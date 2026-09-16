# Layout

Where things sit, what sits next to what, and what happens to all of it when the display changes
size. Tokens fix the values; this file fixes the arrangement those values get spent on.

Nothing here is inherited. Where no platform layout conventions exist to fall back on, an
undeclared arrangement is not a neutral starting point — it is whatever the layout engine does
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
- Regions with no declared reflow behavior: 0.
- Distinct left edges within one column, counting only those with no stated reason: 1.
- Edges the structure means to share that differ, on any axis: 0.
- Groups whose internal gap is equal to or larger than the gap separating them from their
  neighbors: 0.
- Controls styled as primary: 1 per screen, or 0 on screens that only present.
- State captures promoting a different element to primary than the structure names: 0.
- Regions that hide on the narrow display with no stated alternative route to their content: 0.

### The checks

- The declared structure. Read it back. If it is columns, say how many and what the gap is. If it
  is flow, say where the width stops and what stops it.
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
