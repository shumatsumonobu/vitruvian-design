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
- Checks that appear in the Inspection of two files, or a rule stated in the prose of two files:
  0. A cross-file reference names the owning file, and repeats the condition when the pointed-at
  entry exists only under one.
- Threshold numbers in the changed text absent from NOTICE's groups: 0.
- Sentences scoped to one instance of a concern where the law names the concern — "generated
  images" where the concern is artwork, one platform where the rule is platform-independent: 0.
  Read each changed sentence; the enumeration is an example only when a general sentence
  carries the rule beside it.
- Platform-specific sentences outside a file's `Platform notes` section: 0.
- Instructions in an Inspection that tell the inspector to fix something, or to write anywhere
  but `.design/record.md`, `.design/captures/`, or `.design/harness/`: 0.
- Files the skill asks a run to write with no named default home: 0.
- Questions the skill puts to the person whose text is not written out under What it asks you
  in SKILL.md, or that SKILL.md and the entry files do not route through the AskUserQuestion
  tool: 0. In those texts, and in any sentence the skill tells the session to say to the
  person: terms of this skill, sentences with no named actor, sentences carrying more than one
  idea, pronouns reaching back past their sentence, judgments of the person's product, words
  about procedure, a thing called by a name the person has not met yet, and discourtesy — slang,
  a joke, an order barked: 0.
- Lines printed by the sync diff after the batch (the command under Sync in CONTRIBUTING.md): 0.

## The checks

Each is answered in a sentence, in the review, not by feel.

- One name per concept: for each term the change introduces, name the existing term for the
  same concept across the files, or say there is none.
- The operator's view: read the changed procedure as the agent that must execute it. Name the
  first step it could not perform as written, or say there is none. Then walk every path the
  change touches to its end — for each answer the person can give, what the session writes and
  where, and what the next run reads from there and says when it finds nothing — one written
  line per path; a path that cannot be written to its end is a defect, and a path unwritten was
  not walked.
- The fresh session: read each changed file as a session that has never seen this repo. Name
  any term it meets before the file defines it, any pointer to a file or section that does not
  exist, and any sentence that assumes something about the product — a second theme, artwork,
  typing, a network — without saying what happens when it is absent, and any concept the text
  invents to explain a rule where the actual case could be named instead. One of those is how
  two builds invented two names for the same file.
- The person's seat: read each question under What it asks you as the product's owner who has
  never opened this repo. For each answer, say what will happen, what they get, what they give
  up, and what comes after; an answer missing one is a repair. Name any word that owner would
  not have. Say whether each sentence would read as written to someone the agent has just met,
  as one person speaking to another, and whether the labels alone tell the person which to pick.
- The live run: name what would settle the change — a bare page with no declaration, a
  re-inspection of an existing build, or a fresh build from a minimal brief that should trip
  the new machinery without asking for it. Document review caps out before that. The runs and
  what to read after each are under Live test in CONTRIBUTING.md.

## The procedure

1. Review the change yourself with the counts and checks above — read every changed file in
   full, as the agent that will execute it, not by searching for words. Write the review as one
   line per count and per check, in the order above — each count with its number, each check
   with its sentence, and under the first count one line per requirement the change states,
   naming the count or check that reads it. A line not written was not taken, and the review is
   not done.
2. An agent pass is the author's call, not a default step. When the author asks for one: one
   agent reviews the change against these counts and checks, a second tries to refute each
   finding, and only the findings that survive count. Assume your own batch hides defects from
   you; the pass exists for that, and so does reading the whole file rather than the diff.
3. Adjudicate every surviving finding yourself. Before applying, list each repair as before →
   after → why it holds, and wait for the author's go-ahead. Apply the repairs in one batch.
4. Re-sync every copy you keep with the command under Sync in CONTRIBUTING.md and diff it; the
   diff printing nothing at every copy is the last count.

No scores. A count is either 0 or it is a repair; a score is an argument about the score.
