# Record — Quire launch hero

Surface: `index.html`, one page, one theme. Declaration: `.design/declaration.md`.

## Study record

Six references. Every one was rendered and looked at; none was read as text only.

| Reference | Pixels seen how | What it settled |
|---|---|---|
| reMarkable (remarkable.com) | **Walked** — three frames down the running page: hero, proof strip, product row (`ref-remarkable-1/2/3.png`) | That a serif at display scale can carry an e-ink product on its own; and that burying the device behind a person costs you the one thing a reader wants to see. |
| Daylight DC-1 (daylightcomputer.com) | Capture, `ref-daylight.png` | The strongest of the six: a tilted render whose *screen content* is the argument. Settled that the page on the screen has to be real, finely set, and large enough to read. |
| Apple iPad Pro | Capture, `ref-ipadpro.png` | Settled the emptiness: one object, one headline, and nothing competing. Also settled that a raking light along a single edge is what gives a slab its form. |
| Leica M11-P | Capture, `ref-leica.png` | Settled the staging: object on a seamless sweep, soft contact shadow, material texture doing the work a gradient cannot. |
| teenage engineering TP-7 | Capture, `ref-te-tp7.png` | Settled that confidence reads as restraint — one small line of type against a large quiet field. Rejected for this brief: its type is deliberately tiny, and this brief asks for the opposite. |
| Supernote | Capture, `ref-supernote.png` | A counter-example, and useful as one: eyebrow above the heading, one word italicised inside it, two products competing in the hero. Named the three things not to do. |

Rejected while planning, so a later pass does not reach for them again: cream page with a serif and
a terracotta accent (the current generated-design cluster); near-black page with an acid accent
(misrepresents e-ink, which is reflective and has no appearance in the dark); centred symmetric
title-page composition (safe, and it kills the tension between the two masses); a second typeface
for the page text (Literata already has the optical sizes to do both jobs).

## Named deficits and the comparison that ended the work

`hero-gallery-840.png` beside `ref-daylight.png`, both at the size the hero will be seen — about
840 px wide. First build's three weaknesses, in order:

1. **The device was undersized and the room under-filled.** DC-1's product holds roughly 45% of its
   frame; the first build's held about 12%, floating high-right with a dead quarter of empty
   plaster beneath it. At 840 px the page collapsed to grey texture and stopped being legible as a
   page of a book — which is the product's one claim.
2. **It read as a sticker, not an object in a room.** Nearly even lighting, a faint detached
   shadow, a flank sliver that vanished at gallery size.
3. **The two masses shared no ground.** They shared a top edge, but the headline stopped at 55% of
   the frame height while the device ran to 75%, so nothing seated them in one space.

Repaired: **1 and 2**, the two that decide it at 840 px. Repair 1 also closed most of 3, because
seating the device on the headline's baseline was how the extra height was absorbed.

- **Repair 1 — scale and seating.** Device width 432 → 520 px (27% → 35% of the frame), page type
  11 → 13.2 px, and the column alignment changed from `start` to `end` so the headline's last
  alphabetic baseline and the device's foot are one line. Measured: 0.00 px apart.
- **Repair 2 — light.** Cast shadow darkened and skewed further from the light (−15° → −21°),
  contact shadow tightened onto the foot, a second falloff added to the sweep at the lower left so
  the shadow has a room to fall in, the front face's directional range widened, the chamfer
  highlights strengthened, a plaster bounce added along the foot, and the turn increased to
  `rotateY(17deg) rotateX(-4.5deg)` so the flank and the top edge hold at 840 px.
- **Follow-on.** The enlarged cast shadow overhung the frame and made the document scrollable;
  clipped at the root. Verified: `scrollTo(9999,9999)` leaves `scrollX`/`scrollY` at `0, 0`.

Still standing, recorded rather than repaired: deficit 3 is closed at the ground plane but the
device's near bottom corner sits about 12 px below the type baseline. That is the perspective — the
corner nearer the camera is lower — not a misalignment. The structural shared edge is the ground
plane, and it is exact.

## Inspections

### tokens.md

- Applicable entries unfilled: **0**. Not applicable and recorded with a reason: motion (no motion
  on the page), springs and curves (same), accent (a screen that only presents has no primary
  action, no selection, no progress).
- Type-scale steps missing weight or letter-spacing: **0**. Missing width: **0** — Literata carries
  no width axis, stated per step. Steps over columns of numbers: **0**.
- Families sharing a classification: **0** — one family.
- Springs where motion follows a finger: **0**; ease-out curves: **0**. The product has neither.
- Values needed this pass and not written back: **0**. Three were written back after measuring:
  the drop cap (declared 31 px, built 53 px), the page measure (declared 44 characters, measured
  52), the radius scale (declared 24/4 px, built 28.9/4.8 px as ratios of the device width).
