# Design

The design of the design-discipline skill as it stands, for whoever changes the skill next. These
files say what the parts are and how they fit; they do not restate a rule, which is stated once in
the skill file named beside it, and they hold no history. Why a rule reads as it does is in
`DECISIONS.md`; how to change one is in `CONTRIBUTING.md`.

| File | Holds |
|---|---|
| [parts.md](parts.md) | What the skill is made of: the entry point, the four entries, the rule files, the gathered Inspections, the reviewer's instructions, the runner, the picture tool, and what the skill writes into a product |
| [runs.md](runs.md) | What each entry reads, decides, and writes, on a fresh build and on a product that already has screens |
| [vocabulary.md](vocabulary.md) | The terms every file shares, and the file that defines each |
| [concerns.md](concerns.md) | Each concern, the file and section that states its rule, and the count or check that reads it; and what was read and left out |
| [limits.md](limits.md) | What the skill cannot do or has not been shown to do |

## What the skill is for

Interfaces that do not read as generated. The skill does not carry a look. Every value a screen
uses is derived from the subject — the brief, the product's own material, and the references
studied — and written down with its reason before the screen is built. Then the screen is
inspected against counts, which return a number, and checks, which are answered in a sentence;
a count that misses becomes a repair, and a repair either is applied or is said to the person with
the reason it was not. Taste enters only where a written reason names what in the subject chose the
value.

Counting removes what nobody chose; it does not make a screen anyone remembers. So the declaration
also names where the product is bold — the world outside its category whose look it borrows, and
the one element it is remembered by — derived and reasoned like every other value, and counted on
the rendered screen like every other.

## Keeping these files current

A change to the skill that moves a concern, adds a term, adds a number, or opens or closes a limit
changes the line here that names it, in the same commit. The laws a change must keep are under How
the rules are written in `CLAUDE.md`; the procedure — sync, review, the live runs and what to read
after each — is in `CONTRIBUTING.md`.
