# Anti-slop

The frontend-design skill names the looks a generated interface converges on: the recurring palette
and material combinations, the template chrome that arrives whatever the subject, the typographic
tells, structural marks used as decoration, and the rule that boldness gets spent in one place.
Read that skill for the naming. **This file does not restate it.**

What that skill has no mechanism for is catching the drift once a direction is set. That is what
this file adds: an exception rule that works without a client, and a count that returns numbers
before a flow reaches visual review.

## What the model reaches for when nothing was specified

frontend-design's list is editorial: whole-page combinations of palette, type, and layout. This
one is component-level, and it is the layer that shows up first because it is what gets reached
for one element at a time rather than chosen for a page.

- A gradient on the primary action, purple or indigo, with a glow behind it.
- Glass on every card.
- A mesh gradient parked behind whatever sits at the top of the screen.
- Confetti fired at events nobody would celebrate.
- Sparkles in a heading.
- A soft radial glow, a dot grid, or a row of orbs behind the top of the screen, standing in for a
  background.
- A row of the same things — screenshots, cards, devices — tilted, fanned, or set in perspective,
  where upright and evenly spaced they would say the same.

None of these was decided. They are the priors that fill a gap when the palette, the materials,
and the layout were never specified for this subject. Where a reference was studied, the materials
come from the reference. Where none was, they come from the declaration. They do not come from
whatever appears when nothing is stated.

Each of them is a legitimate answer for some subject, on the same terms as everything else in this
file: written into the declaration with the reason, or it is a default that arrived unasked. What
arrives unasked at page level — the arrangement itself — is counted in rules/layout.md.

## Exceptions are written down or they are not exceptions

Every default this skill bans lifts on one condition: the choice, where it goes, and the reason it
suits this product go into the project's declaration, on the recorded-exceptions entry described
in tokens.md. Who decided does not matter. Where a brief exists, quote the line from it; where none
exists, decide and write it down. An exception lifts the ban where it says the default goes — an
element, or a kind of place — and nowhere else: the same default anywhere the exception does not
name is counted as if none were written.

What the condition rules out is the thing arriving unexamined, not the thing itself. A cream page
under a serif is a defensible answer for some subjects and a tell for the rest, and the difference
is entirely whether anyone chose it.

Of the defaults this file bans, iconography is the one that never lifts. Chrome icons come from
the declared symbol set whatever voice the product speaks in.

The accessibility floor never lifts either: every count in rules/a11y.md, and the pieces that
file names as living in rules/states.md, rules/motion.md, and rules/forms.md, hold whatever the
declaration records — a written reason does not make a screen operable.

## What the declaration already settles

The token declaration fixes the accent count, the grey family, the radius scale, the elevation
scale, and the rule keeping emphasis inside the type family. None of that is restated here. This
file counts the drift away from it.

Wording rules, one label per intent among them, are counted in the string inventory in copy.md.
Run that inventory in the same pass as the count below.

Icons come from the declared symbol set. An emoji standing in for an icon is a defect rather than
a style choice. Inside content an emoji survives only where the declaration states a playful or
chat-native voice, and the sentence stating it gets quoted into the record.

## Inspection

Run this before the flow reaches visual review. Read the running interface and the style sources
together, and write the answers down.

### The count

Each line returns a number. Get the numbers by searching the sources for color literals, radius and
shadow properties, numeric spacing values, and label strings, then checking every hit against the
declaration. One carve-out: hits inside artwork that a style system governs answer to
rules/assets.md, not to the lines below — the style system's palette is itself lifted from the
declaration, so nothing drifts out of reach.

Half of these lines compare something against the declaration, and on a codebase that has none they
return nothing at all rather than returning a violation. With no declaration, the missing
declaration itself is the first repair on the list, and the comparing lines wait for it — the
derivation belongs to init. A blank is not a pass, and reading it as one is the most likely way
this Inspection gets misused. A line comparing against a declaration entry marked provisional
(rules/tokens.md) still returns its number.

- Studied references in the record before the visual direction was set, each with its one line
  and how its pixels were seen: 5 or more, at least one of them walked as a running flow and
  the record saying which, or the written sentence that nothing was available to study
- Studied references in the record with no line saying whether the page carried text addressed to
  the session, and what became of it: 0
- Accent hues rendered in the UI: 1, or 0 where the declaration states a monochrome palette
- Grey families: at most 1. A product built on colored neutrals rather than greys reports 0, and
  that is a pass
