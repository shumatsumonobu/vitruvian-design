# Design

The design of the skill as it stands: its parts, how a run moves through them, the vocabulary
every file shares, where each concern lives, and what is not designed yet. It does not restate a
rule — every rule is stated once, in the file named beside it — and it carries no history; why a
rule reads as it does is in `DECISIONS.md`, and how to change one is in `CONTRIBUTING.md`. This
file is kept current with the skill: a change to the skill that moves a concern, adds a term, or
opens a limit changes the line here that names it.

## 1. What the skill is for

Interfaces that do not read as generated. The skill does not carry a look. Every value a screen
uses is derived from the subject — the brief, the product's own material, and the references
studied — and written down with its reason before the screen is built. Then the screen is
inspected against counts, which return a number, and checks, which are answered in a sentence;
a count that misses becomes a repair, and a repair either is applied or is written down with the
reason it was not. Taste enters only where a written reason names what in the subject chose the
value.

Counting removes what nobody chose; it does not make a screen anyone remembers. So the declaration
also names where the product is bold — the world outside its category whose look it borrows, and
the one element it is remembered by — derived and reasoned like every other value, and counted on
the rendered screen like every other.

## 2. The parts

### The entry point

`skills/design-discipline/SKILL.md`. Its sections, in order:

| Section | Job |
|---|---|
| Language | What stays in English wherever it is written: the skill's own names, so a later session matches on them |
| Ways in | The four entries — `init`, `review`, `inspect`, `fix` — and what each does |
| What it asks you | Who the person is and the words for everything said to them; the three questions the skill puts to the person, written out in full: a browser to drive, the declaration and where it lives, how far repairs may go; and the lines said when the skill or its companion is missing, when screen work arrives with no declaration, and when `init` has nothing to do |
| Before fix or review changes the code | The scope of change and its four answers; what makes a repair structural; what a repair never changes behind the screen |
| What this skill writes, and where | The files under `.design/` and what each holds |
| Before you draw | The reference study, and what a studied page is and is not |
| Exceptions | The one way a banned default lifts, and the two things that never lift |
| While you build | Which rule file to open, and when |
| Project tokens | The declaration is written first, from the subject |
| Before you call it done | The build loop: what is run on the screen before a screen closes |
| Numbers | Where every threshold number comes from |

### The four entries

Each has a directory beside the skill (`skills/design-discipline-<name>/SKILL.md`) holding only
the description Claude Code lists; the procedure lives in the Ways in table of `SKILL.md`.

| Entry | Does |
|---|---|
| `init` | Derives the declaration from the subject, reads the code beside it without adopting a value, asks the second question, writes the declaration once — at `.design/declaration.md`, or at the home the person names, which the record keeps; run again after a skipped study, studies the sites and puts the second question again |
| `inspect` | Runs every applicable Inspection against every screen the product has, at the checked sizes, writes the results to the record, returns the repair list with each repair marked, and ends with the report How `inspect` and `fix` end describes; changes nothing else |
| `fix` | Works the repair list down within the scope of change — running the Inspections first where the record holds no list — at most five repairs per pass, and ends with a run of every applicable Inspection whose new findings go to the record for the next `inspect`, except a defect its own changes caused, which it repairs or undoes; ends with the same report |
| `review` | Improves a screen that exists: operates it, names the deficits, gathers references against them, rebuilds in small passes, compares |

### The eleven rule files

Each rule file states its rules, then ends with an Inspection section — the counts, then the
checks — and a Platform notes section, the only place a platform is named. A concern has one
owner; a second file that needs it points at the owner by file name. What each file owns, and
when a session opens it, is the While you build table in `SKILL.md`.

### NOTICE

`skills/design-discipline/NOTICE` holds the provenance of every threshold number the counts use,
in three groups — accessibility guidelines, platform guidelines, this skill's defaults — one
line per number, naming the rule file that uses it. It also names the pieces of the
accessibility floor and the guideline each follows. A number with no line there is a defect.

### The runner

`skills/design-discipline/runner/web/` holds the web runner: `run.mjs`, the parts under `lib/`,
and `README.md`, which a session reads to run it and to write the product's configuration. It
takes the counts any web product needs from a rendered screen, an interaction, or a recording,
names each by its count line's own words, and prints a number, `data` for the session to judge,
or `not taken` with the step and the method that stopped. It needs Node and Chrome and nothing
from npm. A rule file defines every count; the runner only takes it. This repo tests it with
`scripts/live-test/test-runner.mjs` on three scaffolds, a hang, and a frozen tab, and
`scripts/check-runner.mjs` reads its count names against the rule files. Only `rules/review.md`'s
Platform notes names it, since it serves one platform.

