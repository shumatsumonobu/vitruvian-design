# Record — Dispatch landing page

## Study

Six references, all seen as pixels. Captures in `.design/study/`. The browser extension was not
connected, so everything was rendered through a headless-Chrome CDP harness
(`.design/harness/shot.mjs`) at 1440px wide and read as a screenshot.

| Reference | How its pixels were seen | What it settled |
|---|---|---|
| resend.com — home | capture | The velvet is *modelled*, not filled: a broad soft light falls across the floor and gives the black volume. Left-aligned hero, one display size, no accent hue at all. |
| resend.com — API reference, Send Email | walk (four pages of the running product: home → introduction → API reference → pricing) | The shape of the call itself: `const { data, error } = await resend.emails.send({ from, to, subject, html })`, with the response shown directly below the request. My sample and my card's foot strip come from here. |
| resend.com — docs introduction | capture (same walk) | Code chrome convention: the file or language on the left of the card's head strip, the endpoint on the right. |
| linear.app | capture | The floor under a raised object brightens in a wide, soft pool. This is the device the reflection sits in. |
| raycast.com | capture | To read as a light source rather than a tint, a single hue needs hundreds of pixels of falloff, and grain over it so the falloff does not band. |
| neon.com | capture | The near-black-plus-acid-green pairing, i.e. the look to stay away from; also a `POST /v1/...` chip used as a device. |
| vercel.com | capture | Hero convention only — headline left, one primary and one secondary action. Light-themed, so nothing about material carried over. |

**Rejected while planning**, so a later pass does not reach for them again: a centred hero (a lit
prop on a stage argues for it, but it is the generic hero and the left edge is stronger); acid
green and vermilion as the neon (frontend-design names near-black-plus-acid-accent as a cluster
trait, and neon.com is already sitting on it); a filled neon pill for the primary action (it became
the second-brightest object in the frame — demoted in fix pass 1); a page-load "tube strike"
animation (a still is the deliverable, and one animation would have pulled the whole motion
Inspection and its recording in behind it).

## Comparison against the reference, at the size it will be seen

`hero-840` beside `resend-home`, with `raycast` as the glow reference. Three ways mine was weaker:

1. The neon tinted rather than glowed — a 28px text-shadow and a 2px bar, with no light reaching
   the card's own face or the room around it.
2. The reflection read as a rendering artifact: 120px tall, so it caught only the card's footer
   strip and never the lit line, and enough grey detail survived the blur to look like a smear.
3. The blacks were flat — one centred radial where Resend models its floor with a broad shaft.

**Fixed, being the two that matter at 840px:** (1) and (2). The bloom went to three stops at
12/34/72px, `--spill` now lights the card's face from the tube, `--halo` spills past the card's
edges, and grain went over the page to stop the wide gradients banding. The reflection went to
240px so the marked line falls inside it, and the mirrored copy overrides the grey tokens down to
near-black so the object's detail dies in the floor while its light does not. **Not fixed:** (3)
directly — no directional shaft was added. The halo and the spill model the space around the card
as a side effect, which is most of what (3) was asking for, but the upper third of the frame is
still a flat field.

## Inspection

Run against the rendered page, in the order the skill sets: tokens, anti-slop, copy, then layout.

**tokens.md** — Applicable entries unfilled: 0 (symbol set and motion are recorded not-applicable,
with reasons). Type-scale steps missing weight or letter-spacing: 0; missing width: 0, neither
family carries a width axis; missing figure treatment: 0, no step sits over a column of numbers.
Families sharing a classification: 0 (grotesque and monospace). Springs and curves: 0 and 0, the
product has no motion. Values needed this pass and not written back: 0. Gradient entries with no
reason: 0, six declared and each carries one. Colour values with no stated job: 0. Values
hard-coded per theme: 0, there is one theme. Symbol sets named: 0, the interface draws no icons.
Fallback stack check: rendered with the webfont link blocked — the first frame shows Segoe UI and
Consolas, the composition holds, the headline sets about 4% wider and does not rewrap.

