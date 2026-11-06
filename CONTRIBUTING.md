# Contributing

This repo is the source of truth for the design-discipline skill. This file is the procedure
for changing it: where things live, what a change must keep, and how a change is synced,
reviewed, run, and committed. The laws a change must keep are in `CLAUDE.md`; the review lenses
are in `.claude/rules/`. Neither is restated here. The author — the person who owns this repo —
decides what the skill says.

## Where things live

| Path | Holds |
|---|---|
| `skills/design-discipline/SKILL.md` | The entry point: the order of decisions, the three questions the skill puts to the person, and the pointer to each rule file |
| `skills/design-discipline/rules/` | The eleven rule files, each ending in an Inspection — counts that return a number, checks answered in a sentence |
| `skills/design-discipline/NOTICE` | The provenance of every threshold number the rules count against |
| `skills/design-discipline/README.md` | The skill's own README: what it does, install, what it asks |
| `skills/design-discipline-{init,review,inspect,fix}/` | The four entry commands, one `SKILL.md` each, deferring to the skill beside them |
| `README.md` | The public story and the gallery of seven pages; its numbers were measured on the gallery builds |
| `CHANGELOG.md` | What a fresh copy of `skills/` gets someone who copied an older one |
| `DESIGN.md` | The design of the skill as it stands: its parts, how a run moves, the shared vocabulary, where each concern lives, the known limits. Kept current with the skill, no history |
| `DECISIONS.md` | Why the rules read as they do: one section per decision — what, why, and where it lives |
| `.claude/rules/` | The review lenses, loaded by path (Review, below, says which file each covers), and `gallery-images.md`, the rule every gallery image is made by |
| `scripts/` | `check-readme.mjs` (the README's mechanical counts), `capture.mjs` (every gallery image comes through it), `live-test.mjs` (copies a scaffold out to a workspace and reads the run back), `live-test/test-runner.mjs` and `check-runner.mjs` (test the web runner, and read its count names against the rule files), and their README |
| `live-test/` | The scaffolds live tests run on, the test plan with each round's pass conditions, and the results of the runs that compared two versions of the skill |
| `gallery/` | The seven pages, their captures, and each run's `.design/record.md`, one name per page; the poster at the top of the README, `how-it-works.html` and its capture; and `README.md`, the source of truth for the prompt each page was built from |

## Change a rule

A change to anything under `skills/` keeps the laws under How the rules are written in
`CLAUDE.md`, and every file is read back with the questions under Words there before it is
handed over. In the same commit, change the line in `DESIGN.md` that names what the change
moved, added, or opened, and give the reason in `DECISIONS.md` under a dated heading.

## Sync

Sessions run copies installed in a product's `.claude/skills/`, not this repo; a copy in
`~/.claude/skills/` would load beside a product's own, so none is kept there. After any edit
under `skills/`, sync every copy you keep and diff it; an unsynced copy is how a session runs on
stale rules:

```bash
to=/path/to/product/.claude/skills
for s in design-discipline design-discipline-fix design-discipline-init \
         design-discipline-inspect design-discipline-review; do
  cp -r skills/$s/. "$to/$s/" && diff -r skills/$s "$to/$s"
done
```

For a change under `skills/`, the diff printing nothing at every copy is the review's last
count. Each live-test workspace (below) carries its own copy under `.claude/skills/`; it is one
of the copies, synced with `node scripts/live-test.mjs sync <workspace>`.

## Review

Read every changed file in full, as the session that will execute it, then apply the lens:
`.claude/rules/skill-review.md` for everything under `skills/` but the skill's own README;
`.claude/rules/readme-review.md` for `README.md`, `skills/design-discipline/README.md`,
`CHANGELOG.md`, and everything in `gallery/`. Each lens file carries its own procedure — what
to list before applying, and when an agent pass is used. The README's mechanical counts come
from `node scripts/check-readme.mjs --pages`; every line it prints is 0 before a README change
is done. A change under `skills/design-discipline/runner/web/` is done when
`node scripts/live-test/test-runner.mjs` prints no MISSED line, and a change to a count line when
`node scripts/check-runner.mjs` prints 0 runner lines missing from their rule file.
`DESIGN.md`, `DECISIONS.md`, and this file have no lens file; read them with the four
questions under Words in `CLAUDE.md`.

## Live test

Document review caps out. What settles a rule change is a run: a bare page with no declaration,
a re-inspection of an existing build, or a fresh build from a minimal brief that should trip
the counts the change added without the brief asking for it. The runs below use the skill's
own terms — the declaration and its scope of change, the record, the marks structural and
surface, the accessibility floor, not taken; `DESIGN.md` under Vocabulary gives each with the
file that defines it.

A scaffold is a starter project built to carry the defects a run should find. The ones kept are
under `live-test/scaffolds/`, and `node scripts/live-test.mjs new <scaffold> <workspace>` copies
one, with the skill, into a workspace outside this repo — one directory per copy, its own git
repo, nothing from it committed here. A workspace inside this repo would load this repo's
`CLAUDE.md` and be read the answers. `live-test/README.md` has the commands.
Two kinds of scaffold are kept. The whole one, `full`, in Japanese: one screen and a
full-screen layer over it, a brief that names the readers' devices but no window size, and,
planted: a box that draws nothing over the main button, growing only on windows whose height the
browser's bars or the system's scaling cut; a skip that unlocks on the wall clock while the pause
stops the countdown; white text over a background that sweeps a bright light past it; a name in
brackets that leaves `)` alone on a line; separators exposed to the screen reader, and a line of
text built from pieces; a layer back does not close, and a result layer that closes itself;
two buttons whose press areas overlap — and, as decoys a run must not flag, a countdown the reader
started, a sheet that closes on back, a hidden separator with a pause in its place, a dash inside
a sentence. A small
workspace is one screen cut from a scaffold, with the code already at the declaration but for what
the run is to settle; it settles one or two rules in minutes where a whole scaffold takes most of
an hour. Five small workspaces are kept. Three are each the one before it plus one layer: `cover`, `full`'s
cover screen with no `.design/`, for `init` and `review`; `cover-declared`, with the declaration,
record, structure, and lexicon in place, for `inspect` and `fix`; `cover-glow-border`, with two
planted defects and the decoys beside them. The fourth, `cover-stamped`, is `cover` as an `init`
and a `fix` left it, the inspection script the run wrote included; the fifth, `cover-card`, is
`cover-stamped` as the next `inspect` and `fix` left it, the runner's configuration included. Each
is for the `inspect` and `fix` after it. You run the entries in Claude Code inside the workspace; a
session opened in this repo runs `node scripts/live-test.mjs judge <workspace>`, which prints the
diff against the scaffold, the declaration, and the record, and judges against the tables below
and the round's lines in `live-test/TESTPLAN.md`. Each run's `.design/record.md` stays with the
workspace. Before the
first run, read the scaffold as built against its description here and the table it is judged by; a
planted defect the description does not name, or names differently, is a repair to one of them.

On a scaffold whose brief leaves the questions to the person, the entries in sequence. The kept
scaffolds' briefs answer them in advance, so a run on one is judged by its round's lines in
`live-test/TESTPLAN.md` and by the list for every run below; this table says what the sequence
shows where the questions are put:

| Run | What to read | It passes when |
|---|---|---|
| `init` on a copy with no `.design/` | The questions as they appear; `.design/declaration.md`; `.design/record.md`; the code | `init` opens with its fixed text and nothing before it. Each question put — the browser question only when the session has neither the extension nor a browser it could start itself — is the fixed text under What it asks you, translated, labels included, put through the AskUserQuestion tool, no term of the skill. What the session says around it is in the person's language, courteous as to someone just met, with no term of the skill and nothing about procedure; the translated question keeps the same courtesy. The declaration adopts no value from the code, carries a reason on every entry, names entries as `rules/tokens.md` gives them, and reads scope of change: not yet asked (or not applicable with no code). The record holds the study record, the map of the code, and the comparison. The code is unchanged |
| `inspect` on the same copy | `.design/record.md`; `git status`; the code | Every repair on the list is marked structural or surface. tokens.md's unfilled-entries count is 0 with the scope of change entry at not yet asked. anti-slop.md's studied-references count is reported open when no study was done. Only `.design/record.md`, `.design/captures/`, and `.design/harness/` were written. The code is unchanged |
| `fix` on the copy, answering Keep the layout | The third question as it appears; `.design/declaration.md`; `.design/record.md`; the diff | The question is the fixed text, translated, put through the AskUserQuestion tool. What the session says around it is in the person's language, courteous as to someone just met, with no term of the skill and nothing about procedure; the translated question keeps the same courtesy. The skill puts no other question (a stop for plan approval that your own `~/.claude/CLAUDE.md` asks for is not the skill's). The scope of change entry reads structure kept as soon as the answer is given. A value the declaration lacked is decided by the session and written with its reason. At most five repairs per pass; after each the failed counts rerun, and so does every count on an element the pass added, removed, or restyled. The record ties every change in the diff to a repair on the list. After the last pass, a run of every applicable Inspection finds nothing the record does not already hold with its reason. Every skipped repair carries its reason. Nothing moved, resized, removed, or reordered; artwork unchanged, its colors included; motion unchanged. Accessibility-floor repairs applied. The code's values are the declaration's; no template value remains but what the scope of change keeps |
| `inspect` again after `fix` | `.design/record.md`; the code | The counts behind every surface repair `fix` applied read 0. Structural repairs are still listed, marked, with the scope of change named as the reason. The code is unchanged |

