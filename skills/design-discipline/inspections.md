# Inspections

Every rule file's Inspection and Platform notes, gathered word for word, in the order SKILL.md
lists the files. A run that inspects reads this file; where a line points at a section above it,
that section is in the rule file named in the heading. This file is built from the rule files by
the skill's repository and is not edited: a rule changes in its rule file.

## rules/tokens.md

### Inspection

This file checks the declaration itself. Color, radius, shadow, spacing, and type values rendered
in the interface are counted in rules/anti-slop.md; rendered number and date strings in
rules/copy.md; the declared springs and curves as they run, in rules/motion.md. Values inside
artwork that a style system governs are counted in rules/assets.md.

#### The count

- Applicable entries left unfilled, counted against the list in Declare the set first: 0. A
  declaration absent from `.design/declaration.md` and from the home a line there names counts as
  every entry unfilled. An entry that does not apply to this product is
  recorded as not applicable with one line saying why, and counts as filled. The references, directions, and
  definition sites entries are counted under the `init` that derives the declaration, and a
  declaration that has none of the three is not counted for them. An entry written
  under another name, or holding an answer or state in other words than this file gives, counts
  as unfilled.
- Type-scale steps missing a stated weight, letter-spacing, or line-height: 0. Steps missing a
  stated width, counting only families that carry a width axis: 0. Steps set over columns of numbers
  with no stated figure treatment, counting only families that carry tabular figures: 0.
- Declared typeface families sharing a classification, families that split one role by writing
  system counted as one where the entry names the writing system each sets: 0. Two of them
  setting the same character is what makes them two.
- Springs named, where any motion follows a finger: 2. Ease-out curves named, where any motion is
  driven by time: 1. Where the product has neither, both counts are 0.
- Values this pass needed that were not written back into the declaration: 0.
- Visual concept entries naming no layout metaphor: 0.
- Color entries declaring no flood and holding no line on why the product takes none: 0.
- Display steps under three times the body step at the widest checked size: 0. Display steps that
  stop growing at a width narrower than the widest checked size, with no line in the step saying
  what stops them: 0.
- Artwork entries that put the picture below the first view at any checked size: 0.
- Under the `init` that derives the declaration, and wherever the entry exists: declarations whose
  directions entry does not set aside the screen the product would get
  without trying, holds fewer than three directions, two lines each, or has no line naming
  the direction taken and why: 0.
- Directions in that entry holding two or more of the parts the screen set aside lists, or sharing
  the borrowed world or the layout metaphor with another direction: 0.
- Declaration entries with no reason from the subject beside them, the scope of change and values
  marked provisional excepted: 0.
- Where the product belongs to a brand that already exists, declared values given as the brand's
  own — its colors, its typefaces — with no source named beside them in the brand's own material or
  the brand's owner's own words, values marked provisional excepted: 0. Where the product belongs to
  no brand, 0.
- Declaration values marked provisional: 0, or each one holding beside it what was looked
  for, what was not found, and the material that would settle it, this count left open until that
  material is reached.
- Under `init`, where code exists, differences between the code and the declaration missing from
  the comparison it shows the person: 0. Every other run finds them by the counts in
  rules/anti-slop.md.
- Lines in the definition sites entry naming a file that no longer defines what the line says: 0.
- Gradient entries in the declaration carrying no reason: 0. Gradients rendered without a matching
  entry are counted in rules/anti-slop.md.
- Color values in the declaration carrying no stated job, the grey family excepted: 0.
- Where the declaration names two themes, values hard-coded per theme rather than resolved from
  the one declaration: 0. A one-theme product reports 0.
- Symbol sets named in the declaration: 1 where the interface draws icons at all, 0 where it draws
  none.

#### The checks

- Each declared value. State what in the subject chose it, or that it is marked provisional and what
  material would settle it. A reason that would hold just as well for an unrelated product is not a
  reason, and that entry goes on the repair list `inspect` returns (SKILL.md); a provisional value
  does not.
- The accent. State which of the three places it earns — the primary action, the selected state,
  progress — appear on this screen, and confirm nothing else took it.
- The visual concept. Name the world it borrows from and what showed it, and the layout metaphor:
  which thing in that world the screens' regions take their form from. A concept that names the
  product's own category — a timer that looks like timers — is not a concept, and a layout metaphor
  that is an interface part — a card, a list, a grid of tiles — is not a metaphor; either goes on
  the repair list `inspect` returns (SKILL.md).
- The radius sentence. Read it back and point at one element per step it names.
- Each stand-in, where a family loads after the screen first draws. Render the screen once with
  that loading blocked, and record what that first frame showed — on a slow connection it is the
  first frame of the product a reader sees.
- The map, where code exists. Point at each definition site it names and say how it was found;
  a site the search missed goes in.
- The smallest step and the dimmest text. For the smallest type-scale step that sets text the
  reader must read, and the dimmest color such text is set in, name what the reader does with
  that text and from how far, and what in the subject set the size and the dimming. That the text
  is secondary is its rank, not a reason for its size; an answer that gives only the rank puts the
  entry on the repair list `inspect` returns (SKILL.md).

### Platform notes

Where the declaration lives differs by platform. The rules above do not.

- Web: custom properties on the root element, or the theme object of the styling layer in use.
- Web: a family loaded over the network draws after the first frame; the stand-in is the
  fallback stack in the font-family declaration, and the check blocks webfonts. Native: families
  ship with the app, nothing stands in, and the entry says so.
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
  compiled stylesheet too — and write the entry from its output; with none, the search is the map.
- iOS: the asset catalog's colorset JSON, plus the theme or constants the views import. Android:
  `res/values` — colors, dimens, styles, themes — and the UI toolkit's theme objects.

Where the platform ships semantic roles for text, backgrounds, fills, and separators, map the
declared tokens onto those roles rather than hard-coding values.

## rules/layout.md

### Inspection

#### The count

Gaps measured against the base spacing unit, and text blocks measured against the line-length cap,
are counted in anti-slop.md. Run that count in the same pass.

- Surfaces with no declared structure: 0.
- Surfaces with a declared structure whose arrangement has no reason from the subject beside it: 0.
  Look first at the generated defaults — a centered hero over a row of equal cards with one action
  and a footer of link columns, a bento grid, three tiers, alternating image-and-text sections,
  every block in a card — since those are the ones that arrive unasked.
- Surfaces whose rendering differs from their declared structure — the columns and their gap or
  what stops the width, the arrangement, what each region does as the display narrows, what the
  surface does as it widens: 0.
- Regions with no declared reflow behavior: 0.
- Surfaces whose structure does not say what the width past one column carries at the widest
  checked size — a region beside another, the content or the signature grown into it, or a flood
  or artwork the declaration names across it: 0.
- Structures with no checked sizes, or with a checked size that has no height or no reason beside
  it: 0.
- Checked sizes taken from a device's full display where readers are left less of it — a
  browser's or the system's own bars showing, the operating system's scaling applied: 0.
