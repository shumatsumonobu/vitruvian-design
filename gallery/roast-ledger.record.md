# Record — The Roast Ledger

## Subject

A fictional specialty coffee roaster, **Halvorsen & Wren, Portland, Oregon**. The screen is the
quarterly sales review its partners read, published under its own masthead, **The Roast Ledger**.
Audience: the four partners and the head roaster. Primary job: report what the quarter sold, where
it came from, and which lots moved.

## Study record

Five references, each rendered and looked at. Captures are in `.design/captures/refs/`.

| Reference | How its pixels were seen | Question carried in | What it settled |
|---|---|---|---|
| FT Markets Data, `markets.ft.com/data` | Walk — two pages of the running product navigated in sequence and captured: Markets Data, then Commodities (`ft-markets.png`, `ft-commodities.png`) | How does a paper-tinted ground carry dense financial data without grey card chrome? | Data sits directly on the tinted stock. No card, no shadow, no container — a heavy rule over each block and a hairline under each row is the whole apparatus. Adopted for every block on the sheet. |
| FT Commodities table | Capture (`ft-commodities.png`) | How is a per-row trend shown inside a table without a second chart? | A ~70×30 px sparkline in its own column, and a separate thin 52-week range bar with the low and the high printed at its two ends. Adopted: the twelve-week trend column in the roast ledger. Also settled the change column — sign, absolute and percent stacked, so direction never rests on colour. |
| Tufte CSS, `edwardtufte.github.io/tufte-css` | Capture (`tufte.png`) | Where does an annotation go if the chart is not allowed a legend box? | Serif body on a wide measure with generous leading, and notes set in the margin beside what they annotate rather than collected below it. Adopted: chart series labelled at the end of the line itself, no legend anywhere on the sheet. |
| Our World in Data grapher, green coffee production | Capture (`owid.png`) | What does an honest chart have to carry besides its marks? | Title as a real sentence, unit stated immediately under it (`Measured in tonnes`), source line under the chart. Adopted: every chart on the sheet states its unit in its caption and the sheet carries one colophon naming the source and the cut-off. |
| SEY Coffee, `seycoffee.com` | Capture (`sey.png`) | What vocabulary does specialty coffee actually use for a lot? | Region, then washing station or farm, then process, then variety — in that order, and never the word "product". Adopted verbatim as the shape of the origin column: `Nyeri, Gichatha-ini, Kenya` over `Washed, SL28 and SL34`. |

Two further references were attempted and are **not** counted, because their pixels were a bot
check rather than the product: `economist.com/graphic-detail` and `ft.com` home both returned a
Cloudflare verification page (`economist-gd.png`, `ft-home.png`). They settled nothing and are
recorded only so the count is honest.

## Rejected while planning

- **Cream `#F4F1EA` ground with a terracotta `#D97757` accent.** The current house style of generated
  design, and on a coffee brief the terracotta would read as the subject when it is really the tell.
  The ground moved to a buff newsprint `#F0E7D5` and the accent to a press red `#9E2B25`.
- **A card grid.** Identical rounded containers with one soft grey shadow under each. Rejected before
  the first line: the brief forbids grey dashboard chrome, and a press cannot print a shadow.
- **A monospace face for the small data labels.** A tell, and wrong besides — newspapers set their
  table apparatus in a grotesque, which is where Libre Franklin came from.
- **All-caps tracked-out eyebrow labels over each section.** Section heads are real sentences instead.
- **A period selector (twelve / twenty-six / fifty-two weeks).** Considered, to give the accent an
  active state to colour. Dropped: it would have governed the hero and the chart but not the ledger
  or the channel mix, which would have left three blocks silently showing a different period from
  the one selected. A control that lies is worse than no control.
- **A roast-profile curve** (bean temperature against time, first crack annotated). Beautiful, and
  off-brief — this is a sales review, not a roasting log.
- **Colour-coded chart series.** Every mark on this sheet is drawn in the one ink; the second plate
  is spent only where the declaration says.

