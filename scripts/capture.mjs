#!/usr/bin/env node
/**
 * Captures the README images into gallery/ (puppeteer-core driving the installed Chrome; ffmpeg encodes).
 *
 * Usage:
 *   node scripts/capture.mjs still  <source> <name> [--theme light|dark] [--settle 1500] [--colors 64]
 *   node scripts/capture.mjs motion <source> <name> [--theme light|dark] [--frames 45] [--step 120] [--open-settled 0]
 *
 *   <source> a path relative to the repo root (gallery/quire.html) or a URL (file:///…, http://localhost:…).
 *            The log records it exactly as given, so a repo-relative path keeps machine paths out of the log
 *   <name>   the output name without extension — the page's own name, so quire.html gets quire.png
 *
 * Output: gallery/<name>.png (still) or gallery/<name>.gif (motion). Both are SPEC.width
 * wide; the height is SPEC.height plus whatever the page actually scrolls.
 *
 * The spec lives in capture-spec.mjs and its provenance in scripts/README.md. Every capture is
 * appended to capture-log.json, which check-readme.mjs compares the images against.
 *
 * Needs Chrome at SPEC.chrome, and ffmpeg on the Windows PATH or in WSL (sudo apt install ffmpeg).
 */

import puppeteer from 'puppeteer-core';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPEC, specForLog } from './capture-spec.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'gallery');
const LOG = resolve(__dirname, 'capture-log.json');   // one entry per image: source, mode, options, SPEC, hash

// ---- arguments ---------------------------------------------------------------
const [mode, source, name, ...rest] = process.argv.slice(2);
if (!['still', 'motion'].includes(mode) || !source || !name) {
  console.error('usage: node scripts/capture.mjs still|motion <source> <name> [--theme light|dark] [--settle ms] [--colors n] [--frames n] [--step ms] [--open-settled n]');
  process.exit(2);
}
// A URL is used as given; anything else is a path relative to the repo root, turned into a file URL
// for Chrome. The log keeps `source` as typed, so a repo-relative path never records a machine path.
const isUrl = /^[a-z][a-z0-9+.-]*:\/\//i.test(source);
const url = isUrl ? source : 'file:///' + resolve(ROOT, source).replace(/\\/g, '/');
const opt = (flag, fallback) => {
  const i = rest.indexOf(flag);
  return i >= 0 && rest[i + 1] !== undefined ? rest[i + 1] : fallback;
};
const theme = opt('--theme', 'light');
const settleMs = Number(opt('--settle', SPEC.still.settleMs));
const stillColors = Number(opt('--colors', SPEC.still.colors));
const frames = Number(opt('--frames', SPEC.motion.frames));
const stepMs = Number(opt('--step', SPEC.motion.stepMs));
// --open-settled n: put n copies of the final (settled) frame at the front, so the GIF opens and
// every loop restarts on the finished screen rather than on the blank first frame of an entrance.
const openSettled = Number(opt('--open-settled', 0));
if (!['light', 'dark'].includes(theme)) { console.error('--theme must be light or dark'); process.exit(2); }

const TMP = resolve(__dirname, '.tmp', name);
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

// ---- ffmpeg: the Windows PATH first, WSL's ffmpeg when there is none ----------
const useWsl = (() => {
  const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  return Boolean(r.error);
})();
const toWsl = (p) => p.replace(/\\/g, '/').replace(/^([A-Za-z]):\//, (_, d) => `/mnt/${d.toLowerCase()}/`);
const P = (p) => (useWsl ? toWsl(p) : p);
function ffmpeg(args) {
  const argv = ['-y', '-loglevel', 'error', ...args];
  // --exec bypasses the WSL shell, so filter graphs containing ';' reach ffmpeg intact
  const r = useWsl ? spawnSync('wsl', ['--exec', 'ffmpeg', ...argv], { stdio: 'inherit' }) : spawnSync('ffmpeg', argv, { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`ffmpeg failed (${useWsl ? 'wsl' : 'windows'}):`, argv.join(' ')); process.exit(1); }
}

// ---- browser ------------------------------------------------------------------
async function openPage() {
  const browser = await puppeteer.launch({
    executablePath: SPEC.chrome,
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: SPEC.width, height: SPEC.height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: theme },
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ]);
  return { browser, page };
}

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;

// The height is the viewport plus what the page actually scrolls. scrollHeight is not used: it
// counts elements hidden behind overflow:hidden (a screen-reader-only paragraph added 17 px on
// one page), and the capture should show only what a reader can reach.
async function scrollableHeight(page) {
  const maxY = await page.evaluate(() => { window.scrollTo(0, 1e7); const y = window.scrollY; window.scrollTo(0, 0); return y; });
  return SPEC.height + Math.round(maxY);
}