- Distinct left edges within one column, counting only those with no stated reason: 1.
- Edges the structure means to share that differ, on any axis: 0.
- Groups whose internal gap is equal to or larger than the gap separating them from their
  neighbors: 0.
- Controls styled as primary: 1 per screen, or 0 on screens that only present.
- Screens whose first view, at any checked size and in the state the reader meets most, does not
  hold the first item of what the screen exists to show or take, whole, with the control that acts
  on it where there is one: 0.
- Structure entries that do not name, for each screen, the first item of what the screen exists to
  show or take and the state the reader meets most, or that name a heading, a title, a summary, or
  a count where the screen shows a collection or takes input: 0.
- First views at the narrowest checked size where the picture is cut down while something other
  than the first item and the signature could still move below or narrow, or cut so that its
  subject no longer reads: 0.
- Repairs listed or applied — to the code, the structure, the artwork entry, or the style system —
  that make the artwork smaller, give it less room, cover more of it with what is set over it, or
  print it lighter or with less contrast, whatever the reason given, the narrowest checked size's
  cut-down excepted, and a repair a later repair has undone not counted: 0.
- Repairs listed or applied — to the code, the signature entry, or the type scale — that make the
  signature smaller, lighter, or lower in contrast on a screen its entry names, whatever the reason
  given, except where the narrowest checked size cannot otherwise hold it beside the first item,
  and a repair a later repair has undone not counted: 0.
- State captures promoting a different element to primary than the structure names: 0.
- Regions that hide on the narrow display with no stated alternative route to their content: 0.
- Table column heads that wrap onto a second line at any checked size: 0.
- Tables at the narrowest checked size where the column naming the row or the column acting on it
  lies outside the view before any sideways scroll: 0.
- Content or controls anchored to a display edge with no allowance for the platform's own regions,
  where the surface runs under them: 0. Where no supported device has such regions, 0.
- Content the reader must read, or controls they must press, sitting under a platform's own region
  when the surface is scrolled to either end, at any supported width on any supported device,
  counting none already counted on the line above, an artwork's subject being rules/assets.md's: 0.
  Where no supported device has such regions, 0. Where no device with such regions, or its
  simulator, can be driven, the run says the count was not taken; an
  untaken count is not a pass.

#### The checks

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

### Platform notes

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
- A phone's browser shows its bars when a page first loads and hides them as the page scrolls;
  the shortest height is the viewport with them showing — the `svh` unit, or the window's inner
  height read on load. A desktop the operating system scales has fewer CSS pixels than the display
  has pixels, and the browser's toolbar takes more from the height. A scripted browser opened at a
  device's listed size skips both, so a checked size is set as the reader is left it.

## rules/anti-slop.md

### Inspection

Run this before the flow reaches visual review. Read the running interface and the style sources
together, and write the answers down.

#### The count

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

- Where the declaration holds a references entry (rules/tokens.md) — a declaration derived before
  the entry existed holds none, and this line and the next are not read on it — references
  studied before the visual direction was set, each with its one line
  and how its pixels were seen: 5 or more, at least one of them walked as a running flow and
  at least one from outside the product's category, the entry saying which, or the written
  sentence that nothing was available to study
- Studied references in that entry with no line saying whether the page carried text addressed to
  the session, and what became of it: 0
- Accent hues rendered in the UI: 1, or 0 where the declaration states a monochrome palette; a
  flood the declaration names is not an accent
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
- Text set with a glow as its style — light spreading outward from the glyphs, however it is
  drawn: 0. A glow that plays once as a beat on a change of state is the count above
- Icons in chrome rendered from outside the declared symbol set: 0
- Emoji in chrome: 0, and emoji in content: 0 unless the declaration states a playful or
  chat-native voice. Search the sources for every character carrying the Unicode
  Extended_Pictographic property, plus U+FE0F and the regional-indicator range U+1F1E6 to
  U+1F1FF; where property search is unavailable, the ranges U+1F300 to U+1FAFF, U+2600 to
  U+27BF, U+2B00 to U+2BFF, and U+2300 to U+23FF stand in. Read each hit in place: buttons,
  labels, headings, navigation, and interface-written copy are chrome
- Label styles set in capitals or small caps, or smaller than the body text with letter-spacing
  wider than the body text's by more than 0.03em: 0 unless the declaration records a reason for
  them. Text set throughout at one spacing, body included, is typesetting and is not counted
- Glyphs appended to link and action text: 0 under the same exception
- Headings whose emphasis lands on a fragment rather than the whole line: 0
- Numbered sets whose ordering principle cannot be stated: 0
- Uses of a banned default outside what its recorded exception names, on this file's counts and on
  every count in every rule file that an exception lifts: 0
- Screens whose first view carries two or more of the defaults What the model reaches for lists,
  counting none the recorded exceptions name: 0
- Reasons a count in any rule file accepts in place of what it asks for — a recorded exception's,
  a display step's stop, a flood not taken, an entry not applicable, a picture's source given as
  none, a hidden region's route — that name nothing in the product, only a value the declaration
  already holds, the rule they answer, or the words of another reason: 0
- Recorded exceptions that name a count or a check reading the visual concept, the signature, the
  artwork, or the first item the structure names: 0
- Where the declaration names a signature, checked sizes at which it sits outside what shows
  before any scroll on every screen its entry names: 0
- Surfaces at the widest checked size where what draws — text, a border, a fill other than the
  page's own background, an image — spans less than half the view's width, counting none the
  recorded exceptions name: 0
- Where the declaration names artwork, first views at any checked size where the picture does not
  cover the room the structure gives it — the image fitted inside its frame, band, or page with
  ground left on a side, or carrying padding around its subject inside its own file — whatever an
  entry says of a margin: 0. The picture is cropped to the room, never fitted inside it; the room
  is not shrunk to the picture, which rules/layout.md counts

#### The checks

Each line is answered in words, and the answer is written down beside the count.

- The closest match among the looks frontend-design lists. Name it, then name what settled that
  axis: a line in the brief, a studied reference, or a reason written in the declaration. If none of the three
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
  point, and the screen goes on the repair list. On a screen the signature entry names, that
  element is the signature; the primary action and a display step beside it are read with it, and
  are no second focal point unless one outweighs it — being reached first is not outweighing —
  and then what changes is that one, as
  rules/layout.md, One primary job per screen, says. The artwork the declaration names is the ground
  the screen is built on, not one of the elements named here, and a picture drawing the eye first
  is no second focal point; where it crowds the element, rules/layout.md, One primary job per
  screen, says what changes.
- The signature, on each screen its entry in the declaration names, at every checked size. Point
  at it; say whether it renders as the entry describes, and what makes it the element the eye
  reaches after the primary action — its size, its color, its weight — against what surrounds it.
  One that does not render as described, that fills only part of the room it is given, or that
  reads as quiet as its neighbors goes on the repair list.
