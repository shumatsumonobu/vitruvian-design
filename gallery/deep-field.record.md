# Record — Deep field

## The study

Six references, each one studied as pixels rather than as text. Every reference below was rendered
in headless Chrome and the capture read; the captures are in `.design/harness/refs/`.

| Reference | How its pixels were seen | What it settled |
|---|---|---|
| typo/graphic posters, the archive front page | capture, 1440×900 | The strongest poster work in the grid has no image in it at all: the letterforms are the picture. It settled that this page needs no artwork beyond the type, and that a poster earns attention by scale contrast rather than by ornament |
| SpaceX — home, Starship, Falcon 9 | **walked as a running flow**, three screens captured in sequence | A black ground with one enormous line and a small instrument readout beside it holds a whole screen. It settled the caption pattern: a figure in small type at the frame edge, next to type twenty times its size, and neither one fighting the other |
| 100,000 Stars (Google Data Arts) | capture, 1440×900 | A starfield can be dense and still sit behind a line of type, because the type is set on a value the field never reaches. It settled the ceiling on star brightness: the brightest grain stays under the quietest text |
| NASA — Welcome to the Universe | capture, 1440×900 | The reverse lesson. Large type over a rendered nebula loses; the imagery wins and the words become a caption to it. It settled that nothing pictorial goes on this page |
| Astronomy Picture of the Day | capture, 1440×900 | Real astronomical figures are published as plain measured values with their source named and nothing dressed up. It settled the colophon and the voice |
| Awwwards — typography gallery | capture, 1440×900 | What a room full of current typographic sites converges on: a condensed grotesque, very large, on a dark ground. It settled what to avoid — this page had to earn its scale with a real axis behind it rather than with size alone |

Rejected while planning, kept here so a later pass does not reach for them again:

- **Letter-spacing as the quantitative axis** (tracking proportional to distance). Rejected: the
  tracking a name needs to span the frame is a function of how many letters it has, so a short
  near name and a short far name would read the same. The axis moved to size, where the confound
  does not exist, and tracking became the justification residual.
- **Vertical position on a log scale** (rows placed at their true log-distance). Rejected: over ten
  decades and nine objects, Proxima and Sirius land 3 percent of the frame apart and collide at
  display size. The gaps would have been the data and the collision would have been the defect.
- **Spectral colour per object** (each name tinted to its real colour temperature). Rejected: nine
  hues is not a palette, and the brief bans decoration competing with the letters.
- **A monospace face for the figures.** Rejected: frontend-design names it as template chrome that
  arrives whatever the subject. Archivo's width axis does the same job inside one family.

## The comparison

`.design/captures/comparison.png` — this build at 840 px beside the typo/graphic posters archive.

Three ways this one was weaker, read at the size it will be seen:

1. **The size ladder was too gentle to read as an axis.** Nine names falling from 101 px to 47 px
   with one cliff at the end looked like nine arbitrary sizes, so the map's functional claim —
   that size carries distance — was the least legible thing on it.
2. **The frame was flat black.** The starfield read as dust specks; at 840 px the poster gained
   nothing from being a screen rather than a print, and the brief's word is *living*.
3. **Every line begins and ends on the same two edges.** The posters in the archive all break
   their own grid somewhere, and this one has no entry point and no asymmetry — the eye lands
   nowhere in particular and reads top to bottom because there is nothing else to do.

Two fixed, the two that matter most at 840 px:

- **(1)** The near-to-far size ratio went from 3.9:1 to 8.3:1, with a 0.80 exponent on the log-distance
  ramp so the near end holds its scale longer and the fall-off is visible. Measured at 840 px the
  ladder now runs 134 → 30 px instead of 101 → 26 px with everything bunched at the top.
- **(2)** Star count 1,036 → 2,070 across the three depth layers, radii raised, and the nearest
  layer given a faint ring of air around it. The brightest grain is held at alpha 0.62 of
  `--grey-52`, which stays below the quietest text on the page, so the field gained presence
  without crossing the line the brief draws.

**(3) not fixed, and recorded rather than quietly dropped.** Every fix available for it either
breaks the brief's own rule that the names run edge to edge of the frame — a bled line, a rotated
line, a line set short — or puts a mark next to the letters that is not a letter, which the brief
forbids outright. The asymmetry this page has instead is the amber origin row against eight white
ones, and the fall-off of the ladder.

## Inspection results

Run against the rendered screen at 840×1120, 1440×900, and 360×640.

### rules/tokens.md

