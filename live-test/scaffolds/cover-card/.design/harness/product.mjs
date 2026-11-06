// Configuration for the runner at .claude/skills/design-discipline/runner/web/run.mjs.
// Each value names the entry it comes from in .design/declaration.md or .design/structure.md.

// ---- records, computed from now when this module loads; the week starts Monday in local time ----
const KEY = "asanobi-log"; // storage key, value: JSON array of { at: <ms>, minutes: <number> }
const mondayOf = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
const monday = mondayOf(new Date());
// A moment `days` days after this week's Monday (negative: before), at `hour` o'clock local time.
const at = (days, hour = 7) => {
  const d = new Date(monday);
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};
const json = (records) => JSON.stringify(records);

// populated: records on 3 days of the current week (Mon, Tue, Wed) and some in earlier weeks
const populated = json([
  { at: at(0), minutes: 10 }, { at: at(1), minutes: 10 }, { at: at(2), minutes: 12 },
  { at: at(-3), minutes: 10 }, { at: at(-4), minutes: 8 }, { at: at(-9), minutes: 10 }, { at: at(-12), minutes: 15 }, { at: at(-16), minutes: 10 },
]);
// empty: records only in earlier weeks
const empty = json([{ at: at(-2), minutes: 10 }, { at: at(-8), minutes: 10 }, { at: at(-15), minutes: 12 }]);
// long: 57 records over many weeks, two of them this week
const long = json(Array.from({ length: 57 }, (_, i) => (
  i === 0 ? { at: at(0), minutes: 10 }
    : i === 1 ? { at: at(1), minutes: 10 }
      : { at: at(-(i - 1) * 4 - 1), minutes: 10 + (i % 5) }
)));

// small helpers for the flows (run on the Node side only)
const sizeTag = (z) => `${z.w}x${z.h}`;

