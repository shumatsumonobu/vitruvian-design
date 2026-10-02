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
of the copies.

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
Three scaffolds. The first: one page whose `:root` carries a template's defaults (a near-black
background, a blue accent, `system-ui`, one radius), a logo drawn in CSS with a spin animation, one
button, two cards, one email field; a `README.md` holding the brief in one paragraph; a `CLAUDE.md`
with the one line that routes screen work to the skill and names the language the person reads, its
polite form included; the skill copied into `.claude/skills/` and synced after every edit. The
second: two pages sharing one navigation, a `brand/` directory holding the brand's guidelines and
logo as text, the same `README.md`, `CLAUDE.md`, and skill copy, and, planted on the pages, defects
that trip the counts — a carousel nothing can stop, a fixed bottom bar with no allowance for the
platform's own regions, a field with 14-pixel text, on which paste is blocked, a hover treatment
with no hover condition, a disabled button with no reason in sight, a button label that wraps at 320
pixels, an error line that pushes the form down, a menu whose animation restarts from its start, a
headline that names nothing of the product, no way past the navigation by keyboard, a viewport that
caps zoom, a hero over three equal cards with no reason written for the arrangement, and, carrying
nothing, a glow and a dot grid behind the hero, an eyebrow over each card and a colored band down
its edge. The third, in Japanese: two pages sharing one navigation, a `brand/` directory whose
guidelines name three colors, one role split between a Japanese family and a Latin family, and a
handwriting face for one line of the hero, a `README.md` whose brief states the member count, and,
planted: font stacks whose order differs between headings and body, so Latin letters are set in both
families; the handwriting face on the hero line and on one card's title; three cards of the same
kind rotated and set in perspective; a lead that says thousands where the brief says the count; a
photograph whose largest areas are a blue no declared value holds; an English eyebrow restating the
title under it, and a lead repeating the heading. You run the entries in Claude Code inside the
workspace; a session opened in this repo reads `.design/` and the diff and judges against the tables
below. Keep a copy of the scaffold's code as it stood before the first run, and a script in the
workspace that prints the diff against it, the declaration, and the record; the judging session runs
that script after every run. Each run's `.design/record.md` stays with the workspace. Before the
first run, read the scaffold as built against its description here and the table it is judged by; a
planted defect the description does not name, or names differently, is a repair to one of them.

On the first scaffold:

| Run | What to read | It passes when |
|---|---|---|
| `init` on a copy with no `.design/` | The questions as they appear; `.design/declaration.md`; `.design/record.md`; the code | `init` opens with its fixed text and nothing before it. Each question put — the browser question only when the session has neither the extension nor a browser it could start itself — is the fixed text under What it asks you, translated, labels included, put through the AskUserQuestion tool, no term of the skill. What the session says around it is in the person's language, courteous as to someone just met, with no term of the skill and nothing about procedure; the translated question keeps the same courtesy. The declaration adopts no value from the template, carries a reason on every entry, names entries as `rules/tokens.md` gives them, and reads scope of change: not yet asked (or not applicable with no code). The record holds the study record, the map of the code, and the comparison. The code is unchanged |
| `inspect` on the same copy | `.design/record.md`; `git status`; the code | Every repair on the list is marked structural or surface. tokens.md's unfilled-entries count is 0 with the scope of change entry at not yet asked. anti-slop.md's studied-references count is reported open when no study was done. Only `.design/record.md`, `.design/captures/`, and `.design/harness/` were written. The code is unchanged |
| `fix` on the copy, answering Keep the layout | The third question as it appears; `.design/declaration.md`; `.design/record.md`; the diff | The question is the fixed text, translated, put through the AskUserQuestion tool. What the session says around it is in the person's language, courteous as to someone just met, with no term of the skill and nothing about procedure; the translated question keeps the same courtesy. The skill puts no other question (a stop for plan approval that your own `~/.claude/CLAUDE.md` asks for is not the skill's). The scope of change entry reads structure kept as soon as the answer is given. A value the declaration lacked is decided by the session and written with its reason. At most five repairs per pass; after each the failed counts rerun, and so does every count on an element the pass added, removed, or restyled. The record ties every change in the diff to a repair on the list. After the last pass, a run of every applicable Inspection finds nothing the record does not already hold with its reason. Every skipped repair carries its reason. Nothing moved, resized, removed, or reordered; artwork unchanged, its colors included; motion unchanged. Accessibility-floor repairs applied. The code's values are the declaration's; no template value remains but what the scope of change keeps |
| `inspect` again after `fix` | `.design/record.md`; the code | The counts behind every surface repair `fix` applied read 0. Structural repairs are still listed, marked, with the scope of change named as the reason. The code is unchanged |

