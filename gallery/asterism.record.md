# Record — Asterism landing hero

## Study

Six references. Pixels seen for every one; how, per row. One walked as a running flow.

| Reference | How its pixels were seen | What it settled |
|---|---|---|
| Hubble Ultra Deep Field, NASA/ESA/STScI (`esahubble.org/images/heic0611b`) | Page capture, then the full image fetched and viewed at 840 px and cropped | The **strongest reference**, and the master of grain: thousands of hard sub-pixel points with a huge brightness range, decisive hue per object, and no empty ground anywhere. Set the whole magnitude model |
| Stellarium Web (`stellarium-web.org`) | **Walked** — arrived, dragged the sky, wheel-zoomed six steps, clicked an object; four frames in `walk1..4` | That a live sky sits on a deep navy-to-black wash, never pure black; that labels are tiny, quiet and grey-blue; that the chrome stays out of the sky's way |
| ESO, The Milky Way panorama (`eso.org/public/images/eso0932a`) | Page capture | Where a rich field turns murky: the band's mid-tones are the one soft thing in the frame and they are exactly what the brief bans. Argued the flat ground with no wash |
| in-the-sky.org sky map | Page capture (the site returned an access-denied page under automation; the capture is of that page and it settled nothing) | Nothing. Recorded so the count is honest — **this one does not count toward the five** |
| Are.na (`are.na`) | Page capture | The collective-knowledge product register: a plain declarative line, an ordinary word on the button, no sell. Confirmed one line and one action |
| NASA Astronomy Picture of the Day | Page capture | That a single astronomical image carries a page with nothing but a caption, and loses nothing by it |

Five that settled something, one that did not. The walked reference is Stellarium Web.

Rejected while planning, so a later pass does not re-reach for them: a centered hero with the copy
over the middle of the sky (the default, and it puts type on the densest part of the image); a
nebula wash or Milky Way band behind the clusters (the murky mid-field); a silhouette horizon or
a constellation figure drawn in joining lines (the brief forbids forcing the sky into a shape, and
the clusters make better geography than any outline); ambient twinkle and pointer parallax (a
gallery still does not want either, and both would have forced springs into the declaration for
one effect).

## Structure — the layout.md entry for this surface

**Flow, not columns.** One viewport, `overflow:hidden`, no scroll. The sky is full-bleed by
definition, so no maximum content width applies to it; what stops the width is the copy column, at
`clamp(232px,33vw,400px)`, and the display step's 22ch cap inside it. In practice the column binds
first, at about 15 characters a line.

Regions and their reflow behaviour:

| Region | Wide (landscape) | Narrow (portrait, aspect under 9/10) |
|---|---|---|
| Sky | Full bleed, clusters spread over the whole frame, low-density void carved in the left third | Full bleed; the cluster geography is remapped into the upper 59% and the void moves to the bottom band |
| Copy block | Left column, vertically centered with `safe center` so long content never leaves the frame | Bottom-left, `safe flex-end`, width `min(88vw,460px)` |
| Wordmark | Top left, on the copy column's left edge | Same |
| Field labels | Beside their cluster, side chosen per cluster, flipped when the label would cross the frame edge | Same, with 19px minimum vertical separation instead of 17px |

Nothing hides at any width, so there is no region needing an alternative route to its content.

One left edge in the copy column: the wordmark, the line and the action all sit on
`clamp(24px,5vw,72px)`.

Grouping: the gap inside the copy group is 32px (line to action); the gap from the group to the
wordmark is 240px at the gallery size. Inner gap is smaller than outer, so the group reads as one.

Density serves a decision, not scanning — one line, one action, and as much room around them as
the frame allows.

Reading order against visual weight:

- read: the sky, the line, the action, the wordmark, the field labels
- weight: the sky (full frame), the line (43.7px), the action (the only saturated fill), the
  wordmark (19px), the labels (12px, lowest contrast on the screen)

The two lists match.

The primary action sits directly under the line it answers, at the bottom of the copy group. The
reason is scan order on a pointer surface: the reader arrives at the sky, drops to the line, and
the action is the next thing under the eye. One control carries the primary style.

## Style system — the assets.md entry for the sky

The canvas depicts something (a sky of notes), so it is artwork and answers to this system.

