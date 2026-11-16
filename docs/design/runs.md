# How a run moves

What each entry reads, decides, and writes, on a fresh build and on a product that already has
screens. For whoever changes the skill.

## A fresh build

`init` — the person answers the first two questions — the build loop under Before you call it
done runs the Inspections the screen needs while it is built — `inspect` once before the screen
closes. The build loop is not a repair pass and asks nothing: it builds against the declaration.
`init` run again studies the sites a first run skipped and puts the second question again,
keeping what the person wrote; with nothing left to do, it says so and stops.

## A product that already has screens

`init` — `inspect` — `fix` — `inspect`, or `review` in place of `fix` when the task is to make an
existing screen better rather than to close a list. Before the first change, `fix` or `review`
asks the third question once and writes the answer into the declaration's scope of change entry, or `init` writes the brief's answer there where the brief states one;
later passes read it there.

## What inspect returns

One line per count that missed or check that failed, each marked **structural** or **surface**,
in one order: repairs to what a whole screen shows first, then repairs to one element
(`rules/review.md`, Rebuild in small passes).
Structural: the repair changes where something sits, how big it is, whether it exists, its
order, the container that presents it, what an artwork depicts or its colors, or whether a
motion plays. Everything else is surface — a repair that changes nothing the reader receives,
such as an entry written into the declaration, the structure, the lexicon, or the style
system, included. The definition is in `SKILL.md` under Before fix or review changes the code.

A count that the workspace cannot drive — a device with the platform's own regions, a touch
screen, a screen reader, a frame-rate capture — is said to the person as not taken. An
untaken count is not a pass. A count the run's own tools could take is taken in the run, never
passed to the next one. A count the person takes on a device of their own and reports is taken
by the person, until the code it was read on changes.

`inspect` reads every screen the product has, at the checked sizes `rules/layout.md` defines —
the widest and the narrowest supported width, each at the shortest height a reader is left
there, and any window the brief, the data, or the person names — and reads each count about the
rendered screen off a capture, a recording, or a walk of that run.

The run ends with the report under How `inspect` and `fix` end in `SKILL.md`: one sentence on
what it did; the repairs heaviest first — those without which a reader cannot use the screen,
one line each; those the reader sees, the structural ones one line each and the surface ones as
a number; those that only write into a file, as a number; what only the person can give; what
was not taken and what would take it, with steps on the person's own device where that would;
and the next command.

## What fix may apply

A repair passes four gates, in this order, and each gate has one owner:

| Gate | Rule | Owner |
|---|---|---|
| The scope of change | Under structure kept, no structural repair; under kept: none that touches a named element; under report only, none; under everything may change, all | `SKILL.md`, Before fix or review changes the code |
| The accessibility floor | The counts in `rules/a11y.md` and the pieces it names in states, motion, and forms are applied under every answer but report only, and no recorded exception lifts them | `rules/a11y.md` names the pieces; `NOTICE` names their guidelines; `rules/anti-slop.md` states that they never lift |
| Behind the screen | A repair changes what the reader receives and nothing the product relies on behind it — a route, a field's submit name, an anchor, a test identifier, an event name, a storage key, wording fixed by law or contract. A repair that would need one changed is written down for the person, who may grant it in the declaration's recorded exceptions | `SKILL.md`, same section; counted in `rules/review.md` |
| Provisional values | A declaration value marked provisional — a brand value whose material was not reached — is not brought into the code until the material arrives | `rules/tokens.md` |

A repair that fails a gate stays on the list with the reason, for the run's last message, and the count it would have
closed stays open.

## When fix is done

At most five repairs per pass. After each pass the failed counts rerun, and so does every count
on an element the pass added, removed, or restyled — the inspection script running those rule
files alone; a pass after which every rule file's counts ran names the change that reached them
all. Every change to the code belongs to a repair
on the list. `fix` is done when the list is empty and a run of every
applicable Inspection after the last pass finds nothing the list does not already hold with its
reason. The rule is the `fix` row of Ways in; the lines on repairs at the end of `rules/review.md`
— repairs per pass, repairs against the scope, repairs behind the screen, unmarked or unreasoned
repairs, changes tied to no repair, deficits left without a reason — are read by
the run that applied the repairs, against itself, before it ends.

## Who decides, and who writes

The session decides: the deficits, the target lines, each repair and how far it goes, every
verdict on a count or a check. Where it can start a helper — a second agent on a smaller, faster
model — the helper writes every script under `.design/harness/`, and may write a pass's repairs;
it has not read the skill, so the session hands it the repair and its target line, or the rule
files whose counts a script takes, and reads every change back before any count runs on it. The
session says, as it works, what a helper wrote. The rule is in `rules/review.md`, Rebuild in small passes; the
Claude Code form is in its Platform notes.

The checks read off a capture are answered first by a reviewer: an agent on the session's own
model, started in a context of its own and handed the captures, what the visual concept,
signature, and artwork entries name, the lines it answers, and the order of repairs — no count's
result and no reason. `inspect` starts
one, and so does `fix` in its closing run. The session still decides each finding, listing it as a
repair, or dismissing it where a capture contradicts it, naming the capture and the place in it. The rule is in `rules/review.md`, A reviewer
who has not read the reasons.

Before the first pass, `fix` and `review` take an inventory of what the product relies on behind
the screen and each control with its name, and take it again after the last; an item missing
after that no repair names is counted (`rules/review.md`). On the web the runner takes both.

## How a decision changes

The person edits the declaration: the scope of change entry to widen or narrow repairs, the
recorded exceptions to keep a default the rules ban or to allow a change behind the screen, an
entry's value to change a token. The skill asks nothing twice; the three questions it does ask
are fixed texts under What it asks you, put to the person in their language through the
AskUserQuestion tool.
