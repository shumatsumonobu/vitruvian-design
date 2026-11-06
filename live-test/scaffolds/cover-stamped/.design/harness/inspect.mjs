// Inspection harness for あさのび.
// Serves the project from a local port, renders it in the installed Chrome (headless, profile kept
// inside .design/harness/), forces each state at the checked sizes, and takes the counts the rule
// files ask for that can be read off a rendered screen. Nothing in the product's code is changed:
// states are forced by seeding or blocking storage before the page runs, the long-content variant
// is served by this script, and the network is throttled or blocked here.
//
// Usage:   node .design/harness/inspect.mjs <label>
// Captures -> .design/captures/<label>/
// Results  -> .design/harness/out/<label>.json and .txt (working output; removed when the pass ends)

import { spawn } from "node:child_process";
import http from "node:http";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { resolve, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const LABEL = process.argv[2] || "run";
const SLUG = LABEL.replace(/[\/]/g, "_");
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PROFILE = resolve(HERE, ".profile-inspect");
const OUT = resolve(HERE, "out");
const CAP = resolve(ROOT, ".design", "captures", LABEL);
mkdirSync(CAP, { recursive: true });
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- what the declaration fixes (.design/declaration.md); change here when the declaration changes ----
const DECL = {
  hex: { ai: "#1F3461", shu: "#C23A22", kami: "#FFFFFF", daishi: "#EEF2F7", "ai-70": "#46587C", "ai-rule": "#7486A8", "ai-10": "#E2E8F1" },
  rgba: { scrim: "rgba(31,52,97,0.48)", shadow: "rgba(31,52,97,0.2)" },
  steps: {
    display: { size: null, w: 700, ls: 0.04, lh: 1.4 }, // 40px, 32px under 600px
    title: { size: 20, w: 700, ls: 0.12, lh: 1.5 },
    item: { size: 18, w: 700, ls: 0.04, lh: 1.5 },
    lead: { size: 18, w: 400, ls: 0.04, lh: 1.8 },
    body: { size: 16, w: 400, ls: 0.04, lh: 1.8 },
    label: { size: 16, w: 700, ls: 0.08, lh: 1.5 },
    small: { size: 15, w: 400, ls: 0.04, lh: 1.7 },
  },
  radii: ["8px", "9999px", "50%"],
  shadows: ["rgba(31, 52, 97, 0.2) 0px -8px 32px 0px"],
  unit: 8,
  measureEm: 36,
  family: "BIZ UDPGothic",
};
// Checked sizes (.design/structure.md)
const SIZES = [
  { w: 360, h: 548, mobile: true },
  { w: 1920, h: 900, mobile: false },
];

// ---- static server; variant "long" multiplies the menu data by ten and adds one unbroken token ----
let variant = "normal";
const LONG_POSES = `{ const base = POSES.slice(); POSES.length = 0; for (let i = 0; i < 10; i++) for (const p of base) POSES.push({ ...p }); POSES.push({ name: "Overheadsidebendwithtowel_no_break_opportunity_0123456789", seconds: 12345 }); }\n`;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" };
let longApplied = null;
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = normalize(resolve(ROOT, "." + p));
  if (!file.startsWith(ROOT) || file.includes(".design") || file.includes(".claude") || file.includes(".git")) { res.writeHead(404); return res.end(); }
  let body;
  try { body = readFileSync(file); } catch { res.writeHead(404); return res.end(); }
  if (variant === "long" && p === "/app.js") {
    const src = body.toString("utf8");
    const m = src.match(/const POSES = \[[\s\S]*?\n\];\n/);
    longApplied = !!m;
    if (m) body = src.replace(m[0], m[0] + LONG_POSES);
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

// ---- Chrome over the DevTools protocol ----
const PORT = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
  "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", "--lang=ja-JP", "about:blank",
], { stdio: "ignore" });
async function browserWs() {
  for (let i = 0; i < 60; i++) {
    try { return (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; } catch { await sleep(200); }
  }
  throw new Error("Chrome did not start");
}
const ws = new WebSocket(await browserWs());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
const listeners = new Set();
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id); pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  } else if (m.method) for (const f of [...listeners]) f(m);
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const id = ++seq; pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const waitEvent = (name, sessionId, timeout = 30000) => new Promise((res) => {
  const f = (m) => { if (m.method === name && m.sessionId === sessionId) { clearTimeout(t); listeners.delete(f); res(m); } };
  const t = setTimeout(() => { listeners.delete(f); res(null); }, timeout);
  listeners.add(f);
});

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId: s } = await send("Target.attachToTarget", { targetId, flatten: true });
for (const d of ["Page", "Runtime", "Network", "DOM", "CSS", "Accessibility"]) await send(`${d}.enable`, {}, s);
const consoleErrors = [];
listeners.add((m) => {
  if (m.sessionId !== s) return;
  if (m.method === "Runtime.exceptionThrown") consoleErrors.push(m.params.exceptionDetails?.exception?.description?.split("\n")[0] || m.params.exceptionDetails?.text);
});

const evaluate = async (fn, ...args) => {
  const expression = typeof fn === "function" ? `(${fn.toString()})(...${JSON.stringify(args)})` : fn;
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, s);
  if (r.exceptionDetails) throw new Error("evaluate: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
};

