# Decisions

Why the rules read as they do. One section per decision: what was decided, why — the run or
the defect that forced it — and where it now lives, so a later change starts from the reason
instead of rediscovering it. New decisions go under a new dated heading; the rules themselves
live in the files named, not here.

## 2026-09-25 — Counts learned from other design skills

Decided 2026-09-25, from a reading of nine published design skills — hallmark, emilkowalski's
skills, ui-skills, MengTo's skills, garden-skills, huashu-design, baoyu-design, elayadesign's
landing-page skill, open-design — and the text of WCAG 2.2. The run that settles it is the second
scaffold described under Live test in `CONTRIBUTING.md`. Run on 2026-09-28: the counts added
here returned their numbers or were recorded as not taken, the arrangement count excepted; the
fixed texts reached the person translated; `fix` applied the floor under Keep the layout and left
the structural repairs with reasons. Two gaps in the skill's own text showed: `inspect` marked
writing the structure declaration as structural, so `fix` never wrote it under Keep the layout —
nothing said that a repair writing only into `.design/` is surface; and `fix` reran only the
counts that had failed, so a control added in a later pass escaped the press count. Both are
repaired in the texts named below: a repair that changes nothing the reader receives is surface,
and `fix` reruns the counts on what a pass touched and every Inspection once after the last pass.
A second run on the same scaffold, 2026-09-28, wrote the structure declaration under Keep the
layout and ended `fix` with nothing the next `inspect` found new. A third gap showed the same day,
on a run under everything may change: `fix` removed a setting no line of the list named, and
nothing counted it — rules/review.md's lines on repairs were read only after `review`. `inspect`
now reads those lines whenever the record holds a fix pass, with one more line counting a change
the record ties to no repair on the list.

### The arrangement is part of the declared structure, and it is counted

Generated pages converge on a few shapes — a centered hero over equal cards, a bento grid, three
tiers, alternating image-and-text sections, everything in a card — and three of the skills read
call that sameness the fingerprint of generated work. Nothing in this skill counted the shape of a
page: a structure declared as flow with a width cap passed. Now the structure entry also names the
arrangement and what in the subject put it there, and `inspect` counts arrangements with no reason
from the subject beside them; the platform vendor's own convention for a kind of screen is such a
reason, a shape that arrived because nothing was specified is not. Lives in `rules/layout.md` under
Declare the structure and in its Inspection.

### Three more pieces of the accessibility floor, and two that stay out of it