export default {
  serve: ".", // the product's root: index.html, styles.css, app.js
  sizes: [ // structure.md, checked sizes
    { w: 360, h: 548, touch: true },
    { w: 1920, h: 900 },
  ],
  declaration: { // declaration.md
    colors: [ // colors, grey family
      { value: "#1F3461", role: "text" },    // ai
      { value: "#C23A22", role: "accent" },  // shu
      { value: "#FFFFFF", role: "surface" }, // kami
      { value: "#EEF2F7", role: "surface" }, // daishi, the page ground
      { value: "#46587C", role: "grey" },    // ai-70
      { value: "#7486A8", role: "grey" },    // ai-rule
      { value: "#E2E8F1", role: "grey" },    // ai-10
    ],
    otherColors: ["rgba(31, 52, 97, 0.20)", "rgba(31, 52, 97, 0.48)"], // elevation scale: overlay shadow color, scrim
    steps: [ // type scale; letter-spacing in em, sizes in px (body 1rem = 16px)
      { name: "display", size: [40, 32], weight: 700, letterSpacing: 0.04, lineHeight: 1.4, display: true }, // 2.5rem, 2rem under 600px
      { name: "title", size: 20, weight: 700, letterSpacing: 0.12, lineHeight: 1.5 },  // 1.25rem
      { name: "item", size: 18, weight: 700, letterSpacing: 0.04, lineHeight: 1.5 },   // 1.125rem
      { name: "lead", size: 18, weight: 400, letterSpacing: 0.04, lineHeight: 1.8 },   // 1.125rem
      { name: "body", size: 16, weight: 400, letterSpacing: 0.04, lineHeight: 1.8 },   // 1rem
      { name: "label", size: 16, weight: 700, letterSpacing: 0.08, lineHeight: 1.5 },  // 1rem
      { name: "small", size: 15, weight: 400, letterSpacing: 0.04, lineHeight: 1.7 },  // 0.9375rem
    ],
    families: ["BIZ UDPGothic"], // typefaces
    radii: ["0px", "8px", "9999px", "50%"], // radius scale: none, card, pill, circle
    shadows: ["rgba(31, 52, 97, 0.2) 0px -8px 32px 0px"], // elevation scale, overlay, in the computed form (0.20 is computed as 0.2)
    spacingUnit: 8, // base spacing unit
    lineLengthEm: 36, // maximum line length
    contentWidth: 640, // maximum content width (40rem)
    curves: ["cubic-bezier(0.2, 0.9, 0.3, 1)"], // ease-out curve
    tapMinimum: 24, // rules/states.md, Platform notes
  },
  screens: [
    {
      name: "cover",
      path: "/",
      states: { // each state: what the page finds before its own scripts run
        populated: { storage: { [KEY]: populated } },
        firstrun: { storage: {} },
        empty: { storage: { [KEY]: empty } },
        error: { blockStorage: true }, // structure.md, 記録の紙, 読めない: storage blocked (app.js state "blocked")
        "error-shape": { storage: { [KEY]: '{"a":1}' } }, // structure.md, 記録の紙, 読めない: stored data not a list (a JSON object; app.js state "broken")
      },
      long: { storage: { [KEY]: long }, pad: 3 }, // rules/states.md, Long content
      signature: ".log-card .week", // signature: this week's participation card, .log-card inside .hero right under はじめる
      names: [".pose-name"], // names set from data
      layers: [ // structure.md, the help sheet
        { name: "help", open: ".help-open", close: ".help-close", box: ".help-sheet", dimmed: ".help" },
      ],
    },
  ],

  // Product flows: only the runner's r.* helpers.
  flows: async (r) => {
    const cover = r.screens[0];
    const phone = r.sizes[0], wide = r.sizes[1];
    const A11Y_OUTCOME = "Outcomes rendered visually with no announcement to the accessibility layer";
    const NAV_SHEET = "Modals, sheets, and full screens that back does not close";
    const DOUBLE = "Controls that navigate twice or submit twice on a fast double press";
    const FOCUS_LAYER = "Modals, sheets, and full-screen takeovers that open without taking focus";
    const FOCUS_ORDER = "Focusable elements reached in an order that differs from the visual order";

    // ---- 1. はじめる: where focus lands, and whether the page scrolled in steps ----
    for (const size of [phone, wide]) {
      // はじめる (.start) is read in populated, empty, firstrun; the record card holds no control (structure.md, 記録の紙)
      for (const state of ["populated", "empty", "firstrun"]) {
        const sel = ".start";
        await r.load(cover, state, { size });
        // Bring the control into view first, so that scrolling is not counted as the press's.
        const c = await r.eval((q) => {
          const e = document.querySelector(q);
          e.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
          const b = e.getBoundingClientRect();
          window.__sc = [];
          return { x: b.left + b.width / 2, y: b.top + b.height / 2, y0: Math.round(scrollY), shown: !e.hidden };
        }, sel);
        await r.wait(150);
        await r.eval(() => { addEventListener("scroll", () => window.__sc.push(Math.round(scrollY))); return true; });
        await r.pressAt(c.x, c.y);
        await r.wait(1000); // the move to the menu comes START_MOVE_MS (300 ms) after the press (app.js)
        const o = await r.eval(() => {
          const a = document.activeElement;
          const t = document.querySelector("#routine-title").getBoundingClientRect();
          return {
            active: a ? a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + (a.classList.length ? "." + [...a.classList].join(".") : "") : "null",
            seen: window.__sc, y: Math.round(scrollY), titleTop: Math.round(t.top), canScroll: document.documentElement.scrollHeight - innerHeight,
            behavior: getComputedStyle(document.documentElement).scrollBehavior,
          };
        });
        const middle = [...new Set(o.seen)].filter((v) => v !== o.y && v !== c.y0);
        r.data("a11y", A11Y_OUTCOME,
          `はじめる ${sizeTag(size)} ${state} ${sel}: focus on ${o.active} (expect #routine-title); scrollY ${c.y0} → ${o.y}, scrollable range ${o.canScroll}px, #routine-title top ${o.titleTop}px; scroll events ${o.seen.length}, intermediate positions ${middle.length ? middle.join(",") : "none"} (${middle.length ? "animated" : "a jump"}); scroll-behavior ${o.behavior}`);
      }
    }

    // ---- 2. Help sheet history: open, reload while open, back, forward ----
    const sheetOpen = () => r.eval(() => {
      const h = document.querySelector(".help");
      return { open: !h.hidden && h.classList.contains("is-open"), hidden: h.hidden, len: history.length, state: JSON.stringify(history.state) };
    });
    for (const size of [phone, wide]) {
      await r.load(cover, "populated", { size });
      await r.press(".help-open");
      await r.wait(500);
      const s1 = await sheetOpen();
      await r.eval(() => { setTimeout(() => location.reload(), 0); return true; });
      await r.wait(1500);
      const s2 = await sheetOpen();
      await r.eval(() => { setTimeout(() => history.back(), 0); return true; });
      await r.wait(800);
      const s3 = await sheetOpen();
      await r.eval(() => { setTimeout(() => history.forward(), 0); return true; });
      await r.wait(800);
      const s4 = await sheetOpen();
      r.data("navigation", NAV_SHEET,
        `${sizeTag(size)} help sheet: after press 使い方 open=${s1.open} (history length ${s1.len}, state ${s1.state}); after reload with it open open=${s2.open} (state ${s2.state}); after back open=${s3.open} (state ${s3.state}); after forward open=${s4.open} (state ${s4.state})`);
    }

    // ---- 3. Double press on 使い方 and on 閉じる ----
    for (const size of [phone, wide]) {
      await r.load(cover, "populated", { size });
      const c = await r.press(".help-open");
      await r.pressAt(c.x, c.y); // the second press, at the same point, right after the first
      await r.wait(800);
      const afterOpen = await sheetOpen();
      const focusOpen = await r.eval(() => { const a = document.activeElement; return a.tagName.toLowerCase() + (a.className ? "." + [...a.classList].join(".") : ""); });

      const k = await r.press(".help-close");
      await r.pressAt(k.x, k.y);
      await r.wait(1000);
      const afterClose = await r.eval(() => {
        const a = document.activeElement, h = document.querySelector(".help");
        return {
          active: a === document.body ? "body" : a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + (a.classList.length ? "." + [...a.classList].join(".") : ""),
          open: !h.hidden && h.classList.contains("is-open"), hidden: h.hidden, len: history.length, state: JSON.stringify(history.state),
        };
      });
      r.data("states", DOUBLE,
        `${sizeTag(size)} 使い方 double press: sheet open=${afterOpen.open} (history length ${afterOpen.len}, focus ${focusOpen}); 閉じる double press: sheet open=${afterClose.open}, hidden=${afterClose.hidden}, history length ${afterClose.len}, state ${afterClose.state}, focus on ${afterClose.active}`);
    }

    // ---- 4. Keyboard walk at 1920x900 ----
    const who = () => r.eval(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return { d: "body", t: "", inSheet: false };
      return {
        d: a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + (a.classList.length ? "." + [...a.classList].join(".") : ""),
        t: (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 12),
        inSheet: !!a.closest(".help-sheet"),
      };
    });
    for (const state of ["populated", "firstrun"]) {
      await r.load(cover, state, { size: wide });
      await r.eval(() => { if (document.activeElement) document.activeElement.blur(); scrollTo(0, 0); return true; });
      const order = [];
      for (let i = 0; i < 8; i++) {
        await r.key("Tab");
        await r.wait(60);
        const w = await who();
        if (w.d === "body" || order.some((x) => x.d === w.d)) { order.push({ d: w.d, t: w.t, end: true }); break; }
        order.push(w);
      }
      r.data("a11y", FOCUS_ORDER, `${sizeTag(wide)} ${state} Tab from the top: ${order.map((x) => `${x.d}「${x.t}」${x.end ? " (end of the page)" : ""}`).join(" → ")}`);

      // Enter on 使い方
      await r.eval(() => { document.querySelector(".help-open").focus(); return true; });
      await r.key("Enter");
      await r.wait(700);
      const afterEnter = await who();
      const inside = [];
      for (let i = 0; i < 6; i++) {
        await r.key("Tab");
        await r.wait(60);
        inside.push(await who());
      }
      // Enter on 閉じる
      await r.eval(() => { document.querySelector(".help-close").focus(); return true; });
      await r.key("Enter");
      await r.wait(900);
      const afterClose = await who();
      const open = await sheetOpen();
      r.data("a11y", FOCUS_LAYER,
        `${sizeTag(wide)} ${state}: Enter on 使い方 → focus ${afterEnter.d}「${afterEnter.t}」 (inside sheet ${afterEnter.inSheet}); 6 Tabs inside the sheet → ${inside.map((x) => `${x.d}${x.inSheet ? "" : " (outside sheet)"}`).join(" → ")}, stays inside ${inside.every((x) => x.inSheet)}; Enter on 閉じる → sheet open=${open.open}, focus ${afterClose.d}「${afterClose.t}」`);
    }

    // ---- 5. はじめる by keyboard (Enter) and by a fast double press ----
    for (const size of [phone, wide]) {
      await r.load(cover, "populated", { size });
      await r.eval(() => { if (document.activeElement) document.activeElement.blur(); scrollTo(0, 0); return true; });
      let reached = false;
      for (let i = 0; i < 8 && !reached; i++) {
        await r.key("Tab");
        await r.wait(60);
        reached = await r.eval(() => document.activeElement.classList.contains("start"));
      }
      const before = await r.eval(() => Math.round(scrollY));
      await r.key("Enter");
      await r.wait(1000); // START_MOVE_MS (300 ms) plus margin
      const afterEnter = await who();
      const yEnter = await r.eval(() => Math.round(scrollY));
      r.data("a11y", A11Y_OUTCOME,
        `はじめる ${sizeTag(size)} by keyboard: reached by Tab ${reached}; Enter → focus ${afterEnter.d}「${afterEnter.t}」 (expect #routine-title), scrollY ${before} → ${yEnter}`);

      await r.load(cover, "populated", { size });
      const c = await r.press(".start");
      await r.pressAt(c.x, c.y); // the second press, at the same point, right after the first
      await r.wait(1000);
      const d = await r.eval(() => ({ len: history.length, y: Math.round(scrollY) }));
      const dActive = await who();
      r.data("states", DOUBLE, `${sizeTag(size)} はじめる double press: history length ${d.len}, scrollY ${d.y}, focus ${dActive.d}`);
    }

    // ---- 6. Help sheet: the dimmed surface, Escape, reload then back, the logo pressed twice ----
    for (const size of [phone, wide]) {
      // the dimmed surface: for DOUBLE_PRESS_MS (500 ms) it lets presses through to 使い方; afterwards a press on it closes the sheet
      await r.load(cover, "populated", { size });
      const c = await r.press(".help-open");
      const hitAt = () => r.eval((x, y) => {
        const e = document.elementFromPoint(x, y), h = document.querySelector(".help");
        return { hit: e ? e.tagName.toLowerCase() + (e.classList.length ? "." + [...e.classList].join(".") : "") : "null", arriving: h.classList.contains("is-arriving") };
      }, c.x, c.y);
      const early = await hitAt();
      await r.wait(700);
      const late = await hitAt();
      await r.pressAt(Math.round(size.w / 2), 12);
      await r.wait(800);
      const afterScrim = await sheetOpen();
      const focusScrim = await who();
      r.data("navigation", NAV_SHEET,
        `${sizeTag(size)} press on the dimmed surface: right after opening, element at 使い方's point ${early.hit} (is-arriving ${early.arriving}); 700 ms later ${late.hit} (is-arriving ${late.arriving}); after a press on the surface open=${afterScrim.open}, history length ${afterScrim.len}, focus ${focusScrim.d}`);

      // Escape
      await r.load(cover, "populated", { size });
      await r.eval(() => { document.querySelector(".help-open").focus(); return true; });
      await r.key("Enter");
      await r.wait(700);
      await r.key("Escape");
      await r.wait(800);
      const afterEsc = await sheetOpen();
      const focusEsc = await who();
      r.data("a11y", FOCUS_LAYER, `${sizeTag(size)} Enter on 使い方 then Escape: sheet open=${afterEsc.open}, focus ${focusEsc.d}「${focusEsc.t}」`);

      // reload with the sheet open, then back
      await r.load(cover, "populated", { size });
      await r.press(".help-open");
      await r.wait(700);
      await r.eval(() => { setTimeout(() => location.reload(), 0); return true; });
      await r.wait(1500);
      const reloaded = await sheetOpen();
      await r.eval(() => { setTimeout(() => history.back(), 0); return true; });
      await r.wait(900);
      let back;
      try {
        back = await r.eval(() => {
          const h = document.querySelector(".help");
          return h ? { here: true, href: location.href, open: !h.hidden && h.classList.contains("is-open"), len: history.length } : { here: false, href: location.href };
        });
      } catch { back = { here: false, href: "no answer" }; }
      r.data("navigation", NAV_SHEET,
        `${sizeTag(size)} reload with the sheet open, then back: after reload open=${reloaded.open}; after back ${back.here ? `still on the cover, open=${back.open}, history length ${back.len}` : `left the cover (${back.href})`}`);

      // the logo pressed twice
      await r.load(cover, "populated", { size });
      const lenBefore = await r.eval(() => history.length);
      const l = await r.press(".logo");
      await r.pressAt(l.x, l.y);
      await r.wait(1000);
      let after;
      try { after = await r.eval(() => ({ len: history.length, href: location.pathname + location.search })); } catch { after = { len: "no answer", href: "no answer" }; }
      r.data("states", DOUBLE, `${sizeTag(size)} logo double press: history length ${lenBefore} → ${after.len}, address ${after.href}`);
    }

    // ---- 7. Hover left behind after a tap (phone only; touch emulation on) ----
    {
      await r.load(cover, "populated", { size: phone });
      const styles = () => r.eval(() => [...document.querySelectorAll("button")].filter((b) => b.getClientRects().length).map((b) => {
        const c = getComputedStyle(b);
        return `${(b.innerText || "").trim()}:${c.backgroundColor}/${c.filter}/${c.color}/${c.borderColor}`;
      }).join(" ; "));
      const was = await styles();
      await r.press(".start");
      await r.wait(1000);
      await r.eval(() => { scrollTo(0, 0); return true; });
      await r.wait(200);
      const now = await styles();
      const hov = await r.eval(() => matchMedia("(hover: hover)").matches);
      r.count("states", "Hover treatments that persist after a tap", was === now ? 0 : 1, `${sizeTag(phone)} (hover media ${hov}) ${was === now ? "button styles the same before and after the tap" : `changed: ${was} → ${now}`}`);
    }

    // ---- 8. Help sheet position: its inner left edge against the column's ----
    for (const size of [phone, wide]) {
      await r.load(cover, "populated", { size });
      await r.press(".help-open");
      await r.wait(700);
      const g = await r.eval(() => {
        const sheet = document.querySelector(".help-sheet"), sh = sheet.getBoundingClientRect(), c = getComputedStyle(sheet);
        const t = document.querySelector(".hero-title").getBoundingClientRect();
        return { left: Math.round(sh.left), width: Math.round(sh.width), top: Math.round(sh.top), bottom: Math.round(sh.bottom), inner: Math.round(sh.left + parseFloat(c.borderLeftWidth) + parseFloat(c.paddingLeft)), column: Math.round(t.left) };
      });
      r.data("layout", "Distinct left edges within one column", `${sizeTag(size)} help sheet open: sheet left ${g.left} width ${g.width} top ${g.top} bottom ${g.bottom}; inner left edge ${g.inner}, the cover's column left edge (.hero-title) ${g.column}`);
    }

    // ---- 9. Long menu: the menu rows multiplied by ten and one unbroken name added in the page (app.js is not served changed) ----
    for (const size of [phone, wide]) {
      await r.load(cover, "populated", { size });
      const m = await r.eval(() => {
        const list = document.querySelector(".poses");
        const rows = [...list.children];
        for (let i = 0; i < 9; i++) for (const row of rows) list.append(row.cloneNode(true));
        const li = rows[0].cloneNode(true);
        li.querySelector(".pose-name").textContent = "Overheadsidebendwithtowel_no_break_opportunity_0123456789";
        li.querySelector(".pose-time").textContent = "12,345秒";
        list.append(li);
        const vw = document.documentElement.clientWidth;
        const off = [...document.querySelectorAll("body *")].filter((e) => e.getClientRects().length).filter((e) => { const b = e.getBoundingClientRect(); return b.right > vw + 0.5 || b.left < -0.5; }).map((e) => e.tagName.toLowerCase() + (e.classList.length ? "." + [...e.classList].join(".") : ""));
        const clipped = [...document.querySelectorAll(".pose-name, .pose-time")].filter((e) => e.scrollWidth > e.clientWidth + 1).length;
        const timeWrapped = [...document.querySelectorAll(".pose-time")].filter((e) => e.getBoundingClientRect().height > parseFloat(getComputedStyle(e).lineHeight) * 1.5).length;
        return { rows: list.children.length, docW: document.documentElement.scrollWidth, vw, off: [...new Set(off)].slice(0, 6), clipped, timeWrapped };
      });
      await r.shot(`long-menu-${sizeTag(size)}`, { full: true });
      const bad = (m.docW > m.vw ? 1 : 0) + m.off.length + m.clipped + m.timeWrapped;
      r.count("states", "Long-content captures", bad, `${sizeTag(size)} menu ${m.rows} rows with an unbroken name: document width ${m.docW} / viewport ${m.vw}, elements past the edge [${m.off.join(", ")}], clipped name or time ${m.clipped}, time wrapped ${m.timeWrapped}`);
    }

    // ---- 10. The stamp at 400 percent on its own surface (phone): the week list scaled by 4 around the stamp's day ----
    {
      await r.load(cover, "populated", { size: phone });
      const st = await r.eval(() => {
        const e = document.querySelector(".stamp");
        if (!e) return false;
        const day = e.closest(".day"), week = document.querySelector(".week");
        day.scrollIntoView({ block: "center", behavior: "instant" });
        const w = week.getBoundingClientRect(), d = day.getBoundingClientRect();
        week.style.transformOrigin = `${d.left + d.width / 2 - w.left}px ${d.top + d.height / 2 - w.top}px`;
        week.style.transform = "scale(4)";
        return true;
      });
      await r.wait(200);
      if (st) await r.shot(`stamp-400-${sizeTag(phone)}`);
      r.data("assets", "Assets inspected at four hundred percent on their surface", st ? `${sizeTag(phone)} stamp-400-${sizeTag(phone)}.png (the week list scaled by 4 around the stamp's day; the session looks at it)` : "no stamp on the screen");
    }

    // ---- 11. Width sweep: where anything leaves the layout, 320 to 1920 (599 and 600 added) ----
    {
      const out = [];
      const widths = [320, 400, 480, 560, 599, 600, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360, 1440, 1520, 1600, 1680, 1760, 1840, 1920];
      for (const w of widths) {
        await r.load(cover, "populated", { size: { w, h: 800, touch: w < 600 } });
        const v = await r.eval(() => {
          const vw = document.documentElement.clientWidth;
          const off = [...document.querySelectorAll("body *")].filter((e) => e.getClientRects().length).filter((e) => { const b = e.getBoundingClientRect(); return b.right > vw + 0.5 || b.left < -0.5; }).map((e) => e.tagName.toLowerCase() + (e.classList.length ? "." + [...e.classList].join(".") : "")).slice(0, 4);
          return { docW: document.documentElement.scrollWidth, vw, off };
        });
        if (v.docW > v.vw || v.off.length) out.push(`${w}: docW ${v.docW} off ${v.off.join(",")}`);
      }
      r.data("layout", "Widths from 320 to 1920 where anything leaves the layout", out.length ? out.join("; ") : `none of the ${widths.length} widths tried`);
    }

    // ---- 12. Webfonts blocked, platform fonts, the accessibility tree, page exceptions: the runner has no request blocking, font query, tree dump or exception log, so these are not taken (see the reply) ----
  },
};