### What the skill writes into a project

Everything lands under `.design/` at the project root; the table under What this skill writes,
and where in `SKILL.md` is the list. The two that carry the design:

- **The declaration** (`.design/declaration.md`, or a section in a design document the person
  keeps). The person's decisions: every token entry with its reason, the scope of change, the
  recorded exceptions, and any permission for what the product relies on behind the screen. Only
  the person changes a decision, by editing it. `init` creates it; a later pass may add an entry
  the declaration lacks, with its reason, or amend an entry's wording, and never writes the scope
  of change or a permission.
- **The record** (`.design/record.md`). The ledger: the study, `init`'s map and comparison of the
  code, every count result, the repair list with its marks, what each fix pass changed and which
  repair each change belongs to, what was left and why, and which counts were not taken.
  `inspect` writes here, and the captures and scripts its counts need under `.design/captures/`
  and `.design/harness/`, and changes nothing in the product.

The structure declaration, the lexicon, the style system, the captures, and the harness are the
remaining files; each rule file that calls for one names it. The structure declaration holds the
checked sizes. The harness keeps the scripts that take counts, so a later pass counts again by
running them; on the web the inspection script is the runner, and the session writes its
configuration and the flows only the product has. An inspection script runs one rule file's
counts without the others, so a pass reruns only what it must. Every step a script waits on has a time limit, and a method that hung
or returned nothing is named in the record so no later script uses it. Where the session can start
a helper, the helper writes them and runs each once before it returns. Their output and a
browser's working files go when the pass ends.

Each entry file carries, besides the pointer to `SKILL.md`, what a session must do from its first
step: write every line in the user's language, a note to itself included, and say one line on
what it is about to do before its first tool call of any kind — `init` its opening text, or that
line where the brief agrees in advance — and, for `fix`, run every rule file's Inspection after
the last pass. Placed only in `SKILL.md`, these were
skipped in runs.

## 3. How a run moves

### A fresh build

`init` — the person answers the first two questions — the build loop under Before you call it
done runs the Inspections the screen needs while it is built — `inspect` once before the screen
closes. The build loop is not a repair pass and asks nothing: it builds against the declaration.
`init` run again studies the sites a first run skipped and puts the second question again,
keeping what the person wrote; with nothing left to do, it says so and stops.

### A product that already has screens

`init` — `inspect` — `fix` — `inspect`, or `review` in place of `fix` when the task is to make an
existing screen better rather than to close a list. Before the first change, `fix` or `review`
asks the third question once and writes the answer into the declaration's scope of change entry, or `init` writes the brief's answer there where the brief states one;
later passes read it there.

### What inspect returns

One line per count that missed or check that failed, each marked **structural** or **surface**.
Structural: the repair changes where something sits, how big it is, whether it exists, its
order, the container that presents it, what an artwork depicts or its colors, or whether a
motion plays. Everything else is surface — a repair that changes nothing the reader receives,
such as a line written into the record, the structure declaration, the lexicon, or the style
system, included. The definition is in `SKILL.md` under Before fix or review changes the code.

A count that the workspace cannot drive — a device with the platform's own regions, a touch
screen, a screen reader, a frame-rate capture — is written in the record as not taken. An
untaken count is not a pass. A count the run's own tools could take is taken in the run, never
passed to the next one. A count the person takes on a device of their own and reports is taken
by the person, until the code it was read on changes.

`inspect` reads every screen the product has, at the checked sizes `rules/layout.md` defines —
the widest and the narrowest supported width, each at the shortest height a reader is left
there, and any window the brief, the data, or the person names — and reads each count about the
rendered screen off a capture, a recording, or a walk of that run.

The run ends with the report under How `inspect` and `fix` end in `SKILL.md`: one sentence on
what it did; the repairs heaviest first — those without which a reader cannot use the screen,
one line each; those the reader sees, the structural ones one line each and the surface ones as
a number; those that only write into a file, as a number; what only the person can give; what
was not taken and what would take it, with steps on the person's own device where that would;
and the next command.

### What fix may apply

A repair passes four gates, in this order, and each gate has one owner:

| Gate | Rule | Owner |
|---|---|---|
| The scope of change | Under structure kept, no structural repair; under kept: none that touches a named element; under report only, none; under everything may change, all | `SKILL.md`, Before fix or review changes the code |
| The accessibility floor | The counts in `rules/a11y.md` and the pieces it names in states, motion, and forms are applied under every answer but report only, and no recorded exception lifts them | `rules/a11y.md` names the pieces; `NOTICE` names their guidelines; `rules/anti-slop.md` states that they never lift |
| Behind the screen | A repair changes what the reader receives and nothing the product relies on behind it — a route, a field's submit name, an anchor, a test identifier, an event name, a storage key, wording fixed by law or contract. A repair that would need one changed is written down for the person, who may grant it in the declaration's recorded exceptions | `SKILL.md`, same section; counted in `rules/review.md` |
| Provisional values | A declaration value marked provisional — a brand value whose material was not reached — is not brought into the code until the material arrives | `rules/tokens.md` |