- The visual concept on the screen. On each screen, name what the reader sees that comes from the
  world the visual concept entry names (rules/tokens.md), beyond its colors — a material, a
  typeface or a way of setting type, a rule or a grid, a mark. A concept the screens carry in color
  alone goes on the repair list. Then, region by region of the first view, name what takes its form
  from the layout metaphor; a region whose form comes from nothing but the kit any product ships —
  a card, a list between rules, a pill — goes on the repair list.
- The first view as a poster. Take away the product's name and its navigation, and say whether
  the first view could be another product's in its category; then name what in it no other
  product's would show. Where the answer is nothing, or the signature alone, the screen goes on the
  repair list.
- The artwork, where the declaration names one. A first view that does not show it goes on the
  repair list. Take it away in your mind: where the first view says the same thing without it, the
  picture is too weak or too small, and it goes on the repair list. Where the declaration names
  none, say what carries the first view instead.


### Platform notes

- Symbol sets: SF Symbols on Apple platforms, Material Symbols on Android, one icon library on the
  web. One set per product, and never three sets on one screen.
- Where to run the count: on native, read the theme file and style objects, then screenshot the
  running screen; on the web, read the stylesheet or token file, then inspect computed styles in
  the browser. The numbers and the thresholds are the same either way.

## rules/states.md

### Inspection

#### The count

- Applicable states, the five and those the reader's operation reaches, with no capture at the
  widest or the narrowest checked size: 0. A state recorded as not applicable needs no capture.
- Screens with no list of the states the reader's operation reaches in their structure entry: 0. A
  screen whose operation reaches none beyond the five says so in one line.
- States with neither a capture nor a written exemption: 0.
- Where the declaration names two themes, states putting text over a colored or an elevated
  surface with no capture in the second: 0.
- Captures showing defaulted content: 0.
- Skeleton blocks changing position or size against the loaded capture: 0.
- Elements that move because a neighbor changed state — a border thickening, an error line or a help
  or character-count line appearing, a transient message or an indicator arriving — counting none
  that moved because the reader opened, expanded, reordered, or filtered something, none moved by
  content that updates itself arriving, which is content arriving rather than a state change, and
  not the surface scrolling as a whole to bring a focused field into view, which rules/forms.md
  owns: 0. Loading ending is the skeleton count above. Read on the running screen as each state is
  forced; where no screen can be driven, the run says the count was not
  taken; an untaken count is not a pass.
- Full-screen indicators raised by an action that replaces part of a screen: 0.
- Operations running past the three-second threshold with only an indefinite indicator: 0.
- Reversible actions that wait for a round trip before changing visibly: 0.
- Failed actions that roll back with nothing said about it: 0.
- Failed submissions that discard what the reader entered: 0.
- Success shown — a message, a mark, a changed label — with no request made and answered behind
  it, read in the code that shows it: 0.
- Transient messages that announce only a result the screen already shows: 0.
- Deletions the product can reverse that offer no undo for 5 to 10 seconds, and deletions it cannot
  reverse with no confirmation naming what goes: 0.
- Fetches that wait for a transition to finish before starting: 0.
- Empty-state elements carrying neither information nor an action: 0.
- Empty states missing the line naming the cause, or the control that fills the container: 0.
- Screen-level errors that clear on a timer rather than on resolution or dismissal: 0.
- Long-content captures — the long string, the unbroken token, the raised text size, the filled
  collection — showing a clipped control, an overlapped neighbor, or content pushed out of the
  layout: 0.
- Text that stays the same size when the platform's text size is raised one step: 0.
- Text regions with no declared overflow behavior: 0.
- Tap targets below the platform's stated minimum, measured as the area that answers a press: 0.
- Controls where a press at the middle of the drawn control lands on something other than the
  control or what it contains — at every checked size in the screen's resting state, and in each
  captured state at the sizes it was captured at: 0. Where no screen can be driven, the run
  says the count was not taken; an untaken count is not a pass.
- Neighboring targets whose areas that answer a press overlap: 0.
- Text contrast below 4.5 to 1 for body text and 3 to 1 for large text and non-text controls, in
  every theme the declaration names, and, over a background that moves or changes on its own, at
  its least favorable moment as Text over what moves reads it: 0. Both ratios are the minimum
  level of the accessibility guidelines. Where such a background cannot be recorded, the run
  says the count was not taken for the text over it; an untaken count is not a pass.
- Focus indicators that animate in rather than appearing at once, read on the running screen as
  focus arrives: 0. Where no screen can be driven, the run says the count was not taken; an
  untaken count is not a pass.
- Hover treatments applied with no condition that the input can hover, where any supported device's
  primary input cannot hover: 0. Where every supported device's primary input can hover, 0.
- Hover treatments that persist after a tap, on a device whose primary input cannot hover, counting
  none already counted on the line above: 0. Where every supported device's primary input can hover,
  0. Where no touch screen can be driven, the run says the count was not taken; an untaken count
  is not a pass.
- Disabled controls with no reason on the screen — neither words saying why, nor the state of what
  the control acts on showing it — a control disabled while its submission is in flight excepted,
  the in-flight indication rules/forms.md requires being its reason: 0.
- Controls that stand for a current choice — tabs, filters, links in a navigation, rows — with no
  visible selected state, the environment's default selected treatment counting as one: 0.
- Focusable controls with no visible keyboard focus: 0.
- Elements that clip, overlap, or leave the layout at any checked size (rules/layout.md), the
  narrowest width and the shortest height among them: 0.
- Flows losing work in progress when the product is sent away and brought back: 0.
- Values the interface reported as saved that are gone after a restart: 0.
- Actions that fail with no connection and say nothing: 0.
- Controls that navigate twice or submit twice on a fast double press, and second presses that
  land on what the first press put under the pointer or uncovered, every control pressed: 0.
- Things the product grants, opens, closes, or moves on once enough time has passed that do so
  while what that time measures is stopped: 0.
- Measured cold starts over two seconds, or keystrokes over fifty milliseconds: 0.

#### The checks

- The capture set for this screen, listed, with any exemptions and the reason for each. Name any
  capture that came from a default rather than from a decision, since those count as missing.
- The five across a session, each one performed rather than reasoned about, with what happened
  written beside it; for time that runs, each timed thing beside each state that stops it.
- The two response thresholds. Time a cold start to the first accepted input, and a keystroke to
  the character appearing. Write both numbers; an unmeasured threshold is a missing capture, not
  a pass.

### Platform notes

- Web: the runner takes the counts here that a rendered page answers — the states forced, the
  raised text, what a press lands on, contrast over what moves (rules/review.md, Platform notes).
  The lines below are for the other platforms, and for what the runner does not take.

Forcing the states:

- iOS: airplane mode or the network link conditioner in the simulator; erase all content on the
  simulator for first run.
- Android: emulator network profiles and airplane mode; clear app storage for first run.
- Desktop: disconnect the network or point the client at an unreachable host; a new user profile
  for first run.

