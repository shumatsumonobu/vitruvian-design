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

const cfg = JSON.parse(readFileSync(process.argv[2], "utf8"));
const sizes = cfg.sizes || [[390, 844, true], [1280, 800, false]];
const refDir = resolve(ROOT, ".design", "captures", "refs", cfg.name);
mkdirSync(refDir, { recursive: true });
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
  "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio",
  "--lang=ja-JP", "about:blank",
], { stdio: "ignore" });

async function browserWs() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch { await sleep(200); }
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await browserWs());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id); pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  } else if (m.method) listeners.forEach((f) => f(m));
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const id = ++seq; pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const waitEvent = (name, sessionId, timeout = 20000) => new Promise((res) => {
  const t = setTimeout(() => res(null), timeout);
  const f = (m) => { if (m.method === name && m.sessionId === sessionId) { clearTimeout(t); listeners.splice(listeners.indexOf(f), 1); res(m); } };
  listeners.push(f);
});

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId: s } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, s);
await send("Runtime.enable", {}, s);

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

const report = { name: cfg.name, url: cfg.url, sizes: {} };
try {
  for (const [w, h, mobile] of sizes) {
    const label = `${w}x${h}`;
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: !!mobile }, s);
    await send("Emulation.setTouchEmulationEnabled", { enabled: !!mobile }, s);
    const loaded = waitEvent("Page.loadEventFired", s, 30000);
    await send("Page.navigate", { url: cfg.url }, s);
    await loaded;
    await sleep(cfg.settle ?? 2500);
    await shot(`${label}-top`);
    if (cfg.fullPage) await shot(`${label}-full`, true);
    const probe = await evaluate(PROBE);
    const log = [];
    if (!cfg.stepsOnlyAt || cfg.stepsOnlyAt === label) for (const st of cfg.steps || []) log.push(await act(st, label));
    report.sizes[label] = { probe, log, afterSteps: (cfg.steps || []).length ? await evaluate(PROBE) : null };
  }
} finally {
  writeFileSync(resolve(OUT, `${cfg.name}.json`), JSON.stringify(report, null, 2));
  try { await send("Browser.close"); } catch {}
  ws.close();
  await sleep(500);
  chrome.kill();
}
console.log(`captured ${cfg.name} -> .design/captures/refs/${cfg.name}/`);
