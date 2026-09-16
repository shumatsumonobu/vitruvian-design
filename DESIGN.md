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

## 2. The parts

### The entry point

`skills/design-discipline/SKILL.md`. Its sections, in order:

| Section | Job |
|---|---|
| Language | What stays in English wherever it is written: the skill's own names, so a later session matches on them |
| Ways in | The four entries — `init`, `review`, `inspect`, `fix` — and what each does |
| What it asks you | The three questions the skill puts to the person, written out in full: a browser to drive, the declaration and where it lives, how far repairs may go |
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
| `init` | Derives the declaration from the subject, reads the code beside it without adopting a value, asks the second question, writes the declaration once |
| `inspect` | Runs every applicable Inspection against the running screen, writes the results to the record, returns the repair list with each repair marked, changes nothing else |
| `fix` | Works the repair list down within the scope of change, at most five repairs per pass, and ends with a run of every applicable Inspection |
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
remaining files; each rule file that calls for one names it.

## 3. How a run moves

### A fresh build

`init` — the person answers the first two questions — the build loop under Before you call it
done runs the Inspections the screen needs while it is built — `inspect` once before the screen
closes. The build loop is not a repair pass and asks nothing: it builds against the declaration.

### A product that already has screens

`init` — `inspect` — `fix` — `inspect`, or `review` in place of `fix` when the task is to make an
existing screen better rather than to close a list. Before the first change, `fix` or `review`
asks the third question once and writes the answer into the declaration's scope of change entry;
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
untaken count is not a pass.

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
on an element the pass added, removed, or restyled. Every change to the code belongs to a repair
on the list, and the record says which. `fix` is done when the list is empty and a run of every
applicable Inspection after the last pass finds nothing the record does not already hold with its
reason. The rule is the `fix` row of Ways in; the lines on repairs at the end of `rules/review.md`
— repairs per pass, repairs against the scope, repairs behind the screen, unmarked or unreasoned
repairs, changes tied to no repair, deficits left without a recorded reason — are read by
`inspect` whenever the record holds a fix pass.

### How a decision changes

The person edits the declaration: the scope of change entry to widen or narrow repairs, the
recorded exceptions to keep a default the rules ban or to allow a change behind the screen, an
entry's value to change a token. The skill asks nothing twice; the three questions it does ask
are fixed texts under What it asks you, put to the person in their language.

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
| recorded exceptions | The declaration entry where a chosen default and its reason, or a granted change behind the screen, are written | `rules/anti-slop.md`, Exceptions are written down |
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
| the session, the agent | The same actor: the session in every rule; the agent only in the texts put to the person | `SKILL.md` |

Terms the skill does not use, and what it says instead: toast or notice → a transient message;
helper line → a help or character-count line, described, not named; the active state → the
selected state; navigation item → a link in a navigation; headline → a claim or a title; trigger
→ the control that summoned it; overlay → the dimmed surface; supported size → supported width,
supported device; layout skeleton → the arrangement; mark, for a brand's symbol → a symbol the
product gets from the brand's own material; protected contract → what the product relies on
behind the screen, said in words; the scope → the scope of change.

## 5. Concerns adopted from other design skills, and where they live

Nine published design skills were read for concerns this skill lacked — hallmark, emilkowalski's
skills, ui-skills, MengTo's skills, garden-skills, huashu-design, baoyu-design, elayadesign's
landing-page skill, open-design — beside WCAG 2.2. What was taken is the concern, never the
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

The numbers these brought — five seconds, 200 percent, 16 CSS pixels, one line, two focusable
elements — have their lines in `NOTICE`.

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
  not taken, and a run that cannot drive one closes with those counts open.
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
