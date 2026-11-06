// The measuring steps. Each step loads what it needs, takes its readings, and puts findings on the
// count lines it feeds (X.add / X.put / X.data). A step that fails leaves those lines "not taken".
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { hueClusters, nearBlacks, resolveSteps, matchStep, sameSize, easesIn, declaredCurve, CLOSE, worstRatio, normalizeHex } from "./measure.mjs";

const PASS_FEEDS = ["sides", "hues", "nearblack", "families", "display", "offscale", "linelen", "contentwidth", "radii", "shadows", "spacing", "glow", "signature", "edges", "gaps", "primary", "hidden", "tap", "press", "overlap", "contrast", "clip", "labelwrap", "closebracket", "onechar", "wordbreak"];
const norm = (s) => s.replace(/\s+/g, " ").trim();
const sleepFor = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runSteps(X) {
  const { R, cfg, L, add, put, data, unavailable, step, extras, results, views, CAP, limits, ev, H, send, s, history, mouse, key, shot, wait } = X;
  const decl = cfg.declaration || {};
  const sizes = cfg.sizes, screens = cfg.screens;
  const tagOf = (z) => `${z.w}x${z.h}`;
  const multi = screens.length > 1;
  const stateNames = (screen) => Object.keys(screen.states || { default: {} });
  const accents = (decl.colors || []).filter((c) => c.role === "accent").map((c) => normalizeHex(c.value).toLowerCase());
  const tapMin = decl.tapMinimum ?? 24;
  const where = (z, screen, st, layer) => [tagOf(z), multi ? screen.name : null, st, layer].filter(Boolean).join(" ");
  const measure = (key, v) => { (results.measurements[key] ||= []).push(v); };
  const agg = { colors: {} };
  const baseTexts = {};   // per size and screen: the texts of the first state, for the raised-text comparison
  const hiddenAt = {};    // per size and screen: the regions not rendered
  const curvesSeen = {};

  // What a declaration cannot answer is said so on the line, not guessed.
  if (!decl.steps) unavailable("offscale", "the configuration's declaration has no type-scale steps");
  if (!decl.lineLengthEm) unavailable("linelen", "the configuration's declaration has no maximum line length");
  if (!decl.contentWidth) unavailable("contentwidth", "the configuration's declaration has no maximum content width");
  if (!decl.radii) unavailable("radii", "the configuration's declaration has no radius scale");
  if (!decl.shadows) unavailable("shadows", "the configuration's declaration has no elevation scale");
  if (!decl.spacingUnit) unavailable("spacing", "the configuration's declaration has no base spacing unit");
  if (!screens.some((x) => x.long)) { unavailable("longcaps", "no screen in the configuration names a long-content state"); unavailable("translation", "no screen in the configuration names a long-content state"); }

  const pollNode = async (fn, ms, every = 100) => {
    const t0 = Date.now();
    for (;;) {
      let v = false;
      try { v = await fn(); } catch {}
      if (v) return true;
      if (Date.now() - t0 > ms) return false;
      await sleepFor(every);
    }
  };

  // ---- reading one probe against the declaration ----
  function analyze(p, hit, ctx) {
    const { size, where: w, kind } = ctx;
    const steps = resolveSteps(decl, size.w);
    for (const t of p.texts) add("families", t.family, w);
    if (decl.steps) {
      put("display", new Set(p.texts.filter((t) => matchStep(t, steps)?.display).map((t) => t.size)).size, w);
      for (const t of p.texts) if (!matchStep(t, steps)) add("offscale", `${t.el}「${t.text.slice(0, 14)}」 ${t.size}px w${t.weight} ls${t.ls.toFixed(2)} lh${t.lh}${t.features ? " " + t.features : ""}`, w);
    }
    for (const [k, v] of Object.entries(p.colors)) agg.colors[k] ||= v;
    if (decl.lineLengthEm) for (const b of p.blocks) if (b.maxEm > decl.lineLengthEm + 0.2) add("linelen", `${b.el} ${b.maxEm}em`, w);
    if (decl.contentWidth && p.scrolls && p.contentWidth > decl.contentWidth + 1) add("contentwidth", `${kind === "layer" ? ctx.layer : "page"} content ${p.contentWidth}px`, w);
    if (decl.radii) for (const [k, v] of Object.entries(p.radii)) if (!decl.radii.includes(k)) add("radii", `${k} (${v})`, w);
    if (decl.shadows) { const ok = decl.shadows.map(norm); for (const [k, v] of Object.entries(p.shadows)) if (!ok.includes(norm(k))) add("shadows", `${norm(k)} (${v})`, w); }
    if (decl.spacingUnit) for (const e of p.spacing) for (const [k, v, rawv] of e.values) if (Math.abs(v / decl.spacingUnit - Math.round(v / decl.spacingUnit)) > 0.01) add("spacing", `${e.el} ${k}=${rawv}`, w);
    for (const g of p.glow) add("glow", g.el, w, g.how);

    // edges and gaps are data for the session to judge
    const lefts = {};
    for (const e of p.edges) lefts[e.left] = (lefts[e.left] || 0) + 1;
    data("edges", `${w}: ${Object.entries(lefts).sort((a, b) => a[0] - b[0]).map(([l, n]) => `${l}${n > 1 ? `×${n}` : ""}`).join(" ")}`);
    data("gaps", `${w}: ${p.gaps.map((g) => `${g.el} [${g.gaps.join(" ")}]`).join(" ")} | between ${p.between.join(" ")}`);
    put("primary", p.controls.filter((c) => c.filled && (!accents.length || (c.bg && accents.includes(c.bg.toLowerCase())))).length, w);

    const byIndex = hit && hit.length === p.controls.length ? hit : null;
    p.controls.forEach((c, i) => {
      const hh = byIndex?.[i];
      if (hh && !hh.ok) add("press", `${hh.el}「${hh.text}」 → ${hh.hit}`, w);
      const aw = Math.round(c.area.r - c.area.l), ah = Math.round(c.area.b - c.area.t);
      if ((!hh || hh.ok) && (aw < tapMin || ah < tapMin)) add("tap", `${c.el}「${c.text}」 ${aw}x${ah}`, w);
    });
    for (let i = 0; i < p.controls.length; i++) for (let j = i + 1; j < p.controls.length; j++) {
      const a = p.controls[i], b = p.controls[j];
      if (a.path.startsWith(b.path) || b.path.startsWith(a.path)) continue;
      const ix = Math.min(a.area.r, b.area.r) - Math.max(a.area.l, b.area.l), iy = Math.min(a.area.b, b.area.b) - Math.max(a.area.t, b.area.t);
      if (ix > 0.5 && iy > 0.5) add("overlap", `${a.el}「${a.text}」 / ${b.el}「${b.text}」`, w, `${Math.round(ix)}x${Math.round(iy)} px`);
    }
    for (const t of p.texts) {
      const thr = t.large ? 3 : 4.5;
      if (t.flat) { if (t.ratio < thr) add("contrast", `${t.el}「${t.text.slice(0, 12)}」`, w, `${t.color} on ${t.bg} ${t.ratio}:1, needs ${thr}`); }
      else if (ctx.pending) ctx.pending.push(t);
    }
    for (const e of p.clipped) add("clip", `clipped ${e}`, w);
    for (const e of p.overlaps) add("clip", `overlap ${e}`, w);
    for (const e of p.offscreen) add("clip", `off-screen ${e}`, w);
    if (p.docW > p.vw) add("clip", `page wider than the view (${p.docW} > ${p.vw})`, w);

    const titleish = (b) => b.title || (decl.steps && sameSize(b.size, steps));
    for (const b of p.blocks) {
      if (b.control && (b.shaped || /^button/.test(b.el)) && b.lines.length > 1) add("labelwrap", `${b.el} ${b.lines.join(" | ")}`, w);
      for (const l of b.lines.slice(1)) if (CLOSE.test(l)) add("closebracket", `${b.el}「${l.slice(0, 10)}」`, w);
      const bare = (t) => [...t.replace(/[\p{P}\s]/gu, "")].length;
      const shortText = !b.control && b.lines.length >= 2 && b.lines.length <= 3;
      if ((titleish(b) || shortText) && b.lines.length > 1 && bare(b.lines.at(-1)) === 1) add("onechar", `${b.el} last「${b.lines.at(-1)}」`, w);
      if (titleish(b) && b.lines.length > 1) {
        for (const k of b.breaks) {
          if (k.inWord) add("wordbreak", `${b.el} ${k.lineBefore}｜${k.lineAfter}`, w, `inside the word「${k.before}」`);
          else data("wordbreak", `${w} ${b.el}: ${k.before} | ${k.after}`);
        }
      }
    }
  }

  // Contrast over pixels: the text is made clear, the box behind it is read; over something moving, 16 moments.
  async function pixelContrast(ctx) {
    const read = new Map(ctx.pending.map((t) => [t, { minY: 2, maxY: -1, moments: 0 }]));
    const take = async (t) => {
      const bw = Math.max(1, Math.ceil(t.tr.r - t.tr.l) + 2), bh = Math.max(1, Math.ceil(t.tr.b - t.tr.t) + 2);
      const clip = { x: Math.max(0, Math.floor(t.tr.l) - 1), y: Math.max(0, Math.floor(t.tr.t) - 1), width: Math.min(bw, ctx.size.w), height: bh, scale: 1 };
      const r = await send("Page.captureScreenshot", { format: "png", clip }, s);
      const lm = await H("luminance", r.data), v = read.get(t);
      v.minY = Math.min(v.minY, lm.min); v.maxY = Math.max(v.maxY, lm.max); v.moments++;
    };
    const still = ctx.pending.filter((t) => !t.moving), seekable = ctx.pending.filter((t) => t.moving && t.period), scripted = ctx.pending.filter((t) => t.moving && !t.period);
    for (const t of ctx.pending) await H("hideText", t.path, true);
    try {
      for (const t of still) await take(t);
      // Animations the page runs by its own clock: pause them and seek across one iteration.
      if (seekable.length) {
        for (let k = 0; k < 16; k++) { await H("seek", k / 16); await H("frames"); for (const t of seekable) await take(t); }
        await H("seek", null);
      }
      // Content drawn by script (a canvas, a video) cannot be seeked: read it as it runs, over cfg.movingWindowMs.
      if (scripted.length) {
        const gap = (cfg.movingWindowMs || 8000) / 16;
        for (let k = 0; k < 16; k++) { for (const t of scripted) await take(t); await wait(gap); }
      }
    } finally { for (const t of ctx.pending) await H("hideText", t.path, false); }
    for (const t of ctx.pending) {
      const { minY, maxY, moments } = read.get(t);
      const worst = worstRatio(t.color, t.colorAlpha, minY, maxY);
      const thr = t.large ? 3 : 4.5;
      measure(`contrast/${ctx.where}`, { el: t.el, text: t.text, moving: t.moving, moments, worst: +worst.toFixed(2) });
      if (worst < thr) add("contrast", `${t.el}「${t.text.slice(0, 12)}」`, ctx.where, `${worst.toFixed(2)}:1${t.moving ? ` worst of ${moments} moments` : ""}, needs ${thr}`);
    }
  }

  // ---- state captures: one load, one probe, one reading ----
  async function pass(size, screen, st, first) {
    const tag = tagOf(size), w = where(size, screen, st);
    await R.load(screen, st, { size });
    const name = `${screen.name}-${st}-${tag}`;
    const full = await shot(name, { full: true });
    const view = await shot(`${name}-view`);
    (views[tag] ||= []).push({ name: `${screen.name} ${st}`, file: view });
    if (screen.signature) {
      const g = await H("rect", screen.signature);
      if (g && g.bottom > g.vh) add("signature", `${tag} ${screen.name}`, w, `${screen.signature} top ${g.top} bottom ${g.bottom}, view height ${g.vh}`);
      measure(`signature/${tag}/${screen.name}/${st}`, g);
    }
    if (first) hiddenAt[`${tag}/${screen.name}`] = await H("hiddenRegions");
    // The width what draws spans, at the widest checked size: text, a border, a fill other than the page's, an image.
    if (size.w === Math.max(...sizes.map((z) => z.w))) {
      const sp = await ev(() => {
        const page = getComputedStyle(document.body).backgroundColor;
        let l = Infinity, r = -Infinity;
        for (const e of document.body.querySelectorAll("*")) {
          const c = getComputedStyle(e);
          if (c.display === "none" || c.visibility === "hidden" || e.closest("[hidden]")) continue;
          const b = e.getBoundingClientRect();
          if (b.width < 1 || b.height < 1 || b.bottom < 0 || b.top > innerHeight) continue;
          const text = [...e.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
          const fill = c.backgroundColor !== "rgba(0, 0, 0, 0)" && c.backgroundColor !== page;
          const border = ["Top", "Right", "Bottom", "Left"].some((x) => parseFloat(c[`border${x}Width`]) > 0 && c[`border${x}Style`] !== "none");
          const image = /^(IMG|SVG|CANVAS|VIDEO|PICTURE)$/i.test(e.tagName) || c.backgroundImage !== "none";
          if (!(text || fill || border || image)) continue;
          l = Math.min(l, Math.max(0, b.left)); r = Math.max(r, Math.min(innerWidth, b.right));
        }
        return { span: Math.round(r - l), view: innerWidth };
      });
      measure(`sides/${tag}/${screen.name}/${st}`, sp);
      if (sp.span < sp.view / 2) add("sides", `${tag} ${screen.name}`, w, `what draws spans ${sp.span} of ${sp.view} px, before any scroll`);
    }
    const p = await H("probe", null, screen.names || []);
    const hit = await H("hit", null);
    const ctx = { size, where: w, kind: "state", pending: [] };
    analyze(p, hit, ctx);
    if (first) baseTexts[`${tag}/${screen.name}`] = p.texts;
    results.measurements[`state/${tag}/${screen.name}/${st}`] = { captures: [full, view], probe: p, hit };
    // the contrast over pixels follows at once, on the page as it stands
    if (ctx.pending.length) await step(`${w}: contrast over pixels`, ["contrast"], () => pixelContrast(ctx));
  }

  const layoutFound = (p) => [...p.clipped.map((e) => `clipped ${e}`), ...p.overlaps.map((e) => `overlap ${e}`), ...p.offscreen.map((e) => `off-screen ${e}`), ...(p.docW > p.vw ? [`page wider than the view`] : [])];
  // Long content twice: the longest real values, which every count reads (rules/copy.md reads line breaks
  // under them), then the source strings padded, which only the layout counts read (rules/copy.md,
  // Translation; rules/states.md, Long content) — a padded string is not a value the product shows.
  async function longPass(size, screen) {
    const tag = tagOf(size), w = where(size, screen, "long");
    await R.load(screen, "long", { size });
    const name = `${screen.name}-long-${tag}`;
    const full = await shot(name, { full: true });
    (views[tag] ||= []).push({ name: `${screen.name} long`, file: await shot(`${name}-view`) });
    const p = await H("probe", null, screen.names || []);
    const hit = await H("hit", null);
    analyze(p, hit, { size, where: w, kind: "long" });
    const found = layoutFound(p);
    if (found.length) add("longcaps", `${screen.name} long content at ${tag}`, w, found.slice(0, 3).join(", "));
    const measured = { capture: full, found };
    if (screen.long.pad) {
      const wp = where(size, screen, `long, strings ×${screen.long.pad}`);
      await R.load(screen, "long", { size, pad: screen.long.pad });
      measured.padded = { capture: await shot(`${name}-padded`, { full: true }) };
      const fp = layoutFound(await H("probe", null, screen.names || []));
      if (fp.length) add("longcaps", `${screen.name} padded strings at ${tag}`, wp, fp.slice(0, 3).join(", "));
      for (const f of fp) add("translation", f, wp);
      measured.padded.found = fp;
    }
    results.measurements[`long/${tag}/${screen.name}`] = measured;
  }

  async function bigPass(size, screen, st0) {
    const tag = tagOf(size), w = where(size, screen, `${st0} raised text`);
    await R.load(screen, st0, { size, big: true });
    const full = await shot(`${screen.name}-textsize-${tag}`, { full: true });
    (views[tag] ||= []).push({ name: `${screen.name} raised text`, file: await shot(`${screen.name}-textsize-${tag}-view`) });
    const p = await H("probe", null, screen.names || []);
    const base = new Map((baseTexts[`${tag}/${screen.name}`] || []).map((t) => [`${t.path}|${t.text}`, t.size]));
    for (const t of p.texts) { const b = base.get(`${t.path}|${t.text}`); if (b !== undefined && Math.abs(b - t.size) < 0.1) add("textsize", `${t.el}「${t.text.slice(0, 14)}」 ${t.size}px`, w); }
    const found = [...p.clipped.map((e) => `clipped ${e}`), ...p.overlaps.map((e) => `overlap ${e}`), ...p.offscreen.map((e) => `off-screen ${e}`), ...(p.docW > p.vw ? ["page wider than the view"] : [])];
    if (found.length) add("longcaps", `${screen.name} raised text at ${tag}`, w, found.slice(0, 3).join(", "));
    results.measurements[`big/${tag}/${screen.name}`] = { capture: full, found };
  }

  // ---- layers ----
  const relevant = (anims, boxPath) => anims.filter((a) => a.path && boxPath && (a.path.startsWith(boxPath) || boxPath.startsWith(a.path)) && a.iterations !== "infinite");
  const maxMs = (anims) => anims.reduce((m, a) => Math.max(m, a.duration + a.delay), 0);
  const openFn = (layer) => (typeof layer.open === "function" ? () => layer.open(R) : () => R.press(layer.open));
  // Opens a layer and reads what animated while it did.
  async function openLayer(layer, size, screen, st) {
    await R.load(screen, st, { size });
    return openNow(layer);
  }
  async function openNow(layer) {
    await openFn(layer)();
    await H("frames");
    const boxPath = await H("pathOf", layer.box);
    const anims = relevant(await H("anims"), boxPath);
    const ok = await H("until", layer.box, true, 2000);
    await H("settle", 2000);
    return { ok, anims, boxPath };
  }
  async function closeNow(layer, boxPath) {
    if (layer.close) await R.press(layer.close);
    await H("frames");
    const anims = relevant(await H("anims"), boxPath);
    await pollNode(async () => !(await H("openBox", layer.box)), 1500);
    await H("settle", 2000);
    return anims;
  }
  const easeOf = (a) => (a.kfEasing.length ? a.kfEasing : [a.easing]);
  const scaleOf = (v) => {
    if (!v) return null;
    for (const x of [v.transform, v.scale]) {
      if (!x || x === "none") continue;
      const m = String(x).match(/matrix\(([^)]+)\)/);
      if (m) return Math.hypot(...m[1].split(",").slice(0, 2).map(Number));
      const sc = String(x).match(/scale\(\s*([\d.]+)/) || String(x).match(/^([\d.]+)/);
      if (sc) return +sc[1];
    }
    return null;
  };
  const noteCurves = (anims, w) => {
    for (const a of anims) for (const c of easeOf(a)) if (a.duration > 0 && (!decl.curves || !declaredCurve(c, decl.curves)) && c !== "linear") add("curves", `${c} (${a.target} ${a.prop})`, w);
  };

  async function layerPass(size, screen, st0, layer) {
    const tag = tagOf(size), w = where(size, screen, st0, layer.name);
    const o = await openLayer(layer, size, screen, st0);
    if (!o.ok) { X.notes.push(`${w}: the layer did not open (${layer.box} not shown)`); results.measurements[`layer/${tag}/${layer.name}`] = { opened: false }; return; }
    const name = `${screen.name}-${layer.name}-${tag}`;
    (views[tag] ||= []).push({ name: `${screen.name} ${layer.name}`, file: await shot(name) });
    const p = await H("probe", layer.box, screen.names || []);
    const hit = await H("hit", layer.box);
    const ctx = { size, where: w, kind: "layer", layer: layer.name, pending: [] };
    analyze(p, hit, ctx);
    if (ctx.pending.length) await step(`${w}: contrast over pixels`, ["contrast"], () => pixelContrast(ctx));
    // entrance
    for (const a of o.anims) {
      if (a.duration <= 0) continue;
      for (const c of easeOf(a)) if (easesIn(c)) add("easein", `${a.target} ${a.prop} ${c}`, w);
      const from = scaleOf(a.from), to = scaleOf(a.to);
      if (from !== null && from < 0.9 && (to === null || to >= 0.9)) add("fromnothing", `${a.target} ${a.prop} scale ${+from.toFixed(2)} to ${to === null ? 1 : +to.toFixed(2)}`, w);
    }
    noteCurves(o.anims, w);
    const closing = await closeNow(layer, o.boxPath);
    noteCurves(closing, w);
    const din = maxMs(o.anims), dout = maxMs(closing);
    // "about seven-tenths": up to three-quarters of the entrance is read as about
    if (layer.close && din > 0 && dout > din * 0.75) add("exitlong", layer.name, w, `entrance ${din} ms, exit ${dout} ms`);
    measure(`layer/${tag}/${layer.name}`, { entrance: o.anims, exit: closing, entranceMs: din, exitMs: dout, probe: p, hit });
  }

  async function ignoresInput(size, screen, st0, layer) {
    const w = where(size, screen, st0, layer.name);
    await R.load(screen, st0, { size });
    await openFn(layer)();
    await R.press(layer.close);
    await pollNode(async () => !(await H("openBox", layer.box)), 1200);
    await H("settle", 2000);
    const stillOpen = await H("openBox", layer.box);
    if (!stillOpen) return;
    await R.press(layer.close);
    const closedLater = await pollNode(async () => !(await H("openBox", layer.box)), 1500);
    if (closedLater) add("ignoresinput", layer.name, w, "a press on the close control while the entrance played did nothing; after it, the press closed the layer");
  }

  async function reduceLayer(size, screen, st0, layer) {
    const w = where(size, screen, st0, layer.name) + " reduce-motion";
    await R.load(screen, st0, { size, media: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await openFn(layer)();
    await H("frames");
    const boxPath = await H("pathOf", layer.box);
    const a1 = relevant(await H("anims"), boxPath);
    await H("until", layer.box, true, 2000);
    await H("settle", 2000);
    const a2 = layer.close ? await closeNow(layer, boxPath) : [];
    for (const a of [...a1, ...a2]) {
      const moves = /^(transform|translate|scale|rotate)$/.test(a.prop) || [["transform"], ["scale"], ["translate"]].some(([k]) => a.from && a.to && a.from[k] !== a.to[k] && (a.from[k] || a.to[k]));
      if (moves && a.duration > 0) add("reduce", `${a.target} ${a.prop || "transform"}`, w);
    }
  }

  async function focusLayer(size, screen, st0, layer) {
    const w = where(size, screen, st0, layer.name);
    await R.load(screen, st0, { size });
    const problems = [];
    const openerSel = layer.opener || (typeof layer.open === "string" ? layer.open : null);
    const openerDesc = openerSel ? await ev((q) => window.__h.desc(document.querySelector(q)), openerSel) : null;
    // a keyboard opens it from the opener, which no box laid over the opener can stop
    if (openerSel) { await ev((q) => { document.querySelector(q).focus(); return true; }, openerSel); await key("Enter"); }
    else await openFn(layer)();
    await H("until", layer.box, true, 2000);
    await H("settle", 2000);
    let st = await H("state", layer.box);
    if (!st.open) return;
    if (!st.activeInBox) problems.push("focus stays outside when it opens");
    for (let i = 0; i < 12 && !problems.includes("focus leaves while it is open"); i++) {
      await key("Tab");
      st = await H("state", layer.box);
      if (!st.activeInBox && st.active !== "body") problems.push("focus leaves while it is open");
    }
    if (openerDesc) {
      await R.press(layer.close);
      await pollNode(async () => !(await H("openBox", layer.box)), 1500);
      await H("settle", 2000);
      const after = await H("state", layer.box);
      if (after.active !== openerDesc) problems.push(`focus does not return to ${openerDesc} on close (it is on ${after.active})`);
    }
    if (problems.length) add("focuslayer", layer.name, w, problems.join("; "));
  }

  async function backLayer(size, screen, st0, layer) {
    const w = where(size, screen, st0, layer.name);
    const closedOrLeft = async (h0) => {
      await pollNode(async () => { const h = await history(); return h.url !== h0.url || !(await H("openBox", layer.box)); }, 1500);
      const h1 = await history();
      const left = !h1.url.startsWith(X.base);
      let open = false;
      if (!left) { try { open = await H("openBox", layer.box); } catch { open = false; } }
      return { left, open, url: h1.url };
    };
    await R.load(screen, st0, { size });
    await openFn(layer)();
    await H("until", layer.box, true, 2000);
    await H("settle", 2000);
    let h0 = await history();
    await ev("setTimeout(() => history.back(), 0), true");
    let r = await closedOrLeft(h0);
    if (r.left || r.open) add("backmodal", layer.name, w, r.left ? `back left the product (${r.url})` : "back left it open");
    // the same after a reload while it is open
    await R.load(screen, st0, { size });
    await openFn(layer)();
    await H("until", layer.box, true, 2000);
    await H("settle", 2000);
    const reloaded = X.waitEvent("Page.loadEventFired", s, limits.load);
    await send("Page.reload", {}, s);
    await reloaded;
    await X.reinstall();
    await H("frames");
    if (await H("openBox", layer.box)) {
      h0 = await history();
      await ev("setTimeout(() => history.back(), 0), true");
      r = await closedOrLeft(h0);
      if (r.left || r.open) add("backmodal", layer.name, w + " after a reload", r.left ? `back left the product (${r.url})` : "back left it open");
    }
  }

  // Six seconds of nothing: the watch itself has nothing to wait on, so the time is fixed.
  async function idleWatch(size, screen, st0, layer) {
    const w = where(size, screen, st0, layer ? layer.name : "resting");
    const box = layer ? layer.box : null;
    await R.load(screen, st0, { size });
    if (layer) { await openFn(layer)(); await H("until", box, true, 2000); await H("settle", 2000); }
    const pauseControl = await H("pauseControl");
    const infinite0 = await H("infinite");
    const samples = [];
    for (let i = 0; i <= 6; i++) {
      samples.push({ t: i, ...(await H("state", box)), canvas: JSON.stringify(await H("canvasSig")), video: JSON.stringify(await H("videoSig")) });
      if (i < 6) await wait(1000);
    }
    const first = samples[0], last = samples.at(-1), mid = samples[3];
    const what = [];
    if (last.url !== first.url) what.push(`the address changed to ${last.url}`);
    if (box && first.open && !last.open) what.push(`${layer.name} closed after ${samples.findIndex((x) => !x.open)} s`);
    if (!box && last.scrollY !== first.scrollY) what.push(`the page scrolled from ${first.scrollY} to ${last.scrollY}`);
    if (what.length) add("selfmove", layer ? layer.name : screen.name, w, what.join("; "));
    const moving = [];
    if (infinite0.length && (await H("infinite")).length) moving.push(`${infinite0.map((a) => a.target + " " + a.prop).slice(0, 3).join(", ")} runs without end`);
    if (first.canvas !== mid.canvas && mid.canvas !== last.canvas) moving.push("a canvas keeps changing");
    if (first.video !== mid.video && mid.video !== last.video && first.video !== "[]") moving.push("a video keeps playing");
    if (moving.length && !pauseControl) add("autoplay", layer ? layer.name : screen.name, w, moving.join("; "));
    measure(`idle/${w}`, { samples, moving, pauseControl });
  }

  // ---- keyboard ----
  async function focusWalk(size, screen, st0) {
    const w = where(size, screen, st0);
    await R.load(screen, st0, { size });
    const n = (await H("ctlList", null)).length;
    await H("fvBase");
    await H("blur");
    const seq = [];
    for (let i = 0; i < Math.min(40, n + 3); i++) {
      await key("Tab");
      const f = await H("focusInfo");
      if (f.body || seq.some((x) => x.path === f.path)) break;   // out of the page, or around to the first again
      seq.push(f);
      if (!f.indicator) add("focusvisible", `${f.el}「${f.text}」`, w);
      if (f.anims.some((a) => /outline|shadow|border|background|color|filter|transform|opacity|all/.test(a.prop) || a.type === "CSSAnimation")) add("focusanim", `${f.el}「${f.text}」`, w, f.anims.map((a) => `${a.prop} ${a.duration} ms`).join(", "));
    }
    for (let i = 1; i < seq.length; i++) {
      const a = seq[i - 1].pos, b = seq[i].pos;
      // the same row where the boxes share some height; then left to right
      const sameRow = b.t < a.t + a.h && a.t < b.t + b.h;
      if ((!sameRow && b.t < a.t) || (sameRow && b.l < a.l - 1)) add("focusorder", `${seq[i - 1].el} → ${seq[i].el}`, w);
    }
    measure(`focus/${w}`, seq);
  }

  async function neighbors(size, screen, st0) {
    const w = where(size, screen, st0);
    await R.load(screen, st0, { size });
    await H("nbBase");
    await H("blur");
    await H("nbRects");
    for (let i = 0; i < 14; i++) {
      await key("Tab");
      await H("settle", 800);
      const d = await H("nbDiff", "focus");
      for (const m of d.moved) add("moves", `${m.el}「${m.text}」 ${m.what}`, w, `after Tab to ${d.who}`);
      if (d.tag === "body") break;
    }
    for (let i = 0; i < 12; i++) {
      const p = await H("nbPrepare", i, null);
      if (p.x === undefined) break;
      await H("nbRects");
      await mouse("mouseMoved", p.x, p.y);
      await mouse("mousePressed", p.x, p.y, { button: "left", buttons: 1, clickCount: 1 });
      await H("settle", 800);
      const d = await H("nbDiff", "press");
      // released 400 px away, so no click reaches the control
      await mouse("mouseMoved", p.x + 400, p.y + 400, { button: "left", buttons: 1 });
      await mouse("mouseReleased", p.x + 400, p.y + 400, { button: "left", buttons: 0, clickCount: 1 });
      for (const m of d.moved) add("moves", `${m.el}「${m.text}」 ${m.what}`, w, `while pressing ${p.who}`);
      await H("settle", 800);
    }
  }

  // ---- presses ----
  async function pressAnswers(size, screen, st0, reduce) {
    const w = where(size, screen, st0) + (reduce ? " reduce-motion" : "");
    await R.load(screen, st0, { size, media: reduce ? [{ name: "prefers-reduced-motion", value: "reduce" }] : [] });
    const ctls = (await H("ctlList", null)).slice(0, reduce ? 6 : 8);
    for (const c of ctls) {
      const t = await H("target", c.path);
      if (!t) continue;
      await mouse("mouseMoved", t.x, t.y);
      await H("settle", 800);
      await H("hold", c.path);
      await mouse("mousePressed", t.x, t.y, { button: "left", buttons: 1, clickCount: 1 });
      const a = await H("heldAnswer");
      await mouse("mouseMoved", t.x + 400, t.y + 400, { button: "left", buttons: 1 });
      await mouse("mouseReleased", t.x + 400, t.y + 400, { button: "left", buttons: 0, clickCount: 1 });
      await H("settle", 800);
      const label = `${c.el}「${c.text}」`;
      if (reduce) {
        if (a.scale !== 1 || a.animated.some((x) => /transform|translate|scale/.test(x.prop))) add("reduce", `press ${label} scale ${a.scale}`, w);
        continue;
      }
      const answered = a.changed || a.animated.length > 0 || c.native;
      measure(`press/${w}`, { control: label, ...a });
      if (!answered) { if (!c.inRunningText) add("noanswer", label, w); continue; }
      if (!c.native && (a.duration < 95 || a.duration > 155)) add("timing", label, w, `${a.duration} ms`);
      data("vocab", `${w}: ${label} scale ${a.scale}, opacity ${a.opacity}, background ${a.bgBefore} → ${a.bgNow}, ${a.duration} ms`);
    }
  }

  async function doublePress(size, screen, st0) {
    const w = where(size, screen, st0);
    await R.load(screen, st0, { size });
    const n = Math.min(6, (await H("ctlList", null)).length);
    for (let i = 0; i < n; i++) {
      if (i) await R.load(screen, st0, { size });
      const c = (await H("ctlList", null))[i];
      const t = c && (await H("target", c.path));
      if (!t) continue;
      await ev((path) => {
        const el = document.querySelector(path);
        window.__clicks = [];
        document.addEventListener("click", (e) => window.__clicks.push({ target: window.__h.desc(e.target), on: el.contains(e.target) }), true);
        return true;
      }, c.path);
      const h0 = await history();
      await R.pressAt(t.x, t.y, 1);
      await R.pressAt(t.x, t.y, 2);
      await pollNode(async () => { const h = await history(); return h.length !== h0.length; }, 300, 50);
      let clicks = [];
      try { await H("settle", 800); clicks = await ev("window.__clicks"); } catch {}
      const h1 = await history();
      const twice = h1.length - h0.length >= 2 || h1.index - h0.index >= 2;
      const second = clicks.length >= 2 && clicks[0].on && !clicks[1].on;
      if (twice || second) add("double", `${c.el}「${c.text}」`, w, twice ? "navigated twice" : `the second press landed on ${clicks[1].target}`);
      measure(`double/${w}`, { control: c.el, h0, h1, clicks });
    }
  }

  async function backs(size, screen, st0) {
    const w = where(size, screen, st0);
    await R.load(screen, st0, { size });
    const h0 = await history();
    // Every load comes from a blank page, so the tab's history holds the runner's own loads; what
    // the page wrote beneath itself is what stands between the last blank entry and the current one.
    const full = await send("Page.getNavigationHistory", {}, s);
    let blank = -1;
    for (let i = full.currentIndex; i >= 0; i--) if (full.entries[i].url === "about:blank") { blank = i; break; }
    const written = blank >= 0 ? full.currentIndex - blank - 1 : 0;
    if (written > 0) add("history", screen.name, w, `${written} entr${written === 1 ? "y" : "ies"} written by the page beneath where it arrived`);
    await ev("setTimeout(() => history.back(), 0), true");
    await pollNode(async () => (await history()).url !== h0.url, 1200);
    const h1 = await history();
    if (h1.url === h0.url) add("backnothing", screen.name, w, "back left the address and the screen as they were");
    measure(`back/${w}`, { h0, h1 });
  }

  // ---- a11y ----
  async function a11yReads(size, screen, st0) {
    const w = where(size, screen, st0);
    await R.load(screen, st0, { size });
    const ctls = (await H("ctlList", null)).slice(0, 40);
    for (const c of ctls) {
      const { result } = await send("Runtime.evaluate", { expression: `document.querySelector(${JSON.stringify(c.path)})`, returnByValue: false }, s);
      if (!result.objectId) continue;
      const { nodes } = await send("Accessibility.getPartialAXTree", { objectId: result.objectId, fetchRelatives: false }, s);
      const name = (nodes[0]?.name?.value || "").trim();
      if (!name) add("noname", `${c.el}`, w);
      else if (c.text) {
        const f = (x) => x.toLowerCase().replace(/\s+/g, "");
        if (!f(name).includes(f(c.text))) add("namelabel", `${c.el} name「${name}」 label「${c.text}」`, w);
      }
    }
    (await H("eyeOnly")).forEach((e, i) => add("eyeonly", `${e.el}「${e.text}」 #${i + 1}`, w));
    const meta = await H("viewportMeta");
    const content = meta || "";
    const scale = content.match(/maximum-scale\s*=\s*([\d.]+)/);
    if (/user-scalable\s*=\s*(no|0)/i.test(content) || (scale && +scale[1] < 2)) add("zoom", `${screen.name} viewport「${content}」`, w);
    measure(`a11y/${w}`, { viewport: meta });
  }

  // ---- connection, start ----
  async function offline(size, screen, st0) {
    const w = where(size, screen, st0);
    await R.load(screen, st0, { size });
    const n = Math.min(6, (await H("ctlList", null)).length);
    const readScreen = () => ev(() => ({ text: document.body.innerText.replace(/\s+/g, " ").trim(), url: location.href, status: [...document.querySelectorAll("[role=status],[role=alert],[aria-live]")].map((e) => e.innerText.trim()).filter(Boolean).join(" / ") }));
    try {
      for (let i = 0; i < n; i++) {
        if (i) await R.load(screen, st0, { size });
        const c = (await H("ctlList", null))[i];
        if (!c) continue;
        await send("Network.emulateNetworkConditions", { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, s);
        const before = await readScreen();
        await R.press(c.path);
        let after = null;
        try { await H("frames"); await H("settle", 1500); after = await readScreen(); } catch {}
        data("offline", after
          ? `${w}: pressed ${c.el}「${c.text}」 → ${before.text !== after.text ? "the screen changed" : "nothing on the screen changed"}; address ${before.url === after.url ? "same" : "changed"}; status「${after.status}」`
          : `${w}: pressed ${c.el}「${c.text}」 → the page was left for the browser's own error page`);
      }
    } finally { await send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, s); }
  }

  async function coldStart(size, screen) {
    const w = where(size, screen, "cold start");
    // the mobile throttling Lighthouse uses: 4x slower CPU, 150 ms round trip, 1.6 Mbps down, 750 Kbps up
    await R.load(screen, { storage: {}, cpu: 4, clearCache: true, net: { latency: 150, down: (1.6 * 1024 * 1024) / 8, up: (750 * 1024) / 8 } }, { size });
    const m = await ev(() => {
      const n = performance.getEntriesByType("navigation")[0];
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      return { domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), firstPaint: fcp ? Math.round(fcp.startTime) : null };
    });
    await send("Emulation.setCPUThrottlingRate", { rate: 1 }, s);
    await send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, s);
    measure(`cold/${w}`, m);
    // Input is accepted once the page's scripts have run (DOMContentLoaded) and it has painted;
    // the load event also waits for fonts and images, which do not hold input back (rules/states.md).
    const ready = Math.max(m.domContentLoaded, m.firstPaint || 0);
    if (ready > 2000) add("cold", `${screen.name} at ${tagOf(size)}`, w, `ready for input ${ready} ms (DOMContentLoaded ${m.domContentLoaded} ms, first paint ${m.firstPaint} ms)`);
    data("cold", `${w}: ready for input ${ready} ms; load event ${m.load} ms`);
  }

  // ---- once for the whole run ----
  async function sweep(screen, st0) {
    const ws = sizes.map((z) => z.w), lo = Math.min(...ws), hi = Math.max(...ws);
    const narrow = sizes.reduce((a, b) => (b.w < a.w ? b : a));
    const h = Math.min(...sizes.map((z) => z.h));
    await R.load(screen, st0, { size: narrow });
    const widths = [];
    for (let x = lo; x < hi; x += 40) widths.push(x);
    widths.push(hi);
    for (const wd of widths) {
      await send("Emulation.setDeviceMetricsOverride", { width: wd, height: h, deviceScaleFactor: 1, mobile: !!narrow.touch }, s);
      await H("frames");
      const r = await ev(() => ({ docW: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, off: [...document.querySelectorAll("body *")].filter((e) => window.__h.visible(e)).filter((e) => { const b = e.getBoundingClientRect(); return b.right > document.documentElement.clientWidth + 0.5 || b.left < -0.5; }).map((e) => window.__h.desc(e)).slice(0, 6) }));
      if (r.docW > r.vw) add("clip", `page wider than the view (${r.docW} > ${r.vw})`, `${wd}px wide`);
      for (const e of r.off) add("clip", `off-screen ${e}`, `${wd}px wide`);
    }
  }

  async function frameRate(size, screen, st0, layer) {
    await R.load(screen, st0, { size });
    await send("Emulation.setCPUThrottlingRate", { rate: 4 }, s);
    try {
      await ev(() => { window.__frames = new Promise((res) => { const ts = []; const f = (t) => { ts.push(t); if (ts.length < 50) requestAnimationFrame(f); else res(ts); }; requestAnimationFrame(f); }); return true; });
      if (layer) await openFn(layer)(); else await ev("scrollTo({ top: 400, behavior: 'smooth' }), true");
      const ts = await ev("window.__frames");
      const iv = ts.slice(1).map((t, i) => +(t - ts[i]).toFixed(1));
      extras.push({ rule: "motion", line: "Frame rate", value: "data", where: `${X.gpu ? "GPU on" : "GPU off — read the frame-rate check from a run with --gpu"}, ${tagOf(size)} at 4x slower CPU, ${layer ? `opening ${layer.name}` : "scrolling"}: ${iv.length} intervals, longest ${Math.max(...iv)} ms, ${iv.filter((x) => x > 20).length} over 20 ms: ${iv.slice(0, 20).join(" ")}` });
    } finally { await send("Emulation.setCPUThrottlingRate", { rate: 1 }, s); }
  }

  async function recording(size, screen, st0) {
    await R.load(screen, st0, { size });
    const n = await R.record("recording", async () => {
      await wait(500);
      for (const layer of screen.layers || []) {
        await openFn(layer)();
        await H("until", layer.box, true, 2000);
        await wait(700);
        if (layer.close) { await R.press(layer.close); await pollNode(async () => !(await H("openBox", layer.box)), 1500); await wait(500); }
      }
      await ev("scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }), true");
      await wait(1200);
    });
    measure("recording", { size: tagOf(size), frames: n });
  }

  // The captures of one size side by side, scaled so the sheet's long edge is at most 1568 px; composed in a blank page.
  async function contactSheet(size) {
    const tag = tagOf(size), list = views[tag] || [];
    if (!list.length) return;
    const gap = 12, label = 18, MAX = 1568;
    let best = null;
    for (let cols = 1; cols <= list.length; cols++) {
      const rows = Math.ceil(list.length / cols);
      const sc = Math.min(1, (MAX - (cols + 1) * gap) / (cols * size.w), (MAX - (rows * (label + gap) + gap)) / (rows * size.h));
      if (sc > 0 && (!best || sc > best.sc)) best = { cols, rows, sc };
    }
    const cw = Math.floor(size.w * best.sc), ch = Math.floor(size.h * best.sc);
    const W = best.cols * (cw + gap) + gap, Hh = best.rows * (ch + label + gap) + gap;
    const imgs = list.map((v) => ({ name: v.name, src: "data:image/png;base64," + readFileSync(resolve(CAP, v.file)).toString("base64") }));
    await send("Page.navigate", { url: "about:blank" }, s);
    await X.sleep(150);
    await send("Emulation.setDeviceMetricsOverride", { width: W, height: Hh, deviceScaleFactor: 1, mobile: false }, s);
    await send("Emulation.setTouchEmulationEnabled", { enabled: false }, s);
    await ev(async (items, cols, cw, ch, gap, label) => {
      document.body.style.cssText = `margin:0;background:#888;font:12px/${label}px sans-serif;color:#fff`;
      document.body.innerHTML = `<div style="display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${gap}px;padding:${gap}px">${items.map((i) => `<figure style="margin:0"><div style="height:${label}px;white-space:nowrap;overflow:hidden">${i.name}</div><img src="${i.src}" width="${cw}" height="${ch}" style="display:block;background:#fff"></figure>`).join("")}</div>`;
      await Promise.all([...document.images].map((i) => i.decode()));
      return true;
    }, imgs, best.cols, cw, ch, gap, label);
    const r = await send("Page.captureScreenshot", { format: "png" }, s);
    writeFileSync(resolve(CAP, `contact-${tag}.png`), Buffer.from(r.data, "base64"));
  }

  // ===== the order of the run =====
  const only = (...ids) => ids.some((id) => L.has(id));
  const first = (screen) => stateNames(screen)[0];

  for (const size of sizes) {
    const tag = tagOf(size);
    for (const screen of screens) {
      const st0 = first(screen);
      const sc = `${tag} ${screen.name}`;
      for (const st of stateNames(screen)) await step(`${where(size, screen, st)}: capture and probe`, PASS_FEEDS, () => pass(size, screen, st, st === st0));
      if (screen.long) await step(`${sc} long content`, ["longcaps", "translation", "labelwrap", "closebracket", "onechar", "wordbreak", "clip"], () => longPass(size, screen));
      await step(`${sc} raised text`, ["textsize", "longcaps"], () => bigPass(size, screen, st0));
      for (const layer of screen.layers || []) {
        const ln = `${sc} ${layer.name}`;
        await step(`${ln} open and close`, ["easein", "fromnothing", "exitlong", "curves", ...PASS_FEEDS], () => layerPass(size, screen, st0, layer));
        if (layer.close) await step(`${ln} press during the entrance`, ["ignoresinput"], () => ignoresInput(size, screen, st0, layer));
        await step(`${ln} with reduced motion`, ["reduce"], () => reduceLayer(size, screen, st0, layer));
        if (layer.close) await step(`${ln} focus`, ["focuslayer"], () => focusLayer(size, screen, st0, layer));
        if (!layer.skipBack) await step(`${ln} back`, ["backmodal"], () => backLayer(size, screen, st0, layer));
        await step(`${ln} idle`, ["selfmove", "autoplay"], () => idleWatch(size, screen, st0, layer));
      }
      await step(`${sc} idle`, ["selfmove", "autoplay"], () => idleWatch(size, screen, st0, null));
      await step(`${sc} keyboard focus`, ["focusvisible", "focusanim", "focusorder"], () => focusWalk(size, screen, st0));
      await step(`${sc} neighbors`, ["moves"], () => neighbors(size, screen, st0));
      await step(`${sc} press answers`, ["noanswer", "timing", "vocab"], () => pressAnswers(size, screen, st0, false));
      await step(`${sc} press with reduced motion`, ["reduce"], () => pressAnswers(size, screen, st0, true));
      await step(`${sc} double press`, ["double"], () => doublePress(size, screen, st0));
      await step(`${sc} back`, ["backnothing", "history"], () => backs(size, screen, st0));
      await step(`${sc} names, symbols, zoom`, ["noname", "namelabel", "eyeonly", "zoom"], () => a11yReads(size, screen, st0));
      await step(`${sc} offline`, ["offline"], () => offline(size, screen, st0));
      await step(`${sc} cold start`, ["cold"], () => coldStart(size, screen));
      if (only("curves")) await step(`${sc} declared curves`, ["curves"], async () => {
        await R.load(screen, st0, { size });
        const found = await H("curves");
        for (const [c, el] of Object.entries(found)) if (!decl.curves || !declaredCurve(c, decl.curves)) add("curves", `${c} (${el})`, where(size, screen, st0));
      });
    }
  }

  // regions that hide on the narrow display: not rendered at the narrowest width, rendered at the widest
  await step("regions hidden at the narrow width", ["hidden"], async () => {
    const wide = sizes.reduce((a, b) => (b.w > a.w ? b : a)), narrow = sizes.reduce((a, b) => (b.w < a.w ? b : a));
    if (wide.w === narrow.w) { data("hidden", "the checked sizes have one width"); return; }
    for (const screen of screens) {
      const wideHidden = new Set((hiddenAt[`${tagOf(wide)}/${screen.name}`] || []).map((x) => x.path));
      for (const h of hiddenAt[`${tagOf(narrow)}/${screen.name}`] || []) if (!h.byAttr && !wideHidden.has(h.path)) data("hidden", `${tagOf(narrow)} ${screen.name}: ${h.el}「${h.text}」 is not shown (it is at ${tagOf(wide)})`);
    }
  });
  // colors across every capture
  await step("hues and near-blacks across the captures", ["hues", "nearblack"], async () => {
    const clusters = hueClusters(agg.colors, decl);
    for (const c of clusters) add("hues", `hue ${c.h}°`, "all captures", c.members.slice(0, 3).join(", "));
    const nb = nearBlacks(agg.colors);
    data("nearblack", nb.length ? nb.join(" ; ") : "none rendered");
  });

  const narrow = sizes.reduce((a, b) => (b.w < a.w ? b : a));
  const s0 = screens[0], st00 = first(s0);
  await step("width sweep", ["clip"], () => sweep(s0, st00));
  if (X.selected.has("motion")) await step("frame rate at 4x slower CPU", [], () => frameRate(narrow, s0, st00, (s0.layers || [])[0]));
  if (only("noanswer", "timing", "vocab", "easein", "fromnothing", "exitlong", "ignoresinput", "reduce", "autoplay", "curves")) await step("recording", [], () => recording(narrow, s0, st00));
  for (const size of sizes) await step(`contact sheet ${tagOf(size)}`, [], () => contactSheet(size));
}
