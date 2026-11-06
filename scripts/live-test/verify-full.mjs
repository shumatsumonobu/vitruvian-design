// Confirms the planted defects in a full workspace actually show, and the decoys stay clean.
// Usage: node scripts/live-test/verify-full.mjs <directory>
// Judge-side only: the sessions under test never see this file.
import { dirArg, sleep, start, tree } from "./harness.mjs";

const { base, browser, newPage, close } = await start(dirArg("verify-full.mjs"));

// Where the box covers the start button: real windows (bars or scaling take height) against full displays.
{
  const map = [["1920x1080 full display",1920,1080],["1920x969 maximized, toolbar",1920,969],["1536x864 125% full display",1536,864],["1536x790 125% maximized",1536,790],["1536x730 125% window",1536,730],["1440x900 full display",1440,900],["1366x768 full display",1366,768],["1366x657 maximized, toolbar",1366,657],["1280x800 full display",1280,800],["1280x720 scripted default",1280,720],["390x844 full display",390,844],["390x664 bars shown",390,664],["375x667 full display",375,667],["375x553 bars shown",375,553],["360x800 full display",360,800],["320x720",320,720],["320x568 full display",320,568],["320x460 bars shown",320,460]];
  console.log("--- start button, press at its middle");
  for (const [label, w, h] of map) {
    const p = await newPage(w, h);
    await p.goto(base);
    const r = await p.evaluate(() => { document.querySelector(".start").scrollIntoView({ block: "center" }); const s = document.querySelector(".start").getBoundingClientRect(); const el = document.elementFromPoint(s.x + s.width / 2, s.y + s.height / 2); return document.querySelector(".start").contains(el) ? "lands on it" : "COVERED by " + (el ? el.className : "nothing"); });
    console.log("  " + label.padEnd(30) + r);
    await p.close();
  }
}

const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// Lines of an element, read by grouping each character's box by its top.
const linesOf = () => (el) => {
  const out = [];
  for (const node of [...el.querySelectorAll ? [el] : []]) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let tops = new Map();
    let t;
    while ((t = walker.nextNode())) {
      for (let i = 0; i < t.length; i++) {
        const r = document.createRange();
        r.setStart(t, i); r.setEnd(t, i + 1);
        const b = r.getClientRects()[0];
        if (!b) continue;
        const k = Math.round(b.top);
        tops.set(k, (tops.get(k) || "") + t.data[i]);
      }
    }
    out.push([...tops.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]));
  }
  return out[0];
};

