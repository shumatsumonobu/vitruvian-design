// The web inspection runner. Usage and contract: runner/web/README.md.
//
//   node <skill>/runner/web/run.mjs <label> [--rules=states,copy] [--config=.design/harness/product.mjs]
//
// Node 22 or later, no dependencies. Reads the product's configuration, serves the product on a local
// port, drives one Chrome tab over the DevTools protocol, and prints one line per count. It writes only
// under .design/ and changes nothing in the product.
import http from "node:http";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { launch, LimitError, sleep } from "./lib/cdp.mjs";
import { install } from "./lib/page.mjs";
import { COUNTS } from "./lib/counts.mjs";
import { runSteps } from "./lib/steps.mjs";

export { COUNTS };

// Time limits (runner/web/README.md, Time limits; NOTICE, this skill's defaults), in milliseconds.
// A configuration may raise one with `limits: { ... }` and a comment giving the reason.
export const LIMITS = {
  message: 15_000, // one message to the browser and its answer
  load: 30_000,    // a page load
  fonts: 5_000,    // webfonts settling after a load
  run: 600_000,    // the whole run
};

export const ALL_RULES = ["tokens", "anti-slop", "layout", "states", "navigation", "motion", "copy", "forms", "assets", "a11y"];

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".map": "application/json" };

function usage(msg) {
  console.error(`${msg}\nusage: node run.mjs <label> [--rules=${ALL_RULES.join(",")}] [--config=.design/harness/product.mjs] [--gpu]`);
  process.exit(1);
}

function parseArgs(argv) {
  const flags = argv.filter((a) => a.startsWith("--")), rest = argv.filter((a) => !a.startsWith("--"));
  if (rest.length !== 1) usage("one label is needed");
  const bad = flags.filter((f) => !f.startsWith("--rules=") && !f.startsWith("--config=") && f !== "--gpu");
  if (bad.length) usage(`unknown option: ${bad.join(" ")}`);
  const rf = flags.find((f) => f.startsWith("--rules="));
  const rules = rf ? rf.slice(8).split(",").map((x) => x.trim()).filter(Boolean) : ALL_RULES;
  const unknown = rules.filter((r) => !ALL_RULES.includes(r));
  if (unknown.length || !rules.length) usage(`unknown rule: ${unknown.join(" ") || "(none given)"}`);
  const cf = flags.find((f) => f.startsWith("--config="));
  return { label: rest[0], rules: ALL_RULES.filter((r) => rules.includes(r)), config: cf ? cf.slice(9) : ".design/harness/product.mjs", gpu: flags.includes("--gpu") };
}

// Serves a directory; a path with a dot-directory or dot-file in it (.design, .git, .claude) is not served.
function serve(root) {
  const server = http.createServer((req, res) => {
    let p;
    try { p = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { res.writeHead(400); return res.end(); }
    if (p.endsWith("/")) p += "index.html";
    const file = resolve(root, "." + p);
    if (!file.startsWith(root + sep) && file !== root) { res.writeHead(404); return res.end(); }
    if (p.split("/").some((x) => x.startsWith(".") && x.length > 1)) { res.writeHead(404); return res.end(); }
    let body;
    try { body = readFileSync(file); } catch { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() })));
}