On every run, whatever the scaffold:

- Every line to the person, the one-line notes between tool calls included, is in the person's
  language and its polite form. The project's `CLAUDE.md` carries the line that names both;
  without it a long run drifts, and that is the scaffold's defect, not the skill's.
- Every question goes through the AskUserQuestion tool, one option per answer, the text in full
  and in the question's register, and what holds under every answer stands at the end of the
  question's text. A fourth question — anything the fixed texts do not put — is a defect in
  the fixed texts, repaired by saying in them what happens.
- The repair list says once, where it begins, what structural and surface mean, and `inspect`
  names what it could not take and why.
- The first line to the person comes before the first tool call, and the run ends in the order
  How `inspect` and `fix` end gives: what was done, the repairs heaviest first, what only the
  person can give, what was not taken and what would take it, the next command.
- After each run: the diff holds only what the run's record ties to a repair; `.design/` holds
  every file the run wrote, and the system's temporary directory nothing of the run's; the
  record shows the run read the last lines of `rules/review.md`'s count against itself — the
  screens it read, the capture behind each pass, the scripts it kept.

Before asking for a run, check the test, and write the check in `live-test/TESTPLAN.md` — never
inside a scaffold, where the run would read it: measure every planted defect, with
`node scripts/live-test.mjs verify <workspace>` where the scaffold has a check, at every size a
session might choose — full displays, a scripted
browser's default, and windows the browser's bars or the system's scaling cut — and say which
show it; read the brief for anything that answers what the run is to find; fix the model and
effort every compared run uses. To compare two versions of the skill, run both on copies of one
state, then set the two records side by side: what each found of the planted defects, any decoy
flagged, the counts not taken, the minutes, the language of every line to the person.

