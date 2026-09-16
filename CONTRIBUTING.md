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
| `scripts/` | `check-readme.mjs` (the README's mechanical counts), `capture.mjs` (every gallery image comes through it), and their README |
| `gallery/` | The seven pages, their captures, and each run's `.design/record.md`, one name per page, and `README.md`, the source of truth for the prompt each page was built from |

## Change a rule

A change to anything under `skills/` keeps the laws under How the rules are written in
`CLAUDE.md`, and every file is read back with the questions under Words there before it is
handed over. In the same commit, change the line in `DESIGN.md` that names what the change
moved, added, or opened, and give the reason in `DECISIONS.md` under a dated heading.

## Sync

Sessions run the copies in `~/.claude/skills/`, not this repo. After any edit under `skills/`,
sync the copies and diff them; an unsynced copy is how a session runs on stale rules:

```bash
for s in design-discipline design-discipline-fix design-discipline-init \
         design-discipline-inspect design-discipline-review; do
  cp -r skills/$s/. ~/.claude/skills/$s/ && diff -r skills/$s ~/.claude/skills/$s
done
```

For a change under `skills/`, the diff printing nothing is the review's last count. Each
live-test workspace (below) carries its own copy under `.claude/skills/`; run the same loop
there, with the workspace's `.claude/skills/$s/` in place of `~/.claude/skills/$s/`.

## Review

Read every changed file in full, as the session that will execute it, then apply the lens:
`.claude/rules/skill-review.md` for everything under `skills/` but the skill's own README;
`.claude/rules/readme-review.md` for `README.md`, `skills/design-discipline/README.md`,
`CHANGELOG.md`, and everything in `gallery/`. Each lens file carries its own procedure — what
to list before applying, and when an agent pass is used. The README's mechanical counts come
from `node scripts/check-readme.mjs --pages`; every line it prints is 0 before a README change
is done. `DESIGN.md`, `DECISIONS.md`, and this file have no lens file; read them with the four
questions under Words in `CLAUDE.md`.

## Live test

Document review caps out. What settles a rule change is a run: a bare page with no declaration,
a re-inspection of an existing build, or a fresh build from a minimal brief that should trip
the counts the change added without the brief asking for it. The runs below use the skill's
own terms — the declaration and its scope of change, the record, the marks structural and
surface, the accessibility floor, not taken; `DESIGN.md` under Vocabulary gives each with the
file that defines it.

The workspace lives outside this repo — one directory per copy of a scaffold, a starter project
built to carry the defects a run should find; its own git repo, nothing from it committed here.
Two scaffolds. The first: one page whose `:root` carries a template's defaults (a near-black
background, a blue accent, `system-ui`, one radius), a logo drawn in CSS with a spin animation,
one button, two cards, one email field; a `README.md` holding the brief in one paragraph; a
`CLAUDE.md` with the one line that routes screen work to the skill; the skill copied into
`.claude/skills/` and synced after every edit. The second: two pages sharing one navigation, a
`brand/` directory holding the brand's guidelines and logo as text, the same `README.md`,
`CLAUDE.md`, and skill copy, and, planted on the pages, defects that trip the counts — a
carousel nothing can stop, a fixed bottom bar with no allowance for the platform's own regions,
a field with 14-pixel text, on which paste is blocked, a hover treatment with no hover
condition, a disabled button with no reason in sight, a button label that wraps at 320 pixels,
an error line that pushes the form down, a menu whose animation restarts from its start, a
headline that names nothing of the product, no way past the navigation by keyboard, a viewport
that caps zoom, a hero over three equal cards with no reason written for the arrangement, and,
carrying nothing, a glow and a dot grid behind the hero, an eyebrow over each card and a
colored band down its edge. You run the entries in Claude Code inside the workspace; a session
opened in this repo reads `.design/` and the diff and judges against the tables below. Each
run's `.design/record.md` stays with the workspace.

On the first scaffold:

