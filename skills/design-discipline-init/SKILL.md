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
Everything that skill references sits beside it — its rules are
`${CLAUDE_SKILL_DIR}/../design-discipline/rules/`. Do not search for any of it. If
`../design-discipline/` is not installed beside this skill, say this and stop: "The
design-discipline skill isn't installed beside this command. Install the five directories
together — the README says how — and run this again."
