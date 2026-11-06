// Confirms the planted defects in a cover workspace show, and the decoys stay clean.
// Usage: node scripts/live-test/verify-cover.mjs <directory>
import { dirArg, sleep, start, tree } from "./harness.mjs";

const { base, newPage, close } = await start(dirArg("verify-cover.mjs"));

for (const [w, h] of [[1536, 700], [360, 560]]) {
  // Double press on the help button: the second press lands on what the first put under the pointer.
  const page = await newPage(w, h);
  await page.goto(base);
  const b = await page.$eval(".help-open", (el) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.mouse.click(b.x, b.y);
  await sleep(80);
  const under = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.className, b);
  await page.mouse.click(b.x, b.y);
  await sleep(300);
  const open = await page.evaluate(() => !document.querySelector(".help").hidden);
  console.log(`${w}x${h} double press on 使い方: after the first press the point holds "${under}"; after the second the sheet is ${open ? "open" : "CLOSED"}`);
  await page.close();
}

{
  // Reload with the sheet open, then back once.
  const page = await newPage(360, 560);
  await page.goto("about:blank");
  await page.goto(base);
  await page.click(".help-open");
  await page.reload();
  const before = await page.evaluate(() => ({ url: location.href, len: history.length, open: !document.querySelector(".help").hidden }));
  await page.goBack();
  await sleep(300);
  const after = await page.evaluate(() => ({ url: location.href, open: !document.querySelector(".help").hidden }));
  const moved = after.url === before.url ? "same address" : "left to " + after.url;
  console.log(`reload with the sheet open: sheet ${before.open ? "open" : "closed"} after reload; back once -> ${moved}, sheet ${after.open ? "STILL OPEN" : "closed"}`);
  await page.close();
}

{
  const page = await newPage(360, 560);
  await page.goto(base);
  console.log("--- tree");
  console.log(await tree(page, ".routine .tags"));
  console.log(await tree(page, [".routine .tags", 1]));
  console.log(await tree(page, ".site-footer"));
  const logLine = await page.$("#log-line");
  console.log(`log line text nodes: ${logLine ? await logLine.evaluate((el) => el.childNodes.length) : "absent (#log-line is not on the page)"}`);
  const fonts = await page.evaluate(() => [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules].filter((r) => r.constructor.name === "CSSFontFaceRule").length; } catch { return 0; } }).reduce((a, b) => a + b, 0));
  const links = await page.$$eval("link", (ls) => ls.map((l) => l.href));
  console.log(`webfont loads in the page: @font-face rules ${fonts}, links ${JSON.stringify(links)}`);
  await page.close();
}

await close();
