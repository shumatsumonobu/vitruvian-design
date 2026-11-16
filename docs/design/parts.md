# The parts

What the skill is made of: each file, what it holds, and what it writes into a product. For
whoever changes the skill.

## The entry point

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

## The four entries

Each has a directory beside the skill (`skills/design-discipline-<name>/SKILL.md`) holding only
the description Claude Code lists; the procedure lives in the Ways in table of `SKILL.md`.

| Entry | Does |
|---|---|
| `init` | Derives the declaration from the subject, reads the code beside it without adopting a value, asks the second question, writes the declaration once — at `.design/declaration.md`, or at the home the person names, which a line in `.design/declaration.md` then gives; run again after a skipped study, studies the sites and puts the second question again |
| `inspect` | Runs every applicable Inspection against every screen the product has, at the checked sizes, writes the repair list to `.design/repairs.md` with each repair marked, and ends with the report How `inspect` and `fix` end describes; changes nothing else |
| `fix` | Works the repair list down within the scope of change — running the Inspections first where `.design/repairs.md` holds no list, and taking each repair off it as it is made — at most five repairs per pass, and ends with a run of every applicable Inspection and its reviewer, whose new findings are one more pass — every defect its own changes caused, and up to five other repairs, whole screens first — before what is left is said to the person and the list is deleted; ends with the same report |
| `review` | Improves a screen that exists: operates it, names the deficits, gathers references against them, rebuilds in small passes, compares |

## The twelve rule files

Each rule file states its rules, then ends with an Inspection section — the counts, then the
checks — and a Platform notes section, the only place a platform is named. A concern has one
owner; a second file that needs it points at the owner by file name. What each file owns, and
when a session opens it, is the While you build table in `SKILL.md`.

## NOTICE

`skills/design-discipline/NOTICE` holds the provenance of every threshold number the counts use,
in three groups — accessibility guidelines, platform guidelines, this skill's defaults — one
line per number, naming the rule file that uses it. It also names the pieces of the
accessibility floor and the guideline each follows. A number with no line there is a defect.

## The gathered Inspections

`skills/design-discipline/inspections.md` holds every rule file's Inspection and Platform notes,
word for word, in the order `SKILL.md` lists the files. A run that inspects reads it in place of
opening twelve files, and opens a rule file only for a section one of its lines points at. The
rule files own every line; `scripts/build-inspections.mjs` builds the file and checks it.

## The reviewer's instructions

`skills/design-discipline/reviewer.md` is what a reviewer reads: what it was handed, the first
word it returns, at most eight findings with whole screens first, one answer on the visual
concept and the signature, and nothing written. The session does not read it — `rules/review.md`
says so — so the screens are not shaped to the review; where no agent can be started, the session
reads it and answers it before it reads any count line.

## The runner

`skills/design-discipline/runner/web/` holds the web runner: `run.mjs`, the parts under `lib/`,
and `README.md`, which a session reads to run it and to write the product's configuration. It
takes the counts any web product needs from a rendered screen, an interaction, or a recording,
names each by its count line's own words, and prints a number, `data` for the session to judge,
or `not taken` with the step and the method that stopped. It needs Node and Chrome and nothing
from npm. A rule file defines every count; the runner only takes it. It also takes the inventory
`fix` and `review` compare before the first pass and after the last (`--inventory=`, `--kept=`).
This repo tests it with `scripts/live-test/test-runner.mjs` on three scaffolds, a fixture of
planted measurements and their decoys, a hang, and a frozen tab, and
`scripts/check-runner.mjs` reads its count names against the rule files. Only `rules/review.md`'s
Platform notes names it, since it serves one platform.

## The picture tool

`skills/design-discipline/images/` holds `fetch.mjs` and its `README.md`: given what a picture
shows and how it is treated, it generates one where an image key is in the environment and finds a
freely licensed photograph in Wikimedia Commons otherwise, writing the picture with its source and
its credit beside it. `scripts/check-images.mjs` tests it against stubs. Only `rules/assets.md`'s
Platform notes names it.

## What the skill writes into a project

Everything lands under `.design/` at the project root; the table under What this skill writes,
and where in `SKILL.md` is the list. The two that carry the design:

- **The declaration** (`.design/declaration.md`, or a section in a design document the person
  keeps). The person's decisions: every token entry with its reason, the scope of change, the
  recorded exceptions, and any permission for what the product relies on behind the screen. Only
  the person changes a decision, by editing it. `init` creates it; a later pass may add an entry
  the declaration lacks, with its reason, or amend an entry's wording, and never writes the scope
  of change or a permission.
- **The repair list** (`.design/repairs.md`). What `inspect` hands to `fix`, and nothing else: each
  open repair with its marks. `fix` takes a repair off it as it makes it, says what is left in its
  last message, and deletes the file. No file holds what a run did: every file the skill writes
  holds what is true now — the study, the directions set aside, and where the code's values live
  are entries of the declaration — and what a run counted, found, and changed, it says as it works; its last
  message gives the person what was left and what only they can give, and the project's version
  history keeps what changed.
  `inspect` writes here, and the captures and scripts its counts need under `.design/captures/`
  and `.design/harness/`, and changes nothing in the product.

The structure declaration, the lexicon, the style system, the captures, and the harness are the
remaining files; each rule file that calls for one names it. The structure declaration holds the
checked sizes, and, per surface, the lines other rule files place there: the first item of the
first view, a state that cannot occur, the states the reader's operation reaches, what back does
at each step, a count the person took on their own device. The harness keeps the scripts that take counts, so a later pass counts again by
running them; on the web the inspection script is the runner, and the session writes its
configuration and the flows only the product has. An inspection script runs one rule file's
counts without the others, so a pass reruns only what it must. Every step a script waits on has a time limit, and a method that hung
or returned nothing is named in `.design/harness/hung.md` so no later script uses it. Where the session can start
a helper, the helper writes them and runs each once before it returns. Their output and a
browser's working files go when the run ends.

Each entry file carries, besides the pointer to `SKILL.md`, what a session must do from its first
step: write every line in the user's language, a note to itself included, and say one line on
what it is about to do before its first tool call of any kind — `init` its opening text, or that
line where the brief agrees in advance — write no account of the run to any file; for `inspect` and `fix`, read the Inspections from
`inspections.md`; for `inspect`, write the repair list to `.design/repairs.md`; and, for `fix`, run
every rule file's Inspection after the last pass, take each repair off the list as it is made, and
delete the list at the end. An instruction placed only in
`SKILL.md` is read once and lost in a long run, so the entry file carries it.