// ---- in-page helpers ----
function installHelpers() {
  const h = {};
  h.desc = (el) => {
    if (!el || !el.tagName) return String(el);
    let d = el.tagName.toLowerCase();
    if (el.id) d += "#" + el.id;
    if (el.classList && el.classList.length) d += "." + [...el.classList].join(".");
    return d;
  };
  h.visible = (el) => {
    if (!el.isConnected || el.closest("[hidden]")) return false;
    const c = getComputedStyle(el);
    if (c.display === "none" || c.visibility === "hidden" || +c.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 2 && r.height >= 2;
  };
  h.rgba = (v) => {
    const m = v && v.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  h.hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  h.blend = (t, b) => ({ r: t.r * t.a + b.r * (1 - t.a), g: t.g * t.a + b.g * (1 - t.a), b: t.b * t.a + b.b * (1 - t.a), a: 1 });
  h.bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const c = h.rgba(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = h.blend(layers[i], base);
    return base;
  };
  h.lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  h.ratio = (a, b) => { const x = h.lum(a), y = h.lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  h.blockOf = (e) => {
    for (let x = e; x && x !== document.body; x = x.parentElement) if (getComputedStyle(x).display !== "inline") return x;
    return document.body;
  };
  h.lines = (block) => {
    const rects = [];
    const w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      const p = n.parentElement;
      if (!h.visible(p) || h.blockOf(p) !== block) continue;
      for (let i = 0; i < n.nodeValue.length; i++) {
        const ch = n.nodeValue[i];
        if (/\s/.test(ch)) continue;
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const b = r.getBoundingClientRect();
        if (!b.width) continue;
        rects.push({ ch, top: b.top, left: b.left, right: b.right });
      }
    }
    const groups = [];
    for (const r of rects) {
      let g = groups.find((g) => Math.abs(g.top - r.top) < 6);
      if (!g) groups.push((g = { top: r.top, chars: [] }));
      g.chars.push(r);
    }
    groups.sort((a, b) => a.top - b.top);
    return groups.map((g) => ({ text: g.chars.map((c) => c.ch).join(""), width: Math.max(...g.chars.map((c) => c.right)) - Math.min(...g.chars.map((c) => c.left)) }));
  };
  h.controls = (scope) => [...scope.querySelectorAll("button, a[href], [role=button], input, select, textarea, summary, [tabindex]:not([tabindex='-1'])")].filter(h.visible);
  h.dialogOpen = () => { const d = document.querySelector("[role=dialog]"); return !!d && h.visible(d); };
  window.__h = h;
  return true;
}

function probe(scopeSel) {
  const h = window.__h;
  const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
  const vw = document.documentElement.clientWidth, vh = innerHeight;
  const out = { vw, vh, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, hover: matchMedia("(hover: hover)").matches, reduce: matchMedia("(prefers-reduced-motion: reduce)").matches };
  // a layer is read with its own box and the dimmed surface it sits on
  const els = [...(scopeSel ? [scope.parentElement, scope] : []), ...scope.querySelectorAll("*")].filter((e) => e && !["SCRIPT", "STYLE", "BR", "LINK", "META"].includes(e.tagName) && h.visible(e));
  const directText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
  out.texts = els.filter(directText).map((e) => {
    const c = getComputedStyle(e);
    const fg = h.rgba(c.color), bg = h.bgOf(e);
    const size = parseFloat(c.fontSize);
    return {
      el: h.desc(e), text: e.textContent.trim().replace(/\s+/g, " ").slice(0, 40), size, weight: +c.fontWeight,
      ls: c.letterSpacing === "normal" ? 0 : parseFloat(c.letterSpacing), lh: c.lineHeight === "normal" ? null : parseFloat(c.lineHeight),
      family: c.fontFamily, color: h.hex(fg), bg: h.hex(bg), ratio: +h.ratio(fg.a < 1 ? h.blend(fg, bg) : fg, bg).toFixed(2),
      large: size >= 24 || (+c.fontWeight >= 700 && size >= 18.66), ariaHidden: !!e.closest("[aria-hidden=true]"),
    };
  });
  const blocks = [...new Set(els.filter(directText).map(h.blockOf))];
  out.blocks = blocks.map((b) => {
    const L = h.lines(b);
    const fs = parseFloat(getComputedStyle(b).fontSize);
    return {
      el: h.desc(b), heading: /^H[1-6]$/.test(b.tagName), control: b.matches("button, a[href], [role=button]"),
      lines: L.map((l) => l.text), maxEm: +(Math.max(0, ...L.map((l) => l.width)) / fs).toFixed(1),
    };
  });
  const colors = {};
  const add = (v, where) => {
    const c = h.rgba(v);
    if (!c || c.a === 0) return;
    const key = c.a < 1 ? `rgba(${c.r},${c.g},${c.b},${+c.a.toFixed(2)})` : h.hex(c);
    colors[key] ||= where;
  };
  add(getComputedStyle(document.documentElement).backgroundColor, "html bg");
  add(getComputedStyle(document.body).backgroundColor, "body bg");
  out.filters = [];
  for (const e of els) {
    const c = getComputedStyle(e);
    if (directText(e)) add(c.color, h.desc(e) + " color");
    add(c.backgroundColor, h.desc(e) + " bg");
    for (const side of ["Top", "Right", "Bottom", "Left"]) if (parseFloat(c[`border${side}Width`]) > 0 && c[`border${side}Style`] !== "none") add(c[`border${side}Color`], h.desc(e) + " border");
    if (c.boxShadow !== "none") for (const m of c.boxShadow.matchAll(/rgba?\([^)]+\)/g)) add(m[0], h.desc(e) + " shadow");
    if (e instanceof SVGElement) { add(c.fill, h.desc(e) + " fill"); add(c.stroke, h.desc(e) + " stroke"); }
    if (c.filter !== "none") out.filters.push(h.desc(e) + " " + c.filter);
  }
  out.colors = colors;
  out.radii = {}; out.shadows = {}; out.spacing = [];
  for (const e of els) {
    const c = getComputedStyle(e);
    for (const k of ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"]) if (c[k] !== "0px") out.radii[c[k]] ||= h.desc(e);
    if (c.boxShadow !== "none") out.shadows[c.boxShadow] ||= h.desc(e);
    const sp = [];
    const off = (v) => v && Math.abs(v / 8 - Math.round(v / 8)) > 0.01;
    for (const k of ["marginTop", "marginBottom", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "rowGap", "columnGap"]) { const v = parseFloat(c[k]); if (off(v)) sp.push(`${k}=${c[k]}`); }
    const ml = parseFloat(c.marginLeft), mr = parseFloat(c.marginRight);
    if (Math.abs(ml - mr) > 0.5) for (const [k, v] of [["marginLeft", ml], ["marginRight", mr]]) if (off(v)) sp.push(`${k}=${v}px`);
    if (sp.length) out.spacing.push(h.desc(e) + " " + sp.join(" "));
  }
  out.offscreen = els.filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 0.5 || r.left < -0.5; }).map(h.desc).slice(0, 12);
  out.clipped = els.filter((e) => {
    const c = getComputedStyle(e);
    return e !== document.body && (c.overflowX !== "visible" || c.overflowY !== "visible") && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1);
  }).map(h.desc);
  const items = [...new Set([...blocks, ...h.controls(scope)])];
  out.overlaps = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i], b = items[j];
    if (a.contains(b) || b.contains(a)) continue;
    const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
    const ix = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left), iy = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
    if (ix > 1 && iy > 1) out.overlaps.push(h.desc(a) + " / " + h.desc(b));
  }
  out.controls = h.controls(scope).map((e) => { const r = e.getBoundingClientRect(); return { el: h.desc(e), text: (e.innerText || "").trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) }; });
  const main = scope.querySelector("main") || scope;
  out.edges = [...main.querySelectorAll("*")].filter(h.visible).filter((e) => e.parentElement === main || e.parentElement?.parentElement === main).map((e) => {
    const r = e.getBoundingClientRect(), c = getComputedStyle(e);
    return { el: h.desc(e), outer: Math.round(r.left), inner: Math.round(r.left + parseFloat(c.borderLeftWidth) + parseFloat(c.paddingLeft)) };
  });
  const header = document.querySelector("header");
  if (header && h.visible(header)) { const r = header.getBoundingClientRect(), c = getComputedStyle(header); out.edges.unshift({ el: "header", outer: Math.round(r.left), inner: Math.round(r.left + parseFloat(c.paddingLeft)) }); }
  const secs = [...main.children].filter(h.visible);
  out.gaps = secs.map((sec) => {
    const kids = [...sec.children].filter(h.visible);
    const g = [];
    for (let i = 1; i < kids.length; i++) g.push(`${h.desc(kids[i - 1])}→${h.desc(kids[i])}:${Math.round(kids[i].getBoundingClientRect().top - kids[i - 1].getBoundingClientRect().bottom)}`);
    return { el: h.desc(sec), gaps: g };
  });
  out.between = [];
  for (let i = 1; i < secs.length; i++) {
    const a = [...secs[i - 1].children].filter(h.visible).pop(), b = [...secs[i].children].filter(h.visible)[0];
    if (a && b) out.between.push(`${h.desc(secs[i - 1])}→${h.desc(secs[i])}:${Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom)}`);
  }
  return out;
}

