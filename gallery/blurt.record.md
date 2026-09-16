# BLURT — design record

## Study record

Six references, all seen as pixels. Captures live in `.design/captures/refs/`.

| # | Reference | Pixels seen how | What it settled |
|---|---|---|---|
| 1 | Sticker Mule, die-cut stickers product page | Capture, `stickermule.png` | The burst composition itself: a dozen die-cut stickers scattered at different angles, overlapping, thinning toward the frame edge, photographed under one hard light from the upper left. This is where the screen's whole material read came from |
| 2 | The same photograph at 400 percent, cropped to one sticker's edge | Capture, `stickermule-edge-400.png` | What a kiss-cut border actually is: not an outline, but a visibly layered stack of paper plies, warm rather than pure white, following the silhouette at a constant offset and rounding every concavity. Also that the artwork inside carries its own dark keyline set in from the cut edge, and that the contact shadow is short and dense rather than spread |
| 3 | LINE STORE, sticker shop home | Capture, `linestore.png` | That a sticker set is sold as one artist's set, not as an icon library, and that the words are part of the art — the thumbnails carry handwritten Japanese one-word bubbles baked into the drawing |
| 4 | LINE STORE, walked: top creators list → `FRIC 28` set detail → the set's grid | Walk, three captures `line-walk-1-list.png`, `-2-detail.png`, `-3-grid.png` | The one reference walked as a running flow. A set is roughly forty items, every one the same character in a different state, every one a character rather than a symbol, on a plain ground with no container around it. Forty-eight was chosen off this. It also settled the face vocabulary: one artist's set varies the mouth and the pose, never the eyes |
| 5 | Dribbble, "sticker pack" gallery | Capture, `dribbble.png` | The dense-overlap pile as a composition — the OVCHARKA tile in particular, where a saturated ground, thick white cut borders, hard rotation variance, and one-word labels stacked into a single mass read as one object at thumbnail size. It confirmed the sky has to be saturated: on a pale ground the white borders disappear |
| 6 | Telegram, home | Capture, `telegram.png` | That stickers have to survive being small and sitting on a colored ground, and that the platform's own presentation gives them no container and no shadow beyond a contact shadow |

Adopted patterns and where each came from:

- Warm, thick, constant-offset kiss-cut border with a stack read → reference 2.
- Hard 10 o'clock light, short dense contact shadow → references 1 and 2.
- Handwritten one-word bubble inside the die-cut silhouette → references 3 and 4.
- Forty-eight subjects, one face vocabulary, one artist → reference 4.
- Saturated ground under white-bordered stickers, heavy rotation variance, overlapping pile → reference 5.

Nothing was reproduced. What was taken is the material and the density; the subject set, the sky,
the chrome logotype and the marble are this product's.

### Rejected while planning

- A pale cream or off-white board with the stickers scattered on it. This is the shape the
  reference photographs actually take, and on screen it collapses: the white kiss-cut border is the
  material's whole signature and it vanishes against a pale ground (reference 5 is the evidence).
  The saturated noon sky exists to keep that border visible.
- A neat grid of stickers. It is what references 3, 4 and 6 all do, because they are stores. A
  store has to make forty items comparable; this screen has to make them feel thrown.
- A flat two-color vector style for the subjects. Cheaper to draw and it reads as an icon set,
  which is the one thing the product is claiming not to be.
- A pill-shaped primary button under the logotype. It would have been the fourth thing on the
  screen wearing a rectangle, and it would have made the marble decorative. The marble is the
  button.
- A second display line — a tagline at display size under the logotype. It splits the focal point
  a burst composition exists to build.

## Plan, after review against the brief

The generic answer to "sticker app onboarding" is a pale cream board, a rounded-rectangle hero
card, a grid of stickers fading and sliding up in sequence, and a gradient pill reading `Get
started`. Every part of that was replaced, and why is in the rejected list above.

