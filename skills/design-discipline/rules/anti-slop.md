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

None of these was decided. They are the priors that fill a gap when the palette, the materials,
and the layout were never specified for this subject. Where a reference was studied, the materials
come from the reference. Where none was, they come from the declaration. They do not come from
whatever appears when nothing is stated.

Each of them is a legitimate answer for some subject, on the same terms as everything else in this
file: written into the declaration with the reason, or it is a default that arrived unasked.

## Exceptions are written down or they are not exceptions

Every default this skill bans lifts on one condition: the choice and the reason it suits this
product go into the project's declaration, on the recorded-exceptions entry described in
tokens.md. Who decided does not matter. Where a brief exists, quote the line from it; where none
exists, decide and write it down.

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
this Inspection gets misused.

- Studied references in the record before the visual direction was set, each with its one line
  and how its pixels were seen: 5 or more, or the written sentence that nothing was available
  to study
- Accent hues rendered in the UI: 1, or 0 where the declaration states a monochrome palette
- Grey families: at most 1. A product built on colored neutrals rather than greys reports 0, and
  that is a pass
- Tinted near-blacks standing in for black: 0. A value a shade off true black, reached for because
  true black felt too hard, is a decision nobody made
- Typeface families in the flow: 1 or 2
- Words emphasized by a switch of family rather than by weight or italic: 0
- Display sizes rendered on one screen: 1, unless the declaration names a second one and says what
  each of the two is for
- Text blocks whose measured line length runs past the declared cap: 0
- Vertically scrolling surfaces whose content measures wider than the declared maximum content
  width: 0
- Radius values outside the declared scale: 0
- Shadow values not present in the declared elevation scale: 0
- Spacing values not a multiple of the declared base unit: 0
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

### The checks

Each line is answered in words, and the answer is written down beside the count.

- The closest match among the looks frontend-design lists. Name it, then name what settled that
  axis: a line in the brief, a studied reference, or a recorded judgment. If none of the three
  exists, redesign that axis.
- Each eyebrow. State what it carries that the heading below it does not. If there is nothing,
  remove the eyebrow.
- Each numbered set. State the ordering principle in one phrase. If it cannot be stated, drop the
  numbers.
- Each divider and border. State what it separates. If it cannot be stated, drop it.
- Palette, material, and layout skeleton. For each of the three, name what settled it and where
  that is written down.
- The one element the screen is built around. Name it. If two get named, the screen has no focal
  point, so demote until one is left.

A number that misses its threshold is not an argument to have. Repair it, run the line again, move
on.

## Platform notes

- Symbol sets: SF Symbols on Apple platforms, Material Symbols on Android, one icon library on the
  web. One set per product, and never three sets on one screen.
- Where to run the count: on native, read the theme file and style objects, then screenshot the
  running screen; on the web, read the stylesheet or token file, then inspect computed styles in
  the browser. The numbers and the thresholds are the same either way.