A repair that fails a gate is written to the record with the reason, and the count it would have
closed stays open.

### When fix is done

At most five repairs per pass. After each pass the failed counts rerun, and so does every count
on an element the pass added, removed, or restyled — the inspection script running those rule
files alone; a pass after which every rule file's counts ran names the change that reached them
all. Every change to the code belongs to a repair
on the list, and the record says which. `fix` is done when the list is empty and a run of every
applicable Inspection after the last pass finds nothing the record does not already hold with its
reason. The rule is the `fix` row of Ways in; the lines on repairs at the end of `rules/review.md`
— repairs per pass, repairs against the scope, repairs behind the screen, unmarked or unreasoned
repairs, changes tied to no repair, deficits left without a recorded reason — are read by
`inspect` whenever the record holds a fix pass.

### Who decides, and who writes

The session decides: the deficits, the target lines, each repair and how far it goes, every
verdict on a count or a check. Where it can start a helper — a second agent on a smaller, faster
model — the helper writes every script under `.design/harness/`, and may write a pass's repairs;
it has not read the skill, so the session hands it the repair and its target line, or the rule
files whose counts a script takes, and reads every change back before any count runs on it. The
record names what a helper wrote. The rule is in `rules/review.md`, Rebuild in small passes; the
Claude Code form is in its Platform notes.

### How a decision changes

The person edits the declaration: the scope of change entry to widen or narrow repairs, the
recorded exceptions to keep a default the rules ban or to allow a change behind the screen, an
entry's value to change a token. The skill asks nothing twice; the three questions it does ask
are fixed texts under What it asks you, put to the person in their language through the
AskUserQuestion tool.

## 4. Vocabulary

One name per concept, across every file. A term is defined in the sentence where the owning file
first uses it; every other file uses the same word.

| Term | Means | Defined in |
|---|---|---|
| the subject | The brief, the product's own material, and the references studied — what every value is derived from | `rules/tokens.md`, Deriving the declaration |
| the declaration | The file holding the person's design decisions | `SKILL.md`, What this skill writes |
| the record | `.design/record.md`, the ledger of every run | `SKILL.md`, What this skill writes |
| the scope of change | The declaration entry answering how far repairs may go: structure kept, everything may change, report only, kept: … | `SKILL.md`, Before fix or review changes the code |
| structural, surface | The two marks `inspect` puts on a repair | `SKILL.md`, same section |
| provisional | The mark on a brand value whose material was not reached | `rules/tokens.md`, Deriving the declaration |
| the accessibility floor | The counts no recorded exception lifts | `rules/a11y.md`, opening paragraph |
| recorded exceptions | The declaration entry where a chosen default, where it goes, and its reason, or a granted change behind the screen, are written | `rules/anti-slop.md`, Exceptions are written down |
| the repair list | What `inspect` returns | `SKILL.md`, Ways in |
| a count, a check | An Inspection line returning a number; one answered in a sentence | `SKILL.md`, Ways in (`inspect` row) |
| not taken | The record's word for a count the workspace could not drive | Each count that says it, with the record's path beside it |
| the arrangement | What a surface opens with, what follows, what closes it | `rules/layout.md`, Declare the structure |
| the generated defaults, arrived unasked | The few shapes generated pages converge on; a shape nobody chose | `rules/layout.md`, the arrangement count; `rules/anti-slop.md` |
| the platform's own regions | A status bar, a camera cutout, a home indicator, a system navigation bar | `rules/layout.md`, The platform's own regions |
| the primary input | The input the device is mostly operated with | `rules/states.md`, A control has states of its own |
| the environment, the environment's default | The platform's toolkit or browser; what it draws when the product adds nothing | `rules/motion.md`, What drives it |
| a press answer | What a control shows within 100 to 150 ms of a press | `rules/motion.md`, What drives it |
| a claim | A string saying what this product is, does, has, or gives | `rules/copy.md`, A claim names this product |
| a title | A string naming a place — Settings, Recent | `rules/copy.md`, the string inventory |
| a transient message | A message that arrives and leaves on its own | `rules/motion.md` |
| the dimmed surface | What lies behind a modal or a sheet | `rules/navigation.md` |
| the control that summoned it | What opened a menu, a popover, a sheet | `rules/motion.md`, What drives it |
| focusable elements | The places the keyboard lands | `rules/a11y.md`, The keyboard can do what the pointer can do |
| the session, the agent | The same actor: the session in every rule; in the texts put to the person the agent speaks as I | `SKILL.md` |
| the person | The product's owner, who has never opened the skill: the reader of everything the session says to them | `SKILL.md`, What it asks you |
| the checked sizes | The widest and the narrowest supported width, each at the shortest height a reader is left there, and any window the brief, the data, or the person names | `rules/layout.md`, The sizes a screen is checked at |
| the area that answers a press | A control's target, measured where a press lands rather than where the control is drawn | `rules/states.md`, What a press lands on |
| a stop | Each place a screen reader halts and reads | `rules/a11y.md`, What the ear receives |
| taken by the person | A count the person took on their own device and reported; it stands until the code changes | `SKILL.md`, How `inspect` and `fix` end |
| the visual concept | The declaration entry naming the world outside the product's category whose look it borrows, and what in the subject chose it | `rules/tokens.md`, Declare the set first |
| the signature | The declaration entry naming the one element the product is remembered by, what it carries, and where it sits — before any scroll, on at least one screen, at every checked size | `rules/tokens.md`, Declare the set first |
| a flood | A color declared as a surface it fills across a large share of the screens it names; not the accent | `rules/tokens.md`, Declare the set first |
| the product's category | The kind of product it is — a timer among timers; where the skeleton and the readers' conventions come from | `SKILL.md`, Before you draw |
| the runner | The tested script this skill carries for one platform, taking the counts any product on it needs from a rendered screen, an interaction, or a recording; the web's is `runner/web/run.mjs` | `SKILL.md`, What this skill writes |
| a helper | A second agent on a smaller, faster model that writes what the session decided: every script under `.design/harness/`, and a pass's repairs where the session chooses | `rules/review.md`, Rebuild in small passes |
| families that split one role by writing system | Families of one classification, each setting the characters the others do not, where the product's text spans more than one writing system; one family wherever the skill counts families | `rules/tokens.md`, Declare the set first |