const sizes = [["1920x969 tall desktop", 1920, 969], ["1536x790 scaled desktop", 1536, 790], ["390x844 phone, bars hidden", 390, 844], ["390x664 phone, bars shown", 390, 664], ["320x568", 320, 568]];
for (const [label, w, h] of sizes) {
  const page = await newPage(w, h);
  await page.goto(base);
  const hit = await page.evaluate(() => {
    const b = document.querySelector(".start").getBoundingClientRect();
    const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    return { onStart: document.querySelector(".start").contains(el), got: el && el.className };
  });
  const h1 = await page.evaluate(linesOf(), await page.$(".hero-title"));
  const cards = await page.$$eval(".pose-name", (els) => els.map((el) => {
    const tops = new Map();
    const t = el.firstChild;
    for (let i = 0; i < t.length; i++) {
      const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1);
      const b = r.getClientRects()[0]; if (!b) continue;
      const k = Math.round(b.top); tops.set(k, (tops.get(k) || "") + t.data[i]);
    }
    return [...tops.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]).join(" / ");
  }));
  await page.evaluate(() => document.querySelector(".start").click());
  await sleep(200);
  // The player's pose names, each laid out in turn.
  const poseLines = await page.evaluate(async (names) => {
    const el = document.querySelector("#pose-name");
    const res = [];
    for (const n of names) {
      el.textContent = n;
      const tops = new Map();
      const t = el.firstChild;
      for (let i = 0; i < t.length; i++) {
        const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1);
        const b = r.getClientRects()[0]; if (!b) continue;
        const k = Math.round(b.top); tops.set(k, (tops.get(k) || "") + t.data[i]);
      }
      res.push([...tops.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]).join(" / "));
    }
    el.textContent = names[0];
    return res;
  }, ["Cat-Cow(Slow)", "Downward Dog(Hold)", "Child's Pose(Rest)", "Seated Twist(Each Side)", "Neck Roll(Gentle)"]);
  const band = await page.evaluate(() => {
    const p = document.querySelector(".pause").getBoundingClientRect();
    const n = document.querySelector(".next").getBoundingClientRect();
    const midGap = (p.right + n.left) / 2;
    const yMid = p.y + p.height / 2;
    const onePxIntoPause = document.elementFromPoint(p.right + 1, yMid);
    return { gap: Math.round(n.left - p.right), gapLandsOn: document.elementFromPoint(midGap, yMid)?.className, justRightOfPause: onePxIntoPause?.className };
  });
  // Contrast of the pose name: first frame, then the worst of 16 frames across the 8-second loop.
  const box = await page.evaluate(() => { const r = document.querySelector("#pose-name").getBoundingClientRect(); return { x: Math.floor(r.x), y: Math.floor(r.y), w: Math.ceil(r.width), h: Math.ceil(r.height) }; });
  await page.addStyleTag({ content: "#pose-name { visibility: hidden }" });
  let worst = 99, first = null;
  for (let i = 0; i < 16; i++) {
    const shot = await page.screenshot({ clip: { x: box.x, y: box.y, width: Math.max(1, Math.min(box.w, w - box.x)), height: box.h }, encoding: "base64" });
    const maxL = await page.evaluate(async (b64) => {
      const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const g = c.getContext("2d"); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      let m = 0; for (let i = 0; i < d.length; i += 4) m = Math.max(m, 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]));
      return m;
    }, shot);
    const r = ratio(1, maxL);
    if (first === null) first = r;
    worst = Math.min(worst, r);
    await sleep(500);
  }
  console.log(`--- ${label}`);
  console.log(`  start button hit: ${hit.onStart ? "lands on it" : "COVERED by " + hit.got}`);
  console.log(`  h1 lines: ${h1.join(" / ")}`);
  console.log(`  menu cards: ${cards.join("  |  ")}`);
  console.log(`  player pose lines: ${poseLines.join("  |  ")}`);
  console.log(`  band: gap ${band.gap}px, gap midpoint lands on ${band.gapLandsOn}, 1px right of pause lands on ${band.justRightOfPause}`);
  console.log(`  pose name over glow: first frame ${first.toFixed(2)}, worst of 16 frames ${worst.toFixed(2)} (floor 3 for large text)`);
  await page.close();
}

// Time that runs while nothing does: pause at 2 s, wait past 10 s, see whether the skip opened.
{
  const page = await newPage(1536, 790);
  await page.goto(base);
  await page.evaluate(() => document.querySelector(".start").click());
  await sleep(2000);
  await page.click(".pause");
  await sleep(9000);
  const st = await page.evaluate(() => ({ remain: document.querySelector("#remain").textContent, nextDisabled: document.querySelector(".next").disabled }));
  console.log(`--- gate: paused at 2 s, 9 s later: remaining ${st.remain} s, skip ${st.nextDisabled ? "still closed" : "OPEN while paused"}`);
  // Back from the player: where does it land?
  const before = page.url();
  await page.goBack().catch(() => {});
  await sleep(300);
  console.log(`--- back from the player: url ${page.url() === before ? "unchanged (layer closed in place?)" : "left the page -> " + page.url()}`);
  await page.close();
}
// Back from the help sheet (decoy: should close the sheet and stay).
{
  const page = await newPage(390, 844);
  await page.goto("about:blank");
  await page.goto(base);
  await page.click(".help-open");
  await sleep(200);
  await page.goBack();
  await sleep(300);
  const st = await page.evaluate(() => ({ url: location.href, helpHidden: document.querySelector(".help").hidden }));
  console.log(`--- back from help: ${st.url.startsWith("http") ? "stayed on the page" : "left"}, sheet ${st.helpHidden ? "closed" : "still open"}`);
  // The result layer: does it leave on its own?
  await page.evaluate(() => { localStorage.clear(); });
  await page.close();
}
// Accessibility tree of the tags and the log line.
{
  const page = await newPage(390, 844);
  await page.goto(base);
  console.log("--- accessibility tree of the routine and log sections");
  console.log(await tree(page, ".routine"));
  console.log(await tree(page, ".log"));
  const nodes = await page.$eval("#log-line", (el) => el.childNodes.length);
  console.log(`  log line text nodes: ${nodes}`);
  await page.close();
}

await close();