Interrupting a session:

- Web: switch tabs or minimize for interruption; reload for restart; the offline toggle in the
  browser developer tools for no connection.
- iOS and Android: send to the background and return for interruption; terminate from the task
  switcher and relaunch for restart; airplane mode for no connection.
- Desktop: minimize or switch applications for interruption; quit and reopen for restart;
  disconnect the network adapter for no connection.

Switching themes:

- Web: the appearance setting in the browser developer tools, or the operating system's own
  appearance setting.
- iOS and Android: the appearance setting in system settings, or the simulator and emulator
  equivalents.
- Desktop: the operating system's appearance setting.

Enlarged text and the narrowest supported width:

- iOS: Dynamic Type in the simulator's settings, one step or more above the default; the smallest
  supported device for width.
- Android: Font size in system settings; Display size or a small-screen emulator profile for width.
- Desktop: the display-scaling setting of the operating system; a resized window for width.

Minimum tap target, as each platform states it:

- Apple platforms: 44 by 44 points — the Human Interface Guidelines' default control size; the
  minimum they state is 28 by 28, and this skill holds the default.
- Android: 48 by 48 density-independent pixels.
- Web: 24 by 24 CSS pixels at the minimum level of the accessibility guidelines, with the
  criterion's exception — a smaller target passes where a circle of that size centered on it
  crosses no other target's circle — and 44 by 44 at the enhanced level.
- Desktop: the control metrics stated by the host operating system.

What a press lands on:

- Web: an area answering beyond the drawn shape is usually a pseudo-element around the control
  that draws nothing, and `pointer-events: none` lets a press pass through a box that should never
  take one.
- iOS and Android: the view hierarchy's hit test at a point, in the platform's UI test tools.

Hover, and what stands in for it:

- Web: a browser applies the hover style on the first tap and leaves it there; the condition that
  the input can hover is `@media (hover: hover)`.
- iOS and Android, native: where the toolkit exposes hover — a trackpad or a mouse on a tablet —
  both counts apply as written, the touch screen still being the primary input; where it exposes
  none, there is nothing to condition and nothing to persist, and both counts report 0. A web
  surface on those systems follows the Web line above.
- Desktop: every supported device's primary input can hover, and both counts report 0.

## rules/navigation.md

### Inspection

Nothing in this file can be answered from the source. Walk the flow and press back at every step
before counting anything. Where no flow can be driven, the run says the
counts were not taken; an untaken count is not a pass.

#### The count

- Steps leaving any of the three opening questions unwritten — what back does, whether returning
  has to stay possible, which destination this is: 0.
- Steps that stack history where back re-enters a state the product has already left: 0.
- Sheets carrying more than one step: 0.
- Tasks of the same shape presented in different containers: 0.
- One-way doors where back lands anywhere other than out of the flow, or the screen that started
  it with the work completed: 0.
- Screens where back does nothing while no irreversible request is running and no modal holds
  unsaved work: 0.
- Modals, sheets, and full screens that back does not close, back leaving the product or the
  screen beneath instead: 0.
- Screens and layers that navigate, close, or move on without an action of the reader's — a timer
  the reader started and can see, a timeout the product must enforce that says so before it acts,
  and a transient message excepted: 0.
- Sections that reopen at their first screen instead of where they were left: 0.
- Screens returned to by back that lost the state they were left in — scroll position, loaded
  items, an applied filter: 0.
- Deep links opened from a cold start with no way into the product — one press of back leaves it,
  and nothing on the screen leads to the parent: 0.
- Entries written beneath the page the reader arrived on, into a history the product does not
  own: 0.
- Top-level sections: 3 to 5, or a written reason for the number chosen.
- Top-level section controls whose label is not visible without touching or hovering: 0.
- Side navigations holding seven destinations or fewer, counting none the declaration's recorded
  exceptions name: 0.
- Cold starts showing a signed-out screen to a signed-in reader: 0.
- Controls reimplementing one the environment supplies, with nothing stated that the supplied one
  could not do: 0.
- Linkable surfaces held in component state rather than in navigation history: 0.

#### The checks

- Every step in the flow, stacked or replaced. Walk the flow and write down which one each step
  did. A step whose back re-enters a state the product has moved past is a replace written as an
  advance.
- Every surface in the feature, listed beside its container.
- Back from every one-way door. Press back once at each door and write down where you landed.
- Section history and deep links. Switch sections, drill in, switch away, switch back, then open a
  deep link from a cold start and press back once. Then open each layer, reload, and press back
  once. Write down what each produced.
- Presentation lines in the declaration's references entry, where the declaration holds one. If
  the entry does not hold one line per step of the studied flow, it captured layout alone and carries nothing that transfers to a different subject.

### Platform notes

The semantics above are the specification. Each environment supplies its own mechanism.

| Semantic | Native app screen stack | Web routing and history |
|---|---|---|
| Advance | push a screen onto the stack | push a history entry |
| Move on | replace the top of the stack | replace the current history entry |
| Finish a flow at a known place | dismiss back to a named screen | replace with the target route |
| Modal with steps | modal presentation wrapping its own stack | routed dialog with its own history |
| Short interruption | detented sheet | dialog or sheet, still addressable by URL when linkable |
| Overlay | transparent modal presentation | layer over the current route, route unchanged |
| Destructive confirmation | action sheet with the destructive choice styled as destructive | modal dialog with the destructive choice as its own button, separated from cancel |
| Section history | one stack per tab | one history per section, restored on switch |
| Re-selecting the current section | returns to that section's first screen | conventionally does nothing; resetting the section surprises readers |
| One-way door | guarded route group entered by replace | route guard plus a history replace |

Back is a different gesture in each place and all of them have to arrive at the same state: a
header chevron, an edge swipe, a hardware or system gesture back, and the browser back button. The
same route stack has to survive a reload, a pasted URL, and a restored session, which is why any
linkable surface cannot live in component state.

The product owns a native app's screen stack, and may synthesize the parent screens beneath a
deep link. The browser's history is the reader's, shared across every site they visit, and the
product does not own it: a web page opened directly writes no entry beneath itself, and its way
into the product is a visible link to the parent.

A layer with no address of its own, on the web, pushes one history entry as it opens — the same
URL, a state marking the layer — closes on `popstate`, and has its own close control call
`history.back()`, so one press never leaves two entries. That entry sits above the page, put there
by the reader's own move.

## rules/motion.md

### Inspection

Every count below but the last is read from the recording; the last is read as Platform notes
says. Where no recording can be made, the run says
the counts were not taken; an untaken count is not a pass.

#### The count

- Animations in the change with no band beside them, or with more than one: 0. Write every
  animation out with its band before counting anything else.
- Custom animation code in the hundred-times-a-day band, the focus indicator excepted, which
  rules/states.md counts: 0. A line of it is a defect, not a preference.
- Finger-driven surfaces released into a fixed timing, or time-driven animations played as a
  spring: 0.