Terms the skill does not use, and what it says instead: toast or notice → a transient message;
helper line → a help or character-count line, described, not named; the active state → the
selected state; navigation item → a link in a navigation; headline → a claim or a title; trigger
→ the control that summoned it; overlay → the dimmed surface; supported size → supported width,
supported device, or the checked sizes where a height counts too; hit area → the area that
answers a press; layout skeleton → the arrangement; mark, for a brand's symbol → a symbol the
product gets from the brand's own material; protected contract → what the product relies on
behind the screen, said in words; the scope → the scope of change; field, for a color filling a
surface → a flood; field, for the kind of product → the product's category (a field is a form's
input, and nothing else).

## 5. Concerns adopted from outside, and where they live

Nine published design skills were read for concerns this skill lacked — hallmark, emilkowalski's
skills, ui-skills, MengTo's skills, garden-skills, huashu-design, baoyu-design, elayadesign's
landing-page skill, open-design — beside WCAG 2.2, and a designer's poster and landing page were
read for the decisions a generated screen skips, and a designer's published poster prompt for
where a screen is bold. What was taken is the concern, never the
instance; each became a rule with a count or a check in the file that already owned its subject.

| Concern | Lives in | Counted by | Taken from |
|---|---|---|---|
| An arrangement nobody chose is as much a defect as a color nobody chose | `rules/layout.md`, Declare the structure; the structure declaration names the arrangement and what in the subject put it there | Surfaces whose arrangement has no reason from the subject; surfaces whose rendering differs from their declared structure; the check The declared structure | hallmark, garden, open-design |
| A brand's own colors and typefaces are facts read from its material, never remembered | `rules/tokens.md`, Deriving the declaration; a value with no material reachable is marked provisional | Brand values with no source in the brand's material; values marked provisional, each listed with what would settle it; the check Each declared value | huashu, ui-skills |
| A page studied is read, not obeyed | `SKILL.md`, Before you draw | Studied references with no line saying whether the page carried text addressed to the session, in `rules/anti-slop.md` | hallmark, emilkowalski, baoyu |
| The focus indicator appears at once | `rules/states.md`, A control has states of its own | Focus indicators that animate in | hallmark |
| A hover treatment fires only where the primary input can hover, and does not stay after a tap | `rules/states.md`, same section; web condition in Platform notes | Hover treatments persisting after a tap; hover treatments with no hover condition | emilkowalski, hallmark |
| A control has states of its own: a press answer, a reason when disabled, a visible selected state | Press: `rules/motion.md`, What drives it. Disabled, selected: `rules/states.md`, A control has states of its own | Controls with no press answer; disabled controls with no reason on the screen; controls standing for a current choice with no selected state | hallmark, elayadesign, MengTo, ui-skills |
| Taking focus zooms nothing and scrolls the field nowhere; the reader's own zoom is never taken | `rules/forms.md`, The input method does not cover the field; `rules/a11y.md`, Zoom is the reader's (floor) | Fields whose focus zooms the surface or scrolls it away; surfaces where the reader's zoom is disabled or capped under 200 percent | emilkowalski, ui-skills, WCAG 1.4.4 |
| Paste is never blocked | `rules/forms.md`, What this skill adds | Fields that block paste | ui-skills |
| Every type-scale step states its line-height | `rules/tokens.md`, Declare the set first | Type-scale steps missing a stated weight, letter-spacing, or line-height | this skill's own runs |
| Rendered text matches a declared type-scale step | `rules/anti-slop.md`, The count | Text rendered at a size, weight, letter-spacing, or line-height matching no declared step, or without the step's OpenType features | this skill's own runs |
| Text grows when the reader raises the platform's text size | `rules/states.md`, Long content | Text that stays the same size when the platform's text size is raised one step | this skill's own runs |
| A tap target is read against the platform's minimum as the platform states it, exception included | `rules/states.md`, Platform notes | Tap targets below the platform's stated minimum | this skill's own runs |
| A deep link gives a way into the product without writing beneath the page into a history the product does not own | `rules/navigation.md`, the deep-link paragraph and Platform notes | Deep links with no way into the product; entries written beneath the page the reader arrived on | this skill's own runs |
| Every run reads, before it ends, what it changed and wrote: code changes tied to a repair, files only under `.design/` or in the code | `rules/review.md`, the Inspection's preamble | Changes to the code tied to no repair; files written outside `.design/` and the code — read by every run, not only after a fix pass | this skill's own runs |
| A value the person changes before saving is theirs; what was derived from it is derived again and marked, and the whole declaration is shown again before the question is put again | `rules/tokens.md`, Deriving the declaration, step 5; the second question's second answer in `SKILL.md` | None — the live run reads it | this skill's own runs |
| The record names the declaration's home, and every entry reads the declaration from there | `SKILL.md`, What this skill writes; the init row of Ways in; the second question's third answer | Applicable entries left unfilled, in `rules/tokens.md` — a declaration absent from the named home counts as every entry unfilled | this skill's own runs |
| Motion runs on the declared springs and curves | `rules/motion.md`, the count | Motion running on a spring or a curve the declaration does not name | this skill's own runs |
| A family that loads after first draw declares what stands in until it does, on every platform | `rules/tokens.md`, Declare the set first and Platform notes | The check Each stand-in, where a family loads after the screen first draws | this skill's own runs |
| Motion never takes the controls away: input lands mid-transition, animations reverse, nothing moves under the pointer | `rules/motion.md`, Motion never takes the controls away | Controls ignoring input while a transition plays, or animations restarting instead of reversing; controls that move as the pointer arrives | emilkowalski, MengTo |
| Nothing the reader must read or press sits under the platform's own regions | `rules/layout.md`, The platform's own regions; the web, iOS, and Android allowances in Platform notes | Content anchored to an edge with no allowance; content under a region at either scroll end, or not taken | emilkowalski, hallmark, ui-skills |
| More of what arrives unasked: a glow, a dot grid, orbs; drawn frames; images presented as the product's own | `rules/anti-slop.md`, What the model reaches for; `rules/assets.md`, When to reject | The gradient count and the decorative-element check; the reject-list check | hallmark, open-design, MengTo |
| Each decorative element states what it carries that the content beside it does not | `rules/anti-slop.md`, the check Each decorative element | The check itself; an element with nothing to state goes on the repair list | MengTo, hallmark, garden |
| A repair changes nothing the product relies on behind the screen | `SKILL.md`, Before fix or review changes the code; the third question's introduction | Repairs that changed something behind the screen, in `rules/review.md`, read after `fix` | garden, hallmark |
| The keyboard can skip a block of controls that recurs before the content | `rules/a11y.md`, The keyboard can do what the pointer can do (floor) | Surfaces where a recurring block sits before the content with no way past it; two focusable elements make a block | elayadesign, WCAG 2.4.1 |
| Content that moves or updates itself can be paused, stopped, or hidden | `rules/motion.md`, Motion the reader can stop (floor) | Moving content past five seconds with no control; self-updating content with no control | hallmark, WCAG 2.2.2 |
| The label on a control drawn around it holds one line | `rules/copy.md`, A control's label holds one line | Labels on drawn controls set on more than one line at any supported width | hallmark |
| A state change moves nothing else unless the reader opened something | `rules/states.md`, A state change moves nothing else | Elements that move because a neighbor changed state | hallmark, MengTo |
| A claim names this product; a string that would hold for any product is empty | `rules/copy.md`, A claim names this product | Claims naming nothing of this product's; claims the brief did not supply that the record does not list as missing | elayadesign, MengTo, open-design |
| A role set by two families because the text spans two writing systems is one choice, not two | `rules/tokens.md`, Declare the set first and What the declaration locks | Families sharing a classification, in `rules/tokens.md`, counting such families as one where the entry names the writing system each sets; families in the flow, in `rules/anti-slop.md`, counting them as one where the flow sets no character in two of them | this skill's own runs |
| An exception lifts a default where it names, and nowhere else | `rules/anti-slop.md`, Exceptions are written down; the recorded exceptions entry in `rules/tokens.md` names where the default goes | Uses of a banned default outside what its exception names, in `rules/anti-slop.md`, governing every count an exception lifts | a designer's poster and landing page |
| A row of the same things tilted, fanned, or set in perspective is a default that arrives unasked | `rules/anti-slop.md`, What the model reaches for | The check Each decorative element | a designer's poster and landing page |
| A figure the brief or the product's data supplies is shown as the figure, not as a word for it | `rules/copy.md`, Banned strings, listed once | Words standing in for a supplied figure | a designer's poster and landing page |
| A photograph the product ships is held to the declared palette | `rules/assets.md`, The style system, Palette | Photographs whose largest areas of color are neither declared values nor the named source of one | a designer's poster and landing page |
| A fact, a claim, a title, or a section label is said once on a screen; a second language as texture is a recorded choice | `rules/copy.md`, Said once | Facts, claims, titles, and section labels stated twice | a designer's poster and landing page |
| A screen is checked at the sizes its readers are left with: heights the browser's bars or the system's scaling cut | `rules/layout.md`, The sizes a screen is checked at | Structures with no checked sizes; checked sizes taken from a full display | a product's month under the skill |
| A press lands on the control drawn, and the areas that answer two presses do not overlap | `rules/states.md`, What a press lands on (floor) | Controls where a press at the middle lands elsewhere; targets measured as the area that answers; overlapping areas | a product's month under the skill |
| What the reader's own operation reaches is listed and captured like the five states | `rules/states.md`, What the reader's own operation reaches | States with no capture at the widest or narrowest checked size; screens with no list | a product's month under the skill |
| Time that grants or moves on stops when what it measures stops | `rules/states.md`, Across a session | Things moved by elapsed time while what it measures is stopped | a product's month under the skill |
| Contrast over a background that moves is read at its worst moment | `rules/states.md`, Text over what moves (floor) | The contrast count | a product's month under the skill |
| A second fast press lands on nothing the first put under the pointer | `rules/states.md`, Across a session | Second presses landing on what the first press put there, every control pressed | this skill's own runs |
| Nothing moves on without the reader; what covers the screen closes on back | `rules/navigation.md`, The screen moves when the reader moves it; Choosing the container | Screens and layers moving on without the reader; modals, sheets, full screens back does not close | a product's month under the skill |
| A mark for the eye only is hidden from the tree; a phrase is one stop; stops follow the eye | `rules/a11y.md`, What the ear receives (floor) | Eye-only marks left in the tree; phrases read as more than one stop; stops out of visual order | a product's month under the skill |
| A wide display's width past one column is given to something; a column centered with bare sides arrives unasked, and only a recorded exception lifts it | `rules/layout.md`, Reflow is declared; `rules/anti-slop.md`, What the model reaches for | Surfaces whose structure does not say what that width carries, in `rules/layout.md`; surfaces where what draws spans less than half the widest view, in `rules/anti-slop.md` | this skill's own runs |
| The signature is what the eye reaches after the primary action, filling the room it is given, at every checked size | `rules/anti-slop.md`, the check The signature | The check itself | this skill's own runs |
| The visual concept shows on the screen in more than its colors | `rules/anti-slop.md`, the check The visual concept on the screen | The check itself | this skill's own runs |
| No line opens with a closing mark; no title, and no short text standing on its own, ends on one character, punctuation not counted | `rules/copy.md`, Where a line breaks | The two counts | a product's month under the skill |
| Sizes and dimming lean small and dim when nothing decides them | `rules/tokens.md`, Deriving the declaration; `rules/anti-slop.md`, What the model reaches for | The check The smallest step and the dimmest text | a product's month under the skill |
| A beat on a change of state plays once, does not stay lit, and shows its peak | `rules/motion.md`, What for | Beats that stay lit, loop, or show no peak | a product's month under the skill |
| Every entry holds on every screen; a run lists every screen it read | `rules/tokens.md`; `SKILL.md`, Ways in | The screens line in `rules/review.md` | a product's month under the skill |
| A pass is read off a capture, a recording, or a walk of the run; the scripts that take counts are kept | `rules/review.md`, the Inspection's preamble; `SKILL.md`, What this skill writes | The passes and scripts lines in `rules/review.md` | a product's month under the skill |
| `fix` repairs or undoes what its own changes caused | `SKILL.md`, Ways in | Defects tied to the run's own changes still in place | this skill's own runs |
| How `inspect` and `fix` end, and a count the person takes on their own device | `SKILL.md`, What it asks you | None — the live run reads it | a product's month under the skill |
| Glowing type and a border around text that is only read arrive unasked | `rules/anti-slop.md`, What the model reaches for | The count Text set with a glow as its style; the decorative-element check | a product's month under the skill |
| Where the product is bold is decided and written: a visual concept borrowed from outside its category, and a signature where the boldness is spent | `rules/tokens.md`, Declare the set first and What the declaration locks; `SKILL.md`, the `init` row of Ways in and the text Before `init` writes the declaration | Applicable entries left unfilled, in `rules/tokens.md`; the checks The visual concept, in `rules/tokens.md`, and The signature, in `rules/anti-slop.md` | a designer's published poster prompt |
| At least one reference comes from outside the product's category, studied for how it looks | `SKILL.md`, Before you draw | The studied-references count in `rules/anti-slop.md` | a designer's published poster prompt |
| A color may fill a large surface as a flood, apart from the accent | `rules/tokens.md`, Declare the set first | The accent count in `rules/anti-slop.md`, a flood excepted | a designer's published poster prompt |
| The display step states its jump from the body step; a scale climbing in small even steps arrives unasked | `rules/tokens.md`, Declare the set first; `rules/anti-slop.md`, What the model reaches for | Declaration entries with no reason, in `rules/tokens.md` | a designer's published poster prompt |
| Where artwork and text share a frame, which sits in front is decided first; text over artwork is read at its worst point | `rules/assets.md`, Composition answers to the layout | Artwork sharing a frame with text with no line saying which sits in front, in `rules/assets.md`; the contrast count in `rules/states.md` | a designer's published poster prompt |
| People rendered as the generator's default are rejected | `rules/assets.md`, When to reject | The reject-list check | a designer's published poster prompt |
| The signature sits before any scroll at every checked size, on at least one screen | `rules/tokens.md`, the signature entry | The signature count in `rules/anti-slop.md` | this skill's own runs |
| A title, a heading, or a name breaks between words; between phrases where the language sets no spaces | `rules/copy.md`, Where a line breaks | Titles, headings, and names with a break inside a word or phrase | this skill's own runs |
| The session decides; a helper on a smaller model writes the scripts the counts run on | `rules/review.md`, Rebuild in small passes; `SKILL.md`, Ways in | Scripts a run wrote itself where it could start a helper; helper work not read back or not named — both in `rules/review.md` | this skill's own runs |
| A tested runner takes the counts any web product needs; a run writes its configuration, not a script of its own | `SKILL.md`, What this skill writes; `runner/web/README.md` | Counts the runner takes, taken instead by another script under `.design/harness/`; configuration values that differ from the entry their comment names — both in `rules/review.md` | this skill's own runs |
| An inspection script runs one rule file's counts alone, so a pass reruns only what it must | `SKILL.md`, What this skill writes | Scripts that cannot; passes that ran every rule file's counts with no change named — both in `rules/review.md` | this skill's own runs |
| Every step a script waits on has a time limit; a method that hung is named in the record and handed to the helper | `SKILL.md`, What this skill writes; `rules/review.md`, Rebuild in small passes; the runner's README, What a headless browser does differently | Steps with no time limit, hung methods unnamed, and steps using a named one, in `rules/review.md` | this skill's own runs |