Closest look among the ones frontend-design names: none of the five exactly, and the nearest
risk was the SaaS-card kit, which was avoided by putting no rectangle on the screen at all except
the reduce-motion caption plate. What settled the palette is reference 5 plus the material
constraint from reference 2; what settled the material is reference 2; what settled the layout
skeleton is reference 1.

The one element the screen is built around: the chrome balloon logotype at the centre. The marble
is deliberately smaller, lower, and the only object wearing the accent, so it reads as the one
thing to press without competing for the centre.

## The hero beside the reference

`.design/captures/compare-vs-reference.png` — my settled board at 840 px next to the Sticker Mule
die-cut page, the strongest thing studied. Three ways mine was weaker, judged at the size it gets
seen:

1. **The cut border had no thickness.** In the photograph the white kiss-cut edge is a stack of
   paper plies with a side wall that catches light; mine was a flat white outline. At 840 px the
   reference's stickers read as objects with height and mine read as decals.
2. **Every contact shadow was identical.** In the photograph each sticker sits differently — some
   flush, some lifted along one side — so the pile has variation. Mine applied one shadow to all
   forty-eight, which flattens the pile into a single plane.
3. **The value range was compressed.** The photograph has real darkness where stickers overlap and
   bright specular on the ones on top. Mine was uniformly mid-bright, so the mass had no depth.

Fixed the two that matter at 840 px:

- **(1)** Each sticker now draws its silhouette three times before the artwork — `#9E9484` offset
  2.6, `#D8CFBE` offset 1.3, then `--paper` — so the cut edge has two visible plies and a side wall.
- **(3)** The shared paper light was deepened from `ink .11` to `#1B2E4E .22` at its dark end, and
  the contact shadow split into `--e1` tight and dense plus `--e2` ambient. The pile now runs from
  near-white on the top edges to a real shadow where stickers overlap.

**(2)** was left. It is the truest of the three, and the honest fix is per-sticker shadow variation
driven by the curl's side; it does not show at 840 px next to the other two, and it would have been
a fourth pass over all forty-eight.

## Inspection results

All run against the rendered screen at 1680 × 1050 and 390 × 844, plus one end-to-end recording.
Scripts and output in `.design/harness/`, captures in `.design/captures/`.

### rules/tokens.md

| Count | Result |
|---|---|
| Applicable entries left unfilled | 0. Four entries are recorded not applicable with a reason: symbol set (no icons drawn), number and date formats (none rendered), maximum content width (the surface does not scroll), serif measure (no serif declared) |
| Type-scale steps missing a weight or letter-spacing | 0 |
| Steps missing a width, counting families with a width axis | 0 — neither family carries one |
| Steps over columns of numbers with no figure treatment | 0 — no numeric columns |
| Declared families sharing a classification | 0 — rounded display sans, and handwriting |
| Springs named where motion follows a finger | Not applicable: nothing here follows a finger. Two are named anyway, under recorded exception 2 |
| Ease-out curves named where motion is time-driven | 1 |
| Values this pass needed and did not write back | 0. Three were amended into the declaration during the pass: the two ply greys, the three elevation values as they are actually realised, and the sky ramp's interior stops |
| Gradient entries carrying no reason | 0 of 4 |
| Color values carrying no stated job | 0 |
| Values hard-coded per theme | 0 — one theme, by decision |
| Symbol sets named | 0, and the interface draws no icons |

Checks. **Baloo 2**: chosen because it is drawn as a pressurised object rather than a written one,
which is what lets chrome read as an inflated balloon instead of a metal effect on a normal face —
no other brief would pick it. **Shantell Sans**: one person's marker hand with a live bounce axis,
so forty-eight words read as written by the artist who drew the stickers rather than typeset over
them. **The accent**: of its three places only the primary action exists here; the marble is the
only object wearing `#FF5B24` and nothing else takes it. **The radius sentence**: the marble is the
circle (`--r-full`), the cloud's lumps are the same circle, `--r-md` is the reduce-motion caption
plate, `--r-sm` is unused and declared so a second screen does not invent one. Measured radii on
the running page: `9999px` and the circle token, nothing else. **Fallback stacks**: rendered with
`fonts.googleapis.com` aborted — `.design/captures/no-webfont.png`. The first frame keeps the
layout, the chrome, the sky and every sticker; the logotype falls to Trebuchet MS and still reads
BLURT in chrome, the handwriting falls to Comic Sans MS. Nothing reflows.