const KEYS = { Tab: [9, "Tab", ""], Enter: [13, "Enter", "\r"], " ": [32, "Space", " "], Escape: [27, "Escape", ""], ArrowDown: [40, "ArrowDown", ""], ArrowUp: [38, "ArrowUp", ""], ArrowLeft: [37, "ArrowLeft", ""], ArrowRight: [39, "ArrowRight", ""] };

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const slug = args.label.replace(/[\\/:*?"<>|]/g, "_");
  const root = process.cwd();
  const cfgFile = resolve(root, args.config);
  if (!existsSync(cfgFile)) usage(`no configuration at ${args.config}`);
  const cfg = (await import(pathToFileURL(cfgFile).href)).default;
  if (!cfg || !Array.isArray(cfg.sizes) || !cfg.sizes.length || !Array.isArray(cfg.screens) || !cfg.screens.length) usage("the configuration needs sizes and screens");
  const limits = { ...LIMITS, ...(cfg.limits || {}) };
  const deadline = Date.now() + limits.run;
  const harnessDir = resolve(root, ".design", "harness");
  const outDir = resolve(harnessDir, "out");
  const CAP = resolve(root, ".design", "captures", slug);
  mkdirSync(outDir, { recursive: true });
  mkdirSync(CAP, { recursive: true });
  const progress = (m) => process.stderr.write(`[runner] ${m}\n`);

  // ---- the lines ----
  const selected = new Set(args.rules);
  const L = new Map(COUNTS.filter((c) => selected.has(c.rule)).map((c) => [c.id, { ...c, items: new Map(), data: [], put: null, taken: false, failed: [], unavailable: null }]));
  const extras = [];
  const notes = [];
  let seq = 0;
  const add = (id, key, where, detail) => {
    const l = L.get(id); if (!l) return;
    let f = l.items.get(key);
    if (!f) l.items.set(key, (f = { wheres: new Set(), detail }));
    f.wheres.add(where);
  };
  const put = (id, n, where) => { const l = L.get(id); if (l && (l.put === null || n > l.put.n)) l.put = { n, where }; };
  const data = (id, text) => L.get(id)?.data.push(text);
  const unavailable = (id, why) => { const l = L.get(id); if (l && !l.unavailable) l.unavailable = why; };
  const idOf = (rule, line) => (COUNTS.find((c) => c.rule === rule && (c.line === line || c.line.startsWith(line))) || {}).id;

  // A step: the lines it feeds read "not taken" if it fails, and the run goes on to the next step.
  // A step that ran past a limit leaves the tab in doubt: revive() opens a new tab where the old one
  // no longer answers, and where no tab answers, every later step is not taken at once.
  let revive = null;
  let dead = null;
  async function step(name, feeds, fn) {
    const live = feeds.filter((id) => L.has(id));
    if (feeds.length && !live.length) return { ok: true };
    const fail = (why) => {
      live.forEach((id) => L.get(id).failed.push(why));
      if (!live.length) extras.push({ rule: name === "flows" ? "flows" : "run", line: name, value: "not taken", where: why });
      progress(`not taken: ${why}`);
      return { ok: false, why };
    };
    if (dead) return fail(dead);
    if (Date.now() > deadline) return fail(`step "${name}" did not start: the run ran past ${limits.run / 60000} min`);
    progress(name);
    try { await fn(); live.forEach((id) => { L.get(id).taken = true; }); return { ok: true }; }
    catch (e) {
      const why = e instanceof LimitError ? `step "${name}" ran past ${e.ms / 1000} s${e.method ? ` (${e.method})` : ""}` : `step "${name}" could not run: ${String(e.message).split("\n")[0]}`;
      if (e instanceof LimitError && revive && !(await revive(name))) dead = `step "${name}" did not start: the browser stopped answering after step "${name}"`;
      return fail(why);
    }
  }

  // ---- the product on a port, or at an address ----
  const server = cfg.url ? null : await serve(resolve(root, cfg.serve || "."));
  const base = cfg.url || server.url;

  const browser = await launch({ harnessDir, limits, deadline, lang: cfg.lang, gpu: args.gpu });
  const { send, waitEvent, listeners } = browser;
  const results = { label: args.label, rules: args.rules, base, when: new Date().toISOString(), browser: browser.path, gpu: args.gpu, limits, measurements: {} };
  const consoleErrors = [];
  let s;
  let tab = null;
  let scripts = [];
  // The steps pass PAGE for the page's session; it resolves to the tab open at the moment of the call.
  const PAGE = "PAGE";
  const sendP = (method, params, sid, ms) => send(method, params, sid === PAGE ? s : sid, ms);
  const waitP = (name, sid, ms) => waitEvent(name, sid === PAGE ? s : sid, ms);
  async function openTab(reuse) {
    const { targetInfos } = await send("Target.getTargets");
    const page = reuse ? targetInfos.find((t) => t.type === "page") : null;
    tab = page ? page.targetId : (await send("Target.createTarget", { url: "about:blank" })).targetId;
    s = (await send("Target.attachToTarget", { targetId: tab, flatten: true })).sessionId;
    for (const d of ["Page", "Runtime", "Network", "Accessibility"]) await send(`${d}.enable`, {}, s);
    scripts = [];
  }
  try {
    await openTab(true);
    revive = async (after) => {
      try { await send("Runtime.evaluate", { expression: "1", returnByValue: true }, s, 3000); return true; } catch {}
      try { await send("Target.closeTarget", { targetId: tab }, undefined, 3000); } catch {}
      try {
        await openTab(false);
        await send("Runtime.evaluate", { expression: "1", returnByValue: true }, s, 3000);
        notes.push(`the tab stopped answering after step "${after}"; a new tab was opened and the run went on`);
        progress(`the tab stopped answering after step "${after}"; opened a new tab`);
        return true;
      } catch { return false; }
    };
    listeners.add((m) => {
      if (m.sessionId === s && m.method === "Runtime.exceptionThrown") consoleErrors.push(m.params.exceptionDetails?.exception?.description?.split("\n")[0] || m.params.exceptionDetails?.text);
    });

    // ---- helpers shared by the steps and by a product's flows ----
    const raw = async (expression, ms) => {
      const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, s, ms);
      if (r.exceptionDetails) throw new Error("page: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).split("\n")[0]);
      return r.result?.value;
    };
    const ev = (fn, ...a) => raw(typeof fn === "function" ? `(${fn.toString()})(...${JSON.stringify(a)})` : fn);
    const H = (method, ...a) => raw(`window.__h.${method}(...${JSON.stringify(a)})`);
    let current = cfg.sizes[0];
    const urlOf = (screen) => new URL(screen.path || "/", base).href;

    async function setSize(size) {
      current = size;
      await send("Emulation.setDeviceMetricsOverride", { width: size.w, height: size.h, deviceScaleFactor: size.touch ? 2 : 1, mobile: !!size.touch }, s);
      await send("Emulation.setTouchEmulationEnabled", { enabled: !!size.touch, maxTouchPoints: size.touch ? 5 : 1 }, s);
    }
    const seedSource = (st) => {
      const entries = Object.entries(st.storage || {}).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)]);
      return `(() => {
        ${st.blockStorage ? `
        const err = () => { throw new DOMException("The operation is insecure.", "SecurityError"); };
        for (const n of ["localStorage", "sessionStorage"]) { try { Object.defineProperty(window, n, { get: err, configurable: true }); } catch {} }
        ` : `
        try { localStorage.clear(); sessionStorage.clear(); ${entries.map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)});`).join(" ")} } catch {}
        `}
      })();`;
    };
    const padSource = (n) => `document.addEventListener("DOMContentLoaded", () => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
      for (const n of nodes) { const v = n.nodeValue; if (v.trim().length > 1 && !n.parentElement.closest("script, style")) n.nodeValue = v.repeat(${n}); }
    });`;
    // Raised text: the root font size to 125 percent, which is one step of the platform's text size (20 px from 16 px).
    const bigSource = `document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = "125%"; });`;

    const stateOf = (screen, state) => (typeof state === "object" && state ? state : (screen.states || { default: {} })[state] || (state === "long" ? screen.long : null) || {});

    // Opens a screen in a state at a size. The page finds the state before its own scripts run.
    async function load(screen, state, o = {}) {
      if (typeof screen === "string") screen = cfg.screens.find((x) => x.name === screen);
      const st = stateOf(screen, state);
      await setSize(o.size || current);
      await send("Emulation.setEmulatedMedia", { features: [...(st.media || []), ...(o.media || [])] }, s);
      if (st.clearCache) await send("Network.clearBrowserCache", {}, s);
      await send("Network.emulateNetworkConditions", { offline: !!st.offline, latency: st.net?.latency || 0, downloadThroughput: st.net?.down ?? -1, uploadThroughput: st.net?.up ?? -1 }, s);
      await send("Emulation.setCPUThrottlingRate", { rate: st.cpu || 1 }, s);
      for (const id of scripts) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: id }, s);
      scripts = [(await send("Page.addScriptToEvaluateOnNewDocument", { source: seedSource(st) }, s)).identifier];
      if (o.pad) scripts.push((await send("Page.addScriptToEvaluateOnNewDocument", { source: padSource(o.pad) }, s)).identifier);
      if (o.big) scripts.push((await send("Page.addScriptToEvaluateOnNewDocument", { source: bigSource }, s)).identifier);
      // From a blank page every time, so the history holds the blank entry and the page's own, and no state carries over.
      const b = waitEvent("Page.loadEventFired", s, limits.load);
      await send("Page.navigate", { url: "about:blank" }, s);
      await b;
      const loaded = waitEvent("Page.loadEventFired", s, limits.load);
      const nav = await send("Page.navigate", { url: urlOf(screen) }, s);
      if (nav.errorText) throw new Error(`could not open ${urlOf(screen)}: ${nav.errorText}`);
      if (!(await loaded)) throw new LimitError("page load", "Page.navigate", limits.load);
      const fonts = await raw(`Promise.race([document.fonts.ready.then(() => true), new Promise((r) => setTimeout(() => r(false), ${limits.fonts}))])`);
      if (!fonts) notes.push(`webfonts had not settled after ${limits.fonts / 1000} s: ${screen.name} ${typeof state === "string" ? state : ""} at ${current.w}x${current.h}`);
      await ev(install);
      await H("frames");
      await H("settle", 1500);
    }
    async function reinstall() { await ev(install); }

    const mouse = (type, x, y, extra = {}) => send("Input.dispatchMouseEvent", { type, x, y, button: "none", ...extra }, s);
    async function pressAt(x, y, count = 1) {
      await mouse("mouseMoved", x, y);
      await mouse("mousePressed", x, y, { button: "left", buttons: 1, clickCount: count });
      await mouse("mouseReleased", x, y, { button: "left", buttons: 0, clickCount: count });
    }
    async function press(sel) {
      const c = await H("target", sel);
      if (!c) throw new Error(`nothing matches ${sel}`);
      await pressAt(c.x, c.y);
      return c;
    }
    async function key(k, modifiers = 0) {
      const spec = KEYS[k];
      if (!spec) throw new Error(`key ${k} is not one the runner sends`);
      const [vk, code, text] = spec;
      await send("Input.dispatchKeyEvent", { type: text ? "keyDown" : "rawKeyDown", key: k, code, windowsVirtualKeyCode: vk, modifiers, ...(text ? { text, unmodifiedText: text } : {}) }, s);
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: vk, modifiers }, s);
    }
    async function shot(name, o = {}) {
      let params = { format: "png" };
      if (o.full) {
        const m = await send("Page.getLayoutMetrics", {}, s);
        const ch = Math.min(10000, Math.ceil((m.cssContentSize || m.contentSize).height));
        params = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: current.w, height: ch, scale: 1 } };
      }
      const r = await send("Page.captureScreenshot", params, s);
      writeFileSync(resolve(CAP, `${name}.png`), Buffer.from(r.data, "base64"));
      return `${name}.png`;
    }
    // Frames go to disk as they arrive.
    async function record(name, fn) {
      const dir = resolve(CAP, name);
      mkdirSync(dir, { recursive: true });
      const frames = [];
      const onFrame = (m) => {
        if (m.method !== "Page.screencastFrame" || m.sessionId !== s) return;
        const n = String(frames.length + 1).padStart(4, "0");
        writeFileSync(resolve(dir, `${n}.jpg`), Buffer.from(m.params.data, "base64"));
        frames.push({ n, t: m.params.metadata.timestamp });
        send("Page.screencastFrameAck", { sessionId: m.params.sessionId }, s).catch(() => {});
      };
      listeners.add(onFrame);
      try {
        await send("Page.startScreencast", { format: "jpeg", quality: 60, everyNthFrame: 1 }, s);
        await fn();
      } finally {
        try { await send("Page.stopScreencast", {}, s); } catch {}
        listeners.delete(onFrame);
        writeFileSync(resolve(dir, "frames.json"), JSON.stringify(frames, null, 1));
      }
      return frames.length;
    }
    // Waits for what has no event to wait on, and never past the run's end.
    const wait = (ms) => sleep(Math.max(0, Math.min(ms, deadline - Date.now())));
    async function history() {
      const h = await send("Page.getNavigationHistory", {}, s);
      return { index: h.currentIndex, length: h.entries.length, url: h.entries[h.currentIndex].url };
    }

    const R = {
      load: (screen, state, o) => load(screen, state, o), press, pressAt, key, eval: ev, shot, record, wait,
      count: (rule, line, value, where = "flow") => {
        const id = idOf(rule, line);
        if (id) { if (L.has(id)) for (let i = 0; i < value; i++) add(id, `flow ${++seq}`, where); return; }
        extras.push({ rule, line, value: String(value), where });
      },
      data: (rule, line, value) => {
        const id = idOf(rule, line);
        if (id) { data(id, String(value)); return; }
        extras.push({ rule, line, value: "data", where: String(value) });
      },
      sizes: cfg.sizes, screens: cfg.screens, config: cfg, limits, rules: args.rules,
    };

    const views = {}; // per size: the viewport captures that go on the contact sheet
    const X = {
      R, cfg, base, selected, L, add, put, data, unavailable, step, notes, extras, results, views, CAP, limits, progress,
      raw, ev, H, send: sendP, s: PAGE, waitEvent: waitP, listeners, setSize, load, reinstall, mouse, pressAt, press, key, shot, wait, history, stateOf, urlOf, sleep, slug,
      current: () => current, gpu: args.gpu,
    };

    try {
      await runSteps(X);
      if (cfg.flows) {
        await step("flows", [], () => cfg.flows(R));
      }
    } catch (e) {
      results.error = String(e.stack || e);
      progress(`stopped: ${e.message}`);
    }
  } finally {
    results.consoleErrors = [...new Set(consoleErrors)];
    results.notes = notes;
    const rows = render(L, extras, selected);
    results.lines = rows.json;
    results.extras = extras;
    writeFileSync(resolve(outDir, `${slug}.txt`), rows.text.join("\n") + "\n");
    writeFileSync(resolve(outDir, `${slug}.json`), JSON.stringify(results, null, 1));
    await browser.close();
    if (server) server.close();
  }
  console.log(render(L, extras, selected).text.join("\n"));
  process.stderr.write(`[runner] lines → .design/harness/out/${slug}.txt and .json, captures → .design/captures/${slug}/\n`);
}

// One line per count in the order of the rule files: rule | the count line's words | the number, data, or not taken | where.
function render(L, extras, selected) {
  const text = [], json = [];
  const clean = (v) => String(v).replace(/\s+/g, " ").trim();
  const row = (rule, line, value, where) => text.push(`${rule} | ${line} | ${value} | ${clean(where)}`.replace(/ \| $/, " |"));
  const showWhere = (l) => {
    const parts = [...l.items.entries()].slice(0, 8).map(([k, f]) => `${[...f.wheres].slice(0, 3).join(" + ")}: ${k}${f.detail ? ` — ${f.detail}` : ""}`);
    if (l.items.size > 8) parts.push(`…(+${l.items.size - 8})`);
    return parts.join(" ; ");
  };
  for (const rule of ALL_RULES) {
    if (!selected.has(rule)) continue;
    for (const l of L.values()) {
      if (l.rule !== rule) continue;
      let value, where;
      const failure = l.failed.length ? l.failed : l.unavailable ? [l.unavailable] : !l.taken ? ["no step ran for this line"] : null;
      if (failure) { value = "not taken"; where = [...new Set(failure)].slice(0, 3).join(" ; "); }
      else if (l.result.startsWith("data")) { value = "data"; where = l.data.slice(0, 40).join(" ; "); }
      else { value = l.put ? l.put.n : l.items.size; where = l.put ? l.put.where : showWhere(l); }
      row(l.rule, l.line, value, where);
      if (!failure && l.result.startsWith("number") && l.data.length) row(l.rule, l.line, "data", l.data.slice(0, 40).join(" ; "));
      json.push({
        rule: l.rule, line: l.line, result: l.result, value, where,
        findings: [...l.items.entries()].map(([key, f]) => ({ key, wheres: [...f.wheres], detail: f.detail })), data: l.data, failed: l.failed,
      });
    }
  }
  for (const e of extras) row(e.rule, e.line, e.value, e.where);
  return { text, json };
}

// An import of this file (scripts/check-runner.mjs) takes COUNTS and starts nothing.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main().catch((e) => { console.error(`runner stopped: ${e.message}`); process.exit(1); });
}
