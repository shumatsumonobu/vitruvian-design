# Lamplight — design record

Single page, single theme. `index.html` at the project root, self-contained, no build step, one
webfont `<link>`.

---

## Study record

**Nothing was available to study, and the direction was taken from the subject alone.**

Stated plainly because the gate requires it: the Claude-in-Chrome extension reported
"Browser extension is not connected", and headless Chrome (`chrome --headless --screenshot`)
returned no file for basecamp.com, duolingo.com, headspace.com, mailchimp.com, slack.com or
mozilla.org across three attempts, two of them with a 150-second timeout per site. A local
`file://` render in the same binary writes a PNG every time, so the failure is reaching the
network, not the capture. **Zero references were studied. Zero had their pixels seen.**

Consequence, recorded rather than worked around: every adopted pattern below names a recorded
judgment as what settled it, because no reference exists to name. The comparison the brief asks
for — hero capture beside the strongest reference studied — **could not be run**, since there is
no reference capture to place beside it. What was run instead is the self-critique at the size
the image will be seen; it is below, and it is not a substitute for the comparison.

### Rejected while planning

- A near-black page with one acid accent, and a cream page with a high-contrast serif and a
  terracotta accent. Both are on frontend-design's calibration list. Rejected before the palette
  was written.
- Portraits as circular avatars, and as flat two-tone geometric mascots. Rejected because the
  brief forbids the first and because the second is what the layout engine produces by default.
- A separate hero illustration plus a separate roster illustration. Rejected because two drawings
  per agent is where a set drifts; the `<symbol>`/`<use>` construction replaced it.
- A lamp-flicker loop and a scroll reveal on the roster. Rejected under Chanel's rule — the page
  has no non-user motion at all.

---

## The one element the screen is built around

**The house: five lit windows in a row, one agent working in each.** Nothing else competes —
the headline sits on empty sky, the chrome is moonlit grey, and the roster below repeats the same
five heads rather than introducing new art.

---

## Self-critique at 840 px

The image the gallery will see is `.design/captures/hero-840.png`, 840 px wide. Read at that size,
three things were weaker than the drawing deserves:

1. **The two lamp posts stood in front of the name plates.** The right post covered "Hare" outright
   and its glow washed "Dispatch"; the door arch pushed up into the "Beetle / Repair" plate and
   dimmed the job line. A portrait whose name cannot be read is not a nameable job.
2. **Wren's room was not lit.** Four rooms glowed and the first one sat in `--night-800`, so the
   row of five broke its own rhythm at the left edge, which is where a reader enters the image.
3. **Moth read as a pale blob.** At 840 px the antennae were hairlines, the eyes were small, and
   the wing edge was a smooth curve — the silhouette that was supposed to say "moth" said
   "something white".

All three were fixed, plus a fourth found at the narrowest width:

- Lamp posts moved into the gaps between plates at x 294 and x 906, their heads dropped below the
  plate band; the door shrunk and its fixture replaced by a lit fanlight, with the glow radius cut
  from 70 to 44. All five plates now read at 840 px.
- Wren's room given its own hanging lamp and glow, and the pigeonhole wall repainted from
  `--night-800` to the warm `#8E4738` of the other four interiors.
- Moth's antennae taken from 3 to 4.6 stroke units with heavier plumes, eyes enlarged from
  9 × 11 to 13 × 16 with a brow line added, and the wing edge scalloped so the outline reads as
  wings rather than as a cloak.
- **Narrow width:** at 390 px the chrome row was a non-wrapping flex container whose min-content
  width exceeded the viewport, pushing the whole document sideways and clipping the headline and
  the body copy. `flex-wrap` added to the chrome and footer rows; the nav drops to its own full
  width below 640 px.

---

## Inspection — rules/tokens.md

| Count | Result |
|---|---|
| Applicable entries unfilled | 0 — `.design/declaration.md` |
| Type-scale steps missing weight or letter-spacing | 0 |
| Steps missing a width (families with a width axis) | 0 — neither family carries one |
| Steps over columns of numbers with no figure treatment | 0 — no such step exists |
| Declared families sharing a classification | 0 — Fraunces is a serif, Karla a grotesque |
| Springs named (motion following a finger) | 0, and none exists — recorded not applicable |
| Ease-out curves named (time-driven motion) | 1 — `cubic-bezier(.22,.61,.36,1)` at 140 ms |
| Values this pass needed but not written back | 0 |
| Gradient entries with no reason | 0 — two gradients, each with its reason |
| Color values with no stated job | 0 |
| Values hard-coded per theme | 0 — one theme, recorded as exception 2 |
| Symbol sets named | 0, and the interface draws no icons — a pass |

