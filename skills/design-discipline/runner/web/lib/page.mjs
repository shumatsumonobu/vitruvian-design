// In-page measuring code. `install` is serialized with toString() and evaluated in the product's page,
// so it must use nothing from this module. It defines window.__h; every method returns plain JSON.
export function install() {
  const h = {};
  const SKIP = new Set(["SCRIPT", "STYLE", "BR", "LINK", "META", "NOSCRIPT", "TEMPLATE", "HEAD", "TITLE"]);
  h.skip = SKIP;

  // ---- naming and visibility ----
  h.desc = (el) => {
    if (!el || !el.tagName) return String(el);
    let d = el.tagName.toLowerCase();
    if (el.id) d += "#" + el.id;
    if (el.classList && el.classList.length) d += "." + [...el.classList].join(".");
    return d;
  };
  h.path = (el) => {
    const parts = [];
    for (let e = el; e && e.nodeType === 1 && e !== document.documentElement; e = e.parentElement) {
      const i = [...e.parentElement.children].indexOf(e) + 1;
      parts.unshift(`${e.tagName.toLowerCase()}:nth-child(${i})`);
    }
    return "html>" + parts.join(">");
  };
  h.visible = (el) => {
    if (!el.isConnected || el.closest("[hidden]")) return false;
    const c = getComputedStyle(el);
    if (c.display === "none" || c.visibility === "hidden" || +c.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 2 && r.height >= 2;
  };
  h.label = (el) => (el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 24);

  // ---- color ----
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

  // ---- text lines ----
  h.blockOf = (e) => {
    for (let x = e; x && x !== document.body; x = x.parentElement) if (getComputedStyle(x).display !== "inline") return x;
    return document.body;
  };
  // The lines a block is set on, read per character as the source of truth for where the browser broke it.
  // `first` and `last` are character offsets into `text`, the block's own text with its spaces.
  h.lines = (block) => {
    const rects = [];
    let text = "";
    const w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      const p = n.parentElement;
      if (!h.visible(p) || h.blockOf(p) !== block) continue;
      const base = text.length;
      text += n.nodeValue;
      for (let i = 0; i < n.nodeValue.length; i++) {
        const ch = n.nodeValue[i];
        if (/\s/.test(ch)) continue;
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const b = r.getBoundingClientRect();
        if (!b.width) continue;
        rects.push({ ch, idx: base + i, top: b.top, left: b.left, right: b.right, h: b.height });
      }
    }
    const groups = [];
    // A character joins the line whose vertical extent holds its middle: characters of different
    // sizes on one line — a smaller arrow or currency sign — have different tops but share the line.
    for (const r of rects) {
      const mid = r.top + r.h / 2;
      let g = groups.find((g) => mid > g.top && mid < g.bottom);
      if (!g) groups.push((g = { top: r.top, bottom: r.top + r.h, chars: [] }));
      else { g.top = Math.min(g.top, r.top); g.bottom = Math.max(g.bottom, r.top + r.h); }
      g.chars.push(r);
    }
    groups.sort((a, b) => a.top - b.top);
    return {
      text,
      lines: groups.map((g) => ({
        text: g.chars.map((c) => c.ch).join(""),
        left: Math.min(...g.chars.map((c) => c.left)),
        width: Math.max(...g.chars.map((c) => c.right)) - Math.min(...g.chars.map((c) => c.left)),
        first: Math.min(...g.chars.map((c) => c.idx)),
        last: Math.max(...g.chars.map((c) => c.idx)),
      })),
    };
  };
  // Every break between two lines of a block: the words on either side, and whether both sides fall in one word.
  h.breaks = (block, read) => {
    const lang = (block.closest("[lang]") || document.documentElement).lang || "en";
    const seg = [...new Intl.Segmenter(lang, { granularity: "word" }).segment(read.text)];
    const at = (i) => seg.find((s) => i >= s.index && i < s.index + s.segment.length);
    const out = [];
    for (let i = 1; i < read.lines.length; i++) {
      const a = at(read.lines[i - 1].last), b = at(read.lines[i].first);
      if (!a || !b) continue;
      out.push({ before: a.segment, after: b.segment, inWord: a.index === b.index, lineBefore: read.lines[i - 1].text.slice(-6), lineAfter: read.lines[i].text.slice(0, 6) });
    }
    return out;
  };

  // ---- controls, and the area that answers a press ----
  h.controls = (scope) => [...scope.querySelectorAll("button, a[href], [role=button], [role=tab], [role=link], input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex='-1'])")].filter(h.visible);
  // The control's box together with the boxes of its pseudo-elements, which answer a press as the control.
  h.area = (e) => {
    const r = e.getBoundingClientRect();
    const a = { l: r.left, t: r.top, r: r.right, b: r.bottom };
    if (getComputedStyle(e).position === "static") return a;
    const cs = getComputedStyle(e);
    const pl = r.left + parseFloat(cs.borderLeftWidth), pt = r.top + parseFloat(cs.borderTopWidth);
    const pr = r.right - parseFloat(cs.borderRightWidth), pb = r.bottom - parseFloat(cs.borderBottomWidth);
    for (const ps of ["::before", "::after"]) {
      const p = getComputedStyle(e, ps);
      if (p.content === "none" || p.content === "normal" || !/absolute|fixed/.test(p.position)) continue;
      const w = parseFloat(p.width), hh = parseFloat(p.height);
      if (!(w > 0) || !(hh > 0)) continue;
      const x0 = p.left !== "auto" ? pl + parseFloat(p.left) : pr - parseFloat(p.right) - w;
      const y0 = p.top !== "auto" ? pt + parseFloat(p.top) : pb - parseFloat(p.bottom) - hh;
      a.l = Math.min(a.l, x0); a.t = Math.min(a.t, y0); a.r = Math.max(a.r, x0 + w); a.b = Math.max(a.b, y0 + hh);
    }
    return a;
  };
  h.ctl = (e) => {
    const r = e.getBoundingClientRect();
    const c = getComputedStyle(e);
    const par = e.parentElement ? h.bgOf(e.parentElement) : { r: 255, g: 255, b: 255, a: 1 };
    const bg = h.rgba(c.backgroundColor) || { r: 0, g: 0, b: 0, a: 0 };
    return {
      el: h.desc(e), path: h.path(e), text: h.label(e), rect: { l: r.left, t: r.top, r: r.right, b: r.bottom }, area: h.area(e),
      weight: +c.fontWeight, filled: bg.a >= 0.5 && (Math.abs(bg.r - par.r) + Math.abs(bg.g - par.g) + Math.abs(bg.b - par.b) > 24), bg: bg.a > 0 ? h.hex(bg) : null,
      border: parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== "none", native: c.backgroundColor === "rgb(239, 239, 239)" && c.borderTopStyle === "outset",
      inRunningText: e.tagName === "A" && !!e.closest("p, li") && (e.closest("p, li").textContent.trim().length > e.textContent.trim().length + 8),
    };
  };
  h.ctlList = (scopeSel) => {
    const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
    return scope ? h.controls(scope).map(h.ctl) : [];
  };
  h.scrollTop = () => { scrollTo({ top: 0, left: 0, behavior: "instant" }); return true; };
  // Scrolls a control to the middle of the view and returns where its middle is.
  h.target = (sel) => {
    const e = typeof sel === "number" ? h.controls(document.body)[sel] : document.querySelector(sel);
    if (!e) return null;
    e.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    const r = e.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, el: h.desc(e), path: h.path(e), text: h.label(e) };
  };
  h.targetByPath = (path) => h.target(path);
  // A press at the middle of each control: what is there instead.
  h.hit = (scopeSel) => {
    const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
    if (!scope) return null;
    const out = [];
    for (const e of h.controls(scope)) {
      e.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
      const r = e.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const reach = x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
      const hit = reach ? document.elementFromPoint(x, y) : null;
      out.push({ el: h.desc(e), text: h.label(e), reach, ok: !reach || (!!hit && (e === hit || e.contains(hit))), hit: reach ? h.desc(hit) : null });
    }
    h.scrollTop();
    return out;
  };

  // ---- glow ----
  h.layers = (v) => v.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
  h.isGlowLayer = (s) => {
    const nums = (s.replace(/rgba?\([^)]*\)/g, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
    if (nums.length < 3) return false;
    const [x, y, blur] = nums;
    return blur >= 4 && Math.abs(x) <= blur / 4 + 0.01 && Math.abs(y) <= blur / 4 + 0.01;
  };
  // Light spreading outward from the glyphs: a text-shadow, or a drop-shadow filter on the text or on what holds it.
  h.glowOf = (e) => {
    const c = getComputedStyle(e);
    if (c.textShadow !== "none") for (const s of h.layers(c.textShadow)) if (h.isGlowLayer(s)) return "text-shadow " + s;
    for (let x = e; x && x !== document.documentElement; x = x.parentElement) {
      const f = getComputedStyle(x).filter;
      let i = f ? f.indexOf("drop-shadow(") : -1;
      while (i >= 0) {
        let d = 0, j = i + 11;
        for (; j < f.length; j++) { if (f[j] === "(") d++; if (f[j] === ")" && --d === 0) break; }
        const body = f.slice(i + 12, j);
        if (h.isGlowLayer(body)) return "filter drop-shadow " + body;
        i = f.indexOf("drop-shadow(", j);
      }
    }
    return null;
  };

  // ---- one probe of the screen (or of a layer) as it stands ----
  h.probe = (scopeSel, names) => {
    const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
    if (!scope) return null;
    const vw = document.documentElement.clientWidth, vh = innerHeight;
    const out = { vw, vh, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, hover: matchMedia("(hover: hover)").matches, reduce: matchMedia("(prefers-reduced-motion: reduce)").matches };
    const els = [...(scopeSel ? [scope.parentElement, scope] : []), ...scope.querySelectorAll("*")].filter((e) => e && !SKIP.has(e.tagName) && h.visible(e));
    const directText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
    const isMedia = (e) => /^(CANVAS|VIDEO|IMG|PICTURE|IFRAME|EMBED|OBJECT)$/.test(e.tagName);

    // what lies under a text, for contrast: flat colors read from styles, anything else read from pixels
    const under = (e, tr) => {
      const pts = [[0.5, 0.5], [0.15, 0.3], [0.85, 0.3], [0.15, 0.7], [0.85, 0.7]].map(([fx, fy]) => [tr.l + (tr.r - tr.l) * fx, tr.t + (tr.b - tr.t) * fy]);
      let flat = true, moving = false, period = 0;
      const seen = new Set();
      for (const [x, y] of pts) {
        if (x < 0 || y < 0 || x > vw || y > vh) continue;
        const stack = document.elementsFromPoint(x, y);
        const i = stack.findIndex((s) => s === e || e.contains(s) || s.contains(e));
        for (const s of stack.slice(i < 0 ? 0 : i + 1)) {
          if (seen.has(s) || s === document.documentElement) continue;
          seen.add(s);
          const c = getComputedStyle(s);
          const ancestor = s.contains(e);
          if (isMedia(s) || c.backgroundImage !== "none" || (!ancestor && s !== e && (h.rgba(c.backgroundColor) || { a: 0 }).a > 0)) flat = false;
          if (/^(CANVAS|VIDEO)$/.test(s.tagName)) moving = true;
          for (const a of s.getAnimations()) {
            moving = true;
            const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
            if (Number.isFinite(t.duration)) period = Math.max(period, t.duration);
          }
        }
      }
      return { flat, moving, period };
    };

    out.texts = els.filter(directText).map((e) => {
      const c = getComputedStyle(e);
      const fg = h.rgba(c.color), bg = h.bgOf(e);
      const size = parseFloat(c.fontSize);
      const rg = document.createRange(); rg.selectNodeContents(e);
      const rb = rg.getBoundingClientRect();
      const tr = { l: rb.left, t: rb.top, r: rb.right, b: rb.bottom };
      const u = under(e, tr);
      const blended = fg.a < 1 ? h.blend(fg, bg) : fg;
      return {
        el: h.desc(e), path: h.path(e), text: e.textContent.trim().replace(/\s+/g, " ").slice(0, 40), size, weight: +c.fontWeight,
        ls: c.letterSpacing === "normal" ? 0 : parseFloat(c.letterSpacing), lh: c.lineHeight === "normal" ? null : parseFloat(c.lineHeight),
        family: c.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, ""), features: `${c.fontVariantNumeric !== "normal" ? c.fontVariantNumeric : ""} ${c.fontFeatureSettings !== "normal" ? c.fontFeatureSettings : ""}`.trim(),
        color: h.hex(fg), colorAlpha: fg.a, bg: h.hex(bg), ratio: +h.ratio(blended, bg).toFixed(2), tr,
        large: size >= 24 || (+c.fontWeight >= 700 && size >= 18.66), ariaHidden: !!e.closest("[aria-hidden=true]"), flat: u.flat, moving: u.moving, period: u.period,
      };
    });

    const blocks = [...new Set(els.filter(directText).map(h.blockOf))];
    const titleSel = ["h1", "h2", "h3", "h4", "h5", "h6", "[role=heading]", ...(names || [])].join(",");
    out.blocks = blocks.map((b) => {
      const read = h.lines(b);
      const cs = getComputedStyle(b);
      const fs = parseFloat(cs.fontSize);
      return {
        el: h.desc(b), path: h.path(b), title: b.matches(titleSel), control: !!b.closest("button, a[href], [role=button], [role=tab]") && b.matches("button, a[href], [role=button], [role=tab]"),
        shaped: parseFloat(cs.borderTopWidth) > 0 || (h.rgba(cs.backgroundColor) || { a: 0 }).a > 0.05, size: fs, weight: +cs.fontWeight,
        left: read.lines.length ? Math.round(Math.min(...read.lines.map((l) => l.left))) : null,
        lines: read.lines.map((l) => l.text), maxEm: +(Math.max(0, ...read.lines.map((l) => l.width)) / fs).toFixed(1),
        breaks: read.lines.length > 1 ? h.breaks(b, read) : [],
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
    out.glow = [];
    for (const e of els) {
      const c = getComputedStyle(e);
      if (directText(e)) { add(c.color, h.desc(e) + " color"); const g = h.glowOf(e); if (g) out.glow.push({ el: h.desc(e), path: h.path(e), how: g }); }
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
      if (c.boxShadow !== "none") for (const s of h.layers(c.boxShadow)) out.shadows[s] ||= h.desc(e);
      const sp = [];
      for (const k of ["marginTop", "marginBottom", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "rowGap", "columnGap"]) { const v = parseFloat(c[k]); if (v) sp.push([k, v, c[k]]); }
      const ml = parseFloat(c.marginLeft), mr = parseFloat(c.marginRight);
      if (Math.abs(ml - mr) > 0.5) for (const [k, v] of [["marginLeft", ml], ["marginRight", mr]]) if (v) sp.push([k, v, v + "px"]);
      if (sp.length) out.spacing.push({ el: h.desc(e), values: sp });
    }
    out.offscreen = els.filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 0.5 || r.left < -0.5; }).map(h.desc).slice(0, 12);
    out.clipped = els.filter((e) => {
      const c = getComputedStyle(e);
      return e !== document.body && /hidden|clip/.test(c.overflowX + c.overflowY) && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1);
    }).map(h.desc);
    const ctls = h.controls(scope);
    const items = [...new Set([...blocks, ...ctls])];
    out.overlaps = [];
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j];
      if (a.contains(b) || b.contains(a)) continue;
      const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
      const ix = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left), iy = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
      if (ix > 1 && iy > 1) out.overlaps.push(h.desc(a) + " / " + h.desc(b));
    }
    out.controls = ctls.map(h.ctl);
    // left edges: the first character of each text block, the box of each control and each picture
    out.edges = [
      ...out.blocks.filter((b) => b.left !== null).map((b) => ({ el: b.el, left: b.left })),
      ...ctls.map((e) => ({ el: h.desc(e), left: Math.round(e.getBoundingClientRect().left) })),
      ...els.filter((e) => isMedia(e) || e instanceof SVGSVGElement).filter((e) => !e.closest("[aria-hidden=true]")).map((e) => ({ el: h.desc(e), left: Math.round(e.getBoundingClientRect().left) })),
    ];
    // the gap inside each group of siblings against the gap to the group's neighbors
    const main = scope.querySelector("main") || scope;
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
    // the widest the content measures: the union of text lines, controls, and pictures
    const spans = [...out.blocks.flatMap((b) => { const r = document.querySelector(b.path)?.getBoundingClientRect(); return r ? [[r.left, r.right]] : []; }), ...out.controls.map((c) => [c.rect.l, c.rect.r])];
    out.contentWidth = spans.length ? Math.round(Math.max(...spans.map((s) => s[1])) - Math.min(...spans.map((s) => s[0]))) : 0;
    out.scrolls = scopeSel ? scope.scrollHeight > scope.clientHeight + 1 : document.documentElement.scrollHeight > vh + 1;
    return out;
  };

  // Elements with text that are not rendered at this size, outermost only.
  h.hiddenRegions = () => [...document.body.querySelectorAll("*")].filter((e) => !SKIP.has(e.tagName) && e.textContent.trim() && e.getClientRects().length === 0 && e.parentElement && e.parentElement.getClientRects().length > 0)
    .map((e) => ({ path: h.path(e), el: h.desc(e), text: e.textContent.trim().replace(/\s+/g, " ").slice(0, 20), byAttr: e.hasAttribute("hidden") }));

  h.rect = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), left: +r.left.toFixed(1), right: +r.right.toFixed(1), vh: innerHeight, vw: document.documentElement.clientWidth };
  };
  h.firstView = () => { h.scrollTop(); return true; };
  h.openBox = (sel) => { const e = sel && document.querySelector(sel); return !!e && h.visible(e); };
  h.state = (sel) => ({ url: location.href, scrollY: Math.round(scrollY), open: sel ? h.openBox(sel) : null, active: h.desc(document.activeElement), activeInBox: sel ? !!(document.querySelector(sel) && document.querySelector(sel).contains(document.activeElement)) : null });

  // ---- waiting on conditions ----
  h.settle = (ms) => Promise.race([
    Promise.all(document.getAnimations().filter((a) => { try { return a.playState === "running" && a.effect.getComputedTiming().endTime !== Infinity; } catch { return false; } }).map((a) => a.finished.catch(() => {}))),
    new Promise((r) => setTimeout(r, ms)),
  ]).then(() => true);
  h.frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(true))));
  h.until = (sel, open, ms) => new Promise((res) => {
    const t0 = performance.now();
    const f = () => { if (h.openBox(sel) === open) res(true); else if (performance.now() - t0 > ms) res(false); else requestAnimationFrame(f); };
    f();
  });

  // ---- keyboard focus ----
  h.sig = (e) => { const c = getComputedStyle(e); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.outlineOffset, c.boxShadow, c.borderTopColor, c.borderTopWidth, c.backgroundColor, c.color, c.textDecorationLine, c.filter, c.transform, c.opacity].join("|"); };
  h.fvBase = () => { window.__fv = new Map(h.controls(document.body).map((e) => [e, h.sig(e)])); return window.__fv.size; };
  h.anims = (keep) => document.getAnimations().filter(keep || (() => true)).map((a) => {
    const ef = a.effect;
    const t = ef && ef.getTiming ? ef.getTiming() : {};
    const kfs = ef && ef.getKeyframes ? ef.getKeyframes() : [];
    const pick = (k) => (k ? { opacity: k.opacity, transform: k.transform, scale: k.scale, translate: k.translate } : null);
    return {
      type: a.constructor.name, prop: a.transitionProperty || a.animationName || "", target: ef && ef.target ? h.desc(ef.target) + (ef.pseudoElement || "") : "", path: ef && ef.target ? h.path(ef.target) : "",
      duration: typeof t.duration === "number" ? t.duration : 0, delay: t.delay || 0, iterations: t.iterations === Infinity ? "infinite" : t.iterations, easing: t.easing,
      kfEasing: kfs.map((k) => k.easing).filter((e) => e && e !== "linear"), from: pick(kfs[0]), to: pick(kfs[kfs.length - 1]), state: a.playState,
    };
  });
  h.focusInfo = async () => {
    const a = document.activeElement;
    if (!a || a === document.body) return { el: "body", body: true };
    const anims = h.anims((x) => { const t = x.effect && x.effect.target; return t && (a === t || a.contains(t)); });
    await h.settle(1500);
    const base = window.__fv && window.__fv.get(a);
    const c = getComputedStyle(a);
    const r = a.getBoundingClientRect();
    return {
      el: h.desc(a), path: h.path(a), text: h.label(a), fv: a.matches(":focus-visible"), anims,
      indicator: base !== undefined ? base !== h.sig(a) : c.outlineStyle !== "none" && parseFloat(c.outlineWidth) > 0,
      pos: { l: r.left + scrollX, t: r.top + scrollY, w: r.width, h: r.height }, scrollY: Math.round(scrollY),
    };
  };
  h.blur = () => { if (document.activeElement) document.activeElement.blur(); h.scrollTop(); return true; };

  // ---- elements that move when a neighbor changes state ----
  const fixed = (e) => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) if (getComputedStyle(x).position === "fixed") return true; return false; };
  const docRect = (e, f) => { const r = e.getBoundingClientRect(); return f ? [r.left, r.top, r.width, r.height] : [r.left + scrollX, r.top + scrollY, r.width, r.height]; };
  h.nbBase = () => { window.__nbEls = [...document.body.querySelectorAll("*")].filter((e) => !SKIP.has(e.tagName) && h.visible(e)); window.__nbFx = window.__nbEls.map(fixed); return window.__nbEls.length; };
  h.nbRects = () => { window.__nbPrev = window.__nbEls.map((e, i) => docRect(e, window.__nbFx[i])); return true; };
  h.nbPrepare = (i, scopeSel) => {
    const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
    const btns = h.controls(scope);
    const b = btns[i];
    if (!b) return { count: btns.length };
    window.__nbBtn = b;
    b.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    const r = b.getBoundingClientRect();
    return { count: btns.length, x: r.left + r.width / 2, y: r.top + r.height / 2, who: `${h.desc(b)}「${h.label(b)}」` };
  };
  h.nbDiff = (mode) => {
    const act = document.activeElement;
    const ex = mode === "press" ? window.__nbBtn : act === document.body ? null : act;
    const next = window.__nbEls.map((e, i) => docRect(e, window.__nbFx[i]));
    const moved = [];
    window.__nbEls.forEach((e, i) => {
      if (ex && (e === ex || e.contains(ex) || ex.contains(e))) return;
      const d = next[i].map((v, k) => v - window.__nbPrev[i][k]);
      if (!d.some((v) => Math.abs(v) > 0.5)) return;
      moved.push({ el: h.desc(e), text: h.label(e).slice(0, 8), what: d.map((v, k) => (Math.abs(v) > 0.5 ? `${"xywh"[k]}${v > 0 ? "+" : ""}${+v.toFixed(1)}` : null)).filter(Boolean).join(" ") });
    });
    if (mode !== "press") window.__nbPrev = next;
    return { who: `${h.desc(act)}「${h.label(act)}」`, tag: h.desc(act), moved };
  };

  // ---- a press, as the control itself answers it ----
  h.hold = (sel) => { const e = document.querySelector(sel); window.__hold = { e, before: h.sig(e), t: performance.now() }; window.__holdAnims0 = new Set(document.getAnimations()); return true; };
  // after the press-in: what changed on the control, and the transitions the press started on it
  h.heldAnswer = async () => {
    const { e, before } = window.__hold;
    const started = document.getAnimations().filter((a) => !window.__holdAnims0.has(a) && a.effect && a.effect.target && (e === a.effect.target || e.contains(a.effect.target) || a.effect.target.contains(e)));
    const list = h.anims((a) => started.includes(a));
    await h.settle(800);
    const c = getComputedStyle(e);
    const m = c.transform && c.transform !== "none" ? c.transform.match(/matrix\(([^)]+)\)/) : null;
    const scale = m ? +Math.hypot(...m[1].split(",").slice(0, 2).map(Number)).toFixed(3) : 1;
    return { changed: h.sig(e) !== before, animated: list, duration: list.length ? Math.max(...list.map((x) => x.duration + x.delay)) : 0, scale, opacity: +c.opacity, bgBefore: before.split("|")[7], bgNow: c.backgroundColor, transform: c.transform };
  };

  // ---- curves the page declares ----
  h.curves = () => {
    const found = {};
    const split = (v) => v.split(/,(?![^(]*\))/).map((s) => s.trim());
    for (const e of document.body.querySelectorAll("*")) {
      const c = getComputedStyle(e);
      const td = split(c.transitionDuration), tf = split(c.transitionTimingFunction);
      td.forEach((d, i) => { if (parseFloat(d) > 0) found[tf[i % tf.length]] ||= h.desc(e); });
      if (c.animationName !== "none") {
        const ad = split(c.animationDuration), af = split(c.animationTimingFunction);
        ad.forEach((d, i) => { if (parseFloat(d) > 0) found[af[i % af.length]] ||= h.desc(e); });
      }
    }
    return found;
  };

  // ---- idle watch ----
  h.canvasSig = () => [...document.querySelectorAll("canvas")].filter(h.visible).map((c) => { try { const s = c.toDataURL("image/jpeg", 0.1); let x = 0; for (let i = 0; i < s.length; i += 7) x = (x * 31 + s.charCodeAt(i)) | 0; return x; } catch { return null; } });
  h.videoSig = () => [...document.querySelectorAll("video")].filter((v) => h.visible(v) && !v.paused).map((v) => v.currentTime);
  h.infinite = () => h.anims().filter((a) => a.iterations === "infinite" && a.state === "running" && a.path && document.querySelector(a.path) && h.visible(document.querySelector(a.path)));
  h.pauseControl = () => h.controls(document.body).some((e) => /pause|stop|hide|mute|一時停止|停止|止め|ポーズ停止|隠す/i.test((e.innerText || "") + " " + (e.getAttribute("aria-label") || "")));

  // Text made only of punctuation or symbols that the screen reader still gets: no aria-hidden, shown on screen.
  // Punctuation a sentence carries — a comma, a full stop, a bracket, a dash — is the sentence's own
  // (rules/a11y.md, What the ear receives) and is not counted, even in a text node of its own.
  const SENTENCE = /^[、。，．,.!?！？:：;；「」『』（）()［］[\]【】〔〕"'“”‘’…‥—–-]+$/u;
  h.eyeOnly = () => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, t = n.nodeValue.trim(), p = n.parentElement;
      if (!t || t.length > 3 || !/^[\p{P}\p{S}]+$/u.test(t) || SENTENCE.test(t) || !p || SKIP.has(p.tagName) || !h.visible(p)) continue;
      if (p.closest("[aria-hidden=true], [role=presentation], [role=none]")) continue;
      const c = p.closest("button, a[href], [role=button]");
      if (c && (c.getAttribute("aria-label") || c.getAttribute("aria-labelledby"))) continue;
      out.push({ el: h.desc(p), text: t });
    }
    return out;
  };

  // ---- pictures and viewport ----
  h.viewportMeta = () => { const m = document.querySelector("meta[name=viewport]"); return m ? m.getAttribute("content") : null; };
  h.hideText = (path, on) => {
    const e = document.querySelector(path);
    if (!e) return false;
    if (on) { e.__old = e.getAttribute("style"); e.style.setProperty("color", "transparent", "important"); e.style.setProperty("text-shadow", "none", "important"); e.style.setProperty("-webkit-text-fill-color", "transparent", "important"); e.style.setProperty("text-decoration-color", "transparent", "important"); }
    else if (e.__old === null) e.removeAttribute("style"); else e.setAttribute("style", e.__old);
    return true;
  };
  // Pause every animation and put it at a point of its iteration (0 to 1), or let them run again.
  h.seek = (f) => {
    if (!window.__seeked) window.__seeked = document.getAnimations().filter((a) => a.playState === "running");
    for (const a of window.__seeked) {
      try {
        if (f === null) { a.play(); continue; }
        const t = a.effect.getComputedTiming();
        a.pause();
        a.currentTime = (t.delay || 0) + f * (Number.isFinite(t.duration) ? t.duration : 0);
      } catch {}
    }
    if (f === null) window.__seeked = null;
    return true;
  };
  h.pathOf = (sel) => { const e = document.querySelector(sel); return e ? h.path(e) : null; };
  h.luminance = async (b64) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    let min = 2, max = -1;
    for (let i = 0; i < d.length; i += 4) { const y = 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]); if (y < min) min = y; if (y > max) max = y; }
    return { min, max };
  };

  window.__h = h;
  return true;
}
