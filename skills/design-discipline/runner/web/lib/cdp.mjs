// Chrome over the DevTools protocol, with Node's global WebSocket and no other dependency.
// Every message waits at most limits.message; a wait past a limit throws LimitError.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

export class LimitError extends Error {
  constructor(kind, method, ms) {
    super(`${kind} ran past ${ms / 1000} s${method ? ` (${method})` : ""}`);
    this.kind = kind;
    this.method = method;
    this.ms = ms;
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// CHROME_PATH; else a chrome-headless-shell the shell can find; else the installed Chrome. No disk search.
export function findBrowser() {
  const named = process.env.CHROME_PATH;
  if (named) return { path: named, shell: /headless-shell/i.test(named) };
  const found = spawnSync(process.platform === "win32" ? "where" : "which", ["chrome-headless-shell"], { encoding: "utf8" });
  const first = found.status === 0 ? found.stdout.split(/\r?\n/).find(Boolean) : null;
  if (first) return { path: first.trim(), shell: true };
  const standard = {
    win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    linux: "google-chrome",
  }[process.platform] || "google-chrome";
  return { path: standard, shell: false };
}

// The GPU is off unless asked for: lighter, and it did not stop answering where the GPU's run did once.
// The frame-rate check asks for it (runner/web/README.md, Running it), since software drawing drops frames a device would not.
export async function launch({ harnessDir, limits, deadline, lang, gpu }) {
  const profile = resolve(harnessDir, ".profile");
  const tmp = resolve(harnessDir, ".tmp");
  rmSync(profile, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const browser = findBrowser();
  const args = [
    ...(browser.shell ? [] : ["--headless=new"]),
    ...(gpu ? [] : ["--disable-gpu"]),
    "--remote-debugging-port=0", `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio",
    ...(lang ? [`--lang=${lang}`] : []),
    ...(process.env.CHROME_FLAGS ? process.env.CHROME_FLAGS.split(/\s+/).filter(Boolean) : []),
    "about:blank",
  ];
  const child = spawn(browser.path, args, { stdio: "ignore", env: { ...process.env, TMP: tmp, TEMP: tmp, TMPDIR: tmp } });
  let spawnError = null;
  child.on("error", (e) => { spawnError = e; });

  const cleanup = async () => {
    try { child.kill(); } catch {}
    if (process.platform === "win32" && child.pid) spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    await sleep(400);
    for (let i = 0; i < 8; i++) {
      try { rmSync(profile, { recursive: true, force: true }); rmSync(tmp, { recursive: true, force: true }); return; } catch { await sleep(400); }
    }
  };

  // The browser writes its debugging port into the profile once it listens.
  let url = null;
  for (let i = 0; i < 100 && !url && !spawnError; i++) {
    const f = resolve(profile, "DevToolsActivePort");
    if (existsSync(f)) {
      const [port, path] = readFileSync(f, "utf8").split(/\r?\n/);
      if (port && path) url = `ws://127.0.0.1:${port}${path}`;
    }
    if (!url) await sleep(100);
  }
  if (!url) { await cleanup(); throw new Error(spawnError ? `could not start ${browser.path}: ${spawnError.message}` : `${browser.path} did not open a debugging port`); }

  const ws = new WebSocket(url);
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new LimitError("opening the debugging socket", "WebSocket", limits.message)), limits.message);
    ws.addEventListener("open", () => { clearTimeout(t); ok(); }, { once: true });
    ws.addEventListener("error", () => { clearTimeout(t); no(new Error("debugging socket failed")); }, { once: true });
  });
  let seq = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? rej(new Error(`${m.error.message || JSON.stringify(m.error)}`)) : res(m.result);
    } else if (m.method) for (const f of [...listeners]) f(m);
  });
  ws.addEventListener("close", () => { for (const { rej } of pending.values()) rej(new Error("the browser closed")); pending.clear(); });

  const send = (method, params = {}, sessionId, ms = limits.message) => new Promise((res, rej) => {
    if (Date.now() > deadline) return rej(new LimitError("the run", method, limits.run));
    const id = ++seq;
    const t = setTimeout(() => { pending.delete(id); rej(new LimitError("message", method, ms)); }, ms);
    pending.set(id, { res: (v) => { clearTimeout(t); res(v); }, rej: (e) => { clearTimeout(t); rej(e); } });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
  // Resolves with the event, or null when none came within the limit.
  const waitEvent = (name, sessionId, ms) => new Promise((res) => {
    const f = (m) => { if (m.method === name && m.sessionId === sessionId) { clearTimeout(t); listeners.delete(f); res(m); } };
    const t = setTimeout(() => { listeners.delete(f); res(null); }, ms);
    listeners.add(f);
  });
  const close = async () => {
    try { await send("Browser.close", {}, undefined, 3000); } catch {}
    try { ws.close(); } catch {}
    await cleanup();
  };
  return { send, waitEvent, listeners, close, shell: browser.shell, path: browser.path };
}
