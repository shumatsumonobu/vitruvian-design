# scripts/

The tools that make the README's images (`gallery/`) and count what the README claims. Never
run ffmpeg by hand for an image — the spec (pixel size, palette size, frame cadence) is fixed in
one place so no two images drift apart.

## Setup

```bash
cd scripts && npm install        # puppeteer-core only
```

- Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe` — `SPEC.chrome` in
  capture-spec.mjs; edit it if yours is elsewhere
- ffmpeg on the Windows PATH, or in WSL (`sudo apt install ffmpeg`) — the tool falls back to WSL's

## Usage

```bash
# a still page → gallery/<name>.png (gallery pages are single-theme, so --theme is not needed)
node scripts/capture.mjs still  gallery/quire.html quire
node scripts/capture.mjs still  gallery/roast-ledger.html roast-ledger

# motion (a starfield, an entrance) → gallery/<name>.gif
node scripts/capture.mjs motion gallery/asterism.html asterism --open-settled 8
node scripts/capture.mjs motion gallery/blurt.html blurt --open-settled 8

# the README counts
node scripts/check-readme.mjs --pages

# the repository's social preview (GitHub Settings → General → Social preview), 1280×640
node scripts/social-preview.mjs
```

The source is a path relative to the repo root, or a URL (`file:///…`, `http://localhost:…`);
the log records it as given, so a repo path keeps machine paths out of the log. The pages in
`gallery/` are byte for byte the runs' own `index.html`.

Options:

- `--theme light|dark` — emulates prefers-color-scheme; add the page's own `?theme=` to the URL
  if it has one
- `--settle ms` — wait before a still; default 1500, a page with an entrance needs 7000 or so
- `--colors n` — palette size for a still; default 64, 128 when a gradient bands
- `--frames n --step ms` — motion; default 45 frames at 120 ms, 5.4 s
- `--open-settled n` — motion: put n copies of the settled last frame first, so the GIF opens
  and loops on the finished screen instead of the blank start of an entrance; the gallery GIFs
  use 8

## The spec (`SPEC` in capture-spec.mjs is the source; this table is its provenance)

| Value | Setting | Why |
|---|---|---|
| Viewport | 1440×900, scale 1 | 1.72× the README's rendered width on github.com (838 px, measured on the repo page at three window widths), so the image stays sharp on high-density screens |
| Height, still and motion | 900 plus whatever actually scrolls; width cut at 1440 | A design that scrolls is shown whole — the broadsheet page ends mid-chart at 900. Measured by scrolling, not from scrollHeight, which counts elements behind overflow:hidden (a screen-reader-only paragraph added 17 px on one page). Anything overflowing sideways is cut, so a page defect shows as one |
| Method, still and motion | Grow the viewport to the page's height, one shot | Two methods were dropped: puppeteer's captureBeyondViewport paints a `background-attachment: fixed` background only in the first viewport (the lower half of one page came out black); scrolling and stitching redraws a fixed background per tile and leaves seams. A tall viewport does neither, and no page so far stretches a 100vh hero under it — the runs' own full-page captures agree |
| Still | PNG, 64-colour palette, no dither | Single-hue heroes land at 230–600 KB. 32 colours banded a dark gradient. Many hues over a gradient (a sticker sky) band even at 128, so those use `--colors 256` (180–320 KB) |
| Motion | CDP screencast received as PNG, 45 frames picked at 120 ms, GIF at 128 colours, bayer dither, rectangle diff | 256 colours with error-diffusion dither made an entrance 9–15 MB; this setting makes it 3–5 MB. JPEG frames carry compression noise into every diff and inflated a quiet page four times over (142 KB → 621 KB) |
| Size guideline | still 300 KB, motion 5 MB | The output line notes when a file is over. A guideline, not a ceiling |
| Output and names | `gallery/<name>.{png,gif}`, beside `gallery/<name>.html` | The image and the page share one name, the product's; no numbering |

Judgement happens at the README's rendered width, 838 px, with the reference beside the result
(the inspection line in the author's PLAN.md, kept beside the run workspaces outside this
repo).

## Files

| File | Role |
|---|---|
| `capture.mjs` | Captures and encodes; `still` and `motion` modes. Appends every capture to `capture-log.json` |
| `capture-spec.mjs` | The settings a capture uses (`SPEC`). Read by capture.mjs; check-readme.mjs compares against the same values |
| `capture-log.json` | What was captured: per image in gallery/, the source URL, mode, options, the `SPEC` in force, and the file's sha256. check-readme.mjs compares the images against it. Not edited by hand — re-capturing rewrites it |
| `check-readme.mjs` | The mechanical README counts: links, unreferenced images, capture-log agreement and SPEC drift, prompt fidelity against gallery/README.md, product-name agreement, praise-word candidates, verdict marks; `--pages` renders every gallery page. Called from the procedure in .claude/rules/readme-review.md |
| `social-preview.mjs`, `social-preview.png` | The GitHub social preview: five gallery pages loaded live in iframes, fanned and overlapping, rendered to the PNG at 1280×640. The layout is the `TILES` list in the script — change a tile's left, top, scale, or rotate and re-run. Not a gallery image — a composition of the pages, not a capture of one — so capture.mjs and check-readme.mjs leave it alone |
| `package.json` | The one dependency, puppeteer-core |
| `.tmp/` | Capture intermediates (raw PNG, frames, palettes). Exists only during a capture; removed once the image is written, kept after a failure for inspection. Git-ignored |
