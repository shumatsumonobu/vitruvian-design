---
name: design-discipline-init
description: Initialize the design declaration for this project — derive it from the subject, read the code beside it, agree on values and a home, write it once; run again with a browser to study the sites a first run skipped. Part of design-discipline.
disable-model-invocation: true
---

Read `${CLAUDE_SKILL_DIR}/../design-discipline/SKILL.md` and follow its `init` entry in Ways in.
Say nothing to the person before the opening text under What it asks you there. Put each question
under What it asks you through the AskUserQuestion tool where that tool exists. Speak to the
person only in the user's language, progress lines included.
Everything that skill references sits beside it — its rules are
`${CLAUDE_SKILL_DIR}/../design-discipline/rules/`. Do not search for any of it. If
`../design-discipline/` is not installed beside this skill, say this and stop: "The
design-discipline skill isn't installed beside this command. Install the five directories
together — the README says how — and run this again."