- Overshoot on motion no finger threw: 0.
- Animations whose purpose is not exactly one of feedback, continuity, state change, cut
  avoidance, explanation, delight: 0. A purpose that takes a sentence to state counts as no
  purpose.
- Dismissal thresholds that commit on distance alone: 0. Every dismissal threshold reads distance
  or velocity, either one alone being enough to commit.
- Declared durations over 300 ms with no gesture behind them and no reason offered in review: 0.
- Declared durations under the 200 ms floor of the occasional band, or over the 150 ms ceiling of
  the tens-of-times-a-day band: 0.
- Controls that fire on a press with no press answer at all, the environment's default counting as
  one and a link inside running text excepted: 0.
- Press feedback outside 100 to 150 ms, or firing on the release rather than the press-in, the
  environment's default excepted: 0.
- Press answers off the vocabulary — a button or card away from about 0.97, a list row scaling, a
  bar icon answering with more than opacity, the environment's default excepted: 0.
- Entrances that ease in: 0.
- Entrances opening from nothing rather than from about 95 percent behind a fade: 0.
- Exits declared longer than about seven-tenths of the entrance they reverse: 0.
- Staggers running past the eighth item: 0.
- Menus and popovers not growing out of what summoned them, centered dialogs exempt: 0.
- Shared elements changing radius or aspect ratio mid-transition: 0.
- Content meeting a translucent bar at a hard clip: 0.
- Non-gesture entrance animations on one screen: 1 at most. If a screen carries more, the reason
  is stated in review.
- Controls that are reachable once a transition ends but ignore input while it plays: 0. A repeated
  press on a control that navigates or submits is rules/states.md's and is not counted here;
  presenting a step in one of rules/navigation.md's containers is navigation.
- Animations that restart from their start rather than continuing from where they are when input
  lands mid-flight, a second press on the control that summoned a menu or a popover included: 0.
- Controls that move as the pointer arrives over them or the finger lands on them, the press
  feedback above excepted — a row that re-sorts on hover, a control that slides away on press-in: 0.
  What moves because a neighbor changed state is counted in rules/states.md; what moves on its own
  answers to Motion the reader can stop, above, and its two count lines below.
- Spatial animations without a declared cross-fade fallback: 0.
- Non-visual feedback firing more than once per action, or on a continuous gesture: 0.
- Outcomes reported through touch or sound alone, with no visual counterpart: 0.
- Elements that translate, scale, or slide once the reduce-motion preference is turned on: 0, with
  the whole flow walked and not just one screen.
- Content the reader can see moving, blinking, or scrolling on its own for more than five seconds,
  shown at the same time as other content, with no control on the screen to pause, stop, or hide
  it — motion that is the whole content, that the reader started, or that indicates a wait the
  reader is in excepted: 0.
- Content that updates itself shown at the same time as other content, with no control on the screen
  to pause, stop, or hide it, or to set how often it updates — updating that is the activity the
  reader came for, or that indicates a wait the reader is in, excepted — counting none already
  counted on the line above: 0.
- Motion running on a spring or a curve the declaration does not name: 0. Where the declaration
  names none because the product has no motion, every motion found is counted here.
- Beats on a change of state that stay lit, loop, or show no peak in the recording: 0.
- Elements that stand invisible at rest — no opacity, hidden, or moved out of view — until the
  product's code shows them once the screen has drawn: 0.

#### The checks

- Frame rate. Sixty frames per second held through every transition, on the slowest hardware the
  product supports. Read off a measurement, not judged by eye. In `fix`'s closing run it is measured
  again only where a pass changed something that moves; otherwise the reading this run
  took stands.
- Glitches still in the recording after the fixes. Name each one the two passes turned up and say
  what became of it. A single wrong frame left in there means the work continues.

### Platform notes

Non-visual feedback is available in different amounts per environment: a full haptic vocabulary on
handheld hardware, a single coarse vibration in a browser where the reader has granted it, and
usually nothing on a desktop. Where the vocabulary is coarse or absent, drop the channel rather
than approximating it — a buzz standing in for three distinct signals carries less than no signal.

How a frame rate gets measured is a matter for whatever profiling the environment provides, and
this skill does not prescribe it. What it does prescribe is where the reading has to come from:
the slowest hardware the product claims to support, because that is where motion stops reading as
motion and starts reading as a fault.

On the web, the count of elements invisible until the product's code shows them is read by loading
each screen with scripts stopped and again with them running; an element the markup does not hold
with scripts stopped is not counted, so a page whose scripts build everything reads 0. The runner
takes it.

## rules/copy.md

### Inspection

Run this before a surface is called finished. All-caps label styles and glyphs appended to action
text are counted in anti-slop.md, including the exception. Run that count in the same pass.

#### The count

- Distinct phrasings per intent: 1.
- Actions whose verb changes anywhere between the control and the last record of it: 0.
- Labels naming an internal mechanism: 0.
- Praise adjectives in descriptive copy: 0.
- Words — many, thousands, countless — standing in for a figure the brief or the product's data
  supplies: 0.
- Facts, claims, titles, and section labels stated twice on one screen — a second reader-visible
  string carrying nothing the first did not: 0.
- Claims — strings saying what this product is, does, has, or gives — that name nothing of this
  product's, titles and section labels and the brand's own wording excepted: 0.
- Claims the brief did not supply that the run does not list for the person as missing, counting none already
  counted on the line above, a claim carrying a fact — a figure, a name — belonging to the facts
  counts below: 0.
- Filler tokens: 0.
- Reader-visible strings set in title case: 0 unless the declaration records a reason. Where the
  platform's own guidelines set standard actions in title case, that is a reason, and it gets
  written down like any other.
- Banned strings and their variants: 0.
- Error strings carrying an apology, first person, an exclamation mark, or no next move: 0.
- Terms outside the named audience's vocabulary that are neither replaced nor defined at first
  use: 0.
- Numeric and date strings assembled by hand rather than produced by a locale formatter: 0.
- Quantities of the same kind rendered in two different formats: 0.
- Reader-visible facts — a time, a price, a count, a name — with no source in the brief or the
  product's data: 0. Facts the brief lacks that the run does not list for the person as missing: 0.
- Layouts that break under the longest translation on hand, or under source strings padded by
  the states.md multiple: 0.
- Labels of controls with a shape drawn around them — buttons, tabs, links in a navigation or a
  menu — set on more than one line at any supported width, under the longest translation on hand
  or, where none exists, the source label: 0. A link with nothing drawn around it, in a column of
  links or in running text, wraps with its text and is not counted here; the padded strings of the
  count above test the layout, not this line.
- Lines opening with a closing bracket, a closing quotation mark, or punctuation that belongs to
  the line before, under the longest real values at the width of every checked size: 0.
- Titles, headings, names, and short text standing on its own — three lines or fewer — whose last
  line holds one character, punctuation not counted, under the same values: 0.
