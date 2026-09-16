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
| `README.md` | The public story and the gallery of seven pages; its numbers were measured on real builds |
| `CHANGELOG.md` | What a fresh copy of `skills/` gets someone who copied an older one |
| `DECISIONS.md` | Why the rules read as they do: one section per decision — what, why, and where it lives |
| `.claude/rules/` | The review lenses, loaded by path: `skill-review.md` for `skills/`, `readme-review.md` for the READMEs, CHANGELOG, and the gallery, `gallery-images.md` for the images |
| `scripts/` | `check-readme.mjs` (the README's mechanical counts), `capture.mjs` (every gallery image comes through it), and their README |
| `gallery/` | The seven pages and their captures, one name per page |

## Change a rule

A change to anything under `skills/` keeps the laws under "How the rules are written" in
`CLAUDE.md`; read them before editing. Two that are easy to miss: a requirement and
its count or check land in the same change, and what the skill says to the person is written
out in full under What it asks you in `SKILL.md`. Everything in this repo is English and is
written in its reader's words — "Words" in `CLAUDE.md` says how to read a file back before
handing it over.

## Sync

Sessions run the copy in `~/.claude/skills/`, not this repo. After any edit under `skills/`,
sync the copy and diff it; an unsynced copy is how a session runs on stale rules:

```bash
cp -r skills/design-discipline/. ~/.claude/skills/design-discipline/ && \
  diff -r skills/design-discipline ~/.claude/skills/design-discipline
```

The diff printing nothing is the last count of every review. A live-test workspace (below)
carries its own copy under `.claude/skills/`; sync that one the same way.

## Review

Read every changed file in full, as the session that will execute it, then apply the lenses:
`.claude/rules/skill-review.md` for anything under `skills/`, `.claude/rules/readme-review.md`
for the two READMEs, CHANGELOG, and the gallery. Each lens file carries its own procedure —
what to list before applying, and when an agent pass is used. The README's mechanical counts
come from `node scripts/check-readme.mjs --pages`; every line it prints is 0 before a README
change is done.

## Live test

Document review caps out. What settles a rule change is a run: a bare page with no declaration,
a re-inspection of an existing build, or a fresh build from a minimal brief that should trip
the new machinery without the brief asking for it.

The terms in the table below — the declaration and its scope of change, the record, repairs
marked structural or surface, the accessibility floor — are the skill's own, defined in
`SKILL.md` and the rule files it points at; read those first.

The workspace lives outside this repo — one directory per scaffold, its own git repo, nothing
from it committed here. The scaffold used so far: one page whose `:root`
carries a template's defaults (a near-black background, a blue accent, `system-ui`, one
radius), a logo drawn in CSS with a spin animation, one button, two cards, one email field; a
`README.md` holding the brief in one paragraph; a `CLAUDE.md` with the one line that routes
screen work to the skill; the skill copied into `.claude/skills/` and synced after every edit.
You run the entries in Claude Code inside the workspace; a session opened in this repo reads
`.design/` and the diff and judges against the table below. Each run's `.design/record.md`
stays with the workspace.

| Run | What to read | It passes when |
|---|---|---|
| `init` on a scaffold with no `.design/` | The two questions as they appear; `.design/declaration.md`; `.design/record.md`; the code | Both questions are the fixed text under What it asks you, translated, labels included, no term of the skill. The declaration adopts no value from the template, carries a reason on every entry, names entries as `rules/tokens.md` gives them, and reads scope of change: not yet asked (or not applicable with no code). The record holds the study note, the map of the code, and the comparison. The code is unchanged |
| `inspect` on the same scaffold | `.design/record.md`; `git status`; the code | Every repair on the list is marked structural or surface. tokens.md's unfilled-entries count is 0 with the scope entry at not yet asked. anti-slop.md's studied-references count is reported open when no study was done. Only `.design/record.md`, `.design/captures/`, and `.design/harness/` were written. The code is unchanged |
| `fix` on the scaffold, answering Keep the layout | The third question as it appears; `.design/declaration.md`; `.design/record.md`; the diff | The question is the fixed text, translated. The skill puts no other question (a stop for plan approval that your own `~/.claude/CLAUDE.md` asks for is not the skill's). The scope entry reads structure kept as soon as the answer is given. A value the declaration lacked is decided by the session and written with its reason. At most five repairs per pass, the counts rerun after each. Every skipped repair carries its reason. Nothing moved, resized, removed, or reordered; artwork unchanged, its colors included; motion unchanged. Accessibility-floor repairs applied. The code's values are the declaration's; no template value remains but what the scope of change keeps |
| `inspect` again after `fix` | `.design/record.md`; the code | The surface counts `fix` addressed read 0. Structural repairs are still listed, marked, with the scope of change named as the reason. The code is unchanged |

The wording of the questions varies from run to run — the session translates the fixed text
each time. Judge it over two runs: a text that passes twice stands, and one failure is not a
repair. A gap in the rules — the skill asks where it should not, writes where it should not, or
leans on a tool's label that a version may change — is repaired on the first sighting.

What a run found, and what changed for it, goes into the commit and its CHANGELOG entry, not
into a document in this repo.

## Commit

"Git" in `CLAUDE.md` holds the rules, the CHANGELOG entry in the same commit included.