## Data integrity

The figures are fictional but internally closed, and the sheet computes rather than restates:

- Twelve weekly net-sales figures sum to exactly `$1,275,800`, the hero figure.
- Twelve prior-year weekly figures sum to `$1,077,500`; `1,275,800 / 1,077,500 = 1.184`, the stated
  `+18.4%`.
- Six ledger rows: kilograms × price per kilogram sums to `$1,275,800`, and kilograms sum to
  `48,920 kg`. Each row's share of sales is computed in the page from its own two numbers, so the
  share column cannot drift from the ledger.
- Four channel figures sum to `$1,275,800` and their shares to `100.0%`.
- Each origin's sparkline is its own weekly kilogram series, normalized to that origin's stated
  total, so the line and the total in the same row describe the same thing.
- The account strip's 38 values are normalized to the wholesale channel figure, and the "five
  largest accounts" share and the median are computed from the plotted values rather than asserted
  beside them.

## The hero beside the strongest reference

`.design/captures/hero.png` (840 px wide, the size it will be seen at) beside
`.design/captures/refs/ft-commodities.png`. Three ways mine was weaker:

1. **The lower two-thirds had no ink in it.** The FT page holds a fairly even tonal weight all the
   way down — coloured sparklines in every row, tinted row bands, bold row labels. Mine put a black
   bomb at the top and then evaporated: pale hatch bars, thirty-eight open circles at 0.9 px, a
   table of hairlines. At 840 px the eye stopped at the hero and the rest of the sheet went grey.
2. **No column structure, so the page read as six horizontal stripes.** A broadsheet's signature is
   the vertical rule and text set in narrow measures. Every block of mine was full width, started at
   the same left edge, and was separated from the next by a horizontal rule of the same weight. From
   arm's length it was a stack of bands, not a printed page.
3. **The charts floated inside their columns.** The FT's blocks fill their columns edge to edge.
   My channel bars stopped well short of the right edge and the account strip used half the height
   it was given, which read as unfinished rather than as generous margin.

The two fixed, being the two that matter at 840 px:

- **(1) Ink weight below the fold.** Hatch pitch tightened from 6 to 5 with a 1 px stroke; channel
  bar outlines 1 → 1.4 px; the this-year line 1.4 → 1.9 px; sparklines 1 → 1.6 px in a column
  widened from 108 to 132 px; account dots enlarged, and **the five largest filled solid** — which
  also made the sentence beside the chart checkable by eye instead of asserted. Origin names went
  from 400 to 600 weight.
- **(2) A real column rule.** The channel and account blocks became a ruled two-column region with a
  hairline down the gutter, breaking the stripe rhythm at exactly the point the page was flattest.

(3) was left. It is real, but it is a proportion problem that costs a layout rebuild, and at 840 px
it reads as margin rather than as error once the ink weight is fixed.

## Inspection

Run against the rendered sheet at 1600 px and 489 px, three repair passes, counts rerun after each.

**rules/tokens.md** — applicable entries unfilled 0 (elevation, motion and symbol set are each
recorded as not applicable with a reason); type-scale steps missing weight or letter-spacing 0;
steps missing a width 0 of 0 applicable, since neither family carries a width axis; numeric steps
missing a figure treatment 0; families sharing a classification 0; springs and curves 0, matching a
product with no motion; gradients with no reason 0; colours with no stated job 0; values hard-coded
per theme 0; symbol sets named 0, correct where no icons are drawn. **Values this pass needed and
wrote back: 2** — the fluid `clamp()` steps for the masthead and the hero, and the structure and
reflow entry, both now in the declaration.

