# Design tokens

The frontend-design skill decides what the palette and the typefaces should be, and why they
should be those rather than the ones any brief would get. Read it for the choosing. **This file
does not restate it.**

What it adds is the artifact. A plan settles a design once; a declaration written into the project
settles it for every session after, including the ones run by somebody else. Undeclared tokens are
why screens built a week apart stop looking like one product.

## Declare the set first

Write the declaration into the project, not into your head. It holds these entries:

- colors: 4 to 6 named values, one of them the accent, each with its job stated — a color whose
  job nobody can name does not go in. The grey family is declared on its own line below and does
  not count against this number
- grey family: one, warm or cool
- themes: one, or light and dark resolved from this one declaration — and which one the product
  ships where it ships one
- scope of change: on a product that already has screens, one of structure kept, everything
  may change, report only, or "kept:" followed by what is named — written by `fix` or `review`
  when they first ask, or from the brief. Until they ask, init writes it as not yet asked, which
  counts as filled. Not applicable on a fresh build — the code carried no values, everything may
  change — and recorded as such. The answers are defined in SKILL.md under What it asks you
- gradients: none, or each one with the reason it exists
- typefaces: one or two, each with a stated role; on the web, each also names the fallback stack
  that stands in before it loads — the stack's families count toward neither the one-or-two
  ceiling nor the rule that two families differ in classification
- type scale: every step with its weight and its letter-spacing, plus its width where the family
  has a width axis to state, and the OpenType features a step relies on where the family carries
  them — a step set over columns of numbers states its figure treatment. The step used at display
  size is marked as such; where a screen needs a second display size, both are marked and each
  says what it is for
- maximum line length: one; a second for serif body text where a serif is declared, with the
  line-height that goes with it
- maximum content width: one, where the surface scrolls vertically and the platform does not
  impose one
- base spacing unit: one
- radius scale: one, plus the sentence saying which shape goes where
- elevation scale: one
- symbol set: one, named
- springs: two where any motion follows a finger: one settling without oscillation, one softer
  for surfaces carrying momentum
- ease-out curve: one where any motion is driven by time rather than by a finger
- formats: number and date
- voice: the product's, in one phrase — what it sounds like and how far from plain it goes. The
  bans in anti-slop.md that turn on voice read this entry
- recorded exceptions: anything this skill bans by default that this product uses on purpose, each
  with the reason it suits this product. An exception nobody wrote here is not an exception

Motion entries stay out of the declaration entirely where the product has no motion. A declaration
is complete when every entry that applies to this product is filled, not when every line above has
something on it.

Entry names are the words each line above opens with, as given; the scope of change entry holds
one of the answers or states above, as given. Values, reasons, and what is named as kept are in
the user's language — the rule is under Language in SKILL.md.

A screen needing a value the declaration lacks is a request to amend the declaration. The
session answers it: decides the value from the declaration's reasons and the rules here, writes
the value and its reason into the entry before building the screen, and says what it added. The
choice is not put to the person as a question; the person changes it by editing the declaration.

The layout concept and the product principles belong to the plan, not to this declaration. The
structure of a surface belongs to layout.md.

## What the declaration locks that a plan does not

- The accent is one value, decided before the first screen and unchanged after it. Three places
  earn it: whatever the screen most wants pressed, whatever is currently selected, and progress.
  Everywhere else the neutrals do the work.
- A grey family is either warm or cool. One product uses one of them.
- Two families differ in classification, not only in name — a serif paired with a sans, or a text
  face paired with a monospace. Two sans families, or two serifs, are one choice made twice: cut
  to one.
- A screen shows type at display size once. A second occurrence splits the attention the first one
  was there to collect, so a screen that genuinely needs two — a page heading and a figure the
  page exists to show, say — declares both and states what each is for. Undeclared, it is one.
- Stress comes from the face already in use, through its weights and its italic. Reaching past it
  for a second family to make one word louder is a defect.
- Spacing: one base unit, either 4 or 8. Every margin, padding, and gap is a multiple of it.
- Radius: one scale, and a sentence naming which element takes which step — actions are pills,
  containers the large step, inputs the small one. That sentence is what makes a mixed set
  checkable; without it, any radius can be argued for.
- Elevation: a shadow states how far a surface sits above the one behind it, and nothing else.
  Declare the steps with what each one means — resting surface, raised surface, overlay — and use
  that one set across the product.
- Formats: declare the abbreviation threshold for large numbers, trailing-zero handling, currency
  placement, and date localization.
- A gradient needs a reason tied to the subject, and that reason goes on the gradient entry. A
  product using none declares none, which is also an answer.

## Deriving the declaration

The declaration is derived from the subject — the brief, the product's own material, and the
references studied — on every project, with code or without. A value in the code is not a
decision; a decision is a value written in the declaration with its reason. Where code exists,
read it beside the derivation to compare, never to adopt: a scaffold ships values nobody chose,
and reading them in would make them decisions every later session obeys.