**Checks.** Fraunces was chosen for its `SOFT` and `WONK` axes, set at 60 and 1, which is what lets
type sit next to hand-drawn ink without reading as machine-set; a face without those axes could not
have been tuned that way, so the reason does not transfer to an unrelated product. Karla was chosen
because it holds at 15 px on a dark ground where the display face cannot, and its cut terminals keep
it from reading as system UI. The accent `--lamp` takes two of its three places on this screen — the
primary action ("Put them on tonight") and the active nav item — and progress does not appear;
nothing else in the interface takes it, and its occurrences inside the drawings are lamplight, which
the style system governs. Radius sentence read back: pills on both actions, the large step on the
chrome and roster containers, the small step on the enamel plates, zero on the artwork edges.
**Fallback stacks: not verified with webfonts blocked — see What did not run.**

## Inspection — rules/anti-slop.md

| Count | Result |
|---|---|
| Accent hues in the UI | 1 |
| Grey families | 1, cool |
| Tinted near-blacks standing in for black | 1 — `#0C1024`, and it is recorded exception 1: the darkest value is the night sky and the drawing ink, not a softened black |
| Typeface families in the flow | 2 |
| Words emphasized by a switch of family | 0 |
| Display sizes rendered on one screen | 1 — the hero headline. The roster heading is the same step overridden down to 30–40 px and the plates are the separate `plate` step, so neither is a second display size |
| Text blocks past the 62ch cap | 0 |
| Surfaces wider than the 1120 px maximum | 0 |
| Radius values outside the scale | 0 — only `var(--r-pill)` and `var(--r-sm)` appear in the stylesheet |
| Shadow values outside the elevation scale | 0 — `--e1` and one hover variant of it |
| Spacing values not a multiple of 4 | 0 in the stylesheet; SVG path coordinates answer to rules/assets.md under that file's carve-out |
| Color/radius/shadow/spacing literals instead of token references | 0 in the stylesheet; literals inside the drawings are the style system's palette, which is lifted from the declaration |
| Gradients with no written reason | 0. Neither of the two sits on an action or behind the top of the screen |
| Translucent blurred materials with no entry | 0 |
| Glows and celebration effects | 0 as interface effects. The soft circles in the scene are drawn lamplight — depictions of a light source that is itself drawn in the frame — and belong to rules/assets.md |
| Icons from outside the declared symbol set | 0 — the interface draws no icons |
| Emoji in chrome / in content | 0 / 0 |
| All-caps label styles | 0 — `text-transform: uppercase` appears nowhere |
| Glyphs appended to link and action text | 0 |
| Headings emphasized on a fragment | 0 — both headings are one uniform line |
| Numbered sets whose ordering cannot be stated | 0 — nothing is numbered |

**Checks.** Closest look on frontend-design's list: **#1**, the cream-and-serif family, because a
Fraunces display is in it. What settled the axis is a recorded judgment — the ground is
`#141A38` night, not cream; the accent is lamp amber, not terracotta; and the display axes are set
at `SOFT 60 / WONK 1 / opsz 144` rather than at their defaults. Eyebrows: none exist. Dividers: one,
the footer's top border, separating the page from its legal and meta line. Palette, material and
layout skeleton were each settled by a recorded judgment in `.design/declaration.md` and
`.design/style-system.md`, since no reference was reachable.

## Inspection — rules/copy.md

Five action and link intents, one phrasing each, no intent wearing two labels: "Put them on
tonight" (once), "Read last night's log" (once), "The crew", "How a night runs", "What it costs".
Each agent's job name appears twice — on the enamel plate in the drawing and as the job line in the
roster — with identical wording both times: Triage, Watch, Repair, Research, Dispatch. Times render
as `03:00`, `02:00`, `04:00`, matching the declared format; "five" is spelled out, matching the
declared rule for counts below ten. **`.design/lexicon.md` was not written — see What did not run.**

