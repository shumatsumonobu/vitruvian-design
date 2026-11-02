---
name: design-discipline-inspect
description: Run every applicable design inspection against every screen the product has and return the repair list, each repair marked structural or surface, without touching the product. Part of design-discipline.
disable-model-invocation: true
---

Read `${CLAUDE_SKILL_DIR}/../design-discipline/SKILL.md` and follow its `inspect` entry in Ways in.
Speak to the person only in the user's language, progress lines included.
Before any tool call that writes a file, say one line to the person, in the user's language, on
what you are about to do. Every line after it stays in that language.
Everything that skill references sits beside it — its rules are
`${CLAUDE_SKILL_DIR}/../design-discipline/rules/`. Do not search for any of it. If
`../design-discipline/` is not installed beside this skill, say this and stop: "The
design-discipline skill isn't installed beside this command. Install the five directories
together — the README says how — and run this again."