1. Derive every entry from the subject, each with the reason that chose it — what in the
   subject, or which studied reference, settled it.
2. Where code exists, find where its values live and write the map in the record
   (`.design/record.md`): one line per definition site — the file, what it defines, how it was
   found. Search by value, not by file name: color literals and the variables that hold them,
   typeface loads, size and weight steps, spacing, radius and shadow values, transition and
   spring settings, icon imports. The files where the hits cluster are the definition sites; the
   rest are literals in components. Where the code carries no values, the map says so in one
   line.
3. Compare entry by entry and write every difference in the record's comparison: the entry, the
   declared value with its reason, the code's value, where it lives, how often it appears.
   Contradictions inside the code — three accent hues, two grey families, radii fitting no
   scale — go on the entry's row in the same table, not in a list beside it. A difference that
   belongs to no entry is not the comparison's to record; the Inspections find it.
4. Show the declaration and the comparison before writing the declaration — its scope of change
   entry written as not yet asked where code exists, and as not applicable where none does.
   Nothing in the code changes here. Once the declaration is agreed, the code's values are what
   the counts in rules/anti-slop.md catch and `fix` replaces.
5. A person who wants a value the code carries keeps it by amending the declaration, where
   decisions live — not by having init read it in.

## Inspection

This file checks the declaration itself. Color, radius, shadow, spacing, and type values rendered
in the interface are counted in rules/anti-slop.md; rendered number and date strings in
rules/copy.md; the declared springs and curves as they run, in rules/motion.md. Values inside
artwork that a style system governs are counted in rules/assets.md.

### The count

- Applicable entries left unfilled, counted against the list in Declare the set first: 0. A
  declaration file that does not exist counts as every entry unfilled. An entry that does not
  apply to this product is recorded as not applicable with one line saying why, and counts as
  filled. An entry written under another name, or holding an answer or state in other words
  than this file gives, counts as unfilled.
- Type-scale steps missing a stated weight or letter-spacing: 0. Steps missing a stated width,
  counting only families that carry a width axis: 0. Steps set over columns of numbers with no
  stated figure treatment, counting only families that carry tabular figures: 0.
- Declared typeface families sharing a classification: 0.
- Springs named, where any motion follows a finger: 2. Ease-out curves named, where any motion is
  driven by time: 1. Where the product has neither, both counts are 0.
- Values this pass needed that were not written back into the declaration: 0.
- Declaration entries with no reason from the subject beside them, the scope of change
  excepted: 0.
- Where code exists, differences between the code and the declaration missing from the record's
  comparison: 0.
- Gradient entries in the declaration carrying no reason: 0. Gradients rendered without a matching
  entry are counted in rules/anti-slop.md.
- Color values in the declaration carrying no stated job, the grey family excepted: 0.
- Where the declaration names two themes, values hard-coded per theme rather than resolved from
  the one declaration: 0. A one-theme product reports 0.
- Symbol sets named in the declaration: 1 where the interface draws icons at all, 0 where it draws
  none.

### The checks

- Each declared value. State what in the subject chose it. A reason that would hold just as
  well for an unrelated product is not a reason, and that entry goes back.
- The accent. State which of the three places it earns — the primary action, the active state,
  progress — appear on this screen, and confirm nothing else took it.
- The radius sentence. Read it back and point at one element per step it names.
- Each fallback stack, on the web. Render the screen once with webfonts blocked, and record what
  that first frame showed — on a slow connection it is the first frame of the product a reader
  sees.
- The map, where code exists. Point at each definition site it names and say how it was found;
  a site the search missed goes in.

## Platform notes

Where the declaration lives differs by platform. The rules above do not.

- Web: custom properties on the root element, or the theme object of the styling layer in use.
- iOS and Android native: the system semantic color roles plus an asset or resource catalog, so
  light and dark resolve from one declaration.
- iOS: rounded rectangles take the platform's continuous corner curvature; a standard circular
  radius reads subtly foreign next to native surfaces.
- Cross-platform runtimes: a shared constants module both platform targets import.
- The map's search starts where the declaration lives, above, and goes on into the rest of the
  code; the search is the same on every platform. Web: the places above, plus `@theme` in
  Tailwind v4, a theme provider's object, a preprocessor's variables file, and the font loader or
  `@font-face`; literals sit in component styles and in arbitrary-value utility classes, which
  resolve to values only in the compiled stylesheet. Where an analyzer that lists every color,
  size, radius, shadow, and transition with its file and line is available, run it — on the
  compiled stylesheet too — and put its output in the record; with none, the search is the map.
- iOS: the asset catalog's colorset JSON, plus the theme or constants the views import. Android:
  `res/values` — colors, dimens, styles, themes — and the UI toolkit's theme objects.

Where the platform ships semantic roles for text, backgrounds, fills, and separators, map the
declared tokens onto those roles rather than hard-coding values.
