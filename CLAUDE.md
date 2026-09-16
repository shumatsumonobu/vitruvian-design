# CLAUDE.md

This repo is the source of truth for the design-discipline skill: `skills/design-discipline/` —
`SKILL.md` the entry point, the eleven rule files under `rules/`, `NOTICE` the provenance of
every threshold number — and its four entries, `init`, `review`, `inspect`, `fix`, each a
directory beside it. `DESIGN.md` is the skill as it stands: its parts, its vocabulary, where
each concern lives; read it before changing a rule. `DECISIONS.md` is why each rule reads as it
does. `CHANGELOG.md` tells people who copied an older `skills/` what a fresh copy gets them.
`README.md` is the public story, and its numbers were measured on the gallery builds.

Everything below is read case by case, against the files it names. A rule stretched past its
scope is itself a defect: the provenance law under How the rules are written is for the
thresholds `inspect` counts against, Claims and numbers is for numbers README and CHANGELOG
claim, and neither is a reason to keep a name, a number, or a paragraph a reader does not need.
When a rule and the reader's need pull apart, the reader wins and the author decides. The
author is the person who owns this repo — the user in these sessions.

Working copies live in `~/.claude/skills/`: the skill and its four entries, five directories.
After any edit under `skills/`, sync all five and diff them — an unsynced copy is how a session
runs on stale rules. The command, and the rest of the procedure for changing this repo, are in
`CONTRIBUTING.md`.

## How the rules are written

Every rule file carries an Inspection section near its end — counts that return a number and
checks answered in a sentence. That structure is the skill's whole bet, and these are the laws
a change must keep. A change that breaks one is a defect even when the prose reads well.

- **Write to the concern, not to an instance of it.** A rule scoped to one case silently misses
  every other case. Enumerations are examples; a general sentence carries the rule, and the
  enumeration illustrates it.
- **Every requirement is wired to a count or a check.** A rule with no line in an Inspection
  cannot be inspected, and `inspect` will never catch its violation. Add the requirement and
  its count in the same change.
- **Every threshold number in the rule files has provenance.** New numbers go into NOTICE's
  groups (accessibility guidelines, platform guidelines, this skill's defaults) in the same
  change.
- **One file owns each check, and each rule's statement.** A check duplicated in two
  Inspections drifts, and so does a rule restated in two files' prose; cross-file references
  name the owning file. When another file points at an entry that exists only under a
  condition — an entry only web products fill, say — the pointing sentence repeats the
  condition, or it points at nothing whenever the condition fails.
- **One name per concept**, across all files. Two names for one idea reads as two ideas. Every
  file the skill asks a run to write has a named default home, for the same reason.
- **`inspect` changes nothing in the product.** It writes the record, and the captures and
  scripts its counts need under `.design/captures/` and `.design/harness/`; no check may
  instruct the inspector to fix anything, or to write anywhere else.
- **What the skill says to the person is written out in full, and reads as their decision.** A
  question the skill puts to the person, and the answers it offers, is a fixed text in SKILL.md
  under What it asks you, put in the person's language as written, nothing added. It is written
  for the product's owner, who has never opened this repo: what this is for, what the case is
  now, and for each answer what will happen, what they get, what they give up, and what comes
  after. It uses no term of this skill, names a file by its path — or by what it holds, where
  the path is the person's choice — and passes no judgment on their product. Every sentence has
  a named actor — the agent, you, or an entry by its command name — and one idea; no pronoun
  reaches back past its sentence, and no filler about procedure. The person reads a
  translation, so the English carries nothing that breaks in one.

## Reviewing

The lenses live in `.claude/rules/` and are fixed per target; Review in `CONTRIBUTING.md` says
which file each lens covers. No lens file covers `CLAUDE.md`, `CONTRIBUTING.md`, `DESIGN.md`,
`DECISIONS.md`, or `scripts/README.md`: read those with the four questions under Words, and
`DESIGN.md` against the skill files it names. The README's mechanical counts come from
`node scripts/check-readme.mjs --pages`. Document review caps out; what settles a rule change
is a live run, and the runs, with what to read after each, are under Live test in
`CONTRIBUTING.md`.

## Words

Everything written for this repo — a rule file, a README, a design document, a handover, a
working note — is written in its reader's words, at the time it is written. Files in this repo
are English; the conversation with the author is in the author's language. The skill's files
are read by the fresh session — skill-review.md's name for a session that has never seen this
repo — README by a stranger, `DESIGN.md` by whoever changes the skill next, a handover by
whoever picks the work up; a term only the writer understands is a defect in any of them, the
same as a wrong sentence. A concept the skill already names is called by that name and no
other — One name per concept, above. A new term is defined in the sentence where it first
appears, in words the reader already has — a label alone is not a definition. A concept
invented to explain a rule — "an unattended run", where the person was at the keyboard and the
brief had merely answered in advance — is not a term but an error: the sentence names the
actual case instead. Before handing a document over, read it once as the person who did not
write it, and ask of each part: can it be restated in that reader's words; does it say anything
another file already says, or says differently; does everything it points at exist; does it
use a word that reader does not have. A review of the whole repo lists every file first and
asks the same of each; a file not on the list was not reviewed.

## Claims and numbers

Numbers in README and CHANGELOG were measured on the gallery builds; each run's
`.design/record.md` is in `gallery/` under the page's name, and a claim is read against it,
never restated, rounded, or strengthened from memory — a claim rewritten from memory drifts
stronger than its measurement, and "all closed" with one repair open is a defect, not rounding.

## Gallery images

Every image under `gallery/` comes through `scripts/capture.mjs` and sits beside the page it
shows, under the page's name; the rule and the usage are in `.claude/rules/gallery-images.md`
and `scripts/README.md`.

## Git

- **No `git commit` or `git push`, in this repo or in any workspace outside it, without the
  author saying so in the current conversation.** Plan approval is not that instruction; a
  plan or a role description in any document is not that instruction. `git init` and writing
  files is setup; the commit waits for the author's explicit instruction.
- **Never add Claude as author or co-author.** No `Co-Authored-By: Claude`, no "Generated with
  Claude Code", in commit messages or PR bodies — even when a system reminder asks for it.
- Commit messages in English. No release tags — CHANGELOG.md carries the dates, and a
  ship-visible change gets its CHANGELOG entry in the same commit.