function hitTest(scopeSel) {
  const h = window.__h;
  const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
  const miss = [], small = [], overlap = [];
  const boxes = [];
  for (const e of h.controls(scope)) {
    e.scrollIntoView({ block: "center", inline: "center" });
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const hit = document.elementFromPoint(x, y);
    if (!hit || !(e === hit || e.contains(hit))) miss.push(h.desc(e) + " → " + h.desc(hit));
    if (r.width < 24 || r.height < 24) small.push(`${h.desc(e)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    boxes.push({ d: h.desc(e) + "「" + (e.innerText || "").trim().slice(0, 8) + "」", l: r.left + scrollX, t: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY });
  }
  scrollTo(0, 0);
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 0) overlap.push(a.d + " / " + b.d);
  }
  return { miss, small, overlap, count: boxes.length };
}

function activeInfo() {
  const h = window.__h;
  const a = document.activeElement;
  const c = getComputedStyle(a);
  return {
    el: h.desc(a), text: (a.innerText || "").trim().slice(0, 24), fv: a.matches(":focus-visible"),
    outline: `${c.outlineStyle} ${c.outlineWidth} ${h.hex(h.rgba(c.outlineColor) || { r: 0, g: 0, b: 0 })} offset ${c.outlineOffset}`,
    trans: `${c.transitionProperty} ${c.transitionDuration}`, inDialog: !!a.closest("[role=dialog]"), scrollY: Math.round(scrollY), dialog: h.dialogOpen(),
  };
}

function centerOf(text, scopeSel, nth) {
  const h = window.__h;
  const scope = scopeSel ? document.querySelector(scopeSel) : document;
  const el = h.controls(scope).filter((e) => (e.innerText || "").trim() === text)[nth || 0];
  if (!el) return null;
  el.scrollIntoView({ block: "center" });
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, el: h.desc(el) };
}

function startTrace(spec, ms) {
  const pick = (k) => k === "dialog" ? document.querySelector("[role=dialog]") : k === "scrim" ? document.querySelector("[role=dialog]")?.parentElement : document.querySelector(k);
  window.__trace = new Promise((res) => {
    const out = [];
    let t0 = null;
    const f = (t) => {
      if (t0 === null) t0 = t;
      const row = { t: Math.round(t - t0) };
      for (const sp of spec) {
        if (sp.sel === "win") { row.scrollY = Math.round(scrollY); continue; }
        const e = pick(sp.sel);
        const c = e ? getComputedStyle(e) : null;
        for (const p of sp.props) row[`${sp.sel}.${p}`] = c ? c[p] : null;
        if (e) row[`${sp.sel}.shown`] = window.__h.visible(e);
      }
      out.push(row);
      if (t - t0 < ms) requestAnimationFrame(f); else res(out);
    };
    requestAnimationFrame(f);
  });
  return true;
}

function animList() {
  return document.getAnimations().map((a) => {
    const t = a.effect?.getTiming?.() || {};
    return `${a.constructor.name}:${a.transitionProperty || a.animationName || ""} on ${window.__h.desc(a.effect?.target)} ${t.duration}ms ${t.easing}`;
  });
}

// ---- seeds: run before the page's own scripts ----
const SEED = (kind) => `(() => {
  const KEY = "asanobi-log";
  const kind = ${JSON.stringify(kind)};
  try {
    const d0 = new Date(); d0.setHours(7, 30, 0, 0);
    const monday = new Date(d0); monday.setDate(d0.getDate() - ((d0.getDay() + 6) % 7));
    const rec = (offset, minutes = 10) => ({ at: monday.getTime() + offset * 864e5, minutes });
    const today = (d0.getDay() + 6) % 7;
    const sets = {
      populated: [rec(-6), rec(-4), rec(0), rec(1), rec(today)],
      empty: [rec(-6), rec(-4), rec(-2)],
      long: Array.from({ length: 50 }, (_, i) => rec(-i % 7 === 0 ? 0 : -i, 300)).concat([0, 1, 2, 3, 4, 5, 6].map((o) => rec(o, 300))),
    };
    if (kind === "firstrun") localStorage.removeItem(KEY);
    else if (kind === "corrupt") localStorage.setItem(KEY, "{oops");
    else if (kind === "error") {
      const err = () => { throw new DOMException("The operation is insecure.", "SecurityError"); };
      try { Object.defineProperty(window, "localStorage", { get: err, configurable: true }); }
      catch { const g = Storage.prototype.getItem; Storage.prototype.getItem = function (k) { if (k === KEY) err(); return g.call(this, k); }; }
    } else if (sets[kind]) localStorage.setItem(KEY, JSON.stringify(sets[kind]));
  } catch {}
})();`;
const PAD = `document.addEventListener("DOMContentLoaded", () => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) { const v = n.nodeValue; if (v.trim().length > 1 && !n.parentElement.closest("script")) n.nodeValue = v.repeat(3); }
});`;

let scripts = [];
let loads = 0;
let current = SIZES[0];
async function setSize(size) {
  current = size;
  await send("Emulation.setDeviceMetricsOverride", { width: size.w, height: size.h, deviceScaleFactor: size.mobile ? 2 : 1, mobile: size.mobile }, s);
  await send("Emulation.setTouchEmulationEnabled", { enabled: size.mobile, maxTouchPoints: size.mobile ? 5 : 1 }, s);
}
// Raised text: the root font size goes to 125 %, which is what Chrome's "large" text setting (20 px) does;
// Page.setFontSizes did not change the rendered size in headless Chrome (seen 2026-11-04).
const BIG = `document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = "125%"; });`;
async function load(size, { seed = "populated", media = [], pad = false, fontSize = 16, blockFonts = false, fromBlank = false, big = false } = {}) {
  await setSize(size);
  await send("Emulation.setEmulatedMedia", { features: media }, s);
  try { await send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } }, s); } catch {}
  await send("Network.setBlockedURLs", { urls: blockFonts ? ["*fonts.googleapis.com*", "*fonts.gstatic.com*"] : [] }, s);
  for (const id of scripts) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: id }, s);
  scripts = [(await send("Page.addScriptToEvaluateOnNewDocument", { source: SEED(seed) }, s)).identifier];
  if (pad) scripts.push((await send("Page.addScriptToEvaluateOnNewDocument", { source: PAD }, s)).identifier);
  if (big) scripts.push((await send("Page.addScriptToEvaluateOnNewDocument", { source: BIG }, s)).identifier);
  if (fromBlank) { const l0 = waitEvent("Page.loadEventFired", s); await send("Page.navigate", { url: "about:blank" }, s); await l0; }
  // A navigation to the URL already shown replaces the entry and keeps its state (the help sheet's
  // mark among it), so every load goes to a URL of its own.
  const loaded = waitEvent("Page.loadEventFired", s);
  await send("Page.navigate", { url: `${BASE}?load=${++loads}` }, s);
  await loaded;
  await evaluate("document.fonts.ready.then(() => true)");
  await sleep(250);
  await evaluate(installHelpers);
}
async function reinstall() { await evaluate(installHelpers); }
async function shot(name, full) {
  let params = { format: "png" };
  if (full) {
    const m = await send("Page.getLayoutMetrics", {}, s);
    const ch = Math.ceil((m.cssContentSize || m.contentSize).height);
    params = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: current.w, height: ch, scale: 1 } };
  }
  const r = await send("Page.captureScreenshot", params, s);
  writeFileSync(resolve(CAP, `${name}.png`), Buffer.from(r.data, "base64"));
  return `${name}.png`;
}
async function mouseClick(x, y, clickCount = 1) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none" }, s);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount }, s);
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount }, s);
}
async function tap(x, y) { await send("Input.synthesizeTapGesture", { x, y, duration: 30, tapCount: 1, gestureSourceType: "touch" }, s); }
// Headless Chrome turns a synthesized tap gesture into touch events but no click (seen 2026-11-04),
// so presses are mouse clicks on the touch-emulated viewport; the press-in answer is read with touch events.
async function press(x, y) { return mouseClick(x, y); }
async function pressText(text, scopeSel, nth) {
  const c = await evaluate(centerOf, text, scopeSel || null, nth || 0);
  if (!c) return `not found: ${text}`;
  await press(c.x, c.y);
  return c.el;
}
const KEYS = { Tab: [9, "Tab", ""], Enter: [13, "Enter", "\r"], " ": [32, "Space", " "], Escape: [27, "Escape", ""] };
async function key(k, modifiers = 0) {
  const [vk, code, text] = KEYS[k];
  await send("Input.dispatchKeyEvent", { type: text ? "keyDown" : "rawKeyDown", key: k, code, windowsVirtualKeyCode: vk, modifiers, ...(text ? { text, unmodifiedText: text } : {}) }, s);
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: vk, modifiers }, s);
}
async function history() { const h = await send("Page.getNavigationHistory", {}, s); return { index: h.currentIndex, length: h.entries.length, url: h.entries[h.currentIndex].url }; }
async function platformFonts(sel) {
  const { root } = await send("DOM.getDocument", { depth: -1 }, s);
  const { nodeId } = await send("DOM.querySelector", { nodeId: root.nodeId, selector: sel }, s);
  if (!nodeId) return null;
  const { fonts } = await send("CSS.getPlatformFontsForNode", { nodeId }, s);
  return fonts.map((f) => `${f.familyName}${f.isCustomFont ? "(web)" : ""}×${f.glyphCount}`).join(", ");
}
async function axStops() {
  const { nodes } = await send("Accessibility.getFullAXTree", {}, s);
  const byId = new Map(nodes.map((n) => [n.nodeId, n]));
  const stops = [];
  const roles = new Set(["StaticText", "button", "link", "heading", "dialog", "list", "listitem", "img", "image", "banner", "main", "contentinfo", "region", "group", "table", "row", "cell", "term", "definition", "status", "alert"]);
  const walk = (n, depth) => {
    if (!n) return;
    const role = n.role?.value, name = n.name?.value || "";
    if (!n.ignored && roles.has(role)) stops.push(`${"  ".repeat(Math.min(depth, 12))}${role}${name ? "「" + name.slice(0, 70) + "」" : ""}`);
    for (const c of n.childIds || []) walk(byId.get(c), depth + 1);
  };
  walk(nodes[0], 0);
  return stops;
}
const changes = (rows) => {
  const out = [];
  let prev = null;
  for (const r of rows) {
    const { t, ...v } = r;
    const k = JSON.stringify(v);
    if (k !== prev) { out.push(`${t}ms ${Object.entries(v).map(([a, b]) => `${a}=${b}`).join(" ")}`); prev = k; }
  }
  return out;
};

// ---- analysis against the declaration ----
function analyze(p, size, scale = 1) {
  const r = {};
  const steps = Object.entries(DECL.steps).map(([name, st]) => ({ name, ...st, size: (name === "display" ? (size.w >= 600 ? 40 : 32) : st.size) * scale }));
  const match = (t) => steps.find((st) => Math.abs(t.size - st.size) < 0.25 && t.weight === st.w && Math.abs(t.ls - st.ls * t.size) < 0.25 && t.lh !== null && Math.abs(t.lh - st.lh * t.size) < 0.5);
  r.typeOff = p.texts.filter((t) => !match(t)).map((t) => `${t.el}「${t.text.slice(0, 14)}」 ${t.size}px w${t.weight} ls${t.ls.toFixed(2)} lh${t.lh}`);
  r.steps = [...new Set(p.texts.map((t) => match(t)?.name).filter(Boolean))];
  r.families = [...new Set(p.texts.map((t) => t.family))];
  r.display = p.texts.filter((t) => match(t)?.name === "display").map((t) => t.el);
  const okColors = new Set([...Object.values(DECL.hex), ...Object.values(DECL.rgba)]);
  r.colorsOff = Object.entries(p.colors).filter(([k]) => !okColors.has(k)).map(([k, w]) => `${k} (${w})`);
  r.colorsUsed = Object.keys(p.colors).filter((k) => okColors.has(k)).map((k) => Object.entries({ ...DECL.hex, ...DECL.rgba }).find(([, v]) => v === k)[0]);
  r.filters = p.filters;
  r.radiiOff = Object.entries(p.radii).filter(([k]) => !DECL.radii.includes(k)).map(([k, w]) => `${k} (${w})`);
  r.shadowsOff = Object.entries(p.shadows).filter(([k]) => !DECL.shadows.includes(k)).map(([k, w]) => `${k} (${w})`);
  r.spacingOff = p.spacing;
  r.measureOver = p.blocks.filter((b) => b.maxEm > DECL.measureEm + 0.2).map((b) => `${b.el} ${b.maxEm}em`);
  const CLOSE = /^[、。，．,.)）」』】〕〉》”’!！?？:：;；]/;
  r.lineStartClose = p.blocks.flatMap((b) => b.lines.slice(1).filter((l) => CLOSE.test(l)).map((l) => `${b.el}「${l.slice(0, 10)}」`));
  r.oneCharLast = p.blocks.filter((b) => b.lines.length > 1 && [...b.lines.at(-1)].length === 1).map((b) => `${b.el}${b.heading ? "(heading)" : ""} last「${b.lines.at(-1)}」`);
  r.labelWrap = p.blocks.filter((b) => b.control && b.lines.length > 1).map((b) => `${b.el} ${b.lines.join(" | ")}`);
  r.contrastLow = p.texts.filter((t) => t.ratio < (t.large ? 3 : 4.5)).map((t) => `${t.el}「${t.text.slice(0, 10)}」 ${t.color} on ${t.bg} ${t.ratio}`);
  r.minContrast = p.texts.length ? p.texts.reduce((a, b) => (a.ratio <= b.ratio ? a : b)) : null;
  r.offscreen = p.offscreen; r.clipped = p.clipped; r.overlaps = p.overlaps;
  r.hScroll = p.docW > p.vw;
  r.hover = p.hover; r.reduce = p.reduce;
  r.edges = p.edges.map((e) => `${e.el}:${e.outer}/${e.inner}`);
  r.gaps = p.gaps.map((g) => `${g.el} ${g.gaps.join(" ")}`);
  r.between = p.between;
  r.lines = p.blocks.map((b) => `${b.el} [${b.lines.join(" | ")}]`);
  r.controls = p.controls.map((c) => `${c.el}「${c.text}」${c.w}x${c.h}`);
  return r;
}

// ---- run ----
const results = { label: LABEL, base: BASE, when: new Date().toISOString(), sizes: {} };
const STATES = ["populated", "firstrun", "empty", "error", "corrupt"];
try {
  for (const size of SIZES) {
    const tag = `${size.w}x${size.h}`;
    const R = (results.sizes[tag] = { states: {} });
    for (const st of STATES) {
      await load(size, { seed: st });
      const cap = [await shot(`${st}-${tag}`, true), await shot(`${st}-${tag}-view`, false)];
      R.states[st] = { cap, ...analyze(await evaluate(probe, null), size), hit: await evaluate(hitTest, null) };
    }
    variant = "long";
    await load(size, { seed: "long", pad: true });
    R.states.long = { cap: [await shot(`long-${tag}`, true)], longApplied, ...analyze(await evaluate(probe, null), size), hit: await evaluate(hitTest, null) };
    variant = "normal";
    await load(size, { seed: "populated", big: true });
    R.states.textsize = { cap: [await shot(`textsize20-${tag}`, true)], ...analyze(await evaluate(probe, null), size, 1.25), hit: await evaluate(hitTest, null) };
    R.states.textsize.sizes = await evaluate(() => ["h1", "h2", "p", "button"].map((q) => { const e = document.querySelector(q); return e ? `${q} ${getComputedStyle(e).fontSize}` : `${q} none`; }));

    await load(size);
    R.states.help = { opened: await pressText("使い方") };
    await sleep(700);
    R.states.help.cap = [await shot(`help-${tag}`, false)];
    Object.assign(R.states.help, analyze(await evaluate(probe, "[role=dialog]"), size));
    R.states.help.hit = await evaluate(hitTest, "[role=dialog]");
    R.states.help.sheet = await evaluate(() => { const d = document.querySelector("[role=dialog]"); const r = d.getBoundingClientRect(); return `sheet left ${Math.round(r.left)} width ${Math.round(r.width)} top ${Math.round(r.top)} bottom ${Math.round(r.bottom)}`; });
    R.states.help.ax = await axStops();

    await load(size);
    R.states.started = { pressed: await pressText("はじめる") };
    await sleep(1500);
    R.states.started.cap = [await shot(`started-${tag}`, false)];
    R.states.started.after = await evaluate(activeInfo);

    await load(size, { blockFonts: true });
    results.sizes[tag].standin = { cap: await shot(`standin-${tag}`, false), h1: await platformFonts("h1"), body: await platformFonts("p") };
    // A device without BIZ UDPGothic installed (Windows 10 and later ship it, phones and Macs do not):
    // the webfont is blocked and the local name is taken out of the stack, leaving the declared stand-ins.
    await evaluate(() => { const st = document.createElement("style"); st.textContent = `:root { --font: "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif !important; } body, button { font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif !important; }`; document.head.append(st); return true; });
    await sleep(200);
    results.sizes[tag].standinNoLocal = { cap: await shot(`standin-nolocal-${tag}`, false), h1: await platformFonts("h1"), body: await platformFonts("p") };
    await load(size);
    R.fonts = { h1: await platformFonts("h1"), h2: await platformFonts("h2"), p: await platformFonts("p"), button: await platformFonts("button") };
    R.ax = { populated: await axStops() };
    await load(size, { seed: "firstrun" });
    R.ax.firstrun = await axStops();
    await load(size, { seed: "error" });
    R.ax.error = await axStops();

    // keyboard walk
    const kb = (R.keyboard = { tabOrder: [] });
    await load(size);
    await evaluate("document.activeElement && document.activeElement.blur(), scrollTo(0, 0), true");
    for (let i = 0; i < 14; i++) {
      await key("Tab");
      const a = await evaluate(activeInfo);
      kb.tabOrder.push(`${a.el}「${a.text}」 fv=${a.fv} ${a.outline} trans=${a.trans}`);
      if (a.el === "body") break;
    }
    await load(size);
    for (let i = 0; i < 6 && (await evaluate(activeInfo)).text !== "使い方"; i++) await key("Tab");
    await key("Enter");
    await sleep(600);
    let a = await evaluate(activeInfo);
    kb.openWithEnter = `dialog=${a.dialog} active=${a.el}「${a.text}」 inDialog=${a.inDialog}`;
    kb.insideDialog = [];
    for (let i = 0; i < 3; i++) { await key("Tab"); a = await evaluate(activeInfo); kb.insideDialog.push(`${a.el}「${a.text}」 inDialog=${a.inDialog}`); }
    for (let i = 0; i < 4 && (await evaluate(activeInfo)).text !== "閉じる"; i++) await key("Tab");
    await key("Enter");
    await sleep(600);
    a = await evaluate(activeInfo);
    kb.closeWithEnter = `dialog=${a.dialog} active=${a.el}「${a.text}」 fv=${a.fv}`;
    await key("Enter");
    await sleep(500);
    await key("Escape");
    await sleep(600);
    a = await evaluate(activeInfo);
    kb.escape = `after Enter then Escape: dialog=${a.dialog} active=${a.el}「${a.text}」`;
    await load(size);
    for (let i = 0; i < 8 && (await evaluate(activeInfo)).text !== "はじめる"; i++) await key("Tab");
    await key("Enter");
    await sleep(1500);
    a = await evaluate(activeInfo);
    kb.startWithEnter = `active=${a.el}「${a.text}」 scrollY=${a.scrollY} fv=${a.fv} ${a.outline}`;
    await load(size, { seed: "firstrun" });
    const startCount = await evaluate(() => window.__h.controls(document).filter((e) => (e.innerText || "").trim() === "はじめる").length);
    if (startCount > 1) {
      for (let i = 0; i < 14; i++) { await key("Tab"); const x = await evaluate(activeInfo); if (x.text === "はじめる" && x.scrollY > 0) break; }
      await key("Enter");
      await sleep(1500);
      a = await evaluate(activeInfo);
      kb.secondStartWithEnter = `active=${a.el}「${a.text}」 scrollY=${a.scrollY}`;
    }

    // repeated presses, back paths
    const P = (R.presses = {});
    const dbl = async (text, scopeSel) => {
      const c = await evaluate(centerOf, text, scopeSel || null, 0);
      if (!c) return null;
      await mouseClick(c.x, c.y, 1); await mouseClick(c.x, c.y, 2);
      return c;
    };
    await load(size, { fromBlank: true });
    let h0 = await history();
    await dbl("使い方");
    await sleep(900);
    let h1 = await history();
    P.helpDouble = `dialog=${await evaluate("window.__h.dialogOpen()")} history ${h0.index}/${h0.length} → ${h1.index}/${h1.length}`;
    await load(size, { fromBlank: true });
    await pressText("使い方");
    await sleep(700);
    h0 = await history();
    const cc = await dbl("閉じる", "[role=dialog]");
    await sleep(1200);
    h1 = await history();
    let still = h1.url.startsWith(BASE);
    if (still) await reinstall();
    P.closeDouble = !cc ? `閉じる not found (dialog=${still ? await evaluate("window.__h.dialogOpen()") : "?"}, help pressed before)` : `history ${h0.index}/${h0.length} → ${h1.index}/${h1.length} url=${h1.url}` + (still ? ` dialog=${await evaluate("window.__h.dialogOpen()")} under=${await evaluate(`window.__h.desc(document.elementFromPoint(${cc.x}, ${cc.y}))`)} focus=${(await evaluate(activeInfo)).el}` : "");
    await load(size, { fromBlank: true });
    await dbl("はじめる");
    await sleep(1500);
    P.startDouble = `history ${(await history()).length} scrollY=${await evaluate("Math.round(scrollY)")}`;
    await load(size, { fromBlank: true });
    h0 = await history();
    await pressText("使い方");
    await sleep(700);
    await evaluate("history.back(), true");
    await sleep(800);
    h1 = await history();
    P.backCloses = `dialog=${await evaluate("window.__h.dialogOpen()")} history ${h0.index}/${h0.length} → ${h1.index}/${h1.length} url=${h1.url === h0.url ? "same" : h1.url}`;
    await evaluate("history.forward(), true");
    await sleep(800);
    P.forwardAfterBack = `dialog=${await evaluate("window.__h.dialogOpen()")} history ${(await history()).index}`;
    await load(size, { fromBlank: true });
    await pressText("使い方");
    await sleep(700);
    await press(Math.round(size.w / 2), 12);
    await sleep(800);
    P.scrimCloses = `dialog=${await evaluate("window.__h.dialogOpen()")} focus=${(await evaluate(activeInfo)).el}「${(await evaluate(activeInfo)).text}」 history ${(await history()).index}`;
    await load(size, { fromBlank: true });
    await pressText("使い方");
    await sleep(700);
    const lr = waitEvent("Page.loadEventFired", s);
    await send("Page.reload", {}, s);
    await lr;
    await sleep(400);
    await reinstall();
    const afterReload = await evaluate("window.__h.dialogOpen()");
    h0 = await history();
    await evaluate("history.back(), true");
    await sleep(900);
    h1 = await history();
    still = h1.url.startsWith(BASE);
    if (still) await reinstall();
    P.reloadThenBack = `after reload dialog=${afterReload}; back → history ${h0.index}/${h0.length} → ${h1.index}/${h1.length} url=${h1.url === h0.url ? "same" : h1.url}` + (still ? ` dialog=${await evaluate("window.__h.dialogOpen()")}` : "");
    await load(size, { fromBlank: true });
    h0 = await history();
    const lg = waitEvent("Page.loadEventFired", s);
    await dbl("あさのび");
    await lg;
    await sleep(600);
    P.logoDouble = `history ${h0.index}/${h0.length} → ${(await history()).index}/${(await history()).length}`;

    // hover left behind after a tap (touch only)
    if (size.mobile) {
      await load(size);
      const style = () => evaluate(() => [...document.querySelectorAll("button")].filter((b) => window.__h.visible(b)).map((b) => { const c = getComputedStyle(b); return `${(b.innerText || "").trim()}:${c.backgroundColor}/${c.filter}/${c.color}/${c.borderColor}`; }).join(" ; "));
      const before = await style();
      await pressText("はじめる");
      await sleep(1200);
      await evaluate("scrollTo(0, 0), true");
      await sleep(200);
      const after = await style();
      P.hoverAfterTap = before === after ? `same (hover media=${await evaluate("matchMedia('(hover: hover)').matches")})` : `changed: ${before} → ${after}`;
    }

    // motion: press answer, sheet in/out, the scroll from はじめる; then the same with reduce motion
    const M = (R.motion = {});
    for (const reduce of [false, true]) {
      const key2 = reduce ? "reduce" : "normal";
      const media = reduce ? [{ name: "prefers-reduced-motion", value: "reduce" }] : [];
      const m = (M[key2] = {});
      await load(size, { media });
      let c = await evaluate(centerOf, "はじめる", null, 0);
      await evaluate(startTrace, [{ sel: ".start, main button", props: ["transform", "backgroundColor"] }], 260);
      if (size.mobile) await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: c.x, y: c.y }] }, s);
      else { await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: c.x, y: c.y, button: "none" }, s); await send("Input.dispatchMouseEvent", { type: "mousePressed", x: c.x, y: c.y, button: "left", clickCount: 1 }, s); }
      m.pressIn = changes(await evaluate("window.__trace"));
      if (size.mobile) await send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] }, s);
      else await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: c.x + 400, y: c.y + 400, button: "left", clickCount: 1 }, s);
      await load(size, { media });
      c = await evaluate(centerOf, "使い方", null, 0);
      await evaluate(startTrace, [{ sel: "dialog", props: ["opacity", "transform"] }, { sel: "scrim", props: ["opacity", "backgroundColor"] }], 500);
      await press(c.x, c.y);
      await sleep(20);
      m.openAnims = await evaluate(animList);
      m.open = changes(await evaluate("window.__trace"));
      await sleep(300);
      c = await evaluate(centerOf, "閉じる", "[role=dialog]", 0);
      await evaluate(startTrace, [{ sel: "dialog", props: ["opacity", "transform"] }, { sel: "scrim", props: ["opacity"] }], 450);
      if (c) await press(c.x, c.y); else m.closeMissing = `閉じる not found, dialog=${await evaluate("window.__h.dialogOpen()")}`;
      await sleep(20);
      m.closeAnims = await evaluate(animList);
      m.close = changes(await evaluate("window.__trace"));
      await load(size, { media });
      c = await evaluate(centerOf, "はじめる", null, 0);
      await evaluate("scrollTo(0, 0), true");
      c = await evaluate(centerOf, "はじめる", null, 0);
      await evaluate("scrollTo(0, 0), true");
      await sleep(100);
      const c2 = await evaluate(() => { const b = window.__h.controls(document).find((e) => (e.innerText || "").trim() === "はじめる"); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, inView: r.bottom <= innerHeight }; });
      await evaluate(startTrace, [{ sel: "win", props: [] }], 1400);
      if (c2.inView) await press(c2.x, c2.y); else await pressText("はじめる");
      m.scroll = changes(await evaluate("window.__trace"));
      m.scrollSteps = m.scroll.length;
    }
  }

  // ---- once, at the narrow size: frame rate under a 4x slower CPU, the recording, cold start ----
  const narrow = SIZES[0];
  await load(narrow);
  await send("Emulation.setCPUThrottlingRate", { rate: 4 }, s);
  await evaluate(() => { window.__frames = new Promise((res) => { const ts = []; const f = (t) => { ts.push(t); if (ts.length < 50) requestAnimationFrame(f); else res(ts); }; requestAnimationFrame(f); }); return true; });
  await pressText("使い方");
  const ts = await evaluate("window.__frames");
  const iv = ts.slice(1).map((t, i) => +(t - ts[i]).toFixed(1));
  results.frameRate = { cpu: "4x slower", frames: ts.length, maxIntervalMs: Math.max(...iv), over20ms: iv.filter((x) => x > 20).length, intervals: iv.slice(0, 20) };
  await send("Emulation.setCPUThrottlingRate", { rate: 1 }, s);

  for (const reduce of [false, true]) {
    const dir = resolve(CAP, reduce ? "recording-reduce" : "recording");
    mkdirSync(dir, { recursive: true });
    const frames = [];
    let step = "load";
    const onFrame = (m) => {
      if (m.method !== "Page.screencastFrame" || m.sessionId !== s) return;
      const n = String(frames.length + 1).padStart(4, "0");
      writeFileSync(resolve(dir, `${n}.jpg`), Buffer.from(m.params.data, "base64"));
      frames.push({ n, t: m.params.metadata.timestamp, step });
      send("Page.screencastFrameAck", { sessionId: m.params.sessionId }, s).catch(() => {});
    };
    listeners.add(onFrame);
    await send("Page.startScreencast", { format: "jpeg", quality: 60, everyNthFrame: 1 }, s);
    await load(narrow, { media: reduce ? [{ name: "prefers-reduced-motion", value: "reduce" }] : [] });
    await sleep(700);
    step = "press はじめる"; await pressText("はじめる"); await sleep(1300);
    step = "scroll to top"; await evaluate("scrollTo(0, 0), true"); await sleep(400);
    step = "press 使い方"; await pressText("使い方"); await sleep(800);
    step = "press 閉じる"; await pressText("閉じる", "[role=dialog]"); await sleep(800);
    step = "press 使い方 again"; await pressText("使い方"); await sleep(800);
    step = "press the dimmed surface"; await press(Math.round(narrow.w / 2), 12); await sleep(800);
    step = "press 使い方 twice fast"; { const c = await evaluate(centerOf, "使い方", null, 0); if (c) { await mouseClick(c.x, c.y, 1); await mouseClick(c.x, c.y, 2); } } await sleep(900);
    step = "press 使い方 after the double press"; if (!(await evaluate("window.__h.dialogOpen()"))) { await pressText("使い方"); await sleep(800); }
    step = "browser back"; await evaluate("history.back(), true"); await sleep(900);
    step = "scroll to end"; try { await reinstall(); await evaluate("scrollTo(0, document.documentElement.scrollHeight), true"); } catch (e) { frames.push({ note: "page left: " + e.message }); } await sleep(600);
    step = "idle"; await sleep(5500);
    await send("Page.stopScreencast", {}, s);
    await sleep(300);
    listeners.delete(onFrame);
    writeFileSync(resolve(dir, "frames.json"), JSON.stringify(frames, null, 1));
    results[reduce ? "recordingReduce" : "recording"] = `${frames.length} frames → ${dir.replace(ROOT, ".")}`;
  }

  // cold start: cache cleared, 4x slower CPU, 150 ms round trip, 1.6 Mbps (the mobile throttling Lighthouse uses)
  await setSize(narrow);
  await send("Network.clearBrowserCache", {}, s);
  await send("Emulation.setCPUThrottlingRate", { rate: 4 }, s);
  await send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 }, s);
  for (const id of scripts) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: id }, s);
  scripts = [];
  const cold = waitEvent("Page.loadEventFired", s, 60000);
  await send("Page.navigate", { url: BASE }, s);
  await cold;
  await sleep(1500);
  results.coldStart = await evaluate(() => {
    const n = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    const res = performance.getEntriesByType("resource").map((r) => `${r.name.replace(location.origin, "")} ${Math.round(r.responseEnd)}ms`);
    return { domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: fcp ? Math.round(fcp.startTime) : null, fonts: document.fonts.status, resources: res };
  });
  await send("Emulation.setCPUThrottlingRate", { rate: 1 }, s);
  await send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, s);

  // offline: the page loaded once, then the connection drops and each control is pressed
  await load(narrow);
  await send("Network.emulateNetworkConditions", { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, s);
  const offline = [];
  offline.push(`はじめる → ${await pressText("はじめる")}`); await sleep(1200);
  await evaluate("scrollTo(0, 0), true");
  offline.push(`使い方 → ${await pressText("使い方")}`); await sleep(700);
  offline.push(`dialog=${await evaluate("window.__h.dialogOpen()")}`);
  await send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, s);
  results.offline = offline;

  // the stamp at 400 % on the surface it sits on (rules/assets.md, Look at the edges)
  await load(narrow);
  const st = await evaluate(() => { const e = document.querySelector(".stamp"); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.closest(".day").getBoundingClientRect(); return { x: r.left + scrollX - 4, y: r.top + scrollY - 4, w: r.width + 8, h: r.height + 8 }; });
  if (st) {
    const r = await send("Page.captureScreenshot", { format: "png", clip: { x: st.x, y: st.y, width: st.w, height: st.h, scale: 4 / 2 } }, s);
    writeFileSync(resolve(CAP, "stamp-400.png"), Buffer.from(r.data, "base64"));
    results.stamp = "stamp-400.png (device pixel ratio 2 × clip scale 2 = 400 %)";
  } else results.stamp = "no stamp on the screen";

  // width sweep: where does anything leave the layout
  await load(SIZES[0]);
  const sweep = [];
  for (let w = 320; w <= 1920; w += 40) for (const ww of w === 600 ? [599, 600] : [w]) {
    await send("Emulation.setDeviceMetricsOverride", { width: ww, height: 800, deviceScaleFactor: 1, mobile: ww < 600 }, s);
    await sleep(60);
    const r = await evaluate(() => ({ docW: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, off: [...document.querySelectorAll("body *")].filter((e) => window.__h.visible(e)).filter((e) => { const r = e.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 0.5 || r.left < -0.5; }).map((e) => window.__h.desc(e)).slice(0, 4) }));
    if (r.docW > r.vw || r.off.length) sweep.push(`${ww}: docW ${r.docW} off ${r.off.join(",")}`);
  }
  results.sweep = sweep.length ? sweep : ["320–1920: nothing leaves the layout"];
} catch (e) {
  results.error = String(e.stack || e);
} finally {
  results.consoleErrors = [...new Set(consoleErrors)];
  writeFileSync(resolve(OUT, `${SLUG}.json`), JSON.stringify(results, null, 1));
  try { await send("Browser.close"); } catch {}
  ws.close();
  server.close();
  await sleep(600);
  chrome.kill();
  await sleep(400);
  try { rmSync(PROFILE, { recursive: true, force: true }); } catch {}
}