// ---- still ----------------------------------------------------------------------
async function still() {
  const { browser, page } = await openPage();
  await page.goto(url, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, settleMs));
  // Width fixed at SPEC.width, height the whole page. Anything overflowing sideways is cut off,
  // not accommodated — the cut shows in the image as the page defect it is.
  //
  // The method: grow the viewport to the page's height and take one shot (motion does the same).
  // Two methods were tried and dropped. captureBeyondViewport paints a background-attachment:
  // fixed background only in the first viewport, which left the lower half of one page black.
  // Scrolling by one viewport and stitching redraws a fixed background per tile, which left a
  // seam at every join. A tall viewport does neither; a 100vh hero stretching under it has not
  // happened on any page so far, and matches the full-page captures the runs made themselves.
  const height = await scrollableHeight(page);
  await page.setViewport({ width: SPEC.width, height, deviceScaleFactor: 1 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  const raw = resolve(TMP, 'raw.png');
  await page.screenshot({ path: raw, clip: { x: 0, y: 0, width: SPEC.width, height } });
  await browser.close();

  const pal = resolve(TMP, 'pal.png');
  const out = resolve(OUT_DIR, `${name}.png`);
  ffmpeg(['-i', P(raw), '-vf', `palettegen=max_colors=${stillColors}:stats_mode=full`, P(pal)]);
  ffmpeg(['-i', P(raw), '-i', P(pal), '-lavfi', 'paletteuse=dither=none', '-compression_level', '100', '-pred', 'mixed', P(out)]);
  report(out, 'still');
}

// ---- motion ---------------------------------------------------------------------
async function motion() {
  // Measure the page's height first, then record at a viewport of that height (whole page, as still)
  const probe = await openPage();
  await probe.page.goto(url, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, settleMs));
  const height = await scrollableHeight(probe.page);
  await probe.browser.close();

  const { browser, page } = await openPage();
  await page.setViewport({ width: SPEC.width, height, deviceScaleFactor: 1 });
  const cdp = await page.createCDPSession();
  const shots = [];
  cdp.on('Page.screencastFrame', async (f) => {
    // The first frames can arrive at a different size, before the viewport applies; drop those
    if (f.metadata.deviceWidth === SPEC.width && f.metadata.deviceHeight === height) {
      shots.push({ t: f.metadata.timestamp, data: f.data });
    }
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send('Page.enable');
  // PNG frames, not JPEG: JPEG noise differs frame to frame and inflates the GIF's diff regions
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, frames * stepMs + 600));
  await cdp.send('Page.stopScreencast');
  await browser.close();
  if (!shots.length) { console.error('the screencast produced no frames'); process.exit(1); }

  // Pick one frame per step: the latest frame presented at or before each step's timestamp
  const framesDir = resolve(TMP, 'frames');
  mkdirSync(framesDir, { recursive: true });
  const t0 = shots[0].t;
  const picked = [];
  for (let i = 0; i < frames; i++) {
    const target = t0 + (i * stepMs) / 1000;
    let best = shots[0];
    for (const s of shots) { if (s.t <= target) best = s; else break; }
    picked.push(best.data);
  }
  const sequence = [...Array(openSettled).fill(picked[picked.length - 1]), ...picked];
  sequence.forEach((data, i) => writeFileSync(resolve(framesDir, `f${String(i).padStart(3, '0')}.png`), Buffer.from(data, 'base64')));
  console.log(`screencast: ${shots.length} frames, picked ${frames} at ${stepMs}ms${openSettled ? `, opening on ${openSettled} settled frames` : ''}`);

  // Chrome may emit the first blank frames in another pixel format or size; paletteuse cannot
  // survive a parameter change mid-stream, so every frame is normalised to rgb24 at SPEC size first.
  const normDir = resolve(TMP, 'norm');
  mkdirSync(normDir, { recursive: true });
  const rate = `1000/${stepMs}`;
  ffmpeg(['-reinit_filter', '0', '-framerate', rate, '-i', P(resolve(framesDir, 'f%03d.png')), '-vf', `scale=${SPEC.width}:${height}:flags=lanczos,format=rgb24`, P(resolve(normDir, 'f%03d.png'))]);

  const pattern = resolve(normDir, 'f%03d.png');
  const pal = resolve(TMP, 'pal.png');
  const out = resolve(OUT_DIR, `${name}.gif`);
  ffmpeg(['-framerate', rate, '-i', P(pattern), '-vf', `palettegen=max_colors=${SPEC.motion.colors}:stats_mode=diff`, P(pal)]);
  ffmpeg(['-framerate', rate, '-i', P(pattern), '-i', P(pal), '-lavfi', `paletteuse=dither=${SPEC.motion.dither}:diff_mode=rectangle`, P(out)]);
  report(out, 'motion');
}

function pngDims(p) {
  const b = readFileSync(p);
  return `${b.readUInt32BE(16)}×${b.readUInt32BE(20)}`;
}
function gifDims(p) {
  const b = readFileSync(p);
  return `${b.readUInt16LE(6)}×${b.readUInt16LE(8)}`;
}

// Append this capture to the log: file name → hash, mode, the options used, the SPEC in force
function recordLog(out, kind) {
  const log = existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : {};
  const sha256 = createHash('sha256').update(readFileSync(out)).digest('hex');
  const options = kind === 'still' ? { settleMs, colors: stillColors } : { frames, stepMs, openSettled };
  log[basename(out)] = { sha256, mode: kind, theme, source, options, spec: specForLog(), capturedAt: new Date().toISOString() };
  const sorted = Object.fromEntries(Object.keys(log).sort().map((k) => [k, log[k]]));
  writeFileSync(LOG, JSON.stringify(sorted, null, 2) + '\n');
}

function report(out, kind) {
  if (!existsSync(out)) { console.error('no output written:', out); process.exit(1); }
  recordLog(out, kind);
  const size = statSync(out).size;
  const over = size > SPEC.sizeHintBytes[kind] ? `  (over the ${Math.round(SPEC.sizeHintBytes[kind] / 1024)} KB guideline)` : '';
  const dims = kind === 'still' ? pngDims(out) : gifDims(out);
  console.log(`wrote ${out}  ${kb(out)}  (${dims}, ${theme})${over}`);
  // The intermediates (raw PNG, frames, palettes) are only needed while encoding; drop them so
  // .tmp/ does not accumulate one directory per capture. On a failure they stay for inspection.
  rmSync(TMP, { recursive: true, force: true });
  try { rmdirSync(dirname(TMP)); } catch {}   // the empty .tmp/ itself, when nothing else is in it
}

await (mode === 'still' ? still() : motion());