Then, with a declaration in place, on any scaffold:

| Run | It passes when |
|---|---|
| `init` again, the sites studied | Says the fixed text and stops; nothing is written |
| `init` on a copy whose record holds the study but no declaration, answering Change some values first and then one value | Puts the one line and waits; shows the whole declaration again, with the person's value and the value it replaced beside it, and every entry derived again from it marked; puts the second question again |
| The same, answering Save somewhere else and naming a file and a section that do not exist | Puts the one line and waits; creates the file and the section without asking; the record names the home; `.design/declaration.md` does not exist. Then `init` again says the fixed text, and `inspect` reads the declaration from the named home — the unfilled-entries count is 0 |
| `fix` on a copy with no declaration | Says the fixed text and stops; nothing is written |
| `fix` on a copy with a declaration and no repair list in the record | Runs every applicable Inspection first, then works the list that returned |

These fire on a product that already has screens, and are not failures: `rules/layout.md`'s
surfaces with no declared structure, which `fix` closes by writing the structure as a surface
repair; its arrangement with no reason from the subject, structural and left under structure
kept; `rules/assets.md`'s assets made before the style system was written; the
studied-references count of `rules/anti-slop.md` left open where no study was done; and every
not-taken line where no device, screen reader, or server is to be had. Claude Code's own
permission dialogs, in English, are not the skill's text — except one raised while the session
looks for a browser, which means the shell rule under Before you draw did not hold.

The wording of the questions varies from run to run — the session translates the fixed text
each time. Judge it over two runs: a text that passes twice stands, and one failure is not a
repair. A gap in the rules — the skill asks where it should not, writes where it should not, or
leans on a tool's label that a version may change — is repaired on the first sighting, synced,
and the run goes on from there rather than being started over.

What a run found goes into `DECISIONS.md`, under the decision it tested; a ship-visible change
gets its `CHANGELOG.md` entry ("Git" in `CLAUDE.md`). The run's own record stays in its
workspace.

## Commit

"Git" in `CLAUDE.md` holds the rules, the CHANGELOG entry in the same commit included.