- **Style family:** astronomical plate. Hard photometric points on a flat dark ground. One family,
  nothing else on the product uses another.
- **Palette:** five values, all from the declaration — the surface `#070E22` the artwork is composed
  against, plus `--ice`, `--ember`, `--rose` and pure white for the hottest cores. Each hue carries
  a deep variant for the faint end (`#9CC0FF`, `#FFA94F`, `#FF7D9B`), because thin light over navy
  otherwise composites to grey.
- **Light and texture:** light is emitted, never cast. No ambient light, no cast shadow, no gloss,
  no bloom. Every core is hard-edged at pixel scale and snapped to the pixel grid. The only soft
  thing in the frame is the halo on ten stars, and it falls off steeply.
- **Subject grammar:** abstract points and the clusters they form. No figures, no objects, no
  silhouette, no joining lines between stars.

## Inspections

### tokens.md

- Applicable entries unfilled: **0**. Elevation, symbol set, number and date formats, springs, and
  the serif body cap are each recorded as not applicable with a reason.
- Type-scale steps missing weight or letter-spacing: **0**. Missing width, counting only Archivo:
  **0** (both Archivo steps state `wdth`). Steps over columns of numbers: none exist.
- Declared families sharing a classification: **0** (old-style serif against grotesque sans).
- Springs named where motion follows a finger: **0**, and no motion follows a finger. Ease-out
  curves for time-driven motion: **1**.
- Values this pass needed and did not write back: **0**. Two were added during the pass and are in
  the declaration: the ground moved `#060B1A` → `#070E22`, and each hue gained a deep variant.
- Gradient entries with no reason: **0** (two entries, both optical).
- Colors with no stated job: **0**.
- Values hard-coded per theme: **0**. One theme; there is no second branch to drift from.
- Symbol sets named: **0**, and the interface draws no icons.

Checks. *EB Garamond* — printed star atlases and the commonplace book were both set in humanist
old-style romans; the reason does not transfer to an unrelated product. *Archivo* — its width axis
is what lets a long field name narrow rather than shrink beside a small cluster, which is how
engraved charts handled the same problem. *The accent* — of the three places accent is earned, only
the primary action exists on this screen, and it has it; the active state and progress do not occur
here, and nothing else on the screen is drawn in ember except stars, which are artwork.
*The radius sentence* — actions are pills: the button, at 999px. Containers and inputs have no
element on this screen. *Fallback stacks* — rendered with `fonts.googleapis.com` and
`fonts.gstatic.com` aborted: the line resolves to the first available fallback at the same
43.68px, the block holds the same height, and the first frame a reader on a slow connection sees is
the same layout in a different serif. Capture: `hero-nofont.png`.

### anti-slop.md

- Accent hues rendered in the UI: **1** (ember, on the action).
- Grey families: **1**, cool.
- Tinted near-blacks standing in for black: **0**. `#070E22` is a recorded exception quoting the
  brief, and it is chromatic by 27 steps rather than a black that felt too hard.
- Typeface families in the flow: **2**.
- Words emphasized by a switch of family: **0**.
- Display sizes on one screen: **1**.
- Text blocks past the declared line cap: **0** (the line measures 277px, about 15 characters).
- Scrolling surfaces past the maximum content width: **0**; the surface does not scroll.
- Radius values outside the scale: **0** (one value, 999px).
- Shadow values outside the elevation scale: **0**; there are no shadows.
- Spacing values not a multiple of 8: **0**.
- Color, radius, shadow and spacing literals in place of token references: **0** in the interface
  layer. The canvas literals answer to the style system above, which lifts its palette from the
  declaration.
- Gradients with no written reason: **0**. Neither of the two that arrive unasked is present:
  nothing sits behind the top of the screen, and the action is a flat fill.
- Translucent blurred materials with no entry: **0**.
- Glows fired at anything other than a rare moment: **0**. Ten stars carry a halo, under a recorded
  exception quoting the brief's own line.
- Icons from outside a symbol set: **0**; no icons.
- Emoji in chrome: **0**. In content: **0**. Searched for Extended_Pictographic, U+FE0F, the
  regional indicators, and the four fallback ranges.