### rules/anti-slop.md

| Count | Result |
|---|---|
| Accent hues rendered in the UI | 1 |
| Grey families | 1, warm |
| Tinted near-blacks standing in for black | 1 — `--ink`, recorded exception 8 |
| Typeface families in the flow | 2 |
| Words emphasized by a switch of family | 0 |
| Display sizes rendered on one screen | 1. The measurement query returns 0 for the DOM because the display step is SVG text; the logotype is the one occurrence |
| Text blocks past the declared 48-character cap | 0 — the one line measures 34 |
| Scrolling surfaces past the maximum content width | 0 — the surface does not scroll |
| Radius values outside the declared scale | 0 |
| Shadow values not in the declared elevation scale | 0 — the marble now reads `var(--e3)`, and `#cast` carries `--e1` and `--e2` |
| Spacing values not a multiple of 4 | 0. Sticker coordinates are artwork, placed by the burst's density function, and answer to `.design/artwork.md` |
| Color, radius, shadow and spacing literals instead of token references | 0 outside artwork; artwork literals answer to `.design/artwork.md`, whose palette is lifted from the declaration |
| Gradients with no written reason | 0 of 4 |
| Translucent blurred materials with no declaration entry | 0 — nothing on this screen uses one |
| Glows, sparkles or celebration effects outside a rare first-time moment | 0 — one compression ring, on a first run, recorded exception 7 |
| Icons rendered from outside the declared symbol set | 0 — no icons |
| Emoji in chrome / in content | 0 / 0, measured by property search over the rendered document |
| All-caps label styles | 0 — the logotype is a drawn mark, recorded exception 10 |
| Glyphs appended to link and action text | 0 |
| Headings whose emphasis lands on a fragment | 0 |
| Numbered sets whose ordering principle cannot be stated | 0 — there are none |

Checks. **Closest look among the ones frontend-design names**: the nearest risk was the SaaS-card
kit, and it was settled by putting no rectangle on the screen at all — the only one left is the
reduce-motion caption plate. **Eyebrows**: none. **Numbered sets**: none. **Dividers and borders**:
none; the kiss-cut border is the depicted edge of a printed object, not a rule. **Palette,
material, layout skeleton**: reference 5, reference 2, reference 1, each written in the study
record. **The one element the screen is built around**: the chrome logotype. The marble is smaller,
lower, and the only thing wearing the accent, so it reads as the thing to press without competing.

### rules/motion.md

Every animation sits in the "once, or near enough" band: this is a first run, met one time. Written
out with its band before counting.