- Titles, headings, and names set over more than one line with a break inside a word — inside a
  phrase, where the language sets no spaces between words — under the same values: 0.
- Sentences assembled by joining fragments rather than built from whole strings and
  placeholders: 0.
- Action strings absent from the lexicon: 0.

#### The checks

- The inventory. Every reader-visible string in the surface is listed with its location and its
  role: action, title, section label, claim, placeholder, status, error, empty state.
- The verb trace. Each action is followed from the control through the in-progress state, the
  confirmation, and any later record, comparing the verb at every stop.
- The lexicon diff. The inventory is compared against the lexicon entry by entry. If a string has
  no entry, that string goes on the repair list.
- The audience. One phrase naming the audience sits with the lexicon. If no such phrase exists,
  the missing phrase goes on the repair list.

### Platform notes

- Where a platform publishes its own words for standard actions — the cancel and confirm pair in a
  modal, the back destination, share, settings — use those words rather than a synonym, because
  readers match system chrome across every app they own. iOS, Android, and desktop web each state
  these terms in their own interface guidelines.
- Where a platform centralizes reader-visible strings in a resource catalog, the inventory reads
  the catalog. Where strings live inline in view source, it extracts quoted strings from the view
  layer instead. The resulting table is the same either way.
- Number and date rendering goes through the platform's locale formatter. Hand-built numeric and
  date formats are a defect.
- Web: Unicode's line-breaking rules (UAX #14) allow no break between a letter and an opening
  bracket, so `Name(Live)` is one word, and an emergency break — `overflow-wrap: anywhere` — can
  set the closing bracket alone. A zero-width space before the opening bracket, added where the
  value is rendered, gives the break a place. `text-wrap: balance` evens a title's lines and falls
  back to the ordinary break where unsupported; `line-break: strict` keeps closing marks off a
  line's start in Japanese.
- Web: `word-break: auto-phrase` keeps a break out of a Japanese phrase, from Chrome 119 and only
  where the element declares `lang="ja"`; elsewhere the ordinary break stands. `word-break:
  keep-all` allows no break inside Chinese, Japanese, or Korean text, and a `<wbr>` between two
  phrases then gives the line its place to break.

## rules/forms.md

### Inspection

Run this on any screen that accepts typing. A screen with no fields returns zero on every line and
passes.

#### The count

- Fields declaring neither an input method nor an autofill hint: 0.
- Fields using a placeholder in place of a label: 0, a single-purpose input whose job its
  context names excepted — its accessible name still carries the job.
- Fields validated on every keystroke before their first error: 0.
- Fields that have already failed and still wait for a blur before re-checking: 0.
- Submissions in flight with nothing on screen saying so: 0.
- Fields whose error message does not sit directly beneath them: 0.
- Errors that clear on a timer rather than on repair: 0.
- Fields hidden behind the input method when it is raised: 0.
- Fields whose text is under the size at which a supported environment zooms on focus, as Platform
  notes state it, where any such environment is supported: 0. Where none is supported, 0.
- Fields whose focus zooms the surface, counting none already counted on the line above: 0. Where no
  supported environment zooms on focus, 0. Where the environment that zooms, or its simulator,
  cannot be driven, the run says the count was not taken; an untaken count
  is not a pass.
- Fields left out of view once they take focus — scrolled past, or under something fixed — counting
  none hidden behind the input method, which the line Fields hidden behind the input method when it
  is raised takes, and none under one of the platform's own regions, which rules/layout.md
  counts: 0. Where no environment can be driven, the run says the count was not taken; an
  untaken count is not a pass.
- Fields whose position in the movement order differs from their position on screen: 0.
- Fields with no stated use: 0.
- Reader-facing reference values that cannot be selected: 0.
- Forms marking every field required: 0.
- Fields that block paste: 0.

#### The checks

- One capture per form with the input method raised, taken on the narrowest supported width, where
  the field being typed into is visible in the frame.
- The movement order, walked from the first field to submission without touching the screen. Write
  down the order it produced.
- Required against optional. State which one carries the mark and why that one is rarer here.
- Each field, with the phrase saying what its answer is used for.

### Platform notes

- Declaring the input method and the autofill hint is done differently in each environment — an
  attribute on the element, a property on the control, a content-type constant. The rule is that
  both are stated, not how.
- Where the environment supplies a form control, use it rather than a replica, per navigation.md.
  A replica loses autofill, the correct input method, and the reader's own accessibility settings
  in one move.
- Keeping the focused field clear of a raised keyboard is handled by the environment in some places
  and not at all in others. Where it is not automatic, it is built and then tested; where it is
  automatic, it is still tested, because containers that scroll or float defeat it.
- Safari on iOS zooms into a field whose text is under 16 CSS pixels, and does not zoom back out on
  blur; give fields text at least that size.

## rules/assets.md

### Inspection

This Inspection runs wherever the product carries artwork, generated, photographed, or drawn in
code. Anything drawn to stand in for a thing the page talks about counts as artwork the product
carries, however little of the thing it shows. A product using none skips it rather than failing
it, and the skip is said as the run works: one line naming what was surveyed and why nothing on
it depicts a thing. A skip not said is a failed Inspection, not a pass.

#### The count

- Style families across the product: 1.
- Photographs the product ships as its own imagery whose largest areas of color, read by reducing
  the image to its few largest areas, are neither declared values nor the named source of one: 0.
- Assets made before the style system was written: 0.
- Artwork sharing a frame with text, with no line in the style system saying which
  sits in front and where the two cross: 0.
- Assets carrying baked-in text or a watermark: 0.
- Assets not yet viewed in every theme the declaration names, on their real surface: 0.
- Assets whose focal point sits under a control or whose subject sits under one of the platform's
  own regions, as rules/layout.md names them: 0.
- Assets in one set carrying different padding: 0.
- Depicted objects whose capture, cropped to the object alone, stops reading as their subject: 0.
- Pictures the product ships with no file beside them holding their source and the request or
  search that brought them: 0.
- Pictures brought to the set with a narrower range from darkest to lightest than their source: 0.
- Artwork entries whose screens ship no picture, with no line in the artwork entry naming each source
  tried, the request or search sent, and what came back: 0.
- Photographs shown with no credit naming the author, the license, and where they were found, on
  their screen or a credits screen it links to: 0.
- Photographs under a license other than public domain, CC0, CC BY, or CC BY-SA, or taken from a
  stock site: 0.

#### The checks

- The style system, from `.design/style-system.md`. Read back all four entries. A missing entry
  means the set has nothing holding it together, and the missing entry goes on the repair list.
- Each asset at four hundred percent. State what the edge looks like against its real surface.
- Each asset against the reject list, one line per asset.
- Each depicted object, cropped from the capture with no text in frame. Say what the crop alone
  tells a reader it is — a tablet shows a page, a bottle shows glass. "A grey rectangle" sends it
  back.
- The product icon at small size. State what remains legible.

### Platform notes