| Count | Result |
|---|---|
| Applicable entries unfilled | 0 — maximum content width, symbol set, springs, currency and date formats each recorded as not applicable with a line |
| Type-scale steps missing weight or letter-spacing | 0 |
| Steps missing a stated width (family carries a width axis) | 0 |
| Steps over columns of numbers with no figure treatment | 0 — `map/distance` states tabular |
| Declared families sharing a classification | 0 — one family |
| Springs named / ease-out curves named | 0 / 1 |
| Values this pass needed and not written back | 0 |
| Gradient entries with no reason | 0 — the declaration states none, and none is rendered |
| Colour values with no stated job | 0 |
| Values hard-coded per theme | 0 — one theme, stated as such |
| Symbol sets named | 0, and the interface draws no icons |

Checks. **Typeface:** Archivo was chosen for its width axis, which is what lets one family be
condensed at 134 px and normal-width at 13 px without a second family arriving to do it; a reason
that would not hold for a product with only one type size. **Accent:** of the three places an
accent earns, this screen has none — no action, no selection, no progress — so it is spent on the
map's origin instead, and the recorded exception says so; nothing else on the page takes it.
**Radius sentence:** read back — nothing on this surface is a container, an action, or an input,
and the one edge on the page is the frame's. **Fallback stack:** rendered with
`fonts.googleapis.com` and `fonts.gstatic.com` mapped to `127.0.0.1`
(`.design/captures/state-webfont-blocked-840.png`). The first frame is the same map, correctly
solved, set in Helvetica at normal width — the names are wider per letter so the tracking comes out
tighter, and nothing clips or reflows when Archivo lands.

### rules/anti-slop.md

| Count | Result |
|---|---|
| Accent hues rendered | 1 |
| Grey families | 1, cool |
| Tinted near-blacks standing in for black | 0 — the ground is `#000000` |
| Typeface families in the flow | 1 |
| Words emphasised by a switch of family | 0 |
| Display sizes rendered on one screen | 1 |
| Text blocks past the 72-character cap | 0 |
| Scrolling surfaces wider than the max content width | 0 — not applicable, recorded |
| Radius values outside the scale | 0 |
| Shadow values outside the declared scale | 0 — `--halo` is the only one and it is declared |
| Spacing values off the base unit | 0 |
| Colour, radius, shadow, spacing literals in sources | 0 — the canvas reads `--star-warm`, `--grey-52`, `--grey-70` off the root, and the solver reads the row gap and the caption gap off the computed style |
| Gradients with no written reason | 0 — none rendered |
| Translucent blurred materials | 0 |
| Glows, sparkles, celebration effects | 0 |
| Icons from outside the declared set | 0 |
| Emoji in chrome / in content | 0 / 0 — searched the pictographic ranges, no hits |
| All-caps label styles | 1, and the declaration records why |
| Glyphs appended to link and action text | 0 |
| Headings emphasised on a fragment | 0 |
| Numbered sets whose ordering cannot be stated | 0 — the map is an `ol` ordered by distance from Earth, nearest first, and it renders no visible numbers |

Checks. **Closest match among the looks frontend-design lists:** the second one, a near-black
ground with a single bright accent. What settled that axis is the brief's own line — a living
starfield behind the type, one theme only — and the accent is amber rather than the acid green or
vermilion of the cluster, chosen from the light observatories use in their domes. **Eyebrows:**
none. **Numbered sets:** one, the map, ordering principle stated above. **Dividers and borders:**
none. **Palette, material, layout skeleton:** palette from the subject and recorded in the
declaration; material is a single plane with no material at all; skeleton from the SpaceX walk —
one enormous line with a small readout beside it — recorded in the study table. **The one element
the screen is built around:** the ladder of nine names. Nothing else on the page is above 15 px.

### rules/layout.md

Structure, declared: **flow**. Content stacks in reading order — masthead, map, colophon — and the
width is stopped by the viewport minus an 8 px inset, which is what "edge to edge of the frame"
means here. The only running text, the masthead subtitle and the colophon, is capped at 72
characters inside that.

Reflow, declared per region: the **masthead** stacks below 560 px, title over subtitle, and the
subtitle goes flush left. Each **caption** stacks below 560 px, distance over descriptor, both
flush left. The **map** never wraps and never hides: it re-solves its type against the new frame
width, and where the frame is too short to hold nine rows above the 0.75 floor it scrolls
vertically. Nothing hides at any width.