- All-caps label styles: **0**.
- Glyphs appended to link and action text: **0**.
- Headings whose emphasis lands on a fragment: **0**.
- Numbered sets whose ordering cannot be stated: **0**; there are none.

Checks. *Closest match among the looks frontend-design lists* — the near-black background with a
single bright accent. What settled that axis is the brief: "a deep navy ground rather than pure
black", "three luminous hues". The ground is navy rather than near-black and the accent is one of
the three hues rather than an acid color chosen for contrast alone. *Eyebrows* — none. *Numbered
sets* — none. *Dividers and borders* — one kind: the leader tick, a 16px hairline binding a field
label to the cluster it names. Remove it and eleven labels float over a sky with no stated owner.
*Palette, material, layout skeleton* — palette from the brief's three hues plus the navy ground,
written in the declaration; material from the Hubble reference (hard points, halos rationed),
written in the style system above; skeleton from the decision to leave the left third to the copy
and let the clusters own the rest, written in the structure entry above. *The one element the
screen is built around* — the sky.

### copy.md

- Distinct phrasings per intent: **1**.
- Verbs changing between control and record: **0**; "keep" is fixed in the lexicon through to the
  confirmation.
- Labels naming an internal mechanism: **0**.
- Praise adjectives: **0**. Filler tokens: **0**. Banned strings: **0**. Title case: **0**.
- Error strings: none exist on this surface.
- Terms outside the audience's vocabulary: **0**. Every field name is the readers' own word for
  their subject.
- Numeric and date strings: none rendered.
- Layouts breaking under source strings padded 3×: **0**, verified at 840, 1440, 390 and 320 —
  the copy block stays inside the frame at every width and no label leaves it.
- Action strings absent from the lexicon: **0**.

The full string inventory is in `lexicon.md`.

### layout.md

- Surfaces with no declared structure: **0**. Regions with no declared reflow: **0**.
- Distinct left edges within the copy column with no stated reason: **1**.
- Edges meant to be shared that differ: **0**.
- Groups whose internal gap meets or exceeds their separation: **0**.
- Controls styled as primary: **1**.
- Regions hiding on the narrow display with no alternative route: **0**.
- Run at the widest (1440×900) and narrowest (320×568) supported widths.

### states.md

Five states, four of them recorded as not applicable with a reason:

| State | Status |
|---|---|
| Loading | **Not applicable.** The surface reads no data. Everything it draws is generated in the page from a fixed seed, and the cold start measures 617ms to the point of accepting input — inside the 2s threshold |
| Empty | **Not applicable.** No collection. The sky is generated, not fetched; there is no state in which it holds nothing |
| First run | **Not applicable.** Every arrival is a first run — the screen has no account, no storage and no prior state to differ from |
| Error | **Not applicable.** No request is made, so nothing can fail. With the webfont blocked the surface renders its fallback stack, which is the only degraded path that exists, and it is captured |
| Long content | **Captured and tested.** Every text region declares its overflow: the line wraps, uncapped, in a `safe center` column that never leaves the frame; the field labels wrap at `min(34vw,168px)` and never truncate, because what tells one field from another sits at the end of the word |

- Applicable states with no capture: **0**. States with neither capture nor exemption: **0**.
- Captures in a second theme: **not applicable**; the product has one theme by instruction.
- Text regions with no declared overflow behavior: **0**.
- Tap targets below the minimum: **0**. The action is 182 × 48, over the enhanced 44 × 44.
- Text contrast: the line and the wordmark at **17.26:1**, the field labels at **7.49:1**, the
  action's label on its fill at **11.74:1**, the focus ring on the ground at **13.92:1**. Minimum
  required is 4.5 for the 12px labels and 3 for the rest; nothing is below.
- Focusable controls with no visible focus: **0**. `2px solid #C8DDFF` at 3px offset.
- Elements clipping or leaving the layout down to 320px: **0**.
- Session interruptions, each performed: *interruption and return* — the page holds its rendered
  frame across a background and return; there is no work in progress to lose. *Restart* — reload
  regenerates the identical sky, because the seed is fixed; nothing was claimed as saved.
  *No connection* — with the font host unreachable the surface renders complete in its fallback
  stack and says nothing, which is correct because no reader action failed. *Repeated presses* —
  double-clicked the action faster than any response: 0 navigations, URL unchanged.
