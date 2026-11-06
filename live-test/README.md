# live-test

The scaffolds a change to the skill is run on before it ships, and the record of what those runs
had to show. Whoever changes a rule uses it: copy a scaffold out, run an entry in Claude Code inside
the copy, then read the run back from this repo. Why a run settles what review cannot, and the
pass tables for each scaffold, are under Live test in `CONTRIBUTING.md`.

## What is here

| Path | Holds |
|---|---|
| `scaffolds/cover/` | One screen, in Japanese: the cover of a morning-stretch web app, its brief in `README.md`, the line in `CLAUDE.md` that routes screen work to the skill. No `.design/`. For `init` and `review` |
| `scaffolds/cover-declared/` | `cover` with `.design/` in place: a declaration, a record holding the agreement and the study, a structure with the checked sizes, a lexicon. For `inspect` and `fix`. Its declaration predates the visual concept and signature entries, so it also stands for a product that already had one |
| `scaffolds/cover-glow-border/` | `cover-declared` with two planted defects — a glow on the title, a border on read-only text — and the bordered buttons and focus ring beside them as decoys |
| `scaffolds/cover-stamped/` | `cover` as an `init` and a `fix` left it on 2026-11-04: the cover rebuilt to its declaration, this week's card as its signature, and `.design/` with the inspection script the run wrote. For Round 5's `inspect` and `fix` |
| `scaffolds/cover-card/` | `cover-stamped` as Round 5's `inspect` and `fix` left it on 2026-11-04: this week's card above the menu, the runner configuration a helper wrote in `.design/harness/`. For Round 6's `inspect` and `fix` |
| `scaffolds/full/` | The whole scaffold: one screen and a full-screen layer, every defect `CONTRIBUTING.md` lists for it planted. For the run that walks the full sequence |
| `TESTPLAN.md` | Each round of runs: the copies, the planted defects and decoys, what was measured before the run, and the lines a run passes on |
| `RESULTS-06.md` | The old and new skill set side by side on `full` |

A scaffold whose `fixture.json` names another `extends` it: the files of the one it names are
copied first, its own over them. `fixture.json` is never copied.

## Commands

Set `VITRUVIAN_LIVE_TEST_DIR` to a directory outside this repo, once. A workspace inside the repo
would load this repo's `CLAUDE.md` and be read the answers.

```bash
node scripts/live-test.mjs new <scaffold> <workspace>                 # copy, install the skill, git init; prints the cd … && claude line
node scripts/live-test.mjs new <scaffold> <workspace> --skill <ref>   # the skill as it stood at a commit, for an old-against-new comparison
node scripts/live-test.mjs sync <workspace>                           # the working tree's skill into the workspace, then the diff
node scripts/live-test.mjs verify <workspace>                         # measure the scaffold's planted defects and decoys
node scripts/live-test.mjs judge <workspace>                          # after a run: the diff against the scaffold, the declaration, the record
node scripts/live-test.mjs stats <workspace> [--last]                 # minutes, tool calls, language, polite form, tokens per model
```

`new` refuses a workspace that exists; delete it by hand first. A workspace made with `--skill` is
never synced.

## Keeping it honest

- The pass lines of a round go in `TESTPLAN.md` before the run is asked for, never inside a
  scaffold, where the run would read them.
- A scaffold is changed here and copied out again; a planted defect fixed in a workspace by a run
  is the run's work, not the scaffold's.
- A new scaffold is only as big as what it settles: one screen and the state the run needs.