| Count | Result |
|---|---|
| Animations with no band, or more than one | 0 |
| Custom animation code in the hundred-times-a-day band | 0 |
| Finger-driven surfaces on fixed timing, or time-driven played as a spring | 0 — nothing follows a finger; the springs on time-driven motion are recorded exception 2 |
| Overshoot on motion no finger threw | Recorded exception 2 |
| Animations whose purpose is not one word | 0. The entrance is *delight*; the press answer is *feedback*; the sticker leaving on a press is *state change* |
| Dismissal thresholds committing on distance alone | 0 — there are none |
| Durations over 300 ms with no gesture and no reason | Recorded exception 1 |
| Press feedback outside 100–150 ms, or firing on release | 0 — 120 ms, on `:active`, which fires on press-in |
| Press answers off the vocabulary | 0 — the button scales to 0.97 |
| Entrances that ease in | Recorded exception 3, the slam only |
| Entrances opening from nothing rather than 95 percent | Recorded exception 4 |
| Exits longer than seven-tenths of their entrance | 0 — the send-off runs 280 ms against the 880–1300 ms entrance |
| Staggers running past the eighth item | Recorded exception 5 |
| Menus and popovers not growing from what summoned them | 0 — there are none |
| Shared elements changing radius or aspect ratio mid-transition | 0 |
| Content meeting a translucent bar at a hard clip | 0 — there is no bar |
| Non-gesture entrance animations on one screen | Recorded exception 9: one sequence, one origin, nine staged parts |
| Spatial animations with no declared cross-fade fallback | 0 |
| Non-visual feedback firing more than once per action | 0 — the channel is not used |
| Outcomes reported through touch or sound alone | 0 |
| Elements that translate, scale or slide under reduce-motion | **0, measured.** The harness walks every animation on every element through `getAnimations()` and compares keyframe `transform` values; it reports none that vary |

**Frame rate, read off a measurement.** A `requestAnimationFrame` sampler runs inside the page and
the intervals are taken over the entrance window, 1100 ms to 3300 ms. Three runs at each setting,
Chrome 154, 1680 × 1050:

| CPU | Median | Worst frame | Frames over 20 ms |
|---|---|---|---|
| 1× | 59.9 fps in all three runs | 16.9 / 17.0 / 17.1 ms | 0 / 0 / 0 of ~129 |
| 4× throttle | 59.9 fps in all three runs | 33.5 / 33.4 / 50.1 ms | 13 / 9 / 8 of ~119 |
| 6× throttle | 59.9 fps in all three runs | 666 / 583 / 650 ms | 21 / 20 / 23 of ~55 |

Sixty is held clean at 1× and holds its median at 4× with a long frame every ten or so. At 6× it
comes apart. **The declared floor is therefore 4× throttle relative to this machine, and the 6×
result is recorded rather than hidden** — below that floor the entrance stops reading as motion.

Getting there took one real fix, found by measurement rather than by eye: the sticker contact
shadow was a CSS `drop-shadow` on the wrapper that the launch animation transforms, which
re-rasterised forty-eight subtrees every frame. Baking it into each sticker's own SVG took the
1× drop rate from 5.4 percent to 0.

**The recording.** One take at 1280 × 800: full entrance, then the marble pressed, then pressed
twice more faster than the send-off finishes, then Tab to focus and Enter to activate, then the
viewport dropped to 390 × 844 mid-session. `.design/captures/video/`, frames pulled at
0.55 / 1.05 / 1.35 / 1.55 / 2.10 / 3.10 s into `.design/captures/frames/`.

Two defects the frame-by-frame pass turned up, and what became of them:

- **The whole board was visible before the impact.** `animation-fill-mode: both` with a delay
  applies the `from` keyframe through the delay, so all forty-eight stickers and the logotype sat
  at twelve percent scale in the middle of the frame for the entire descent and the anticipation
  beat. It gave the trick away. Fixed: a 1 ms `reveal` opacity animation carrying the same delay,
  with `opacity: 0` as the base. The frame at 1.05 s now shows the marble alone, hanging.
- **The marble lost its centring at the moment it travelled.** `@keyframes travel` set `transform`
  outright, dropping the `translate(-50%,-50%)` that centres the button — so from 1670 ms the
  marble sat half its own width right and half its height low, and every keep-out computed around
  it was off by the same amount. Fixed by carrying the centring through both keyframes.

No wrong frame is left in the recording.

### rules/layout.md

Run at the widest supported width, 1680 × 1050, and the narrowest, 390 × 844
(`hero-1680.png`, `narrow-390.png`). One primary job: press the marble. One primary action, and it
is the only control. At 390 the logotype takes a larger share of the width by design, the line
wraps to two, and the marble drops below both with real clearance — the keep-out is computed from
the line's measured box rather than from a constant, which is what the narrow pass forced.