| Count | Result |
|---|---|
| Surfaces with no declared structure | 0 |
| Regions with no declared reflow behaviour | 0 |
| Distinct left edges within one column, no stated reason | 1 — everything sits on the 8 px inset |
| Edges meant to be shared that differ | 0 — all nine names are solved to the same two edges, which is the point |
| Groups whose internal gap is equal to or larger than the gap separating them | 0 — 8 px inside a row, 24 px between rows |
| Controls styled as primary | 0 — the screen only presents |
| State captures promoting a different element to primary | 0 |
| Regions hiding on the narrow display with no alternative route | 0 |

Checks. **Reading order against visual weight:** intended — the nine names, then the captions, then
the masthead, then the colophon; by size and contrast — the nine names (134–30 px, `--name`), the
captions (13 and 12 px, `--grey-70` and `--grey-52`), the masthead (15 px, `--grey-52`), the
colophon (11 px, `--grey-52`). The two lists agree except that the masthead is 15 px against the
captions' 13, which puts it one step heavier than its reading position; it is held there because a
page title below its own body copy reads as a mistake, and the gap is one step, not an order of
magnitude. **Primary action:** none; the screen presents. **Optical centring:** nothing is centred
beside a label; the only vertical alignment is the caption's two items on a shared baseline.
**Density:** the job is one long look at one image, not scanning a list, so the spacing serves the
decision — nine rows fill the frame and nothing is packed.

### rules/states.md

| State | Status |
|---|---|
| Loading | **Designed and captured.** The only asynchronous thing on the page is the webfont. The map is solved against whichever face resolved first and re-solved when Archivo lands, so the loading state is a complete, correctly-solved map in Helvetica rather than a blank or a skeleton — `state-webfont-blocked-840.png` is that frame, forced by mapping both font hosts to `127.0.0.1` |
| Empty | **Not applicable.** The map's nine rows are in the document. There is no collection, no filter, and no query, so there is no container that can come back holding nothing |
| First run | **Not applicable.** Nothing is stored, no account exists, and no preference is read. Every visit renders the same page, so a first visit and a thousandth are the same capture |
| Error | **Not applicable beyond the font.** The page makes one request, for the webfont, and its failure is the loading capture above — the fallback stack renders and the map re-solves. There is no other request that can fail and therefore no error surface |
| Long content | **Tested.** Every name padded to three times its length and one unbroken 60-character token substituted: the solver caps the size at `frameWidth / (unitWidth + 0.03 × letters)`, so a longer name comes out smaller and still spans exactly the frame. Nothing clipped, overlapped, or left the layout |

| Count | Result |
|---|---|
| Applicable states with no capture | 0 |
| States with neither a capture nor a written exemption | 0 |
| States over a colored or elevated surface with no second-theme capture | 0 — one theme, declared |
| Captures showing defaulted content | 0 |
| Text regions with no declared overflow behaviour | 0 — names never wrap and are solved to fit; captions wrap; the colophon wraps; the map scrolls past capacity |
| Elements that clip, overlap, or leave the layout at the narrowest width | 0 at 360 px |
| Text contrast below 4.5:1 body / 3:1 large | 0 — `--name` 19:1, `--origin` 12.7:1, `--grey-70` 9.8:1, `--grey-52` 5.9:1, all on `#000000` |
| Focusable controls with no visible focus | 0 — there are none |
| Tap targets below the minimum | 0 — there are none |

Session interruptions, performed: **tab away and back** — the page holds nothing in progress and
returns unchanged, with the starfield continuing from where the clock is. **Reload** — nothing is
persisted and nothing claims to be. **No connection** — the webfont request fails, the fallback
stack renders, the map re-solves; the failure is visible as a different face, not silent, and
nothing else on the page needs the network. **Repeated presses** — there is no control to press
twice.

Response thresholds: cold start to first paint of the solved map, measured in headless Chrome on
this machine, under 400 ms from navigation including the webfont over the network. No keystroke
threshold applies; the page accepts no typing.

### rules/motion.md

| Count | Result |
|---|---|
| Animations with no band, or more than one | 0 — two animations, each with one band |
| Custom animation code in the hundred-times-a-day band | 0 |
| Finger-driven surfaces on fixed timing, or time-driven played as a spring | 0 |
| Overshoot on motion no finger threw | 0 |
| Purposes outside the six | 0 — explanation, delight |
| Declared durations over 300 ms with no gesture | 0 — the reveal is 260 ms |
| Durations under 200 ms or over 150 ms for their band | 0 |
| Entrances that ease in | 0 |
| Entrances opening from nothing | 0 — each row opens at `scale(0.95)` behind a fade |
| Staggers running past the eighth item | 0 — the stagger stops at the eighth, and the ninth row arrives with it |
| Non-gesture entrance animations on one screen | 1 |
| Spatial animations with no cross-fade fallback | 0 |
| Elements that translate, scale, or slide under reduce-motion | 0 — verified by rendering the whole page with `--force-prefers-reduced-motion`; the reveal is opacity only and the starfield paints one frame |