## Inspection — rules/assets.md

| Count | Result |
|---|---|
| Style families across the product | 1 — drawn line |
| Assets made before the style system was written | 0 — `.design/style-system.md` predates the first path |
| Assets carrying baked-in text or a watermark | 0. The names on the enamel plates are live SVG `<text>`, selectable and reachable by assistive tech, not text baked into an image |
| Assets not yet viewed in both themes on their real surface | 0 — one theme exists, and every asset was viewed on `--night-950` and `--night-900`, the surfaces it occupies |
| Assets whose focal point sits under a control or clips a boundary | 0, after the lamp-post and door repairs above |
| Assets in one set carrying different padding | 0 — all five busts share `viewBox="0 0 200 250"`, one arch path, one clip |
| Depicted objects that stop reading as their subject when cropped | 0 — see the crop check below |

**Checks.** Style system read back: all four entries are present — family, palette with the exact
surface color, light and texture, subject grammar. Reject list, one line per asset: **Wren** reads
as a bird in an apron holding an envelope; **Moth** reads as a moth after the antennae, eyes and
scalloped wing edge were repaired; **Beetle** reads as a horned beetle with goggles up; **Owl**
reads as a spectacled owl with ear tufts; **Hare** reads as a long-eared hare in a messenger coat;
**the house** reads as a cutaway building with five lit rooms; none carries a halo, a fringe or a
seam, because every fill meets an ink contour drawn over it rather than an anti-aliased boundary
against the surface. Cropped to the object alone with no text in frame, each window tells a reader
what is happening in it: pigeonholes and envelopes, a gauge panel with a green trace, an opened
machine with cogs and a soldering iron, a bookcase and a page under a magnifier, parcels and a
handcart. The wordmark at 28 px keeps its lit window inside a gabled outline. **Four-hundred-percent
edge inspection was run at 1200 px render scale only — see What did not run.**

## Inspection — the files that do not apply

Each skip is recorded with the reason, per the rule in each file.

- **rules/states.md** — the page loads no data, has no account, no empty state, no error path, and
  no session. It renders the same for every reader on first paint. Loading, empty, first run, error
  and long content have nothing to force. The one line that does apply, contrast, is covered under
  a11y below.
- **rules/navigation.md** — no screen, modal, sheet or overlay is opened. Every link is a
  same-page anchor; there is no one-way door and no back behavior to walk.
- **rules/motion.md** — no non-user motion exists, so the frequency gate has nothing to gate. The
  only time-driven motion is the 140 ms hover and focus transition on the two actions, removed
  under `prefers-reduced-motion: reduce`. No recording was made, because a hover transition on a
  button is the whole of it.
- **rules/forms.md** — the page accepts no typing. No field, no validation, no submit.
- **rules/review.md** — this was a new build, not an improvement to an existing screen.

## rules/a11y.md — partial

What is in the source and confirmed by reading it: a skip link to the crew; the house SVG carries
`role="img"` with a `<title>` and a full `<desc>` describing all five rooms; each roster bust
carries `role="img"` with an `aria-label` naming the animal, its dress and what it holds; every
decorative SVG carries `aria-hidden="true"` and `focusable="false"`; both navs carry
`aria-label`; the active nav item carries `aria-current="page"`; focus is visible as a 3 px
`--lamp` outline at 3 px offset on every link; no meaning is carried by color alone, since each
job is named in words on its plate and again in the roster. **The two walks — the screen reader
once through, and the same flow again with the pointer put away — were not run, and the contrast
ratios were not measured. See below.**

---

## What did not run

Recorded rather than glossed, because a blank is not a pass.

1. **The study gate.** Zero references, for the network reason above. The brief's reference
   comparison could not be performed.
2. **The a11y walks and measured contrast.** No screen reader was driven and no contrast ratio was
   computed. The accessibility floor never lifts, so this is an open item, not an exception.
3. **The fallback-stack check** with webfonts blocked — the first frame on a slow connection was
   never rendered.
4. **Artwork at four hundred percent.** Edges were inspected at 1200 px and 840 px render scale
   only.
5. **The three walks** — happy, skeptic and abuse paths — were not performed.

Items 2 through 5 are the repair list for the next pass.