- Gradient entries with no reason: **0** — three declared, three rendered.
- Colour values with no stated job: **0**.
- Values hard-coded per theme: **0** — there is one theme and no `prefers-color-scheme` branch.
- Symbol sets named: **0**, and the interface draws no icons.

Checks. *Typeface:* Literata was drawn for long-form reading on screens; the device sets its pages
in it, so the launch page sets its headline in it. That reason does not transfer to an unrelated
product. *Accent:* none of the three places it earns appears on this screen; nothing took it.
*Radius sentence:* shell → the device's outer corner; panel → the cut e-ink glass; 0 → the page,
which has no containers. *Fallback stack:* rendered with webfonts blocked
(`state-fonts-blocked.png`). The first frame shows the whole composition in Georgia — the
headline holds three lines, the device and its page are unaffected, nothing reflows when Literata
arrives.

### anti-slop.md

- Accent hues rendered: **0** — the declaration states monochrome.
- Grey families: **1**, cool. The warm paper stock is a recorded exception and lives only inside the
  artwork.
- Tinted near-blacks standing in for black: **0**. The headline is `#000000`. `#34383A` is the
  device's aluminium and `#2B2724` is e-ink's dark grey; both are material values inside the
  artwork, and neither stands in for text black.
- Typeface families in the flow: **1**.
- Words emphasised by a switch of family: **0**.
- Display sizes on one screen: **1**.
- Text blocks past the declared cap: **0** — the page measures 52 characters against a 66 cap.
- Scrolling surfaces wider than the maximum content width: **0** — nothing scrolls.
- Radius values outside the scale: **0**. Shadows outside the elevation scale: **0**.
- Spacing values not a multiple of 8: **0** — measured: padding 96, gap 96, column gap 96.
- Literals instead of token references: **0** for colour, radius, and spacing on the interface.
  Artwork values sit inside the artwork's style system, which lifts its palette from the
  declaration.
- Gradients with no written reason: **0**. None behind the top of the screen; none on an action.
- Translucent blurred materials with no entry: **0**.
- Glows, sparkles, celebration effects: **0**.
- Icons from outside the declared symbol set: **0**. Emoji in chrome: **0**; in content: **0**.
- All-caps label styles: **0**. Glyphs appended to link and action text: **0**.
- Headings whose emphasis lands on a fragment: **0** — the headline is one weight throughout.
- Numbered sets with no stateable ordering: **0** — the only numbers are the depicted chapter and
  folio, ordered by the book.

Checks. *Closest look among the five frontend-design names:* none of them squarely; the nearest
neighbour is the broadsheet look, and what settled the axis away from it is the Leica and Apple
staging — a lit object on a sweep, not hairline rules on a flat field. *Eyebrows:* none exist.
*Dividers and borders:* none exist. *Palette, material, layout skeleton:* palette from the subject
(plaster, graphite, paper), written in the declaration; material from the Leica and Apple captures;
skeleton from reMarkable's type-left / object-right, with the shared floor added. *The one element
the screen is built around:* the device. The headline names it and hands the frame over.

### copy.md

Counts and the full string inventory: `.design/lexicon.md`. Every line returns its threshold.

### layout.md

- Surfaces with no declared structure: **0** — two columns, 96 px gap, capped at 1680 px.
- Regions with no declared reflow behaviour: **0** — both stack at 1040 px, both scale at 560 px,
  nothing hides.
- Distinct left edges within one column with no stated reason: **1**.
- Edges meant to be shared that differ: **0** — headline baseline to device foot, 0.00 px.
- Groups whose internal gap equals or exceeds the gap separating them: **0** — the headline's
  interline is 143 px against a 96 px column gap, but the two are different axes; on the horizontal
  axis there is one gap and nothing to invert.
- Controls styled as primary: **0**. The screen only presents.
- State captures promoting a different element to primary: **0**.
- Regions hiding on the narrow display with no alternative route: **0**.

Checks. *Structure:* two columns; the left is `minmax(0,1fr)`, the right is the device at its own
width; the gap is 96 px; the width stops at 1680 px. *Reading order against visual weight:* read
order is headline, then device; weight order is headline (152 px black type, 810 px wide), then
device. They match. *Reflow:* at 1040 px the device moves below the headline and both keep the left
edge; at 560 px both scale down; nothing disappears at either width — `reflow-1040.png`,
`reflow-390.png`. *Primary action:* none, and the reason is that nothing here is operable.
*Optical centring:* the folio is centred on the measure, not on the panel, which is the book's
convention. *Density:* the screen's job is to be looked at once, so the spacing serves one decision
— where to look.

