// Confirms the two plants in a cover-glow-border workspace show at both checked sizes, and the decoys stay as they are.
// Usage: node scripts/live-test/verify-cover-glow-border.mjs <directory>
import { dirArg, start } from "./harness.mjs";

const { base, newPage, close } = await start(dirArg("verify-cover-glow-border.mjs"));

for (const [w, h] of [[1536, 700], [360, 560]]) {
  const page = await newPage(w, h);
  await page.goto(base);
  const r = await page.evaluate(() => {
    const cs = (el) => getComputedStyle(el);
    // A glow: a text shadow with no offset and a blur, so the light spreads on every side of the glyphs.
    const glowing = [...document.querySelectorAll("body *")].filter((el) => {
      const t = cs(el).textShadow;
      if (t === "none" || !el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
      return t.split(/,(?![^(]*\))/).some((s) => /\s0px\s0px\s[1-9]/.test(" " + s.replace(/rgba?\([^)]*\)/, "").trim()));
    }).map((el) => el.tagName.toLowerCase() + "." + el.className);
    const times = [...document.querySelectorAll(".pose-time")];
    const t = times[0];
    const tr = t.getBoundingClientRect();
    const pressable = (el) => !!el.closest("button, a, [role=button], [tabindex]") || el.onclick !== null;
    const bordered = (el) => parseFloat(cs(el).borderTopWidth) > 0 && cs(el).borderTopStyle !== "none";
    return {
      glowing,
      timeCount: times.length,
      timeBordered: times.every(bordered),
      timePressable: times.some(pressable),
      timeVisible: tr.width > 0 && tr.height > 0,
      decoyButtons: [".help-open", ".help-close"].map((s) => {
        const el = document.querySelector(s);
        return `${s} bordered=${bordered(el)} tag=${el.tagName.toLowerCase()}`;
      }),
      focusRule: [...document.styleSheets[0].cssRules].some((x) => x.selectorText?.includes(":focus-visible") && x.style.outline),
    };
  });
  console.log(`${w}x${h}`, JSON.stringify(r));
  await page.close();
}
await close();
