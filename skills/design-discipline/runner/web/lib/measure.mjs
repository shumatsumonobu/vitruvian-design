// Node-side reading of what the page returned: colors, the type scale, curves, contrast.

const rgbOf = (key) => {
  if (key.startsWith("#")) return [1, 3, 5].map((i) => parseInt(key.slice(i, i + 2), 16));
  return key.match(/[\d.]+/g).slice(0, 3).map(Number);
};
const hsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
};
const near = (a, b) => a.every((v, i) => Math.abs(v - b[i]) <= 2);

// Rendered colors that carry a hue, as clusters of hues 25 degrees apart. A color the declaration gives
// the role text, surface, grey, or flood is not an accent hue; with no declaration, every chromatic color counts.
export function hueClusters(colors, decl) {
  const quiet = [...(decl?.colors || []).filter((c) => c.role !== "accent").map((c) => c.value), ...(decl?.otherColors || [])].map((v) => rgbOf(normalizeHex(v)));
  const out = [];
  for (const [key, where] of Object.entries(colors)) {
    const rgb = rgbOf(key);
    const c = hsl(rgb);
    if (c.s < 0.2 || c.l < 0.1 || c.l > 0.9) continue;
    if (quiet.some((q) => near(q, rgb))) continue;
    let cl = out.find((x) => Math.min(Math.abs(x.h - c.h), 360 - Math.abs(x.h - c.h)) < 25);
    if (!cl) out.push((cl = { h: Math.round(c.h), members: [] }));
    cl.members.push(`${key} (${where})`);
  }
  return out;
}
export const normalizeHex = (v) => {
  if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + [...v.slice(1)].map((x) => x + x).join("");
  if (v.startsWith("#")) return v.slice(0, 7);
  const m = v.match(/[\d.]+/g);
  return m ? "#" + m.slice(0, 3).map((x) => Math.round(+x).toString(16).padStart(2, "0")).join("") : v;
};
// Colors a shade off true black: every channel under 0x30 and not all zero.
export const nearBlacks = (colors) => Object.entries(colors).filter(([k]) => { const c = rgbOf(k); return Math.max(...c) <= 0x30 && Math.max(...c) > 0; }).map(([k, w]) => `${k} (${w})`);

// The declared steps resolved for one viewport width (a step's size is [wide, narrow] where it changes).
export function resolveSteps(decl, width) {
  const below = decl.narrowBelow || 600;
  return (decl.steps || []).map((s) => ({ ...s, px: Array.isArray(s.size) ? (width < below ? s.size[1] : s.size[0]) : s.size }));
}
export function matchStep(t, steps, scale = 1) {
  return steps.find((s) => Math.abs(t.size - s.px * scale) < 0.25 && t.weight === s.weight
    && Math.abs(t.ls - (s.letterSpacing || 0) * t.size) < 0.25
    && t.lh !== null && Math.abs(t.lh - s.lineHeight * t.size) < 0.5
    && (!s.features || t.features.includes(s.features)));
}
export const sameSize = (size, steps) => steps.some((s) => s.display && Math.abs(size - s.px) < 0.25);

// A curve that starts slowly: the first control point climbs less than 0.3 of the way per unit of time.
export function easesIn(easing) {
  if (!easing) return false;
  if (easing === "ease-in" || easing === "ease-in-out") return true;
  const m = easing.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return false;
  const [x1, y1] = m[1].split(",").map(Number);
  return x1 > 0 && y1 / x1 < 0.3;
}
export const curveKey = (c) => c.replace(/\s+/g, "");
export const declaredCurve = (c, curves) => (curves || []).some((d) => curveKey(d) === curveKey(c));

// A line that opens with a closing bracket, a closing quotation mark, or punctuation of the line before.
export const CLOSE = /^[、。，．,.)）」』】〕〉》〗］｝\]}”’"'!！?？:：;；…‥]/;

// Contrast of a text color against the lightest and darkest pixel behind it; the worse of the two.
export function worstRatio(fgHex, alpha, minY, maxY) {
  const c = rgbOf(fgHex);
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const y = 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  const against = (bg) => { const t = alpha * y + (1 - alpha) * bg; return (Math.max(t, bg) + 0.05) / (Math.min(t, bg) + 0.05); };
  return Math.min(against(minY), against(maxY));
}
