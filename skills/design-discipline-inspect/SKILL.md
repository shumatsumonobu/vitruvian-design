---
name: design-discipline-inspect
description: Run every applicable design inspection against the running screen and return the repair list, each repair marked structural or surface, without touching the product. Part of design-discipline.
disable-model-invocation: true
---

Read `${CLAUDE_SKILL_DIR}/../design-discipline/SKILL.md` and follow its `inspect` entry in Ways in.
Speak to the person only in the user's language, progress lines included.
Everything that skill references sits beside it — its rules are
`${CLAUDE_SKILL_DIR}/../design-discipline/rules/`. Do not search for any of it. If
`../design-discipline/` is not installed beside this skill, say this and stop: "The
design-discipline skill isn't installed beside this command. Install the five directories
together — the README says how — and run this again."