| Run | What to read | It passes when |
|---|---|---|
| `init` on a copy with no `.design/` | The questions as they appear; `.design/declaration.md`; `.design/record.md`; the code | Each question put — the browser question only when the session has no browser it can drive — is the fixed text under What it asks you, translated, labels included, no term of the skill. The declaration adopts no value from the template, carries a reason on every entry, names entries as `rules/tokens.md` gives them, and reads scope of change: not yet asked (or not applicable with no code). The record holds the study record, the map of the code, and the comparison. The code is unchanged |
| `inspect` on the same copy | `.design/record.md`; `git status`; the code | Every repair on the list is marked structural or surface. tokens.md's unfilled-entries count is 0 with the scope of change entry at not yet asked. anti-slop.md's studied-references count is reported open when no study was done. Only `.design/record.md`, `.design/captures/`, and `.design/harness/` were written. The code is unchanged |
| `fix` on the copy, answering Keep the layout | The third question as it appears; `.design/declaration.md`; `.design/record.md`; the diff | The question is the fixed text, translated. The skill puts no other question (a stop for plan approval that your own `~/.claude/CLAUDE.md` asks for is not the skill's). The scope of change entry reads structure kept as soon as the answer is given. A value the declaration lacked is decided by the session and written with its reason. At most five repairs per pass; after each the failed counts rerun, and so does every count on an element the pass added, removed, or restyled. The record ties every change in the diff to a repair on the list. After the last pass, a run of every applicable Inspection finds nothing the record does not already hold with its reason. Every skipped repair carries its reason. Nothing moved, resized, removed, or reordered; artwork unchanged, its colors included; motion unchanged. Accessibility-floor repairs applied. The code's values are the declaration's; no template value remains but what the scope of change keeps |
| `inspect` again after `fix` | `.design/record.md`; the code | The counts behind every surface repair `fix` applied read 0. Structural repairs are still listed, marked, with the scope of change named as the reason. The code is unchanged |

On the second scaffold, everything above holds, and:

| Run | What to read | It passes when |
|---|---|---|
| `init` | `.design/declaration.md` | The colors and typefaces name `brand/` as their source, no value is marked provisional, and every type-scale step states a line-height |
| `inspect` | `.design/record.md` | Every planted defect is reported by a count or a check or, where the workspace cannot drive it, recorded as not taken; the arrangement first shows up as no declared structure; and rules/anti-slop.md's check on each decorative element names the eyebrows, the colored bands, and the dot grid as carrying nothing |
| `fix`, answering Keep the layout | `.design/record.md`; `.design/structure.md`; the diff | The carousel gets a control that stops it, a link past the navigation is laid over the page, the zoom cap is removed, paste is unblocked, the wrapping label is shortened, the headline is replaced with a fact from the brief or named as a job and recorded as missing, the arrangement is written into `.design/structure.md` as arrived unasked and left as structural, and the form's `name` and `action` are unchanged |
| `inspect` again after `fix` | `.design/record.md` | The arrangement count reads 1 per page, and the counts recorded as not taken are still recorded so |
| `fix` after the scope of change entry is edited to everything may change, then `inspect` | `.design/declaration.md`; `.design/record.md`; the diff | `fix` asks nothing and applies the structural repairs, the form's `name` and `action` still unchanged; `inspect` reads rules/review.md's lines on repairs from the record and the code, and every change the code shows is tied to a repair on the list |

The wording of the questions varies from run to run — the session translates the fixed text
each time. Judge it over two runs: a text that passes twice stands, and one failure is not a
repair. A gap in the rules — the skill asks where it should not, writes where it should not, or
leans on a tool's label that a version may change — is repaired on the first sighting.

What a run found goes into `DECISIONS.md`, under the decision it tested; a ship-visible change
gets its `CHANGELOG.md` entry ("Git" in `CLAUDE.md`). The run's own record stays in its
workspace.

## Commit

"Git" in `CLAUDE.md` holds the rules, the CHANGELOG entry in the same commit included.
