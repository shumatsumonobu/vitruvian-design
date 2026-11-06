// Confirms the defects left in a cover-stamped workspace show, and the decoys stay clean.
// Usage: node scripts/live-test/verify-cover-stamped.mjs <directory>
import fs from "node:fs";
import path from "node:path";
import { dirArg, sleep, start } from "./harness.mjs";

const root = dirArg("verify-cover-stamped.mjs");
const { base, newPage, close } = await start(root);

// Three days stamped, so the card shows what it carries.
const day = (d) => new Date(2026, 10, d, 7, 30).getTime();
const seeded = JSON.stringify([2, 3, 4].map((d) => ({ at: day(d), minutes: 10 })));

// The lines a block of text is set on, read from each character's box grouped by its top.
const lines = (page, selector) => page.$eval(selector, (el) => {
  const rows = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.parentElement.closest("[hidden], .vh")) continue;
    for (let i = 0; i < n.length; i++) {
      const r = document.createRange();
      r.setStart(n, i); r.setEnd(n, i + 1);
      const box = r.getBoundingClientRect();
      if (!box.width) continue;
      const top = Math.round(box.top);
      const row = rows.find((x) => Math.abs(x.top - top) < 4);
      if (row) row.text += n.data[i]; else rows.push({ top, text: n.data[i] });
    }
  }
  return rows.map((x) => x.text);
});

// The sizes the structure declares, and one between them a session might add.
for (const [w, h] of [[360, 548], [1920, 900], [1536, 900], [600, 800]]) {
  const page = await newPage(w, h);
  await page.evaluateOnNewDocument((v) => { localStorage.clear(); localStorage.setItem("asanobi-log", v); }, seeded);
  await page.goto(base);
  await sleep(1500);
  const title = await lines(page, ".hero-title");
  const lead = await lines(page, ".hero-lead");
  const card = await page.$eval(".week", (el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom) }; });
  const inView = card.bottom <= h;
  console.log(`${w}x${h} title: ${title.join(" / ")}`);
  console.log(`${w}x${h} lead (decoy, body text): ${lead.join(" / ")}`);
  console.log(`${w}x${h} signature card: top ${card.top}, bottom ${card.bottom}, view height ${h} -> ${inView ? "inside the first view" : "OUTSIDE the first view"}`);
  await page.close();
}
await close();

// The inspection script the fix run left: what it reads from the command line.
const script = path.join(root, ".design/harness/inspect.mjs");
if (fs.existsSync(script)) {
  const argv = fs.readFileSync(script, "utf8").split("\n").map((l, i) => [i + 1, l]).filter(([, l]) => l.includes("process.argv"));
  console.log(`harness inspect.mjs reads from the command line: ${argv.map(([i, l]) => `line ${i}: ${l.trim()}`).join("; ") || "nothing"}`);
} else {
  console.log("harness inspect.mjs: absent");
}
