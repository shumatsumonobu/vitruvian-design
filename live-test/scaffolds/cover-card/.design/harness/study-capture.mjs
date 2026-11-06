// Study capture: starts the installed Chrome headless with a profile inside the workspace,
// renders a reference page at the checked sizes, walks optional steps, and saves captures.
//
// Usage: node .design/harness/study-capture.mjs <config.json>
// config: { "name": "slug", "url": "https://...", "sizes": [[390,844,true],[1280,800,false]],
//           "settle": 2500, "fullPage": false,
//           "steps": [ {"click": "css selector" | "text:visible text"}, {"wait": ms},
//                      {"shot": "label"}, {"eval": "js expression"}, {"key": "Enter"} ] }
// Captures  -> .design/captures/refs/<name>/<size>-<label>.png
// Text dump -> .design/harness/out/<name>.json   (working output; removed when the pass ends)
//
// Time limits, the same as the runner's (.claude/skills/design-discipline/runner/web/README.md):
// 15 s for one message to the browser and its answer, 30 s for a page load, 10 min for the whole run.
// A step past its limit is logged as "not taken: <step> (<method>)" and the run goes on to the next
// step. Where the browser no longer answers, the run stops, and the profile and the browser are
// still removed.

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333 + Math.floor(Math.random() * 500);
const PROFILE = resolve(HERE, ".profile");
const OUT = resolve(HERE, "out");

const LIMIT = { message: 15_000, load: 30_000, run: 600_000 }; // the runner's defaults
const deadline = Date.now() + LIMIT.run;

const cfg = JSON.parse(readFileSync(process.argv[2], "utf8"));
const sizes = cfg.sizes || [[390, 844, true], [1280, 800, false]];
const refDir = resolve(ROOT, ".design", "captures", "refs", cfg.name);
mkdirSync(refDir, { recursive: true });
mkdirSync(OUT, { recursive: true });

// A step that ran past a limit. `method` names what was being waited on.
class LimitError extends Error {
  constructor(method, ms, run = false) { super(`${method} ran past ${ms / 1000} s`); this.method = method; this.run = run; }
}
const remaining = () => deadline - Date.now();
// A wait for what has no event to wait on, never past the run's end.
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, Math.min(ms, remaining()))));

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
  "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio",
  "--lang=ja-JP", "about:blank",
], { stdio: "ignore" });
let chromeGone = false;
chrome.on("exit", () => { chromeGone = true; });
chrome.on("error", () => { chromeGone = true; }); // the browser could not start: the connection step is then not taken

