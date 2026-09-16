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
    design-discipline-fix/       work a repair list down to empty, at most five per pass
```

`rules/` stays inside the skill. A project's `.claude/rules/` is a different mechanism, and
nothing here belongs in it. Nothing else is needed — a skill is a plain directory, there is no
plugin to install, and edits to `SKILL.md` apply without restarting the session.

The skill fires on its own when the work is about a screen — that is what its description is for.
To make that deterministic instead of matched, give the project's `CLAUDE.md` one line:

```markdown
When building, restyling, auditing, or reviewing a screen, follow the design-discipline skill.
```

## What it does

`SKILL.md` fixes the order of decisions and points at one rule file per decision. The rule files
are opened only when their decision comes up, so nothing but the description sits in context until
the work is actually about an interface.

| File | Owns |
|---|---|
| `rules/tokens.md` | The token declaration, its entries, and how to derive one from the subject with the code read beside it |
| `rules/layout.md` | Structure, alignment, grouping by space, density, reflow, and the one primary job per screen |
| `rules/anti-slop.md` | The exception rule, and the master count that catches drift from the declaration |
| `rules/states.md` | Loading, empty, first run, error, long content — how to force each one, what a session interruption does to them, and what a screen shows between a tap and its answer |
| `rules/navigation.md` | Advance against move on, container semantics, one-way doors, when blocking back is justified |
| `rules/motion.md` | The frequency gate, purpose, springs against timing, verification by recording |
| `rules/copy.md` | One label per intent, the string inventory and the lexicon, banned strings, translation |
| `rules/forms.md` | Labels, what a field declares about itself, movement order, when to validate, where errors sit, the raised input method |
| `rules/assets.md` | The style system for artwork, generated or drawn in code; what it sits on, its edges, and the reject list |
| `rules/a11y.md` | Accessible names, image descriptions, color as sole carrier, focus in and back, keyboard parity, announcements, hover as a hint |
| `rules/review.md` | Improving a screen that already exists: what better has to mean, and the comparison that ends the work |

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
  amending the declaration, not by `init` reading it in.
- **How far the repairs may go**, on a product that already has screens, before `fix` or
  `review` change anything: Keep the layout, Change anything, Report only, or Keep these —
  recorded as structure kept, everything may change, report only, or kept: followed by what was
  named. The answer is written into the declaration and read from there after; change it by
  editing that line. Accessibility repairs are applied under every answer but report only. A
  fresh build is never asked.

`SKILL.md` carries the three questions as they are put, under What it asks you.

## Where the rules stand

The rules stand on the platform vendors' own documents — Apple's Human Interface Guidelines,
Material Design, the platforms' developer documentation — and on WCAG 2.2. What a document
states is taken as stated and attributed in [NOTICE](NOTICE); the rest are this skill's own
defaults, and a project may override any of them in its declaration.

## License

MIT