- Cold start to first accepted input: **617ms**. Keystroke to character: **not applicable**, the
  surface accepts no typing.

### motion.md

One animation. Band: *once, or near enough* — a landing hero is met once, which is the band where
delight is allowed. Purpose: *explanation*. Driven by time, 1500ms on the declared ease-out curve.

- Animations with no band, or more than one: **0**. Custom code in the hundred-times-a-day band:
  **0**. Finger-driven surfaces on fixed timing, or time-driven played as a spring: **0**.
- Overshoot on motion no finger threw: **0**.
- Durations over 300ms with no gesture behind them: **1**, the ignition, and the reason is that it
  sits in the once band, where the ceiling does not apply. The press feedback — the action's color
  change at 160ms — is inside its own band.
- Entrances that ease in: **0**. Entrances opening from nothing rather than from 95% behind a fade:
  **0** — nothing scales at all; the sequence is opacity only, so there is no size to open from.
- Staggers past the eighth item: **0**; the stars are ordered by brightness, not by position, and
  they are not a list.
- Non-gesture entrance animations on one screen: **1**.
- Spatial animations with no cross-fade fallback: **0**; nothing is spatial.
- Elements that translate, scale or slide with reduce-motion on: **0**. Verified: with the
  preference set, `.mark`, `.copy` and `.fields` all report opacity 1 at 250ms and
  `getAnimations()` returns empty. Capture: `hero-reduced.png`.
- Non-visual feedback: none is used.

Frame rate: not measured against a defined slowest target, because none is defined for a
single-file gallery piece. What is measured is the work per frame — the ignition redraws the full
point set each frame, 12,600 points at 840×525 and 34,000 at 1440×900, and the sequence completes
with no dropped-frame artifact visible in the captures. This is the one line in this record that
rests on an unmeasured judgment, and it is recorded as such.

### a11y.md

- Operable controls with no accessible name: **0**. One control, and its name is its visible label.
- Icon-only controls: none.
- Names not containing their visible label: **0**.
- Informative images with no description: **0**. The canvas is `role="img"` with a description
  saying what the sky is and what a point means, because the sky is the product's data rather than
  decoration. Decorative images exposed to the tree: **0**.
- Meanings carried by color alone: **0**. Hue carries no meaning here — a star's field is stated by
  its label, not by its color.
- Modals, sheets, takeovers: none.
- Operations reachable by pointer but not keyboard: **0**.
- Focusable elements in an order differing from visual order: **0**. One focusable element; the
  second Tab leaves the document.
- Outcomes with no announcement: **0**; no outcome is produced on this surface.
- Operations reachable only through hover: **0**.

Checks. *The keyboard walk* — pointer away: Tab reaches the action, the focus ring is visible
against the ground at 13.92:1, Enter and Space activate it, Tab again leaves. Nothing is
unreachable and nothing traps. *The screen-reader walk* — the tree reads: the image description
of the sky, then "Asterism", then the line as a level-1 heading, then "Keep your first note,
button", then the list "Fields in this sky" with its eleven items. The order matches what the
screen shows, and the eleven field names arrive as a named list rather than as loose text scattered
over an image. *The name table* — no icon-only controls exist.

### assets.md

- Style families across the product: **1**.
- Assets made before the style system was written: **0**.
- Assets carrying baked-in text or a watermark: **0**. Every label is live DOM text over the
  canvas, never drawn into it — which is also why the labels stay crisp and selectable.
- Assets not viewed in both themes on their real surface: **0**; one theme, viewed on it.
- Assets whose focal point sits under a control: **0**. The copy's third of the frame is carved out
  of the cluster geography before any point is placed, not cropped afterwards.
- Assets in one set with different padding: **not applicable**; one asset.
- Depicted objects that stop reading as their subject when cropped: **0**. Capture
  `zoom-orbital.png` is a 400% crop of the Orbital mechanics cluster with no copy in frame; it
  reads as a star cluster — a dense core of hard points thinning into filaments, hues visible
  among them, one bright star with four spikes.