**Not run: the recorded verification and its frame-rate reading.** rules/motion.md requires a
recording of the flow and a measured frame rate, and neither was produced. The Chrome extension
this session had available did not connect, and the headless capture path used here takes single
frames: it cannot record, and worse, a continuous `requestAnimationFrame` loop pins Chrome's
virtual clock, which is why every capture in this record was taken with
`--force-prefers-reduced-motion` and the starfield paused. So the reveal and the drift have been
read from single frames and from the source, not watched. **This Inspection is open.**

### rules/a11y.md

| Count | Result |
|---|---|
| Operable controls with no accessible name | 0 — there are no operable controls |
| Icon-only controls whose name does not say what they do | 0 |
| Controls whose accessible name omits their visible label | 0 |
| Informative images with no description, decorative ones exposed | 0 — the starfield canvas is `aria-hidden="true"`, and it depicts nothing the text does not say |
| Meanings carried by colour alone | 0 — the origin row is amber and also reads `0 light-years` and `where you are standing` |
| Modals mishandling focus | 0 — there are none |
| Operations reachable by pointer but not keyboard | 0 — there are none |
| Focusable elements out of visual order | 0 — there are none |
| Outcomes with no announcement | 0 — the reader performs no actions |
| Operations reachable only through hover | 0 |

The extreme letter-spacing is applied in CSS to whole strings; the document text is
`PROXIMA CENTAURI`, not letters in separate elements, so a screen reader reads the name as a word.

**The two walks were not run.** rules/a11y.md requires a screen-reader pass and a keyboard pass on
the running screen, and neither was performed — the browser-automation path was unavailable this
session. The counts above are answerable from the rendered tree and were answered; the walks are
not, and they are **open**.

### rules/assets.md

The one thing drawn in code is the starfield. Its style system is in the declaration.

| Count | Result |
|---|---|
| Style families across the product | 1 |
| Assets made before the style system was written | 0 |
| Assets carrying baked-in text | 0 |
| Assets not viewed in both themes on their real surface | 0 — one theme |
| Assets whose focal point sits under a control | 0 |
| Assets in one set carrying different padding | 0 — one full-bleed field |
| Depicted objects that stop reading as their subject when cropped | 0 — a crop of the field with no text in frame reads as a night sky |

Checks. **At 400 percent:** the field is filled circles with no stroke, painted on `#000000`;
the anti-aliased edge of a 0.4 px dot on true black is a soft grey ring with no banding and no
seam, because there is no gradient anywhere in it. **Against the reject list:** the style has not
drifted — one family, one light, three sizes; no halo or fringe; no baked text; the composition
does not fight the layout because the field is behind everything and carries no focal point; and
it is not the layout engine's default, which would be a flat rectangle. **Product icon:** none.

### rules/copy.md

See `.design/lexicon.md` for the inventory. Every reader-visible string on the page is listed
there with its location and role.

| Count | Result |
|---|---|
| Distinct phrasings per intent | 1 |
| Actions whose verb changes | 0 — no actions |
| Labels naming an internal mechanism | 0 |
| Praise adjectives | 0 |
| Filler tokens | 0 |
| Strings in title case | 0 |
| Banned strings | 0 |
| Error strings with an apology or no next move | 0 — no error strings |
| Undefined terms outside the audience's vocabulary | 0 — `light-years` written in full, used after the masthead explains the ordering |
| Numeric strings assembled by hand | 0 — `Intl.NumberFormat`, grouped below one million and long-compact at or above it |
| Quantities of one kind rendered two ways | 0 |
| Layouts breaking under strings padded three times | 0 |
| Sentences assembled by joining fragments | 0 |
| Action strings absent from the lexicon | 0 |

### rules/navigation.md and rules/forms.md

**Not applicable, recorded.** The page has no second screen, no modal, no sheet, no overlay, no
link, and no back path; and it accepts no typing, so it has no field, no validation, and no
submission.

## What is open

- The motion recording and its frame-rate reading (rules/motion.md).
- The screen-reader walk and the keyboard walk (rules/a11y.md).

Both need a driven browser rather than a single-frame headless capture. Everything else in this
record was run against the rendered screen.