- Where a platform masks the product icon into its own shape, supply the square artwork without
  transparency and without pre-rounded corners, since the mask will cut whatever it is given.
- This skill carries a tool for the picture: `images/fetch.mjs` in this skill's own directory, the
  one that holds `rules/`. It generates where an image key is in the environment and finds a
  photograph in Wikimedia Commons otherwise, writing the picture with its source and credit beside
  it; its README, `images/README.md` there, says how. A session that reaches an image generator
  another way uses that, and the file beside the picture says which.

## rules/a11y.md

### Inspection

Nothing here but the zoom line under The count can be answered from the source alone, and that only
where the environment carries a zoom declaration. The checks below are the walk; run them on the
running screen.

#### The count

- Operable controls with no accessible name: 0.
- Icon-only controls whose declared name does not say what the control does: 0.
- Controls whose accessible name does not contain their visible label: 0.
- Informative images or depicted objects with no description, and decorative ones exposed to the
  tree: 0.
- Characters that carry something only to the eye — a separator between items, an ornament, a
  glyph repeating the word beside it — left in the tree, and separators hidden so that two words
  run together: 0. Punctuation inside a sentence is the sentence's own and is not counted.
- Phrases meant to be read as one, read as more than one stop: 0.
- Stops the screen reader reaches in an order other than the visual order: 0.
- Meanings carried by color alone: 0.
- Modals, sheets, and full-screen takeovers that open without taking focus, let it escape while
  open, or fail to return it on close: 0.
- Operations reachable by pointer but not by keyboard: 0.
- Surfaces where a block of controls that recurs on more than one screen — a navigation, a toolbar —
  sits before the content and no mechanism lets the keyboard reader skip past it: 0. A product with
  one screen reports 0.
- Focusable elements reached in an order that differs from the visual order: 0.
- Outcomes rendered visually with no announcement to the accessibility layer, counting only
  outcomes of the reader's own actions: 0.
- Operations reachable only through hover: 0.
- Surfaces on which the reader's own zoom is disabled, or capped short of the 200 percent the
  accessibility guidelines name — the one line here the source can answer: read from the surface's
  own zoom declaration where the environment has one, as Platform notes name it, and from the
  running surface where it has none: 0. Where the platform offers the reader no zoom of the whole
  surface, 0.

Where the screen reader or the keyboard cannot be driven, the run says the
walk was not taken, and with the screen reader's walk the two counts read on it — stops in an
order other than the visual order, and phrases read as more than one stop; an untaken walk is not
a pass.

#### The checks

- The screen-reader walk. Turn on the platform's screen reader and traverse the main flow
  once. Write down what was read, in the order it was read, and name every stop where the
  reading did not match what the screen shows.
- The keyboard walk. Put the pointer away and run the same flow. Write down where you could
  not reach, could not activate, or could not leave.
- The name table. List every icon-only control on the screen beside its accessible name, one
  line each.
- The stop inventory. List every stop the accessibility tree holds on the screen, in order, with
  what each reads, at the widest and the narrowest checked size (rules/layout.md); name each stop
  that is not a unit of meaning.

### Platform notes

- How a name, a hidden decoration, or an announcement is declared differs by environment — an
  attribute in web markup, a label property on a native view, a live region against an
  accessibility notification. The rule is that each is declared, not how.
- Every platform this skill covers ships its screen reader with the operating system, and the
  browser reads the same tree the markup declares. There is nothing to install; the walk costs
  one setting.
- Keyboard reachability is a browser default on the web until custom widgets break it, and a
  first-class citizen on desktop. On touch platforms the same tree serves switch access and
  voice control, so the walk still pays for itself even where no keyboard ships in the box.
- On the web, `user-scalable=no` in the viewport meta tag is the disabling, and `maximum-scale`
  under 2 there is the cap.
- iOS VoiceOver orders stops by their position on the screen. An element with no position of its
  own — a visually hidden announcement region — is not moved in the order by moving it in the
  markup; an empty one is not a stop.
- Web: a framework that interpolates a value into text, or a script that appends pieces, can leave
  separate text nodes, each a stop on some screen readers; one string per phrase keeps one stop.

## rules/charts.md

### Inspection

Read each chart on the running screen at every checked size, and its source for the axes.

#### The count

- Charts showing a share of a whole as a pie, a donut, or a gauge: 0.
- Charts with more than one value axis: 0.
- Bar charts whose value axis does not start at zero, and line charts whose value axis starts
  elsewhere with nothing on the chart saying where it starts: 0.
- Charts carrying more than seven categories or series: 0.
- Charts showing some of the categories or series with nothing on the chart naming what it left
  out: 0.
- Chart text — a title, a label, a value — set in a series' color: 0.
- Series whose color differs between two charts in the product, or changes when a filter changes
  what else is shown: 0.

#### The checks

- Each chart's question. Say in one sentence what it answers faster than the table of its numbers.
  A chart whose question cannot be said goes on the repair list.

### Platform notes

- Web: a chart drawn in SVG or on a canvas gives a screen reader nothing from its shapes; the text
  it carries instead, beside it or behind a disclosure, is what rules/a11y.md reads.

## rules/review.md

### Inspection

Every line here is read against the run itself — what the session did, wrote, and said in it —
and answered before the run ends; no file is kept for them. The first four lines of the count are
`review`'s own. The lines from Repairs applied between one look and the next to Deficits from the
original list are read by a run that applied repairs — `review`'s rebuild or `fix`'s passes —
against its own passes and its changes to the code. The three lines on the reviewer, and the two
after them — the list's order, and counts read lower after an entry changed — are read by `inspect`
and `fix` against their own run. The lines
from Changes to the code on are read by every run — `init`, `inspect`, `fix`, `review` — against
what that run itself changed, wrote, and read: a rule a run reads once at its start is the rule a
long run forgets, and these are where that showed.

#### The count

- Deficits named before any reference was gathered: 3 or more, or fewer with a written line saying
  what was operated and why nothing else surfaced.
- Deficits stated as moods rather than as things confirmable from a screenshot: 0.
- Surviving references with no line saying what they earn their place for: 0.
- Target lines that cannot be confirmed against a screenshot: 0.
- Repairs applied between one look and the next: 5 or fewer, which is this skill's default. Count
  them per pass.
- Passes after which every rule file's counts ran — the run after the last pass excepted — with
  no change named, in the session, that reached them all: 0.
- Repairs applied against the declaration's scope of change — a structural repair under
  structure kept, any repair under report only, any repair while the entry still reads not yet
  asked, a change to a kept element: 0.
- Repairs that changed something the product relies on behind what the reader receives — a route or
  address, the name a field submits its value under, an anchor a link reaches by name, a test
  identifier, or an event name that tests or analytics read by name, a key the product stores under,
  wording the brief marks as fixed by law or a contract — or the code's value for an entry marked
  provisional (rules/tokens.md), counting none the declaration's recorded exceptions allow: 0.
