// Confirms the defects left in a cover-card workspace show, and the decoys stay clean.
// Usage: node scripts/live-test/verify-cover-card.mjs <directory>
import { dirArg, sleep, start } from "./harness.mjs";

const { base, newPage, close } = await start(dirArg("verify-cover-card.mjs"));

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

// The checked sizes in the structure, and the laptop widths a session might add.
for (const [w, h] of [[360, 548], [1920, 900], [1536, 900], [1366, 768]]) {
  const page = await newPage(w, h);
  await page.evaluateOnNewDocument((v) => { localStorage.clear(); localStorage.setItem("asanobi-log", v); }, seeded);
  await page.goto(base);
  await sleep(1500);
  const m = await page.evaluate(() => {
    const box = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) }; };
    const main = box("main"), card = box(".log-card");
    // The squares themselves, not the list that holds them: the list may span the card while the squares do not.
    const cells = [...document.querySelectorAll(".week .day")].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0);
    const week = cells.length ? { l: Math.round(Math.min(...cells.map((r) => r.left))), r: Math.round(Math.max(...cells.map((r) => r.right))) } : null;
    if (week) week.w = week.r - week.l;
    const parts = [...document.querySelectorAll("main > *")].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0);
    const left = Math.min(...parts.map((r) => r.left)), right = Math.max(...parts.map((r) => r.right));
    return { main, card, week, content: { l: Math.round(left), r: Math.round(right), w: Math.round(right - left) }, view: document.documentElement.clientWidth };
  });
  const lead = await lines(page, ".hero-lead");
  const title = await lines(page, ".hero-title");
  const sides = m.view - m.content.w;
  console.log(`${w}x${h} content ${m.content.l}..${m.content.r} (${m.content.w} px) of ${m.view}: ${sides} px empty beside it (${Math.round((sides / m.view) * 100)}%)`);
  console.log(`${w}x${h} signature squares span ${m.week?.w} px inside a card of ${m.card?.w} px (${m.week && m.card ? Math.round((m.week.w / m.card.w) * 100) : "-"}%)`);
  console.log(`${w}x${h} lead: ${lead.join(" / ")}${[...lead.at(-1).replace(/[\p{P}\s]/gu, "")].length === 1 ? "  <- last line holds one character" : ""}`);
  console.log(`${w}x${h} title (decoy): ${title.join(" / ")}`);
  await page.close();
}

// A long paragraph with a short last line is not short text: the error state's message, four lines at 360.
{
  const page = await newPage(360, 548);
  await page.evaluateOnNewDocument(() => { localStorage.clear(); localStorage.setItem("asanobi-log", "{oops"); });
  await page.goto(base);
  await sleep(1500);
  const note = await page.$(".log-note:not([hidden])");
  console.log(`360x548 unreadable-record message (decoy, more than three lines): ${note ? (await lines(page, ".log-note")).join(" / ") : "absent"}`);
  await page.close();
}
await close();
