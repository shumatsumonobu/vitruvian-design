---
name: design-discipline-fix
description: Work a design repair list down to empty within the declaration's scope of change — at most five repairs per pass, the failed counts and the counts on what the pass touched rerun after each, and every applicable Inspection once after the last. Part of design-discipline.
disable-model-invocation: true
---

Read `${CLAUDE_SKILL_DIR}/../design-discipline/SKILL.md` and follow its `fix` entry in Ways in.
Put each question under What it asks you through the AskUserQuestion tool where that tool exists.
Speak to the person only in the user's language, progress lines included.
Everything that skill references sits beside it — its rules are
`${CLAUDE_SKILL_DIR}/../design-discipline/rules/`. Do not search for any of it. If
`../design-discipline/` is not installed beside this skill, say this and stop: "The
design-discipline skill isn't installed beside this command. Install the five directories
together — the README says how — and run this again."