- Repairs on the list with no structural or surface mark, or skipped with no reason beside
  them: 0.
- Defects the run's own changes caused that are still in place when it ends: 0.
- Repairs `fix`'s closing run of every Inspection listed — reviewer findings among them — that the
  scope of change allows and that the run left for the next `inspect` while its closing pass held
  fewer than five (SKILL.md, the `fix` entry in Ways in): 0.
- Repairs a pass took to one element while a repair to what a whole screen shows stood open on
  the list: 0.
- Items in the inventory taken before the first pass — where a link goes, the name a field
  submits under, an id a link reaches, a test identifier or event name, a control and its name —
  that the inventory after the last pass lacks and no repair on the list names, and runs that
  applied repairs with no inventory taken before and after: 0.
- Deficits from the original list still present at the end, those the scope of change forbids,
  those whose repair would change what the product relies on behind what the reader receives
  (SKILL.md, Before fix or review changes the code), and those whose repair `fix` leaves for an
  entry marked provisional (rules/tokens.md) excepted, each left on the list as such: 0.
- Runs that got no reviewer's first word, findings, answer on the visual concept, and
  one change, and reviews that ran in the session where an agent could have started: 0.
- Reviewer findings neither put on the list as a repair nor dismissed, and reviewer briefs, as
  sent, that carried more than the four things this file names, or less — a screen, a state, or a
  checked size the run read, or a line read off a capture, left out: 0.
- Reviewer findings dismissed without naming the capture, and the place in it, that contradicts
  what the finding says, and reviewers started more than once in a run, `recapture` excepted: 0.
- Repair lists the run returned or worked with a repair to one element above a repair to what a
  whole screen shows, a repair answering a line that reads a screen or its first view as a whole
  counting as a whole-screen repair: 0.
- Counts on a rendered screen that the run reads lower after a change to the declaration, the
  structure, or the style system while that screen stayed as it was: 0.
- Changes to the code that belong to no repair on the list: 0. A rule, a setting, or a
  script that served only what a listed repair removed belongs to that repair. Under `init` and `inspect`, which apply no repairs, every change is untied.
- Files the run wrote outside `.design/` (SKILL.md, What this skill writes) and outside the
  product's own code — a browser profile or a script in the system's temporary directory
  included: 0. The run lists what it wrote, and the list is read against the file system.
- Passes the run reports for counts about the rendered screen, its motion, or a walk, with no
  capture, recording, or walk this run made named beside them: 0.
- Where this run read any count on a rendered screen, screens the product has missing from the
  list the run gives as it reads them — each screen with the checked sizes (rules/layout.md) and states it was read at,
  or the reason it was not read: 0.
- Counts the run says a script took with no script named beside them that is still under
  `.design/harness/`, and two scripts there taking the same count — a runner this skill carries for
  the platform and a script a run wrote or an earlier run left among them: 0.
- Inspection scripts under `.design/harness/` that cannot run one rule file's counts without the
  others: 0.
- Scripts under `.design/harness/` that this run wrote or changed itself where it could start a
  helper: 0.
- Values in a runner's configuration that differ from the declaration or the structure entry its
  comment names, values with no entry named, and keys the runner's README lists that the
  configuration leaves out where the declaration or the structure holds the entry — a
  configuration an earlier run wrote, before the runner gained the key, among them: 0.
- Steps in scripts under `.design/harness/` that wait with no time limit, methods that hung or
  returned nothing in this run that `.design/harness/hung.md` does not name, and steps using a
  method it names: 0.
- Counts the run gives as not taken that the run's own browser, recording, or scripts could
  have taken — the next run named as what would take one among them: 0.
- Scripts the run, or its helper, fed to an interpreter on its standard input rather than running
  them from a file: 0.
- Code or scripts a helper wrote whose counts the session used before reading them back against
  the repair or the count they serve, and helper work the session did not name as it worked: 0.
- Compactions of the conversation the run did not tell the person of, and steps taken after one
  before SKILL.md and the rule files of the step were read again: 0.
- Files under `.design/` that hold a date, an account of a run, or an item already done;
  `.design/repairs.md` still in place when `fix` ends, report only excepted; and
  `.design/record.md` read or written (SKILL.md, What this skill writes): 0.

#### The checks

- The comparison. Name the strongest reference and say, in words, how the rebuilt screen reads
  beside it. If it reads worse on any of hierarchy, motion, typographic discipline, or state
  handling, name the difference and take another pass.
- The Inspections run this pass, listed with which deficit sent you to each.
- One step either side. State what the entrance and exit look like and where back lands.

### Platform notes

- Capture the screen the way the platform allows and open the capture. Reviewing from memory of
  what was written is how the same defect survives four passes.
- Where a scripted interaction tool is available, capture the flow's main path once the screen has
  stopped moving, so a later change can be checked against it without walking the flow by hand.
- Repeat the comparison at the narrowest supported width before calling the work done, since
  hierarchy that holds at a comfortable size often collapses at the tight one.
- Claude Code: a helper is a subagent started with the Agent tool and `model: "sonnet"`, its
  effort set in the same call, since a subagent on another model does not take the session's.
  A skill's own `model` setting switches the whole turn and is no way to split the work: each
  model has its own prompt cache, so that turn reads the whole conversation again with nothing
  cached. A subagent starts a conversation of its own and leaves the session's cache as it was
  (Claude Code's prompt caching page). Where the organization's available models exclude the one
  named, the call runs on another. A helper or a reviewer started in the background announces its
  own end, and the session waits on that notice, with no wake-up of its own scheduled: under
  `claude -p` a pending wake-up holds the run open until it fires — in one run, 14 minutes after the
  work had ended.
- Claude Code: a reviewer is a subagent started with the Agent tool, the session's own model named
  in the call — a call naming none takes whatever default subagent model is configured — run in
  the background as soon as the captures exist, so that the session takes and reads the counts while
  it works, and its effort set to medium in the call: a review reads captures, and Claude's prompting page for Opus 5.5 reports that model reading
  visual material accurately even at its lowest effort. A subagent starts with none of the
  session's conversation, which is what the review needs. The frame-rate run waits until the
  reviewer returns, since a busy machine drops frames a device would not.
- Claude Code: a file under `.design/` is written with the Edit or Write tool, not through a shell
  redirection — a long section holding quotes breaks the shell's parsing, and in three runs of three
  the section that tried was written twice.
- Claude Code: after a compaction, Claude Code re-attaches the start of each skill the
  conversation invoked, and of what a tool read only what the summary says: SKILL.md and the rule
  files, read by the Read tool, are gone until read again (Claude Code's skills page).
- Web: this skill carries a runner, `runner/web/run.mjs` in this skill's own directory, the one
  that holds `rules/`. Its README — `runner/web/README.md` there — says how to run it, how to
  write the product's configuration and flows, which count lines it takes, its time limits, and
  what a headless browser does differently, a touch-emitting mouse press that never answers among
  it.
