// Shared by the verify-*.mjs checks: serve a directory over local HTTP and drive it with
// puppeteer-core and the Chrome in SPEC.chrome. Judge-side only: the sessions under test never see this.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { SPEC } from "../capture-spec.mjs";

export const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

// The directory to serve comes from the command line; there is no default.
export function dirArg(script) {
  const arg = process.argv[2];
  if (!arg) { console.error(`usage: node scripts/live-test/${script} <directory>`); process.exit(1); }
  const root = path.resolve(arg);
  if (!fs.existsSync(root)) { console.error("no such directory: " + arg); process.exit(1); }
  return root;
}

export async function start(root) {
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };
  const server = http.createServer((req, res) => {
    const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
    if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
    fs.createReadStream(p).pipe(res);
  });
  await new Promise((ok) => server.listen(0, ok));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await puppeteer.launch({ executablePath: SPEC.chrome, headless: true });
  const newPage = async (width, height) => {
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    return page;
  };
  const close = async () => { await browser.close(); server.close(); };
  return { base, browser, newPage, close };
}

// The accessibility tree under an element (a selector, or the nth match as [selector, n]),
// one line per node: role "name".
export async function tree(page, target) {
  const [selector, n] = Array.isArray(target) ? target : [target, 0];
  const el = (await page.$$(selector))[n];
  const snap = await page.accessibility.snapshot({ root: el, interestingOnly: false });
  // Wrapper roles carry no meaning of their own: their children are promoted. Runs of text are joined.
  const wrapper = new Set(["generic", "none", "presentation", "InlineTextBox"]);
  const items = (node) => {
    if (node.role === "StaticText") return [{ text: node.name || "" }];
    const kids = (node.children || []).flatMap(items);
    if (wrapper.has(node.role)) return kids;
    return [{ role: node.role, name: node.name || "", kids }];
  };
  const lines = [];
  const emit = (list, d) => {
    let text = "";
    const flush = () => { if (text.trim()) lines.push("  ".repeat(d) + "- text: " + text.trim()); text = ""; };
    for (const it of list) {
      if (it.text !== undefined) { text += it.text; continue; }
      flush();
      const onlyText = it.kids.length > 0 && it.kids.every((k) => k.text !== undefined);
      const inner = it.kids.map((k) => k.text).join("").trim();
      if (onlyText) lines.push("  ".repeat(d) + `- ${it.role}: ${inner}`);
      else { lines.push("  ".repeat(d) + `- ${it.role}${it.name ? ` "${it.name}"` : ""}${it.kids.length ? ":" : ""}`); emit(it.kids, d + 1); }
    }
    flush();
  };
  emit(items(snap), 0);
  return lines.join("\n");
}
