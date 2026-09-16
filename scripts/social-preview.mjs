#!/usr/bin/env node
/**
 * Renders the repository's GitHub social preview to scripts/social-preview.png at 1280x640: five
 * gallery pages loaded live in iframes, scaled, tilted, and overlapping. Upload the PNG by hand:
 * repository Settings -> General -> Social preview.
 *
 *   node scripts/social-preview.mjs
 *
 * The layout is the TILES list below - change a tile's left, top, scale, or rotate and re-run.
 * Not a gallery image: it is a composition of the pages, not a capture of one, so capture.mjs and
 * check-readme.mjs leave it alone.
 */

import puppeteer from 'puppeteer-core';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SPEC } from './capture-spec.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIDTH = 1280, HEIGHT = 640;          // GitHub's recommended social preview size
const SETTLE_MS = 8000;                    // BLURT's entrance takes about seven seconds to settle
const BACKGROUND = '#e6e2da';
const out = resolve(__dirname, 'social-preview.png');

// Each tile is a 1440x900 page scaled down; left/top are in the 1280x640 frame, in px.
const TILES = [
  { page: 'deep-field',   left: 150, top: -70, scale: 0.30, rotate: -4 },
  { page: 'dispatch',     left: -80, top: 255, scale: 0.34, rotate: -7 },
  { page: 'quire',        left: 830, top: -15, scale: 0.36, rotate: 6 },
  { page: 'roast-ledger', left: 880, top: 390, scale: 0.30, rotate: 5 },
  { page: 'blurt',        left: 340, top: 222, scale: 0.38, rotate: 2 },   // last = in front
];

const pageUrl = (name) => pathToFileURL(resolve(__dirname, '..', 'gallery', `${name}.html`)).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${BACKGROUND}; }
  .tile { position: absolute; width: ${SPEC.width}px; height: ${SPEC.height}px; transform-origin: 0 0; overflow: hidden;
          border-radius: 16px; background: #fff;
          box-shadow: 0 40px 80px rgba(0,0,0,.30), 0 6px 14px rgba(0,0,0,.18); }
  .tile iframe { width: ${SPEC.width}px; height: ${SPEC.height}px; border: 0; pointer-events: none; }
</style></head><body>
${TILES.map((t) => `<div class="tile" style="left:${t.left}px; top:${t.top}px; transform:scale(${t.scale}) rotate(${t.rotate}deg)"><iframe src="${pageUrl(t.page)}"></iframe></div>`).join('\n')}
</body></html>`;

const browser = await puppeteer.launch({ executablePath: SPEC.chrome, headless: 'shell', args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
// Navigate to a file URL first so the document has a file origin and the file:// iframes may load
await page.goto(pathToFileURL(resolve(__dirname, 'capture-spec.mjs')).href, { waitUntil: 'load' });
await page.setContent(html, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, SETTLE_MS));
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await browser.close();
console.log(`wrote ${out}  (${WIDTH}x${HEIGHT})`);
