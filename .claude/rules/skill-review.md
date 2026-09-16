---
paths:
  - "skills/**"
---

# Skill review — the lenses for changes under skills/

Applies to any change under `skills/`: the rule files, `SKILL.md`, `NOTICE`, and the four entry
directories beside the skill. (The skill's own README is prose and follows `readme-review.md`.)
The laws these lenses enforce are in the repo's CLAUDE.md under "How the rules are written" and
"Words"; this file is how a change gets checked against them, the same way every time. Not
lenses invented per review. The author is the person who owns this repo and runs these
sessions; the author decides what the skill says.

## The counts

Each returns a number. The target is 0.

- Requirements in the changed text with no line in an Inspection (a count or a check): 0.
- Checks that appear in the Inspection of two files: 0. A cross-file reference names the owning
  file, and repeats the condition when the pointed-at entry exists only under one.
- Threshold numbers in the changed text absent from NOTICE's groups: 0.
- Sentences scoped to one instance of a concern where the law names the concern — "generated
  images" where the concern is artwork, one platform where the rule is platform-independent: 0.
  Read each changed sentence; the enumeration is an example only when a general sentence
  carries the rule beside it.
- Platform-specific sentences outside a file's `Platform notes` section: 0.
- Instructions in an Inspection that tell the inspector to fix something, or to write anywhere
  but `.design/record.md`: 0.
- Questions the skill puts to the person whose text is not written out under What it asks you
  in SKILL.md: 0. In those texts, terms of this skill, passive sentences with no actor,
  pronouns reaching back past their sentence, judgments of the person's product: 0.
- Lines printed by the sync diff after the batch (the sync command at the top of CLAUDE.md): 0.

## The checks

Each is answered in a sentence, in the review, not by feel.

- One name per concept: for each term the change introduces, name the existing term for the
  same concept across the files, or say there is none.
- The operator's view: read the changed procedure as the agent that must execute it. Name the
  first step it could not perform as written, or say there is none.
- The fresh session: read each changed file as a session that has never seen this repo. Name
  any term it meets before the file defines it, any pointer to a file or section that does not
  exist, and any sentence that assumes something about the product — a second theme, artwork,
  typing, a network — without saying what happens when it is absent. One of those is how two
  builds invented two names for the same file.
- The person's seat: read each question under What it asks you as the product's owner who has
  never opened this repo. For each answer, say what will happen, what they get, what they give
  up, and what comes after; an answer missing one is a repair. Name any word that owner would
  not have.
- The live run: name what would settle the change — a bare page with no declaration, a
  re-inspection of an existing build, or a fresh build from a minimal brief that should trip
  the new machinery without asking for it. Document review caps out before that. The runs and
  what to read after each are under Live test in CONTRIBUTING.md.

## The procedure

1. Review the change yourself with the counts and checks above — read every changed file in
   full, as the agent that will execute it, not by searching for words.
2. An agent pass is the author's call, not a default step. When the author asks for one: one
   agent reviews the change against these counts and checks, a second tries to refute each
   finding, and only the findings that survive count. Assume your own batch hides defects from
   you; the pass exists for that, and so does reading the whole file rather than the diff.
3. Adjudicate every surviving finding yourself. Before applying, list each repair as before →
   after → why it holds, and wait for the author's go-ahead. Apply the repairs in one batch.
4. Re-sync the working copy with the command under Sync in CONTRIBUTING.md and diff it; the
   diff printing nothing is the last count.

No scores. A count is either 0 or it is a repair; a score is an argument about the score.
