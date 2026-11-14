// Counts the design-discipline runner does not take: the accessibility stop inventory (a11y),
// the stand-in typeface (tokens), states the reader's operation reaches and the session (states).
// Run from the project root: node .design/harness/beyond-runner.mjs <label> [--rules=a11y,tokens,states]
// Uses the runner's launcher (lib/cdp.mjs) and the product's configuration (product.mjs); writes only
// .design/harness/out/<label>-beyond.txt and .design/captures/<label>/.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve, extname, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { launch, sleep, LimitError } from "../../.claude/skills/design-discipline/runner/web/lib/cdp.mjs";
import cfg from "./product.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const harnessDir = resolve(here, ".beyond");
const label = process.argv[2];
if (!label || label.startsWith("--")) { console.error("usage: node .design/harness/beyond-runner.mjs <label> [--rules=a11y,tokens,states]"); process.exit(2); }
const rulesArg = process.argv.find((a) => a.startsWith("--rules="));
const wanted = rulesArg && rulesArg.slice(8).trim() ? rulesArg.slice(8).split(",").map((s) => s.trim()) : ["a11y", "tokens", "states"];
const parts = new Set(wanted);

const LIMITS = { message: 15000, load: 30000, fonts: 5000, run: 600000, launch: 20000, listen: 5000 };
const deadline = Date.now() + LIMITS.run;
const capDir = resolve(root, ".design", "captures", label);
const outFile = resolve(root, ".design", "harness", "out", `${label}-beyond.txt`);
const sizes = cfg.sizes;
const populated = cfg.screens[0].states.populated.storage;
const tag = (z) => `${z.w}x${z.h}`;

// ---- output ----
const lines = [];
const say = (part, text) => { for (const l of String(text).split("\n")) { const s = `${part} | ${l}`; lines.push(s); console.log(s); } };
const reason = (e) => (e instanceof LimitError ? `${e.kind} ran past ${e.ms / 1000} s${e.method ? ` (${e.method})` : ""}` : (e && e.message) || String(e));
// Every step is wrapped: a throw or a limit is printed as not taken and the run goes on.
async function step(part, name, fn) {
  try { return await fn(); } catch (e) { say(part, `not taken | ${name} | ${reason(e)}`); return undefined; }
}

// ---- the server ----
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".json": "application/json; charset=utf-8" };
const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = resolve(root, "." + p);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});