The numbers these brought — five seconds, 200 percent, 16 CSS pixels, one line, two focusable
elements, one character — have their lines in `NOTICE`. The rows marked a product's month under
the skill came from one product's own record, read for what its runs had missed; each was
written to the concern and run on a scaffold built to carry it.

### Read and left out

| Left out | Why |
|---|---|
| Catalogues of structures, themes, and recipes | A house style. This skill derives every shape from the subject; the catalogues contradict each other |
| Varying the shape between one build and the next | Not a concern of the screen. The same subject may take the same shape |
| Self-scoring, on any scale | A count is 0 or a repair; a score is an argument about the score |
| Numeric dials set from the brief | A decision is a written reason, not a number |
| A gate requiring three first drafts | A production step, not a rule; `init` derives one declaration and the person amends it |
| Stamps in the CSS, a log file beside the record | The record exists |
| Per-component timings — tooltips, minimum spinner display | The frequency bands in `rules/motion.md` decide timing |
| Implementation rules — animate only transform and opacity, no `transition: all`, viewport units | Outside the skill's scope; their symptoms are caught by the frame-rate check and the long-content count |
| Terms of service and privacy pages | Legal, not design |
| Lorem ipsum and vague action labels; concentric nested radii; a specimen page drawn by `init` | Candidates, not yet designed |
| The primary control set apart by size as well as fill | One screen's case; a filled and an outlined control of one size is a standard pair, and a count would flag it on every product |
| An exception for a glow marking a change of state | Every change can be named a change of state; the recorded exceptions entry already lifts a glow where it says |
| An undo only where the action happened, never in a transient message | One product's taste; an undo in a transient message is a widely used pattern |
| A heading's last line of one word, in a language that separates words | No run showed it; the one-character line is counted |
| A floor on the display step's jump | A number with no source, which a long title at the narrowest width could not meet; the step already states its multiple and its reason |
| Each screen captured shrunk, read for whether it still reads as itself | What is shrunk, and to what size, would each need a source; read again once the signature count has run on products |
| A control or group joining no edge or axis of the structure | One case, a judgment on every control, overlapping the alignment counts |
| Which marks each screen reader reads by name | Software and versions differ; a mark for the eye only is hidden whatever reads it, and punctuation inside a sentence stays |
| A handwriting face and a drawn stroke never both on one screen | Two works by one designer as its provenance, and no run. Each kind is one already — a handwriting face is a family with a role, drawn strokes are the drawn-line style family in `rules/assets.md` — and an exception names where a default goes (`rules/anti-slop.md`), so a second handmade mark is counted |