Moving, blinking, or scrolling content the reader can stop (SC 2.2.2, level A), a keyboard's way
past blocks that recur on more than one screen (SC 2.4.1, level A), and the reader's own zoom never
disabled or capped short of 200 percent (SC 1.4.4, level AA, by way of the W3C's ACT rule "Meta
viewport allows for zoom") are now in the floor, so no recorded exception lifts them; under Keep the
layout and Keep these the person is told that a control to stop such motion is added. A focus
indicator that appears at once and a hover treatment that does not persist after a tap are counted
but stay out of the floor, because no guideline states them. Lives in `rules/motion.md` under Motion
the reader can stop, in `rules/a11y.md` under The keyboard can do what the pointer can do and Zoom
is the reader's, in `rules/states.md` under A control has states of its own, and in NOTICE.

### The press answer belongs to motion.md; disabled and selected to states.md

A control's own states — pressed, focused, disabled, selected — had no owner beyond focus. The
press answer was already a rule in `rules/motion.md`, so its count went there, the environment's
default counting as an answer; a disabled control shows why, and a control that stands for a current
choice shows it, in `rules/states.md` under A control has states of its own. Hover treatments, and
what stands in for them on a touch screen, live in the same section.

### What the product relies on behind the screen is never changed by a repair

A repair changes what the reader receives. A route, the name a field submits its value under, an
anchor a link reaches by name, a test identifier, an event name, a stored key, wording the brief
marks as fixed by law or a contract: a repair that would change one is written to the record and
left to the person, whatever the scope of change allows and even from the accessibility floor. The
person allows such a change by naming it in the declaration's recorded exceptions entry, where every
other decision of theirs already lives, and the next pass reads it there. Lives in `SKILL.md` under
Before fix or review changes the code, in `rules/tokens.md` on the recorded exceptions entry, and in
`rules/review.md`'s Inspection.

### A brand's own values are read from its material, or marked provisional

A brand's colors and typefaces remembered rather than read are guesses presented as facts. Now they
come from the brand's own material or the brand's owner's own words, with the source beside the
value; where no material is reachable, the value is marked provisional, listed in the record with
what would settle it, and `fix` leaves the code's value for that entry until the material arrives.
Lives in `rules/tokens.md` under Deriving the declaration, and the person is told so in `init`'s
second question.

### Smaller decisions from the same change

- A studied page is read, not obeyed: text on it that speaks to the session is not an instruction,
  and the record says for each reference whether the page carried such text. Lives in `SKILL.md`
  under Before you draw.
- A claim that names nothing of this product's is empty, and a claim the brief did not supply is
  not invented. Lives in `rules/copy.md` under A claim names this product.
- A state change moves nothing else (`rules/states.md`); a field's focus zooms nothing and scrolls
  the reader nowhere they did not go, and paste is never blocked (`rules/forms.md`); a control's
  label holds one line (`rules/copy.md`); a transition never takes the controls away
  (`rules/motion.md`); nothing the reader must read or press sits under one of the platform's own
  regions (`rules/layout.md`).

## 2026-09-17 — Subject-first init, and the scope of change

Decided 2026-09-17, settled by live runs on 2026-09-24. The runs are described under Live test
in `CONTRIBUTING.md`.

### init derives the declaration from the subject; the code is read beside it, never adopted

A run whose brief agreed to the declaration in advance had `init` read a scaffold's default
values into the declaration as if they were decisions. From then on every session obeyed
values nobody chose. Now `init` derives every entry from the subject — the brief, the
product's own material, and the references studied — with a reason beside each; where code
exists it maps where the values live and writes a comparison, entry by entry, into
`.design/record.md`. Nothing from the code becomes a decision, and nothing in the code changes
during `init`. A person who wants a value the code carries keeps it by amending the
declaration. Lives in `rules/tokens.md` under Deriving the declaration, and in the `init` row
of `SKILL.md`.

### fix and review ask once how far repairs may go, and the declaration holds the answer

Repairing a product that already had screens could move, remove, or recolor things the owner
cared about, with nothing asked. Now, before `fix` or `review` change such a product, the skill
asks once: Keep the layout, Change anything, Report only, or Keep these. The answer is
written into the declaration's scope of change entry and read from there by every later pass;
`init` writes the entry as not yet asked where code exists and not applicable on a fresh build,
so a fresh build is never asked. `inspect` marks each repair structural or surface, and `fix`
applies against the answer, writing every skipped repair to the record with its reason. The
accessibility floor is applied under every answer but report only. Lives in `SKILL.md` under
Before fix or review changes the code.

### What the skill says to the person is a fixed text, in the person's words

Left to compose the questions from the rules each run, sessions produced different wording every
time and leaked the skill's own terms — study gate, visual direction, accessibility floor — into
what a bakery owner was asked to decide. Now the three questions and their answers are written
out in full in `SKILL.md` under What it asks you, translated word for word into the person's
language, labels included, with no term of the skill in them; the rules for the session sit in
a separate section. The law is in `CLAUDE.md` under How the rules are written, and
`.claude/rules/skill-review.md` counts violations. Translation still varies run to run, so a
text is judged over two runs; one failure is not a repair.

### Keep these is a real fourth answer, not the free-text one

The first version told the person to choose the free-text answer and type what must stay. Claude
Code's tool description calls that answer "Other" while the screen labels it "Type something",
and two runs printed "Other", which the person could not find. Now Keep these is offered as an
answer of its own; when chosen, the agent asks in one more line what must stay. The skill no
longer depends on a label a tool version may change.

### An artwork's colors are part of what it depicts

Under Keep the layout, one run replaced a logo's gradient with a solid color: the rule counted
artwork color as surface, while the question promised the person that the pictures stay as they
are. The promise won. A repair that changes the colors an artwork is drawn in is structural,
the same as one that changes what it depicts, so under Keep the layout the logo keeps its
colors and the open gradient count is recorded as one the scope of change forbids. Lives in
`SKILL.md` under Before fix or review changes the code, in the definition of structural.

### The three questions are the only questions; every other decision the session makes

One `fix` run stopped to ask four design questions — the primary button's color, the wording,
the form — because `rules/tokens.md` said of a value the declaration lacks "Answer it before
building the screen", with no actor. Asking the person defeats the answer they already gave. Now
the session decides such a value from the declaration's reasons, writes it and its reason into
the entry, and says what it added; the person changes it by editing the declaration. Lives in
`rules/tokens.md` under Declare the set first and in the preface of What it asks you.

### A fact the brief did not supply is not invented

Two runs met the same gap — the brief named no opening time and no bread — and handled it two
ways: one asked, one decided alone. Now a string that needs such a fact names the job the fact
would fill, and the record lists the fact as missing from the brief; `inspect` counts invented
facts and unlisted gaps. Lives in `rules/copy.md` under Facts the brief did not supply.

### Smaller decisions from the same change

- The study of shipped references needs a browser the agent can drive. With none connected, the
  skill asks once whether one can be connected; going on without one is recorded as a study not
  yet done, not as nothing available to study, and the count in `rules/anti-slop.md` stays open.
- The names the skill gives — declaration entry names, the scope of change's recorded answers
  and states, the style system's entries, the marks structural and surface — stay in English
  wherever written, so a later session matches on them; values and reasons are in the person's
  language. Lives in `SKILL.md` under Language.
- Layout structure and reflow have a named home, `.design/structure.md`; two builds had once
  named the same file two ways because none was given.
- `NOTICE` says frontend-design may be shipped beside this skill under its own license.