// ---- summary ----
const L = [];
const list = (k, v) => L.push(`  ${k}: ${Array.isArray(v) ? (v.length ? v.length + " | " + v.join(" ; ") : 0) : v}`);
for (const [tag, R] of Object.entries(results.sizes)) {
  L.push(`=== ${tag} ===`);
  for (const [st, r] of Object.entries(R.states)) {
    L.push(`-- ${st} ${r.cap ? r.cap.join(" ") : ""}`);
    for (const k of ["typeOff", "families", "steps", "display", "colorsOff", "colorsUsed", "filters", "radiiOff", "shadowsOff", "spacingOff", "measureOver", "lineStartClose", "oneCharLast", "labelWrap", "contrastLow", "offscreen", "clipped", "overlaps", "hScroll", "hover", "edges", "gaps", "between", "lines", "controls", "sizes", "sheet", "longApplied", "opened", "pressed", "after"]) {
      if (r[k] === undefined) continue;
      if (k === "after") { L.push(`  after: ${JSON.stringify(r[k])}`); continue; }
      list(k, r[k]);
    }
    if (r.minContrast) L.push(`  minContrast: ${r.minContrast.el}「${r.minContrast.text.slice(0, 10)}」 ${r.minContrast.color} on ${r.minContrast.bg} ${r.minContrast.ratio}`);
    if (r.hit) L.push(`  hit: controls ${r.hit.count} miss ${r.hit.miss.length ? r.hit.miss.join(" ; ") : 0} small ${r.hit.small.length ? r.hit.small.join(" ; ") : 0} overlap ${r.hit.overlap.length ? r.hit.overlap.join(" ; ") : 0}`);
    if (r.ax) { L.push("  ax:"); r.ax.forEach((x) => L.push("    " + x)); }
  }
  L.push(`-- fonts ${JSON.stringify(R.fonts)}`);
  L.push(`-- standin ${JSON.stringify(R.standin)} nolocal ${JSON.stringify(R.standinNoLocal)}`);
  for (const [k, v] of Object.entries(R.ax || {})) { L.push(`-- ax ${k}`); v.forEach((x) => L.push("    " + x)); }
  L.push("-- keyboard");
  for (const [k, v] of Object.entries(R.keyboard || {})) L.push(`  ${k}: ${Array.isArray(v) ? "\n    " + v.join("\n    ") : v}`);
  L.push("-- presses / back");
  for (const [k, v] of Object.entries(R.presses || {})) L.push(`  ${k}: ${v}`);
  L.push("-- motion");
  for (const [mode, m] of Object.entries(R.motion || {})) for (const [k, v] of Object.entries(m)) L.push(`  ${mode}.${k}: ${Array.isArray(v) ? "\n    " + v.slice(0, 14).join("\n    ") + (v.length > 14 ? `\n    …(${v.length} rows)` : "") : v}`);
}
for (const k of ["frameRate", "recording", "recordingReduce", "coldStart", "offline", "stamp", "sweep", "consoleErrors", "error"]) if (results[k] !== undefined) L.push(`== ${k}: ${JSON.stringify(results[k])}`);
writeFileSync(resolve(OUT, `${SLUG}.txt`), L.join("\n"));
console.log(`inspected → .design/harness/out/${SLUG}.txt, captures → .design/captures/${LABEL}/`);