## 6. Known limits and open designs

- **`review`'s passes.** Each pass of `review` runs only the Inspections the deficits point at,
  and the work ends on the comparison; there is no final run of every applicable Inspection as
  `fix` has. The end condition of `review` is a separate design.
- **A wrong mark is not counted.** `inspect` may mark a repair structural that the definition
  calls surface; the definition in `SKILL.md` removes the known ambiguity — a repair that writes
  only into the record or a declaration file is surface — but no count reads the marks against
  the definition.
- **Counts that need a device.** The platform's own regions, hover after a tap, focus zoom, a
  screen reader's walk, the frame rate: without the device or its simulator they are recorded as
  not taken, and a run that cannot drive one closes with those counts open, unless the person
  takes them on a device of their own.
- **The cost of every screen at every checked size.** One screen at two checked sizes took a `fix`
  of 95 minutes when each run wrote its own script. The runner reads every rule on one such screen
  in 1 to 3 minutes, the browser holding 1.1 to 1.5 GB; no product with many screens has been
  measured.
- **The runner's reach.** Web only. It was run on the installed Chrome; `chrome-headless-shell`
  could not be started on the machine that tested it, so that branch is untried. Without the GPU
  it holds less memory but can drop frames a device would not, so the frame-rate check needs a run
  with `--gpu`. With the GPU on, a tab stopped answering once in two runs of the heaviest scaffold;
  the runner opens a new tab and goes on.
