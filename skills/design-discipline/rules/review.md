# Reviewing a screen that already exists

The task is not "build this", it is "make this better", and better has to mean something before
any work starts.

**It means this.** Put the screen beside the strongest shipped screen solving the same problem and
read the two honestly. The work stops when yours reads at least as well — hierarchy, motion,
typographic discipline, how it behaves in every state. Improving on what was there before is not a
bar, since any change at all clears it.

Everything below serves that comparison.

## Name the deficits first

Run the screen. Not the source — the screen. Then write down three deficits, each precise enough
that someone else could confirm it from a screenshot.

"No hierarchy: three text rows at the same weight and size" is a deficit. "Feels cluttered" is a
mood. "The modal appears with no transition" is a deficit. "Motion could be better" is a mood.

Three is this skill's default. Finding fewer usually means the screen was read rather than
operated, so operate it first: type into it, empty it, break its network, make it wait. If fewer
than three survive that, write one line saying what you operated and what did not turn up, and
carry on with what you have.

Everything after this aims at those three. A review that skips this step collects inspiration and
lands nowhere. The record of it all — deficits, the surviving references, target lines, pass counts — defaults
to `.design/record.md`.

## Gather against the deficits, then cut

Search in two directions, because they surface different screens.

- By what the screen **is**: the content words, the screen's name, the elements on it.
- By what the screen **should feel like**: the quality being aimed at, described as a reader would
  describe it rather than as a component list.

Collect widely, then cut hard to five or eight, and **write one line per survivor saying what it
earns its place for**. A reference kept without that line is a reference nobody will use, and the
cutting is where the reviewing actually happens.

Then turn the survivors into a target. Layout skeleton, the order the hierarchy puts things in,
which control does which job, the rhythm of the spacing, which token carries which role, and where
motion happens. Write it as lines that can be confirmed against a screenshot. A line nobody can
confirm is a mood board entry wearing a spec's clothes, and it gets rewritten or dropped.

## Rebuild in small passes

Implement against the target, capture the result, put it beside the strongest reference, fix, and
go again.

**Keep the passes small.** This skill's default is at most five repairs between one look and the
next. Regressions hide inside batches, and a batch that improves four things and breaks a fifth
reads as an improvement right up until someone finds the fifth.

Where the declaration's scope of change — the answers SKILL.md defines under What it asks
you — keeps the structure, or names kept elements, the rebuild leaves them as they are and the
target lines are written around them; a deficit that would need them changed is recorded as one
the scope of change forbids, not repaired.

Each pass ends by running the Inspection sections that the deficits point at, rather than all of
them: tokens.md and anti-slop.md where the deficit was visual, layout.md where it was in the
arrangement — alignment, grouping, hierarchy — states.md where a state was missing or defaulted,
navigation.md where a transition or a back path was wrong, motion.md where the motion was,
copy.md where the words were, forms.md where the deficit was in a field, assets.md where the
artwork was, and a11y.md where it was in what a screen reader or the keyboard receives.

## The screen sits in a flow

A screen that passes on its own can still be wrong in its journey. Walk one step before it and one
step after.

Watch the entrance transition and the exit. Confirm the state carried in is the state carried out.
Press back and see where it lands. Where what you are looking at got presented in any container —
a modal, a sheet, an overlay, a full screen — or past a one-way door, confirm that the
presentation matches what the surface actually **is** — navigation.md decides that, and it is the
failure a screenshot cannot show.

## Inspection

### The count

- Deficits named before any reference was gathered: 3 or more, or fewer with a written line saying
  what was operated and why nothing else surfaced.
- Deficits stated as moods rather than as things confirmable from a screenshot: 0.
- Surviving references with no line saying what they earn their place for: 0.
- Target lines that cannot be confirmed against a screenshot: 0.
- Repairs applied between one look and the next: 5 or fewer, which is this skill's default. Count
  them per pass and write the number down.
- Repairs applied against the declaration's scope of change — a structural repair under
  structure kept, any repair under report only, any repair while the entry still reads not yet
  asked, a change to a kept element: 0.
- Repairs on the list with no structural or surface mark, or skipped with no reason beside
  them: 0.
- Deficits from the original list still present at the end, those the scope of change forbids
  excepted and each recorded as such: 0.

### The checks

- The comparison. Name the strongest reference and say, in words, how the rebuilt screen reads
  beside it. If it reads worse on any of hierarchy, motion, typographic discipline, or state
  handling, name the difference and take another pass.
- The Inspections run this pass, listed with which deficit sent you to each.
- One step either side. State what the entrance and exit look like and where back lands.

## Platform notes

- Capture the screen the way the platform allows and open the capture. Reviewing from memory of
  what was written is how the same defect survives four passes.
- Where a scripted interaction tool is available, capture the flow's main path once the screen has
  stopped moving, so a later change can be checked against it without walking the flow by hand.
- Repeat the comparison at the narrowest supported width before calling the work done, since
  hierarchy that holds at a comfortable size often collapses at the tight one.
