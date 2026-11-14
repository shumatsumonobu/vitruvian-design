---
name: design-discipline-init
description: Initialize the design declaration for this project — derive it from the subject, read the code beside it, agree on values and a home, write it once; run again with a browser to study the sites a first run skipped, or one from outside the product's category where the study holds none. Part of design-discipline.
disable-model-invocation: true
---

Read `${CLAUDE_SKILL_DIR}/../design-discipline/SKILL.md` and follow its `init` entry in Ways in.
Say nothing to the person before the opening text under What it asks you there. Put each question
under What it asks you through the AskUserQuestion tool where that tool exists. Every line of
text you write is read by the person — a progress line or a note to yourself included — so every
one is in the user's language.
Before your first tool call of any kind, say your first words to the person: the opening text under
What it asks you, translated, or, where the brief agrees to the values in advance, one line on what
you are about to do. Every line after them stays in that language.
Code and its comments may stay in English; the line you write after an edit, a script's output, a
failed call, or a subagent's answer is in the user's language however much English came before it.
A line that says what you will do next — "Next, I'll…", "Now I'll…" — is the line a long run
writes in English most often: its first word is in the user's language.
When the conversation has been compacted — its earlier turns replaced by a summary — read that
SKILL.md and the rule files of the step you are on again before your next tool call, and say so in
`.design/record.md`.
Everything that skill references sits beside it — its rules are
`${CLAUDE_SKILL_DIR}/../design-discipline/rules/`. Do not search for any of it. If
`../design-discipline/` is not installed beside this skill, say this and stop: "The
design-discipline skill isn't installed beside this command. Install the five directories
together — the README says how — and run this again."
