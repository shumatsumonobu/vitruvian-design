# design-discipline

A design skill for coding agents, so that what they build does not read as generated.

Platform-independent. The same rules apply to a native app and to a web app; anything that differs
between the two sits in a `Platform notes` section at the end of each rule file.

## It runs alongside frontend-design

This skill assumes Anthropic's [frontend-design](https://github.com/anthropics/skills) skill is
installed and does not restate any of it. That skill is short, dense, and carries the judgment:
what a design should be for this subject, which palette and typefaces suit it, the looks a
generated interface falls into, how the words should read, and the plan-then-attack-the-plan
process that gets to code.

This one covers what that leaves open, in a form a reviewer can count rather than judge.

| frontend-design settles | design-discipline settles |
|---|---|
| Which palette, which typefaces, and why those | The declaration that keeps them fixed across sessions |
| The looks to avoid and the tells that give them away | The count that catches drift once a direction is set |
| How the words should read | The inventory that catches one intent wearing three labels |
| The plan, and attacking it before writing code | Structure, states, navigation, motion, forms, artwork, accessibility, and the review loop |

Installed on its own, design-discipline is a checklist with nothing behind it.

## Install

Run these from the root of the repository; everything goes into the same place.

```bash
# available to you in every project
cp -r skills/. ~/.claude/skills/
git clone --depth 1 https://github.com/anthropics/skills /tmp/anthropic-skills
cp -r /tmp/anthropic-skills/skills/frontend-design ~/.claude/skills/
```

Swap `~/.claude/skills/` for `.claude/skills/` to scope them to one project instead. The first
copy lands five directories — this skill, and its four entries as one-file commands that show up
in the `/` menu and defer to the skill beside them:

```text
~/.claude/skills/   or   .claude/skills/
    design-discipline/           SKILL.md, README.md, NOTICE, and rules/ —
                                 tokens, layout, anti-slop, states, navigation,
                                 motion, copy, forms, assets, a11y, review
    design-discipline-init/      the declaration: derive, agree, write — once per project
    design-discipline-review/    improve an existing screen, from named deficits
    design-discipline-inspect/   run every applicable count and check, return the repair list
    design-discipline-fix/       work a repair list down to empty, at most five per pass,
                                 then run every inspection once more
```

`rules/` stays inside the skill. A project's `.claude/rules/` is a different mechanism, and
nothing here belongs in it. Nothing else is needed — a skill is a plain directory, there is no
plugin to install, and edits to `SKILL.md` apply without restarting the session.

The skill fires when Claude Code matches the work to its description; to make it fire every time,
and to keep a long run in your language, give the project's `CLAUDE.md` one line:

```markdown
When building, restyling, auditing, or reviewing a screen, follow the design-discipline skill, and speak to me in <your language>, in its polite form where it has one.
```

The language and its form go in this line because `CLAUDE.md` is read on every turn. The
skill's own rule on them is read once, when a run starts, and an hour of tool calls buries it:
one long run drifted into English without the line, and another dropped the polite form.

## What it does

`SKILL.md` fixes the order of decisions and points at one rule file per decision. The rule files
are opened only when their decision comes up, so nothing but the description sits in context until
the work is actually about an interface.

`SKILL.md`, under While you build, says what each rule file owns and when to open it.

Every rule is written to be checkable. Each file carries an `Inspection` section: counts that
return a number, and checks answered in a sentence. A count that misses its threshold is a repair,
not a discussion.

Much of it is inspection procedure rather than build guidance, because reviewing an interface
that already exists is half of what it is for.

## What it does not cover

The scope is what a reader receives. Decisions about implementation structure sit outside it, and
were removed rather than left in, because a skill carrying both stops being able to say which of
the two it is enforcing.

Left out: where application state lives and how it is split; render performance and virtualisation;
how assets are produced, sized, and exported; profiling and measurement procedure; build
configuration. None of that is unimportant. It belongs to a different skill.

## Project tokens

The token declaration belongs to the project rather than to this skill, so a later session
lands on the same values. On a codebase with no declaration, the skill derives one from the
subject — code or no code — shows it beside what the code carries, and writes it to
`.design/declaration.md` once you agree — that is the `init` entry, run once per project.

## What it asks you

Three questions, each asked once. A brief can answer any of them in advance.

- **A browser, when the session has none.** The reference study before a visual direction needs
  pixels. `init` asks whether one can be connected; going on without one records the study as
  not yet done, and its count in `rules/anti-slop.md` stays open until it is done.
- **The declaration.** `init` shows the derived values beside what the code carries and asks
  whether they stand and where the file should live. A value the code carries is kept by
  amending the declaration, not by `init` reading it in. A brand color or typeface the skill could
  not read from the brand's material is written as a stand-in, and `fix` leaves the code's value
  for it until the material arrives.
- **How far the repairs may go**, on a product that already has screens, before `fix` or
  `review` change anything: Keep the layout, Change anything, Change nothing, just list the
  repairs, or Keep what you name — recorded as structure kept, everything may change, report
  only, or kept: followed by what was named. The answer is written into the declaration and read
  from there after; change it by editing that line. Accessibility repairs are applied under every
  answer but report only. Under every answer, the skill leaves alone what the product relies on
  behind the screen — a screen's address, the name a form sends a value under, wording the brief
  marks as fixed by law or a contract, anything else the product depends on that a reader never
  sees — and lists any repair that would change one in `.design/record.md`; to allow it, write
  that into the declaration on the line the note names. A fresh build is never asked.

`SKILL.md` carries the three questions as they are put, under What it asks you.

## Where the rules stand

The rules stand on the platform vendors' own documents — Apple's Human Interface Guidelines,
Material Design, the platforms' developer documentation — and on WCAG 2.2. What a document
states is taken as stated and attributed in [NOTICE](NOTICE); the rest are this skill's own
defaults, which a project may override in its declaration.

## License

MIT