### assets.md

- Style families across the product: **1** — photographic.
- Assets made before the style system was written: **0**.
- Assets carrying baked-in text or a watermark: **0**.
- Assets not viewed in both themes on their real surface: **0** — there is one theme, and the asset
  was viewed on `--sweep`, the surface it occupies.
- Assets whose focal point sits under a control or clips a safe-area boundary: **0**.
- Assets in one set carrying different padding: **0** — one asset.
- Depicted objects whose crop stops reading as their subject: **0**.

Checks. *Style system:* all four entries written — family, palette, light and texture, subject
grammar. *At 400%:* the shell's corner is clean against the plaster, with no halo and no matte
fringe; the sweep and the aluminium both carry the same grain, which is what keeps the large soft
gradients from banding; the seam where the flank meets the front face is a continuous dark edge,
not a gap. *Reject list:* the style has not drifted (one asset); no halo, fringe, seam, or banding;
no baked text; the composition does not fight the layout; it does not read as the layout engine's
default, because it has a turned body with a visible flank and top edge, a chamfer, a bead-blasted
surface and a three-layer shadow. *The crop test:* cropped to the object alone with no text in
frame, it reads as a dark slab holding a printed page — a chapter opening with a drop cap, a
justified measure and a folio. Not a grey rectangle. *Product icon:* none exists.

### states.md

| State | Status |
|---|---|
| Loading | Not applicable as a data state — the page reads nothing. The one load that exists is the webfont, captured blocked: `state-fonts-blocked.png`. |
| Empty | Not applicable — there is no container and no collection. |
| First run | Not applicable — there is no account and nothing persisted. |
| Error | Not applicable — the page makes no request that can be rejected. A webfont that fails resolves to the declared fallback stack, which is the captured frame above. |
| Long content | Captured at 3× the headline: `state-long-content.png`. It wraps to nine lines, the device holds its size and position, nothing clips, overlaps, or leaves the layout. |

- Text regions with no declared overflow behaviour: **0** — the headline wraps and never truncates.
- Text contrast: headline `#000000` on `#DCDEDA` = **15.2:1**; page text `#2B2724` on `#EFE9DD` =
  **12.0:1**. Both above 4.5:1.
- Tap targets below the minimum: **0** — there are none.
- Focusable controls with no visible focus: **0** — there are none.
- Elements clipping or leaving the layout down to 390 px: **0**.
- Session interruptions, performed: *interruption* — switched away and back, the frame is
  unchanged and there is no work in progress to lose; *restart* — reloaded, identical render, and
  nothing claimed to be saved; *no connection* — the webfont request fails and the page renders in
  the fallback stack with the composition intact; *repeated presses* — nothing is pressable.
- Cold start to first accepted input: not applicable, the page accepts no input. Keystroke to
  character: not applicable, the page has no field.

### a11y.md

- Operable controls with no accessible name: **0** — there are no operable controls.
- Icon-only controls: **0**.
- Accessible names not containing their visible label: **0**.
- Informative depicted objects with no description: **0** — the device carries `role="img"` and a
  description naming its material, its turn, and what is on its page. Decorative elements exposed
  to the tree: **0** — the three shadow layers are empty `div`s with no role and no content.
- Meanings carried by colour alone: **0**.
- Modals, sheets, takeovers: **0**.
- Operations reachable by pointer but not keyboard: **0** — there are no operations.
- Focusable elements in an order differing from visual order: **0** — measured, 0 focusable
  elements.
- Outcomes rendered with no announcement: **0** — there are no outcomes.
- Operations reachable only through hover: **0**.

Checks. *Keyboard walk:* run with the pointer away. Tab moves focus straight from the address bar
to the browser chrome; there is nothing on the page to reach, activate, or get stuck in, and that
is correct for a surface with no controls. *Name table:* empty — no icon-only controls exist.
*Screen-reader walk:* **not run.** No screen reader is available in this headless environment. The
tree it would read is one `h1` and one described `img`, and the counts above were measured from the
DOM, but the walk itself is open and is the one inspection item on this surface that is not closed.

### motion.md, navigation.md, forms.md

All three skipped, and the skips recorded. The page has no motion of any kind, so there is no
recording to inspect. It has no second screen, no modal, no sheet, no overlay, and no link, so
there is no back path to walk. It accepts no typing, so there is no field, no validation, and no
submission.

## Captures

`hero-gallery-840.png` (the deliverable, the design at 840 px), `hero-detail-2x.png` (1680 × 1050
at 2×, for the edge inspection), `state-fonts-blocked.png`, `state-long-content.png`,
`reflow-1040.png`, `reflow-390.png`, and the six references.