// The address of the browser's socket: 50 tries 200 ms apart, each try limited to 2 s.
async function browserWs() {
  for (let i = 0; i < 50 && remaining() > 0; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`, { signal: AbortSignal.timeout(2000) });
      return (await r.json()).webSocketDebuggerUrl;
    } catch { await sleep(200); }
  }
  throw new LimitError("connection to the browser (/json/version)", 10_000);
}

let ws = null;
let seq = 0;
const pending = new Map();
const listeners = [];
function attachSocket(sock) {
  sock.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
    } else if (m.method) listeners.slice().forEach((f) => f(m));
  });
}
// One message and its answer, limited to 15 s (and to what is left of the run).
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  if (remaining() <= 0) return rej(new LimitError(method, LIMIT.run, true));
  const id = ++seq;
  const ms = Math.min(LIMIT.message, remaining());
  const t = setTimeout(() => { pending.delete(id); rej(new LimitError(method, ms, ms < LIMIT.message)); }, ms);
  pending.set(id, { res: (v) => { clearTimeout(t); res(v); }, rej: (e) => { clearTimeout(t); rej(e); } });
  try { ws.send(JSON.stringify({ id, method, params, sessionId })); } catch (e) { clearTimeout(t); pending.delete(id); rej(e); }
});
// An event, or null past the limit; `cancel` drops the wait.
const waitEvent = (name, sessionId, timeout = LIMIT.load) => {
  let cancel;
  const p = new Promise((res) => {
    const f = (m) => { if (m.method === name && m.sessionId === sessionId) { done(); res(m); } };
    const t = setTimeout(() => { done(); res(null); }, Math.max(0, Math.min(timeout, remaining())));
    const done = () => { clearTimeout(t); const i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); };
    cancel = () => { done(); res(null); };
    listeners.push(f);
  });
  p.cancel = cancel;
  return p;
};

let s = null;
const evaluate = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }, s);
  return r.result?.value;
};

const PROBE = `(() => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const pick = (sel) => { const el = document.querySelector(sel); const c = cs(el); return c && {
    sel, text: (el.innerText || "").slice(0, 60), font: c.fontFamily, size: c.fontSize, weight: c.fontWeight,
    lh: c.lineHeight, ls: c.letterSpacing, color: c.color, bg: c.backgroundColor, radius: c.borderRadius,
    shadow: c.boxShadow, pad: c.padding }; };
  const comments = []; const tw = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
  while (tw.nextNode()) comments.push(tw.currentNode.nodeValue.trim().slice(0, 300));
  const metas = [...document.querySelectorAll("meta")].map((m) => (m.name || m.getAttribute("property") || "") + "=" + (m.content || "").slice(0, 200));
  const hidden = [...document.querySelectorAll("body *")].filter((el) => {
    const c = getComputedStyle(el); return (c.display === "none" || c.visibility === "hidden" || +c.opacity === 0) && el.textContent.trim().length > 40;
  }).slice(0, 40).map((el) => el.textContent.trim().slice(0, 200));
  return {
    title: document.title, url: location.href,
    text: document.body ? document.body.innerText.slice(0, 6000) : "",
    comments, metas, hidden,
    body: pick("body"), h1: pick("h1"), h2: pick("h2"), button: pick("button"), a: pick("main a, a"),
    buttons: [...document.querySelectorAll("button, [role=button], a.button, .btn")].slice(0, 12).map((el) => {
      const c = cs(el); return { text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40),
        bg: c.backgroundColor, color: c.color, radius: c.borderRadius, font: c.fontSize + "/" + c.fontWeight }; }),
  };
})()`;

async function act(step, label) {
  if (step.click) {
    const sel = step.click;
    const ok = await evaluate(`(() => {
      const sel = ${JSON.stringify(sel)};
      let el;
      if (sel.startsWith("text:")) {
        const want = sel.slice(5).trim();
        el = [...document.querySelectorAll("button, a, [role=button], label, div, span")]
          .filter((e) => e.offsetParent !== null && (e.innerText || "").trim() === want).pop()
          || [...document.querySelectorAll("button, a, [role=button]")].find((e) => (e.innerText || "").includes(want));
      } else el = document.querySelector(sel);
      if (!el) return false; el.scrollIntoView({ block: "center" }); el.click(); return true;
    })()`);
    return `click ${sel}: ${ok}`;
  }
  if (step.wait) { await sleep(step.wait); return `wait ${step.wait}`; }
  if (step.eval) return `eval: ${JSON.stringify(await evaluate(step.eval)).slice(0, 300)}`;
  if (step.key) {
    for (const type of ["keyDown", "keyUp"]) await send("Input.dispatchKeyEvent", { type, key: step.key, code: step.key }, s);
    return `key ${step.key}`;
  }
  if (step.shot) { await shot(`${label}-${step.shot}`, step.full); return `shot ${step.shot}`; }
  return "noop";
}

async function shot(file, full) {
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: !!full }, s);
  writeFileSync(resolve(refDir, `${file}.png`), Buffer.from(r.data, "base64"));
}

const report = { name: cfg.name, url: cfg.url, sizes: {}, notTaken: [] };
let stopped = null; // set where the browser no longer answers or the run's time is spent

// Runs one step. A step past its limit is logged as not taken in `log` and the run goes on; where the
// browser then no longer answers (or the run's time is spent), the run stops.
async function step(name, log, fn) {
  if (stopped) { const m = `not taken: ${name} (${stopped})`; log.push(m); report.notTaken.push(m); return undefined; }
  try {
    return await fn();
  } catch (e) {
    if (!(e instanceof LimitError)) throw e;
    const m = `not taken: ${name} (${e.method})`;
    log.push(m); report.notTaken.push(m); console.log(m);
    if (e.run) { stopped = "whole run past 10 min"; return undefined; }
    try { await send("Browser.getVersion"); } catch { stopped = "the browser no longer answers"; console.log(`stopping: ${stopped}`); }
    return undefined;
  }
}

const runLog = []; // steps outside any size
try {
  await step("connection to the browser", runLog, async () => {
    const url = await browserWs();
    ws = new WebSocket(url);
    attachSocket(ws);
    const opened = await Promise.race([
      new Promise((r) => ws.addEventListener("open", () => r(true), { once: true })),
      sleep(LIMIT.message).then(() => false),
    ]);
    if (!opened) throw new LimitError("connection to the browser (WebSocket open)", LIMIT.message);
  });
  if (!ws || ws.readyState !== 1) stopped ||= "no connection to the browser";
  await step("open the tab", runLog, async () => {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    s = (await send("Target.attachToTarget", { targetId, flatten: true })).sessionId;
    await send("Page.enable", {}, s);
    await send("Runtime.enable", {}, s);
  });
  if (!s) stopped ||= "no tab";

  for (const [w, h, mobile] of sizes) {
    const label = `${w}x${h}`;
    const log = [];
    const entry = (report.sizes[label] = { probe: null, log, afterSteps: null });
    await step(`set size ${label}`, log, async () => {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: !!mobile }, s);
      await send("Emulation.setTouchEmulationEnabled", { enabled: !!mobile }, s);
    });
    await step(`page load ${label}`, log, async () => {
      const loaded = waitEvent("Page.loadEventFired", s, LIMIT.load);
      try {
        await send("Page.navigate", { url: cfg.url }, s);
        if (!(await loaded)) throw new LimitError("Page.loadEventFired", LIMIT.load, remaining() <= 0);
      } finally { loaded.cancel(); }
    });
    await step(`settle ${label}`, log, () => sleep(cfg.settle ?? 2500));
    await step(`shot ${label}-top`, log, () => shot(`${label}-top`));
    if (cfg.fullPage) await step(`shot ${label}-full`, log, () => shot(`${label}-full`, true));
    entry.probe = (await step(`probe ${label}`, log, () => evaluate(PROBE))) ?? null;
    if (!cfg.stepsOnlyAt || cfg.stepsOnlyAt === label) {
      for (const st of cfg.steps || []) {
        const name = `${label} step ${JSON.stringify(st).slice(0, 80)}`;
        const done = await step(name, log, () => act(st, label));
        if (done !== undefined) log.push(done);
      }
    }
    entry.afterSteps = (cfg.steps || []).length ? ((await step(`probe after steps ${label}`, log, () => evaluate(PROBE))) ?? null) : null;
    if (stopped) break;
  }
} finally {
  report.stopped = stopped;
  try { writeFileSync(resolve(OUT, `${cfg.name}.json`), JSON.stringify(report, null, 2)); } catch {}
  // Clean up whatever answers or not: close the browser, then remove it and its profile.
  if (ws && ws.readyState === 1) { try { await send("Browser.close"); } catch {} }
  try { ws?.close(); } catch {}
  await new Promise((r) => setTimeout(r, 500));
  try { chrome.kill(); } catch {}
  for (let i = 0; i < 10 && !chromeGone; i++) await new Promise((r) => setTimeout(r, 200));
  for (let i = 0; i < 5; i++) {
    try { rmSync(PROFILE, { recursive: true, force: true }); break; } catch { await new Promise((r) => setTimeout(r, 400)); }
  }
}
console.log(`captured ${cfg.name} -> .design/captures/refs/${cfg.name}/${stopped ? ` (stopped: ${stopped})` : ""}`);