- **Shown once, or not yet.** The wide-display rule in its final form — bare sides counted, lifted
  only by a recorded exception — has not been run; Round 6 ran the version a sentence in the
  structure could lift, and the session kept a 640 px column on a 1920 px display with the maximum
  content width as its reason. The checks on the signature and the visual concept were run once.
- **The language in a long run.** In Round 6's `fix`, two progress lines came out in English, ten
  and twenty minutes in, though the entry file says every line is in the user's language.
- **The helper's savings, apart from the runner's.** Round 5's `inspect` and `fix` together took 55
  minutes and 79k output tokens of the larger model, against 95 minutes and 249k for Round 4's
  `fix`, which read the screen first as `inspect` does; the helper wrote 50k on the smaller model.
  The runner and the helper arrived together, and what each saves alone is not measured.
- **The summaries drift.** The Owns column of While you build and the table in `README.md` are
  the two summaries of the rule files, not lists of every count; the Open when column and the
  rule files are the source.
- **The candidates.** A count for placeholder text and vague action labels, a rule for nested
  radii, and a specimen page `init` draws beside the declaration are read and not taken up.

## 7. Changing it

The laws a change must keep are under How the rules are written in `CLAUDE.md`; the procedure —
sync, review, the live runs and what to read after each — is in `CONTRIBUTING.md`; why a rule
reads as it does is in `DECISIONS.md`. A change that moves a concern, adds a term, adds a
number, or opens or closes a limit changes the corresponding line in this file in the same commit.
