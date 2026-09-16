#!/usr/bin/env node
/**
 * The mechanical counts for the public documents — the ones in .claude/rules/readme-review.md
 * that a script can return.
 *
 * Usage:
 *   node scripts/check-readme.mjs            # links, images, capture-log, prompts, names, praise words, marks
 *   node scripts/check-readme.mjs --pages    # also opens every gallery/*.html in Chrome and counts pages that fail to render
 *
 * Documents read: README.md, CHANGELOG.md, skills/design-discipline/README.md — prose lines only,
 * outside fenced code blocks. The prompt and product-entry counts apply to README.md alone; it is
 * the only document that carries them.
 * Output: one "count name: n" line per count, with the offending items listed under any non-zero
 * count. Exit code 1 if any count is non-zero.
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPEC, specForLog } from './capture-spec.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PROSE_FILES = ['README.md', 'CHANGELOG.md', 'skills/design-discipline/README.md'];
const README = 'README.md';
const PROMPTS = resolve(ROOT, 'gallery', 'README.md');
const GALLERY = resolve(ROOT, 'gallery');
const LOG = resolve(__dirname, 'capture-log.json');
const withPages = process.argv.includes('--pages');

// ---- read the documents, separating prose from fenced code ------------------------
const docs = {};   // file → { prose: [{n, line}], textBlocks: [string] }
for (const f of PROSE_FILES) {
  const p = resolve(ROOT, f);
  if (!existsSync(p)) continue;
  const lines = readFileSync(p, 'utf8').split('\n');
  const prose = [], textBlocks = [];
  let inCode = false, lang = '', buf = [];
  lines.forEach((line, i) => {
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      if (!inCode) { inCode = true; lang = fence[1]; buf = []; }
      else { if (lang === 'text') textBlocks.push(buf.join('\n')); inCode = false; }
      return;
    }
    if (inCode) buf.push(line); else prose.push({ n: i + 1, line });
  });
  docs[f] = { prose, textBlocks };
}
const readmeRaw = readFileSync(resolve(ROOT, README), 'utf8');

let failed = false;
function report(name, items) {
  console.log(`${name}: ${items.length}`);
  for (const it of items) console.log(`  ${it}`);
  if (items.length) failed = true;
}

// ---- 1. links and image references resolve (three documents, relative to each) -------
{
  const missing = [];
  for (const [f, { prose }] of Object.entries(docs)) {
    const base = dirname(resolve(ROOT, f));
    for (const { n, line } of prose) {
      const targets = [];
      for (const m of line.matchAll(/\]\(([^)\s]+)\)/g)) targets.push(m[1]);
      for (const m of line.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) targets.push(m[1]);
      for (const t of targets) {
        if (/^(https?:|mailto:|#)/.test(t)) continue;
        if (!existsSync(resolve(base, t.split('#')[0]))) missing.push(`${f}:${n}: ${t}`);
      }
    }
  }
  report('links or image references that do not resolve', missing);
}

// ---- 2. images in gallery/ the README does not reference -----------------------------------
{
  const files = existsSync(GALLERY) ? readdirSync(GALLERY).filter((f) => /\.(png|gif)$/.test(f)) : [];
  report('images in gallery/ the README does not reference', files.filter((f) => !readmeRaw.includes(`gallery/${f}`)).map((f) => `gallery/${f}`));
}

// ---- 3. referenced images against capture-log.json ------------------------------------
{
  const log = existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : {};
  const referenced = [...new Set([...readmeRaw.matchAll(/gallery\/([a-z0-9.-]+\.(?:png|gif))/g)].map((m) => m[1]))];
  const noRecord = [], specDrift = [];
  const current = JSON.stringify(specForLog());
  for (const f of referenced) {
    const p = resolve(GALLERY, f);
    const e = log[f];
    if (!e) { noRecord.push(`${f}: no capture-log entry`); continue; }
    if (!existsSync(p)) continue;                       // existence is count 1's job
    const sha = createHash('sha256').update(readFileSync(p)).digest('hex');
    if (sha !== e.sha256) noRecord.push(`${f}: bytes differ from the capture-log entry`);
    if (JSON.stringify(e.spec) !== current) specDrift.push(`${f}: captured under a different SPEC`);
  }
  report('referenced images with no tool record, or whose bytes differ from it', noRecord);
  report('referenced images captured under a SPEC that is not the current one', specDrift);
}

// ---- 4. quoted prompts equal gallery/README.md (README only; ```text blocks starting with /goal)
{
  const norm = (s) => s.replace(/\s+/g, '');
  const known = new Set();
  if (existsSync(PROMPTS)) for (const m of readFileSync(PROMPTS, 'utf8').matchAll(/```text\n([\s\S]*?)\n```/g)) known.add(norm(m[1]));
  const bad = (docs[README]?.textBlocks ?? [])
    .map((b, i) => ({ i, b }))
    .filter(({ b }) => b.trimStart().startsWith('/goal'))
    .filter(({ b }) => !known.has(norm(b)))
    .map(({ i, b }) => `text block ${i + 1}: "${b.slice(0, 70).replace(/\n/g, ' ')}…"`);
  report('quoted prompts whose words differ from gallery/README.md', bad);
}

// ---- 5. product entries (README only): the ### headings under "Seven pages" → slug = image = page
// heading → slug: lower case, a leading "the " dropped, every run of non-alphanumerics becomes one hyphen
{
  const slugOf = (h) => h.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const all = docs[README]?.prose ?? [];
  const from = all.findIndex((x) => /^## Seven pages/.test(x.line));
  const to = all.findIndex((x, i) => i > from && /^## /.test(x.line));
  const prose = from < 0 ? [] : all.slice(from, to < 0 ? undefined : to);
  const bad = [];
  prose.forEach(({ n, line }, idx) => {
    const head = line.match(/^### (.+)$/);
    if (!head) return;
    const window = prose.slice(idx, idx + 10).map((x) => x.line).join('\n');
    const img = window.match(/gallery\/([a-z0-9-]+)\.(?:png|gif)/);
    const page = window.match(/\(gallery\/([a-z0-9-]+)\.html\)/);
    const want = slugOf(head[1]);
    const got = { image: img ? img[1] : 'missing', page: page ? page[1] : 'missing' };
    if (got.image !== want || got.page !== want) bad.push(`README.md:${n}: "${head[1]}" → ${want}, image ${got.image}, page ${got.page}`);
  });
  report('product entries whose heading, image name, and page name do not agree', bad);
}

// ---- 6. praise-word candidates (prose of the three documents; the count is on intent, the list is examples)
{
  const words = ['stunning', 'stunningly', 'beautiful', 'beautifully', 'gorgeous', 'best', 'amazing', 'incredible', 'delightful', 'world-class', 'elegant'];
  const re = new RegExp(`\\b(${words.join('|')})\\b`, 'i');
  const hits = [];
  for (const [f, { prose }] of Object.entries(docs)) for (const { n, line } of prose) if (re.test(line)) hits.push(`${f}:${n}: ${line.trim().slice(0, 90)}`);
  report('praise adjective candidates in prose (judge the intent)', hits);
}

// ---- 7. verdict marks and emoji (prose of the three documents) ----------------------------
{
  const re = /[✓✔✗✕◎○●△▲★☆]|\p{Extended_Pictographic}/u;
  const hits = [];
  for (const [f, { prose }] of Object.entries(docs)) for (const { n, line } of prose) if (re.test(line)) hits.push(`${f}:${n}: ${line.trim().slice(0, 80)}`);
  report('verdict marks or emoji in prose', hits);
}

// ---- 8. gallery/*.html renders (--pages only; browser conditions from SPEC) -------------------
if (withPages) {
  const { default: puppeteer } = await import('puppeteer-core');
  const dir = resolve(ROOT, 'gallery');
  const pages = readdirSync(dir).filter((f) => f.endsWith('.html'));
  const browser = await puppeteer.launch({ executablePath: SPEC.chrome, headless: 'shell', args: ['--no-sandbox', '--disable-gpu'] });
  const bad = [];
  for (const f of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
    await page.setViewport({ width: SPEC.width, height: SPEC.height });
    await page.goto('file:///' + resolve(dir, f).replace(/\\/g, '/'), { waitUntil: 'load' });
    await new Promise((r) => setTimeout(r, SPEC.still.settleMs));
    const blank = await page.evaluate(() => document.body.innerText.trim().length === 0 && document.querySelectorAll('canvas, svg, img').length === 0);
    if (blank) errors.push('blank page');
    if (errors.length) bad.push(`gallery/${f}: ${errors.join(' | ')}`);
    await page.close();
  }
  await browser.close();
  report('gallery pages that do not render', bad);
}

process.exit(failed ? 1 : 0);
