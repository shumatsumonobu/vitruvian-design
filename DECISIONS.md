# Decisions

Why the rules read as they do. One section per decision: what was decided, why — the run or
the defect that forced it — and where it now lives, so a later change starts from the reason
instead of rediscovering it. New decisions go under a new dated heading; the rules themselves
live in the files named, not here.

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