**anti-slop.md** — Accent hues: 1. Grey families: 1, cool. Tinted near-blacks: 3, all three
recorded as exception 1. Typeface families: 2. Words emphasised by a switch of family: 0. Display
sizes on one screen: 1. Text blocks past the measure: 0 (lead 46ch, band paragraphs about 30ch).
Content wider than 760px: 0. Radius values outside the scale: 0. Shadow values outside the
elevation scale: 0 — the two bloom shadows are declared as material, not elevation. Spacing values
not a multiple of 4: 0. Literals instead of token references: 0 for colour, radius, shadow, and
spacing. Gradients with no written reason: 0. Translucent blurred materials: 0. Glows fired at
anything other than a rare moment: 1, recorded as exception 2 — it is static material, nothing
fires. Icons outside the declared set: 0, there are no icons. Emoji in chrome or content: 0
(searched the pictographic ranges). All-caps labels: 0. Glyphs appended to action text: 0.
Headings emphasised on a fragment: 0. Numbered sets: the code gutter, whose ordering principle is
source line order.

Checks: the closest look among frontend-design's list is the near-black-with-one-bright-accent
cluster, and what settled that axis is the brief, quoted in exceptions 1 through 3. Eyebrows: none
on the page. Dividers: three, and each separates something — the card's head strip from its code,
the code from its response, the hero from the band. Palette, material, and layout skeleton were
settled by the brief plus the Resend and Raycast captures, written down in the declaration. The one
element the screen is built around: the marked line in the code card. Only one gets named.

**copy.md** — the inventory, the lexicon, and the ban checks are in `.design/lexicon.md`. Distinct
phrasings per intent: 1. Actions whose verb changes: 0. Labels naming an internal mechanism: 0.
Praise adjectives: 0. Filler tokens: 0. Title case: 0. Banned strings: 0. Numeric strings assembled
by hand: 0 — every number is a verbatim API value, recorded in the declaration. Same quantity in
two formats: 0. Action strings absent from the lexicon: 0. Long-content: source strings padded
threefold wrap without clipping a control or pushing anything out; the code block scrolls sideways
rather than wrapping, which is its declared overflow behaviour.

**layout.md** — Surfaces with no declared structure: 0. Regions with no declared reflow: 0.
Distinct left edges within the column: 1. Edges meant to be shared that differ: 0. Groups whose
internal gap is at least their separating gap: 0. Controls styled primary: 1. Regions hiding on
narrow with no alternative route: 0 — the nav links are in the footer. Reading order against visual
weight: headline, lead, card, band, footer, against display 64px, lead 18px, the lit card, 16px
titles, 13px fine print. The two lists match. Checked at 1440px and at 380px.

**states.md** — Loading, empty, first run, and error are recorded not applicable: the page reads
nothing, holds no collection, has no account, and performs no operation that can fail. Long content
is applicable and captured. Contrast, measured against the declared values: headline 17:1, code
13:1, secondary text 8.5:1, tertiary text and line numbers 5.0:1 on the card and 5.5:1 on the
stage, the accent 5.8:1 on the stage. Nothing sits below 4.5:1. Tap targets: the primary action is
38px tall, nav links 30px, both past the 24px web minimum. Narrowest supported width, 380px:
nothing clips, overlaps, or leaves the layout; the response strip wraps to two lines, which is its
declared wrap.

**motion.md** — Not applicable, and the page was read for it rather than assumed: no keyframes, no
transition properties, no transforms driven by time. Every count returns 0 by construction.

**assets.md** — Skipped, and here is the skip: the page was surveyed for artwork and carries none.
The velvet, the halo, the spill, the pool, and the grain are background washes that depict nothing;
the reflection is the same DOM rendered again, not a drawn object. Nothing on the page stands in
for a thing the copy talks about.

**a11y.md** — Counts: operable controls with no accessible name: 0, every control is a word.
Icon-only controls: 0. Accessible names not containing the visible label: 0. Informative artwork
with no description, or decorative artwork exposed to the tree: 0 — the grain, the halo, the pool,
and the whole reflected copy carry `aria-hidden`. Meanings carried by colour alone: 0 — the marked
line carries three channels, the accent, the gutter bar's shape and position, and 600 weight on the
call. Modals: none. Operations reachable by pointer but not keyboard: 0, every control is an
anchor. Focus order differing from visual order: 0, DOM order is visual order. Outcomes with no
announcement: 0, the page produces no outcomes. Operations reachable only through hover: 0.

**Not done, and not to be read as passing:** a11y.md's two walks. The screen reader was not run
over the flow, and the flow was not operated with the pointer put away — the browser extension
was not connected, and the headless harness renders but does not drive. Both are checks the file
says cannot be answered from source, so both remain open.

## Captures

`.design/captures/` — `hero-840` (the gallery frame), `full-1440`, `narrow-380`, `long-content`,
`no-webfont`.