- Tinted near-blacks standing in for black: 0. A value a shade off true black, reached for because
  true black felt too hard, is a decision nobody made
- Typeface families in the flow: 1 or 2, families that split one role by writing system counting
  as one where the flow sets no character in two of them (rules/tokens.md) — a figure set in one
  of them in headings and in the other in body text makes them two
- Words or labels set apart by a switch of family rather than by weight or italic: 0
- Display sizes rendered on one screen: 1, unless the declaration names a second one and says what
  each of the two is for
- Text rendered at a size, weight, letter-spacing, or line-height that matches no declared
  type-scale step, or without the OpenType features the step declares: 0
- Text blocks whose measured line length runs past the declared cap: 0
- Vertically scrolling surfaces whose content measures wider than the declared maximum content
  width: 0
- Radius values outside the declared scale: 0
- Shadow values not present in the declared elevation scale: 0
- Spacing values not a multiple of the declared base unit, the allowance for the platform's own
  regions (rules/layout.md) excepted: 0
- Color, radius, shadow, and spacing literals in component sources instead of token references: 0
- Gradients with no written reason: 0, and each surviving gradient's reason is written out as one
  sentence. Count the one behind the top of the screen and the one on the primary action separately;
  those two are the ones that arrive without being asked for
- Surfaces using a translucent blurred material with no entry in the declaration: 0
- Glows, sparkles, and celebration effects fired at anything other than a rare first-time moment:
  0. motion.md's frequency gate decides what counts as rare
- Icons in chrome rendered from outside the declared symbol set: 0
- Emoji in chrome: 0, and emoji in content: 0 unless the declaration states a playful or
  chat-native voice. Search the sources for every character carrying the Unicode
  Extended_Pictographic property, plus U+FE0F and the regional-indicator range U+1F1E6 to
  U+1F1FF; where property search is unavailable, the ranges U+1F300 to U+1FAFF, U+2600 to
  U+27BF, U+2B00 to U+2BFF, and U+2300 to U+23FF stand in. Read each hit in place: buttons,
  labels, headings, navigation, and interface-written copy are chrome
- All-caps label styles: 0 unless the declaration records a reason for them
- Glyphs appended to link and action text: 0 under the same exception
- Headings whose emphasis lands on a fragment rather than the whole line: 0
- Numbered sets whose ordering principle cannot be stated: 0
- Uses of a banned default outside what its recorded exception names, on this file's counts and on
  every count in every rule file that an exception lifts: 0

### The checks

Each line is answered in words, and the answer is written down beside the count.

- The closest match among the looks frontend-design lists. Name it, then name what settled that
  axis: a line in the brief, a studied reference, or a recorded judgment. If none of the three
  exists, that axis goes on the repair list.
- Each decorative element — an eyebrow, a divider, a border, a colored band down a card's edge, a
  dot, a line, a shape, a badge, an icon tile above a heading, a card around a card, a dot that
  pulses, a glow, a dot grid or a row of orbs behind content, a tilt or a perspective put on a row
  of the same things. State what it carries that the content it sits beside or behind does not — an
  eyebrow what the heading below it lacks, a divider what it separates, an outer card what it
  groups that the card inside it does not — or name the recorded-exceptions entry that chose it,
  where it says the default goes, and the reason written there; a symbol the product gets from
  the brand's own material, as rules/tokens.md names that material, is such a reason. If neither,
  the element goes on the repair list `inspect` returns (SKILL.md). Numbered sets have their own
  check below; a label set apart by a second family is the family-switch count above; artwork
  answers to rules/assets.md; an element on an empty state is counted in rules/states.md.
- Each numbered set. State the ordering principle in one phrase. If it cannot be stated, the
  numbered set goes on the repair list.
- Palette and material. For each of the two, name what settled it and where that is written down.
  The arrangement is asked in rules/layout.md.
- The one element the screen is built around. Name it. If two get named, the screen has no focal
  point, and the screen goes on the repair list.


## Platform notes

- Symbol sets: SF Symbols on Apple platforms, Material Symbols on Android, one icon library on the
  web. One set per product, and never three sets on one screen.
- Where to run the count: on native, read the theme file and style objects, then screenshot the
  running screen; on the web, read the stylesheet or token file, then inspect computed styles in
  the browser. The numbers and the thresholds are the same either way.