**rules/anti-slop.md** — accent hues 1; grey families 1; typeface families 2; words emphasized by a
switch of family 0; display sizes rendered 2, both declared with what each is for; radius values
outside the scale 0; shadow values 0; gradients 0; blurred materials 0; glows and celebration
effects 0; icons from outside the symbol set 0; emoji 0; all-caps label styles 0; glyphs appended to
action text 0; headings emphasizing a fragment 0; numbered sets 0. Tinted near-black standing in for
black: 1, lifted by recorded exception 2. Three repaired this pass: **line lengths** (the serif body
was set to `74ch`, which in Bodoni measures about 94 characters — over the declared 74-character
cap; the caps are now 58ch and 56ch, measuring 71 and 64); **spacing values off the base unit** (a
2 px sub-label margin); **spacing literals instead of token references** (three inline `16px`
margins and the sheet padding, now all `calc(var(--u)*n)`).

Closest match among the looks frontend-design names: the broadsheet with hairline rules and zero
radius. What settled it: the brief, which specifies it in those words. What was kept off it: the
cream-and-terracotta palette that usually arrives with it, replaced by buff newsprint and press red.

**rules/layout.md** — surfaces with no declared structure: was 1, now 0. Regions with no declared
reflow behaviour: was 8, now 0. Distinct left edges within one column 1. Edges meant to be shared
that differ 0. Groups whose internal gap equals or exceeds their separating gap 0. Controls styled
as primary 0, correct on a screen that only presents. **Regions hiding on the narrow display with no
alternative route: was 1, now 0** — the twelve-week trend column used to vanish under 820 px with
nowhere else to read it; the table now scrolls sideways and keeps every column.

Reading order against visual weight: masthead, net-sales figure, change, standfirst, weekly chart,
target, channel mix, account strip, ledger, colophon — ordered by size and contrast the two lists
agree, so nothing needed restyling.

**rules/a11y.md** — operable controls with no accessible name 0; icon-only controls 0; names missing
their visible label 0; informative images with no description 0 of 10 SVGs, each carrying
`role="img"` and a sentence naming what it shows; decorative images exposed 0; **meanings carried by
colour alone 0** — the two chart series differ in dash pattern and are labelled at the end of each
line rather than in a legend, every change figure carries an explicit `+` or `−`, and the five
largest accounts are filled rather than merely tinted, with "filled above" in the sentence beside
them; modals 0; operations reachable by pointer but not keyboard: was 1, now 0 — the sideways-
scrolling table region is now `tabindex="0"` with an accessible name and a visible cherry focus
ring; focus order differs from visual order 0; outcomes with no announcement 0, there being no
actions; hover-only operations 0.

Contrast, measured against the paper: ink 14.2:1, secondary text 5.8:1, rules and chart axes 4.1:1
against a 3:1 floor for graphical objects.

### Not run, and why

Honest gaps rather than passes:

- **rules/states.md.** Loading, empty, first run and error do not exist on this sheet: there is no
  network call, no account, no query and no input, so no state can be forced. Long content is the
  content — the longest origin string, `Kochere, Yirgacheffe, Ethiopia` over `Washed, Halo Beriti`,
  is in the live data and wraps correctly at 489 px. The four session interruptions and the response
  thresholds have nothing to act on. The file's counts were not formally run.
- **rules/motion.md, forms.md, navigation.md, assets.md.** No motion, no input, no second screen and
  no artwork. Nothing to inspect.
- **rules/copy.md.** The string inventory was not built. The sheet carries no repeated action labels
  — there are no actions — so the one-label-per-intent count has an empty domain, but the lexicon
  file this skill calls for does not exist.
- **The webfont-blocked first frame.** rules/tokens.md asks for one render with webfonts blocked.
  Attempted by mapping the Google Fonts hosts to localhost; the fonts resolved from the browser
  profile cache anyway, so the capture shows the loaded faces. The fallback stacks are declared but
  **unverified in a render**.
- **The screen-reader walk.** rules/a11y.md's first walk needs a screen reader driven on the running
  page. No browser was reachable in this session — the Chrome extension was not connected, so all
  rendering went through headless Chrome, which cannot host that walk. The counts above were read
  from the markup and the rendered sheet; the walk itself is outstanding.