let browser = null;
try {
  let listenTimer;
  const listened = await Promise.race([
    new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(true))),
    new Promise((ok) => { listenTimer = setTimeout(() => ok(false), LIMITS.listen); }),
  ]);
  clearTimeout(listenTimer);
  if (!listened) {
    for (const p of parts) say(p, `not taken | listen | server did not listen within ${LIMITS.listen / 1000} s`);
    throw new Error("no browser");
  }
  const origin = `http://127.0.0.1:${server.address().port}`;
  mkdirSync(capDir, { recursive: true });
  mkdirSync(dirname(outFile), { recursive: true });

  // launch() has no limit on its WebSocket open, so it is raced against 20 s.
  const launching = launch({ harnessDir, limits: LIMITS, deadline, gpu: false });
  let timer;
  const raced = await Promise.race([
    launching.then((b) => ({ b }), (e) => ({ e })),
    new Promise((ok) => { timer = setTimeout(() => ok({ late: true }), LIMITS.launch); }),
  ]);
  clearTimeout(timer);
  if (raced.late) {
    launching.then((b) => b.close(), () => {});
    for (const p of parts) say(p, `not taken | launch | browser did not start within ${LIMITS.launch / 1000} s`);
    throw new Error("no browser");
  }
  if (raced.e) {
    for (const p of parts) say(p, `not taken | launch | ${reason(raced.e)}`);
    throw new Error("no browser");
  }
  browser = raced.b;
  const { send, waitEvent } = browser;

  // ---- one page target ----
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const cmd = (m, p = {}) => send(m, p, sessionId);
  await cmd("Page.enable");
  await cmd("Runtime.enable");
  await cmd("Network.enable");

  let scriptId = null;
  let loadN = 0;
  async function load(size, storage = populated) {
    if (scriptId) { try { await cmd("Page.removeScriptToEvaluateOnNewDocument", { identifier: scriptId }); } catch {} scriptId = null; }
    const blank = waitEvent("Page.loadEventFired", sessionId, 5000);
    await cmd("Page.navigate", { url: "about:blank" });
    await blank;
    const source = `try { localStorage.clear(); const s = ${JSON.stringify(storage)}; for (const k of Object.keys(s)) localStorage.setItem(k, s[k]); } catch (e) {}`;
    scriptId = (await cmd("Page.addScriptToEvaluateOnNewDocument", { source })).identifier;
    await cmd("Emulation.setDeviceMetricsOverride", { width: size.w, height: size.h, deviceScaleFactor: size.touch ? 2 : 1, mobile: !!size.touch });
    await cmd("Emulation.setTouchEmulationEnabled", { enabled: !!size.touch });
    const loaded = waitEvent("Page.loadEventFired", sessionId, LIMITS.load);
    await cmd("Page.navigate", { url: `${origin}/?r=${++loadN}` });
    if (!(await loaded)) throw new LimitError("page load", "Page.loadEventFired", LIMITS.load);
  }
  async function ev(expression, awaitPromise = false) {
    const r = await cmd("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
    if (r.exceptionDetails) throw new Error(`page threw: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
    return r.result.value;
  }
  async function press(selector) {
    const c = await ev(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null;
      let b = e.getBoundingClientRect();
      if (b.top + b.height / 2 < 0 || b.top + b.height / 2 > innerHeight) { e.scrollIntoView({ block: "center", behavior: "instant" }); b = e.getBoundingClientRect(); }
      return { x: b.left + b.width / 2, y: b.top + b.height / 2, y0: Math.round(scrollY) }; })()`);
    if (!c) throw new Error(`no element for ${selector}`);
    const base = { x: c.x, y: c.y, button: "left", clickCount: 1 };
    await cmd("Input.dispatchMouseEvent", { type: "mouseMoved", x: c.x, y: c.y });
    await cmd("Input.dispatchMouseEvent", { type: "mousePressed", ...base });
    await cmd("Input.dispatchMouseEvent", { type: "mouseReleased", ...base });
    return c;
  }
  async function shot(name) {
    const r = await cmd("Page.captureScreenshot", { format: "png" });
    writeFileSync(resolve(capDir, name), Buffer.from(r.data, "base64"));
  }
  const DESCRIBE = `(a) => !a ? "null" : a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + (a.classList.length ? "." + [...a.classList].join(".") : "")`;
  const active = () => ev(`(${DESCRIBE})(document.activeElement)`);

  // ---------------- a11y ----------------
  async function a11y() {
    await step("a11y", "enable Accessibility", () => cmd("Accessibility.enable"));
    for (const size of sizes) {
      for (const sheet of [false, true]) {
        const name = `${tag(size)} populated ${sheet ? "help sheet open" : "resting page"}`;
        await step("a11y", name, async () => {
          await load(size);
          if (sheet) { await press(".help-open"); await sleep(700); }
          const { nodes } = await cmd("Accessibility.getFullAXTree");
          const byId = new Map(nodes.map((n) => [n.nodeId, n]));
          const order = []; // [node, depth, nearest visible ancestor]
          const walk = (id, depth, parent) => {
            const n = byId.get(id);
            if (!n) return;
            const shown = !n.ignored;
            if (shown) order.push([n, depth, parent]);
            for (const c of n.childIds || []) walk(c, shown ? depth + 1 : depth, shown ? n : parent);
          };
          const rootNode = nodes.find((n) => !n.parentId) || nodes[0];
          walk(rootNode.nodeId, 0, null);
          const txt = (p) => (p && p.value !== undefined && p.value !== null && p.value !== "" ? String(p.value) : "");
          say("a11y", `--- ${name}: tree, non-ignored nodes in tree order (${order.length} of ${nodes.length} nodes) ---`);
          for (const [n, d] of order) {
            const v = txt(n.value);
            say("a11y", `${"  ".repeat(d)}${txt(n.role) || "(no role)"} ${JSON.stringify(txt(n.name))}${v ? ` value=${JSON.stringify(v)}` : ""}`);
          }
          const leaves = order.filter(([n]) => txt(n.role) === "StaticText");
          say("a11y", `--- ${name}: StaticText stops (${leaves.length}) ---`);
          leaves.forEach(([n, , parent], i) => {
            say("a11y", `${String(i + 1).padStart(3)}. ${JSON.stringify(txt(n.name))}   [in ${parent ? `${txt(parent.role)} ${JSON.stringify(txt(parent.name))}` : "root"}]`);
          });
        });
      }
    }
  }

  // ---------------- tokens ----------------
  async function tokens() {
    const targets = [["h1.hero-title", "h1.hero-title"], ["p.hero-lead", "p.hero-lead"], ["button.start", "button.start"], [".pose-name", "first .pose-name"], [".stamp", "first .stamp"]];
    for (const size of sizes) {
      for (const variant of ["normal", "nofiles", "nocss"]) {
        const name = `${variant} ${tag(size)}`;
        await step("tokens", name, async () => {
          const block = variant === "normal" ? [] : variant === "nofiles" ? ["*fonts.gstatic.com*"] : ["*fonts.googleapis.com*", "*fonts.gstatic.com*"];
          try {
            await cmd("Network.setBlockedURLs", { urls: block });
            await load(size);
            const ready = await step("tokens", `${name} document.fonts.ready`, () =>
              ev(`Promise.race([document.fonts.ready.then(() => "ready"), new Promise((r) => setTimeout(() => r("limit"), ${LIMITS.fonts}))])`, true));
            if (ready === "limit") say("tokens", `not taken | ${name} document.fonts.ready | ran past ${LIMITS.fonts / 1000} s (screenshot taken anyway)`);
            await step("tokens", `${name} screenshot`, () => shot(`standin-${variant}-${tag(size)}.png`));
            await cmd("DOM.enable");
            const doc = await cmd("DOM.getDocument", { depth: -1 });
            await cmd("CSS.enable");
            say("tokens", `--- ${name}: platform fonts (fonts.ready: ${ready}) ---`);
            for (const [sel, nice] of targets) {
              await step("tokens", `${name} ${nice} platform fonts`, async () => {
                const { nodeId } = await cmd("DOM.querySelector", { nodeId: doc.root.nodeId, selector: sel });
                if (!nodeId) throw new Error(`no node for ${sel}`);
                const { fonts } = await cmd("CSS.getPlatformFontsForNode", { nodeId });
                say("tokens", `${nice}: ${fonts.length ? fonts.map((f) => `${f.familyName} (isCustomFont=${f.isCustomFont}, glyphCount=${f.glyphCount})`).join("; ") : "(none)"}`);
              });
            }
          } finally {
            try { await cmd("Network.setBlockedURLs", { urls: [] }); } catch {}
          }
        });
      }
    }
  }

  // ---------------- states ----------------
  async function states() {
    for (const size of sizes) {
      const t = tag(size);
      await step("states", `after はじめる ${t}`, async () => {
        await load(size);
        const c = await press(".start");
        await sleep(1000);
        await step("states", `after はじめる ${t} screenshot`, () => shot(`after-start-${t}.png`));
        const o = await ev(`(() => ({ y: Math.round(scrollY), a: (${DESCRIBE})(document.activeElement), top: document.querySelector("#routine-title").getBoundingClientRect().top }))()`);
        say("states", `after はじめる ${t}: scrollY before press ${c.y0}, scrollY ${o.y}, activeElement ${o.a}, #routine-title top ${o.top}`);
      });

      await step("states", `sheet on its way out ${t}`, async () => {
        await load(size);
        await press(".help-open");
        await sleep(700);
        await press(".help-close");
        await sleep(80);
        const before = await ev(`document.querySelector(".help").classList.contains("is-closing")`);
        await step("states", `sheet on its way out ${t} screenshot`, () => shot(`help-closing-${t}.png`));
        const after = await ev(`document.querySelector(".help").classList.contains("is-closing")`);
        say("states", `help closing ${t}: .help has is-closing ${before} (read 80 ms after the press, before the screenshot), ${after} (read after the screenshot)`);
      });

      const sheetRead = () => ev(`(() => { const h = document.querySelector(".help"); return { open: !h.hidden && h.classList.contains("is-open"), hidden: h.hidden, cls: h.className, state: JSON.stringify(history.state), a: (${DESCRIBE})(document.activeElement) }; })()`);
      await step("states", `interruption with the sheet open ${t}`, async () => {
        await load(size);
        await press(".help-open");
        await sleep(700);
        try {
          await cmd("Page.setWebLifecycleState", { state: "frozen" });
          await sleep(2000);
        } finally {
          await cmd("Page.setWebLifecycleState", { state: "active" });
        }
        await sleep(500);
        const s = await sheetRead();
        say("states", `frozen 2000 ms with the sheet open ${t}: sheet open=${s.open} (hidden=${s.hidden}, class "${s.cls}"), history.state ${s.state}, activeElement ${s.a}`);
      });

      for (let rep = 1; rep <= 3; rep++) {
        await step("states", `time that runs while the page is stopped ${t} repetition ${rep}`, async () => {
          await load(size);
          const y0 = await ev(`Math.round(scrollY)`);
          await press(".start");
          try {
            await cmd("Page.setWebLifecycleState", { state: "frozen" }); // no wait after the press
            await sleep(1000);
          } finally {
            await cmd("Page.setWebLifecycleState", { state: "active" });
          }
          const read = () => ev(`({ y: Math.round(scrollY), a: (${DESCRIBE})(document.activeElement) })`);
          const r0 = await read();
          await sleep(500);
          const r1 = await read();
          await sleep(500);
          const r2 = await read();
          await sleep(2000);
          const r3 = await read();
          const f = (r) => `scrollY ${r.y}, activeElement ${r.a}`;
          say("states", `press .start then frozen 1000 ms ${t} repetition ${rep}: scrollY at load ${y0}; after active: at once ${f(r0)}; 500 ms ${f(r1)}; 1000 ms ${f(r2)}; 3000 ms ${f(r3)}`);
        });
      }
    }
  }

  if (parts.has("a11y")) await a11y();
  if (parts.has("tokens")) await tokens();
  if (parts.has("states")) await states();
} catch (e) {
  if (e.message !== "no browser") for (const p of parts) say(p, `not taken | run | ${reason(e)}`);
} finally {
  try { if (browser) await browser.close(); } catch {}
  try { server.close(); } catch {}
  for (let i = 0; i < 8; i++) { try { rmSync(harnessDir, { recursive: true, force: true }); break; } catch { await sleep(400); } }
  try { mkdirSync(dirname(outFile), { recursive: true }); writeFileSync(outFile, lines.join("\n") + "\n"); } catch (e) { console.error("could not write the output file:", e.message); }
  process.exit(0);
}