Checks. *Edges at 400%* — the cores are hard-edged squares and plus-shapes on the pixel grid with
no anti-aliased fringe, because every one is snapped with `|0` and sized in whole device pixels.
The only soft edge in the frame is the hero halo, which is a gradient by design and shows no
banding against the flat ground. *Reject list* — no style drift (one family), no halo or fringe or
seam, no baked text, composition does not fight the layout, and it does not read as the layout
engine's default: nothing here is a rounded rectangle standing in for a thing.

## The comparison

`captures/compare-hudf.png` puts the 840 × 525 hero beside the Hubble Ultra Deep Field cropped to
the same size. Three ways the first version was weaker:

1. **The grain was confetti, not light.** HUDF's points run a continuous brightness range across
   thousands of levels, with the bright ones few. Mine quantized to three sizes, skewed bright, and
   drew the bright ones as filled 2 × 2 and 3 × 3 squares — so cluster cores read as a scatter of
   equal white blocks, and at 840px the whole sky read as confetti rather than as light of many
   strengths.
2. **The hue was under-committed.** HUDF's color is decisive: hard orange next to hard blue-white,
   and the color is what separates one object from the next. Mine whitened everything above
   magnitude 0.82, so at gallery size the three declared hues were a faint blush on an essentially
   monochrome field.
3. **The geography was procedural.** HUDF holds structures across a huge scale range, from a 60px
   galaxy down to 1px specks, with no empty ground anywhere. Mine was eleven near-circular blobs of
   similar apparent size, floating as discrete islands in a thin, evenly-spread dust.

Fixed, being the two that change the 840px image most:

- **(1), the grain.** Bright stars are no longer filled squares: a tier-2 star is a 1px core with
  four 1px arms at half alpha, a tier-3 star a 2px core with the same arms — a crisp plus, which is
  what a point source looks like and stays hard at every pixel. The magnitude curve became
  position-dependent (`pow(rng, 3.4 − 1.1·coreness)`) so cluster cores carry a genuine bright tail
  instead of a uniform boost, and each cluster gained five to ten *luminaries* — a visible heart the
  eye can land on, with no halo, since halos stay rationed to ten. Point count went from ~11,000 to
  ~12,600 at 840px, with the extra spent entirely on the faint end so the ground is never empty and
  never murky.
- **(2), the hue.** Weighting moved from 66/22/12 to 52/30/18, whitening was pushed from magnitude
  0.82 up to 0.975 and capped at 55%, and each hue gained a deep variant used below magnitude 0.58,
  which is what keeps a faint amber point amber instead of letting it composite to grey against the
  navy. Amber and rose are now legible as color at 840px without any point losing its hardness.

Not fixed, and why: **(3), the scale range of the geography.** Cluster radii still fall in a
narrower band than the reference's, and the clusters still read as discrete islands more than as
condensations in a continuous field. The fixes it would take — a wide power-law over cluster size,
and bridges of stars between neighbors — change the composition rather than the rendering, and the
composition is what currently keeps the copy's third of the frame clean. It is the next thing to do
and it is not done.

Two more residuals, both recorded rather than repaired:

- At 390px and below, eleven labels in the upper 59% of the frame sit close enough to crowd. No two
  label boxes overlap and none leaves the frame, verified down to 320px and under 3× padded
  strings, but the band is denser than it should be. Fewer labels on the narrow display would mean
  hiding content, which layout.md only permits with a stated alternative route — and on a
  single-screen hero there is nowhere else for them to be reached.
- The action goes nowhere. Nothing exists past this screen, so the button is present as the
  screen's one primary action and does not navigate. That is why the repeated-press check reports
  zero navigations rather than one.

## Captures

| File | What it is |
|---|---|
| `hero-gallery.png` | The deliverable: 840 × 525, device pixel ratio 1, so every core is one image pixel |
| `hero-wide.png` | 1440 × 900 |
| `hero-narrow.png` | 390 × 844, the portrait geography |
| `hero-reduced.png` | 840 × 525 with reduce-motion on |
| `hero-nofont.png` | 840 × 525 with both font hosts aborted — the fallback stack's first frame |
| `zoom-orbital.png` | 400% crop of one cluster, no copy in frame |
| `compare-hudf.png` | The hero beside the Hubble Ultra Deep Field at the same size |
| `ref1-hubble-udf.png` … `ref6-apod.png` | The study captures |
| `walk1-arrive.png` … `walk4-selected.png` | The Stellarium Web walk |