### rules/states.md

Exemption, recorded: this screen loads no data, has no empty condition, no failure path, no
long-content surface and no typing. It is one fixed composition with one control. The states that
do apply are covered above — first run is the screen itself, and the press answer is verified in
the recording. Cold start to first accepted input: the marble is hit-testable from first paint;
the entrance does not gate it.

### rules/navigation.md

One screen, no modal, no sheet, no overlay, no one-way door, nothing a link can open. Back is the
environment's, and there is no history entry to return through.

### rules/copy.md

Three interface strings, one intent each, inventory in `.design/lexicon.md`. The intent that can
drift — entering the app — has one phrasing, `send your first one`, and it is the same string in
the visible caption and in the accessible name, because the caption *is* the button's content.
Banned generics checked and absent: `Get started`, `Continue`, `Let's go`, `Submit`. No numbers, no
dates, no appended glyphs, no all-caps outside the drawn logotype.

### rules/forms.md

Not applicable: the screen accepts no typing.

### rules/assets.md

| Count | Result |
|---|---|
| Style families across the product | 1 — paper collage |
| Assets made before the style system was written | 0 |
| Assets carrying baked-in text or a watermark | 0. The one handwritten word is the artwork's own content, specified in the style system before any sticker existed |
| Assets not yet viewed in both themes on their real surface | Not applicable — one theme, and every sticker was composed against `#3E9BF5`, the sky value at the composition's centre |
| Assets whose focal point sits under a control or clips at a safe-area boundary | 0 — the keep-outs are computed from the marble's and the line's measured boxes |
| Assets in one set carrying different padding | 0 — every sticker is drawn in the same 132-unit box with the same `-8 -6 148 148` viewBox |
| Depicted objects that stop reading as their subject when cropped | 0 of the eight checked |

Checks. **The four entries**: style family, palette, light and texture, subject grammar — all
written in `.design/artwork.md` before the first sticker. **At 400 percent against the real
surface** (`crops-400.png`, eight of the set rendered alone on `#3E9BF5` with the bubble
suppressed): the cut edge is clean, two plies visible, no halo, no fringe, no seam between the
white border and the sky, and no banding in the paper light. **The reject list**: no drift — one
light, one line weight, five inks; nothing glossy except the marble, which is not a sticker; no
bare geometric primitive in the set. **Cropped to itself with no text in frame**: the eight read as
a to-go cup, a slice of toast, a fried egg, an onigiri, an avocado half, a banana, a frosted
doughnut, a bowl of ramen. **Product icon at small size**: not applicable, this screen ships none.

### rules/a11y.md

- One focusable element, measured: `BUTTON` with the accessible name `send your first one`,
  163 × 189 px, far past the tap-target floor.
- The visible label and the accessible name are the same string, so the two channels agree.
- The board carries an image description naming what it is and what it is doing; its children are
  hidden from assistive technology so forty-eight stickers do not arrive as forty-eight nodes.
- The logotype is an `h1` whose text is available to a screen reader and whose SVG is hidden, so
  BLURT is announced once and not four times.
- Contrast, measured: the line 16.3 : 1 on the cloud it sits on, the marble's label 11.5 : 1 on the
  palest sky beneath it. Both past 4.5.
- Color is not the sole carrier of anything: the one control is also the only round object, the
  only glossy object and the only labelled object.
- Focus: visible ring captured in `focus-ring.png` — 4 px `--paper`, offset 8, following the
  circle.
- **Pointer put away**: Tab reaches the control and Enter activates it; the send-off plays. Walked
  in the recording.
- Reduce-motion: verified programmatically, above.

## What is still open

- Per-sticker contact-shadow variation, the third weakness against the reference, is not done.
- The frame-rate floor is 4× CPU throttle. Below it the entrance degrades; that is recorded rather
  than engineered around.