On the second scaffold, everything above holds, and:

| Run | What to read | It passes when |
|---|---|---|
| `init` | `.design/declaration.md` | The colors and typefaces name `brand/` as their source, no value is marked provisional, and every type-scale step states a line-height |
| `inspect` | `.design/record.md` | Every planted defect is reported by a count or a check or, where the workspace cannot drive it, recorded as not taken; the arrangement first shows up as no declared structure; and rules/anti-slop.md's check on each decorative element names the eyebrows, the colored bands, and the dot grid as carrying nothing |
| `fix`, answering Keep the layout | `.design/record.md`; `.design/structure.md`; the diff | The carousel gets a control that stops it, a link past the navigation is laid over the page, the zoom cap is removed, paste is unblocked, the wrapping label is shortened, the headline is replaced with a fact from the brief or named as a job and recorded as missing, the arrangement is written into `.design/structure.md` as arrived unasked and left as structural, and the form's `name` and `action` are unchanged |
| `inspect` again after `fix` | `.design/record.md` | The arrangement count reads 1 per page, and the counts recorded as not taken are still recorded so |
| `fix` after the scope of change entry is edited to everything may change, then `inspect` | `.design/declaration.md`; `.design/record.md`; the diff | `fix` asks nothing and applies the structural repairs, the form's `name` and `action` still unchanged; `inspect` reads rules/review.md's lines on repairs from the record and the code, and every change the code shows is tied to a repair on the list |

On the third scaffold, everything above holds, and:

| Run | What to read | It passes when |
|---|---|---|
| `init` | `.design/declaration.md` | The typefaces entry lists the Japanese and Latin families as one family of one classification, naming the writing system each sets; the recorded exceptions entry holds the handwriting face with where it goes — the hero line — and the reason quoted from `brand/`; no entry names the photograph as a value's source |
| `inspect` | `.design/record.md` | Each planted defect is reported: families sharing a classification 0 — the entry names the writing systems — and typeface families in the flow 3, uses of a banned default outside its exception 2 (the card title and the rotated row), the rotated row named by the decorative-element check as carrying nothing, words standing in for a figure 1, photographs outside the palette 1, stated twice 2 or more; the card title is also on the family-switch count and the eyebrow on the all-caps count. The font order, the card title, the rotation, the word, and the lead are marked surface; the eyebrow and the photograph structural |
| `fix`, answering Keep the layout | `.design/record.md`; the diff | The five surface repairs are applied — one stack order, the card title in the body family, the rotation removed, the count written as the figure, the lead rewritten — and the eyebrow and the photograph are left with their reasons, the photograph's naming the material that would settle it |
| `inspect` again after `fix` | `.design/record.md` | The five counts read 0; the two structural repairs are still listed, with the scope of change as the reason |
| `fix` after the recorded exceptions entry gains the English captions, with where they go, and the scope of change is edited to everything may change, then `inspect` | `.design/declaration.md`; `.design/record.md`; the diff | The eyebrow is no longer counted as stated twice, and the decorative-element check answers it with the exception's place and reason; the photograph is replaced, brought to the palette, or left with the material named; every change is tied to a repair, and the exception count reads 0 |

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
- After each run: the diff holds only what the run's record ties to a repair; `.design/` holds
  every file the run wrote, and the system's temporary directory nothing of the run's; the
  record shows the run read the last two lines of `rules/review.md`'s count against itself.

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
