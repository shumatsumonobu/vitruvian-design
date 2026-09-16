# Layout

Where things sit, what sits next to what, and what happens to all of it when the display changes
size. Tokens fix the values; this file fixes where those values get spent.

Nothing here is inherited. Where no platform layout conventions exist to fall back on, an
undeclared structure is not a neutral starting point — it is whatever the layout engine does
when nobody said otherwise, which differs from one environment to the next.

## Declare the structure

One entry per surface, written into `.design/structure.md` beside the token declaration — that
is the default home, and the declaration's own home wins where the project chose one. The
reflow declarations below live in the same file.

- **Columns and the gap between them**, where the surface uses a column structure, or
- **Flow**, where content stacks in reading order and width is capped rather than divided.

Either is a decision. Neither being written down is the defect. A structure declared as columns
names how many and what falls between them; a structure declared as flow names what stops the
width and why — and where the declaration carries a maximum content width, that is the value.

An arrangement nobody chose is as much a defect as a color nobody chose, so the entry also names the
arrangement — what the surface opens with, what follows, what closes it — and what in the subject —
the brief, the product's own material, and the references studied, as rules/tokens.md names the
subject — put the arrangement there. Generated pages converge on a few shapes — a centered hero over
a row of equal cards, one action, a footer of link columns; a bento grid; three tiers; sections
alternating image-left and image-right; every block in a card. Any of them is a fine answer for some
subject, on the same terms as everything else in this skill: the declared structure names what in
the subject chose it, or says that it arrived unasked, which the count below still counts.

## One alignment per axis

Things sharing an edge share it exactly. Two values a few units apart on the same axis read as a
mistake rather than as a decision, because at a glance they are indistinguishable from a mistake.

Within a column, one left edge. A second one needs a reason stated beside the structure, and
indentation that carries meaning — a reply, a nested item, a continuation — is that reason.

## Space groups things

Proximity is read before anything else on the surface, ahead of borders, ahead of color, ahead of
the words. Two items closer to each other than to their neighbors are one group whether or not
they were meant to be.

So the gap inside a group stays smaller than the gap between groups, and both come from the
spacing scale. Where those two are equal, the grouping is invisible. Where they are inverted, the
reader gets a grouping nobody designed.

## Centering is optical, not arithmetic

A shape whose visual weight sits off its geometric middle — a play triangle, a glyph with a
descender, a label beside an icon — centers on the weight. Placing it at the arithmetic middle
puts it visibly off-center, and the reader sees the error without locating it.

## Where the width stops

The maximum line length lives in tokens.md, and so does the maximum content width where one is
declared. This file decides what enforces each: the column the text sits in, a cap on the text
container itself, or a wider region that keeps the text block narrow inside it — and, for the
surface as a whole, the container that stops the width. Text running the full width of a large
display because nothing stopped it is the most common version of this failure.

## The platform's own regions

A device's display has regions the platform keeps for itself. A background may run under them;
nothing the reader has to read or press rests under them. Content passing under a bar as it scrolls
is rules/motion.md's; what sits under a region when the surface is scrolled to either end is counted
here.

## Density follows the job

A screen for scanning many items packs tightly. A screen asking for one decision gives that
decision room. One density imposed across a whole product makes half its screens wrong, so density
is decided per screen and the reason is the screen's job.

## Reflow is declared, not discovered

Every region states what it does as the display narrows: wraps, stacks, hides, or scrolls
sideways. Undeclared is the defect, the same way an undeclared overflow behavior is in states.md.

Hiding is a real option and the one most often taken by accident. A region declared as hiding says
what a reader on the narrow display loses and where they can still reach it.

## One primary job per screen

- One control carries the primary style. A screen that only presents carries none.
- Reading order matches visual weight. List the elements in the order they are meant to be read,
  then list the same elements ordered by size, weight, and contrast. Where the two lists disagree,
  the styling changes, not the content.
- Where the primary action sits needs a reason. On a surface operated by touch that reason is
  reach; on one operated by a pointer it is scan order. Both are reasons. Neither is a default.
- Every state of the screen holds this hierarchy. None of them promotes a different element to
  primary.

## Inspection

### The count

Gaps measured against the base spacing unit, and text blocks measured against the line-length cap,
are counted in anti-slop.md. Run that count in the same pass.

- Surfaces with no declared structure: 0.
- Surfaces with a declared structure whose arrangement has no reason from the subject beside it: 0.
  Look first at the generated defaults — a centered hero over a row of equal cards with one action
  and a footer of link columns, a bento grid, three tiers, alternating image-and-text sections,
  every block in a card — since those are the ones that arrive unasked.
- Surfaces whose rendering differs from their declared structure — the columns and their gap or
  what stops the width, the arrangement, what each region does as the display narrows: 0.
- Regions with no declared reflow behavior: 0.
- Distinct left edges within one column, counting only those with no stated reason: 1.
- Edges the structure means to share that differ, on any axis: 0.
- Groups whose internal gap is equal to or larger than the gap separating them from their
  neighbors: 0.
- Controls styled as primary: 1 per screen, or 0 on screens that only present.
- State captures promoting a different element to primary than the structure names: 0.
- Regions that hide on the narrow display with no stated alternative route to their content: 0.
- Content or controls anchored to a display edge with no allowance for the platform's own regions,
  where the surface runs under them: 0. Where no supported device has such regions, 0.
- Content the reader must read, or controls they must press, sitting under a platform's own region
  when the surface is scrolled to either end, at any supported width on any supported device,
  counting none already counted on the line above, an artwork's subject being rules/assets.md's: 0.
  Where no supported device has such regions, 0. Where no device with such regions, or its
  simulator, can be driven, the record (`.design/record.md`) says the count was not taken; an
  untaken count is not a pass.

### The checks

- The declared structure. Read it back. If it is columns, say how many and what the gap is. If it
  is flow, say where the width stops and what stops it. Name what in the subject settled the
  arrangement and where that is written down. A reason that would hold for an unrelated product is
  not one, as rules/tokens.md says of every declared value. The platform's own convention for this
  kind of screen, read from the platform vendor's own material during the study SKILL.md asks for
  under Before you draw, is a reason of this product's — the platform is part of its subject; a
  shape that arrived because nothing was specified is not. Where the reason would hold for an
  unrelated product, or where nothing in the subject chose the shape, that surface goes on the
  repair list `inspect` returns (SKILL.md).
- Reading order against visual weight. Write the two lists and say whether they match. Where they
  do not, name which element gets restyled.
- Each reflow width. Say what moves, what stacks, and what disappears at each one.
- The primary action. Name where it sits and the reason that put it there.
- Each shape centered beside a label or inside a control. State whether it sits on its visual
  weight or on its geometry.
- Density. Name this screen's job and say whether the spacing serves scanning or serves a decision.

## Platform notes

- Reflow widths are chosen from where the content breaks, not from a list of device sizes. Narrow
  the display continuously and write down every width where something stops working; those are the
  widths worth declaring.
- Where the environment supplies a layout system with its own spacing and alignment primitives,
  express the declared structure through it rather than in absolute values, so one change of the
  base unit moves everything that depends on it.
- The regions the platform keeps for itself are a status bar, a camera cutout, a home indicator, a
  system navigation bar. On the web, `viewport-fit=cover` lets the page run under them and
  `env(safe-area-inset-*)` is the allowance; without the first, the page does not run under them. On
  iOS the allowance is the safe area the view reports; on Android, the window insets. A desktop
  display has none, and both counts report 0.
