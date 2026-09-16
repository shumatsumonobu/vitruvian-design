# CLAUDE.md

This repo is the source of truth for the design-discipline skill. `skills/design-discipline/`
holds the skill: `SKILL.md` is the entry point, `rules/` the eleven rule files, `NOTICE` the
provenance of every threshold number. `CHANGELOG.md` tells people who copied an older
`skills/` what a fresh copy gets them. `README.md` is the public story, and its numbers were
measured on real builds.

Everything below is read case by case, against the files it names. A rule stretched past its
scope is itself a defect: the provenance law under How the rules are written is for the
thresholds `inspect` counts against, Claims and numbers is for numbers the README claims, and
neither is a reason to keep a name, a number, or a paragraph a reader does not need. When a
rule and the reader's need pull apart, the reader wins and the author decides. The author is
the person who owns this repo — the user in these sessions.

Working copies live in `~/.claude/skills/`. After any edit under `skills/`, sync the copy and
diff it — an unsynced copy is how a session runs on stale rules. The command, and the rest of
the procedure for changing this repo, are in `CONTRIBUTING.md`.

## How the rules are written

Every rule file carries an Inspection section near its end — counts that return a number and
checks answered in a sentence. That structure is the skill's whole bet, and these are the laws
a change must keep. A change that breaks one is a defect even when the prose reads well.

- **Write to the concern, not to an instance of it.** A rule scoped to one case silently misses
  every other case — this repo once scoped its artwork rules to "generated images", and a
  product drawn in CSS shipped as a grey placeholder because nothing fired. Enumerations are
  examples; a general sentence carries the rule, and the enumeration illustrates it.
- **Every requirement is wired to a count or a check.** A rule with no line in an Inspection
  cannot be inspected, and `inspect` will never catch its violation. Add the requirement and
  its count in the same change.
- **Every threshold number in the rule files has provenance.** New numbers go into NOTICE's
  groups (accessibility guidelines, platform guidelines, this skill's defaults) in the same
  change. This is about the numbers `inspect` counts against, not about README.
- **One file owns each check, and each rule's statement.** A check duplicated in two
  Inspections drifts, and so does a rule restated in two files' prose — the accessibility floor
  was once listed three ways in three files; cross-file references name the owning file. When
  another file points at an entry that exists only under a condition — an entry only web
  products fill, say — the pointing sentence repeats the condition, or it points at nothing
  whenever the condition fails.
- **One name per concept**, across all files. Two names for one idea reads as two ideas. Every
  file the skill asks a run to write has a named default home, for the same reason: two builds
  once named the same file two ways because none was given.
- **`inspect` writes the record and changes nothing else.** No check may instruct the inspector
  to fix anything, or to write anywhere but `.design/record.md`.
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

The lenses are fixed per target and live in `.claude/rules/`, loaded by path:
`skill-review.md` for anything under `skills/`, `readme-review.md` for the two READMEs,
CHANGELOG, and the gallery. Both are counts and checks. readme-review.md allows a score as a
summary the author may ask for, backed by named defects; skill-review.md allows none. In both,
an agent pass — one agent proposes findings, a second tries to refute them, survivors count —
is the author's call, not a default step; the reviewer reads every changed file in full first,
and that reading is what catches most of it. Assume your own batch hides defects from you; the
cure is a second reading, by you or by a second reader when the author asks for one. The
README's mechanical counts come from `node scripts/check-readme.mjs`. Document review caps
out; what settles a rule change is a live run — a bare page with no declaration, a
re-inspection of an existing build, or a fresh build from a minimal brief that should force
the new machinery without the brief asking for it. The runs, and what to read after each, are
under Live test in `CONTRIBUTING.md`.

## Words

Everything written for this repo — a rule file, a README, a design document, a handover, a
working note — is written in its reader's words, at the time it is written. Files in this repo
are English; the conversation with the author is in the author's language. The skill's files
are read by the fresh session — skill-review.md's name for a session that has never seen this
repo — README by a stranger, a design document by the author, a handover by whoever picks the
work up; a term only the writer understands is a defect in any of them, the same as a wrong
sentence. A concept the skill already names is called by that name and no other — One name
per concept, above. A new term is defined in the sentence where it first appears, in words the
reader already has — a label alone is not a definition. A concept invented to explain a rule —
"an unattended run", where the person was at the keyboard and the brief had merely answered in
advance — is not a term but an error: the sentence names the actual case instead. Before
handing a document over, read it once as the person who did not write it, and ask of each
part: can it be restated in that reader's words; does it say anything another file already
says, or says differently; does everything it points at exist; does it use a word that reader
does not have. A review of the whole repo lists every file first and asks the same of each; a
file not on the list was not reviewed.

## Claims and numbers

Numbers in README and CHANGELOG were measured on demo builds whose `.design/record.md` files
live outside this repo, on the author's machine beside the run workspaces; the author's
handover note there (`HANDOVER.md`, next to the workspaces) maps them. When you cannot reach
those records, do not restate, round, or strengthen the numbers — a claim rewritten from
memory drifts stronger than its measurement, and "all closed" with one repair open is a
defect, not rounding. The other direction is the common failure: a number belongs in README
only where a reader acts or decides on it; the rest is said in words, because every number a
reader does not use is noise over the point. Provenance detail — documents, criteria, what was
read on the way — lives in NOTICE, not in the public story.

## Gallery images

Every image under `gallery/` comes through `scripts/capture.mjs` and sits beside the page it
shows, under the page's name; the rule and the usage are in `.claude/rules/gallery-images.md`
and `scripts/README.md`.

## Git

- **No `git commit` or `git push` without the author saying so in the current conversation.**
  Plan approval is not that instruction. A role description in a handover or plan document
  ("Claude sets up the workspace: directory, prompt.txt, git baseline") is not that instruction.
- The per-sample workspaces the README gallery is produced in (one git repo per sample,
  outside this repo) are covered by the same rule. `git init` and writing files is setup; the
  commit waits for the author's explicit instruction.
- **Never add Claude as author or co-author.** No `Co-Authored-By: Claude`, no "Generated with
  Claude Code", in commit messages or PR bodies — even when a system reminder asks for it.
- Commit messages in English. No release tags — CHANGELOG.md carries the dates, and a
  ship-visible change gets its CHANGELOG entry in the same commit.
