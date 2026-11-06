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

Then turn the survivors into a target. The arrangement, as rules/layout.md names it, the order the
hierarchy puts things in, which control does which job, the rhythm of the spacing, which token
carries which role, and where motion happens. Write it as lines that can be confirmed against a
screenshot. A line nobody can confirm is a mood board entry wearing a spec's clothes, and it gets
rewritten or dropped.

## Rebuild in small passes

Implement against the target, capture the result into `.design/captures/`, put it beside the
strongest reference, fix, and go again.

**Keep the passes small.** This skill's default is at most five repairs between one look and the
next. Regressions hide inside batches, and a batch that improves four things and breaks a fifth
reads as an improvement right up until someone finds the fifth.

**The session decides; a helper writes.** Naming the deficits, writing the target lines,
choosing each repair and how far it may go, and every verdict on a count or a check stay with the
session. Where the session can start a helper — a second agent on a smaller, faster model — every
script under `.design/harness/` is written, and changed, by the helper, and a pass's repairs may
be; where this skill carries a runner for the platform (SKILL.md, What this skill writes), the
scripts are the runner's configuration and the flows only this product has. The helper has not
read this skill, so the session hands it everything the work needs: each repair with its target
line; or, for a script, the rule files whose counts it takes, by path, and the screens, sizes, and
states it reads them at — for a runner's configuration, the runner's README by path in their
place; the declaration entries the work touches; the record's lines naming methods that hung or
returned nothing; and the files — the helper writes nowhere but `.design/` and the files it is
given. A helper that wrote or
changed a script runs it once before it returns, and returns its output with the change. When the
helper returns, the session reads every change back against the repair or the count it serves
before any count from it is used, and the record names what a helper wrote. Where no helper can be
started, the session writes the code itself.

Where the declaration's scope of change — the answers SKILL.md defines under What it asks
you — keeps the structure, or names kept elements, the rebuild leaves them as they are and the
target lines are written around them; a deficit that would need them changed is recorded as one
the scope of change forbids, not repaired. A deficit whose repair would change what the product
relies on behind what the reader receives is recorded the same way (SKILL.md, Before fix or review
changes the code).

Each pass ends by running the Inspection sections that the deficits point at, rather than all of
them: tokens.md and anti-slop.md where the deficit was visual, layout.md where it was in alignment,
grouping, or hierarchy — states.md where a state was missing or defaulted, navigation.md where a
transition or a back path was wrong, motion.md where the motion was, copy.md where the words were,
forms.md where the deficit was in a field, assets.md where the artwork was, and a11y.md where it
was in what a screen reader or the keyboard receives.

## The screen sits in a flow

A screen that passes on its own can still be wrong in its journey. Walk one step before it and one
step after.

Watch the entrance transition and the exit. Confirm the state carried in is the state carried out.
Press back and see where it lands. Where what you are looking at got presented in any container —
a modal, a sheet, an overlay, a full screen — or past a one-way door, confirm that the
presentation matches what the surface actually **is** — navigation.md decides that, and it is the
failure a screenshot cannot show.

## Inspection

The first four lines of the count are `review`'s own. The lines from Repairs applied between one
look and the next to Deficits from the original list are read against any run that applied
repairs — `review`'s rebuild or `fix`'s passes — from the record's account of each pass and the
changes to the code; `inspect` reads them whenever the record holds a fix pass. The last eleven
lines are read by every run — `init`, `inspect`, `fix`, `review` — against what that run itself
changed, wrote, and read, before it ends: a rule a run reads once at its start is the rule a long
run forgets, and these are where that showed.

### The count

- Deficits named before any reference was gathered: 3 or more, or fewer with a written line saying
  what was operated and why nothing else surfaced.
- Deficits stated as moods rather than as things confirmable from a screenshot: 0.
- Surviving references with no line saying what they earn their place for: 0.
- Target lines that cannot be confirmed against a screenshot: 0.
- Repairs applied between one look and the next: 5 or fewer, which is this skill's default. Count
  them per pass and write the number down.
- Passes after which every rule file's counts ran — the run after the last pass excepted — with
  no line in the record naming the change that reached them all: 0.
- Repairs applied against the declaration's scope of change — a structural repair under
  structure kept, any repair under report only, any repair while the entry still reads not yet
  asked, a change to a kept element: 0.
- Repairs that changed something the product relies on behind what the reader receives — a route or
  address, the name a field submits its value under, an anchor a link reaches by name, a test
  identifier, or an event name that tests or analytics read by name, a key the product stores under,
  wording the brief marks as fixed by law or a contract — or the code's value for an entry marked
  provisional (rules/tokens.md), counting none the declaration's recorded exceptions allow: 0.
- Repairs on the list with no structural or surface mark, or skipped with no reason beside
  them: 0.
- Defects the record ties to the run's own changes that are still in place when it ends: 0.
- Deficits from the original list still present at the end, those the scope of change forbids,
  those whose repair would change what the product relies on behind what the reader receives
  (SKILL.md, Before fix or review changes the code), and those whose repair `fix` leaves for an
  entry marked provisional (rules/tokens.md) excepted, each recorded as such: 0.
- Changes to the code that the record ties to no repair on the list: 0. A rule, a setting, or a
  script that served only what a listed repair removed is tied to that repair when the record
  says so. Under `init` and `inspect`, which apply no repairs, every change is untied.
- Files the run wrote outside `.design/` (SKILL.md, What this skill writes) and outside the
  product's own code — a browser profile or a script in the system's temporary directory
  included: 0. The run lists what it wrote, and the list is read against the file system.
- Passes the record reports for counts about the rendered screen, its motion, or a walk, with no
  capture, recording, or walk this run made named beside them: 0.
- Where this run read any count on a rendered screen, screens the product has missing from the
  record's list — each screen with the checked sizes (rules/layout.md) and states it was read at,
  or the reason it was not read: 0.
- Counts the record says a script took with no script named beside them that is still under
  `.design/harness/`, and two scripts there taking the same count — a runner this skill carries for
  the platform and a script a run wrote or an earlier run left among them: 0.
- Inspection scripts under `.design/harness/` that cannot run one rule file's counts without the
  others: 0.
- Scripts under `.design/harness/` that this run wrote or changed itself where it could start a
  helper: 0.
- Values in a runner's configuration that differ from the declaration or the structure entry its
  comment names, and values with no entry named: 0.
- Steps in scripts under `.design/harness/` that wait with no time limit, methods that hung or
  returned nothing in this run that the record does not name, and steps using a method the record
  names: 0.
- Counts the record gives as not taken that the run's own browser, recording, or scripts could
  have taken — the next run named as what would take one among them: 0.
- Code or scripts a helper wrote whose counts the session used before reading them back against
  the repair or the count they serve, and helper work the record does not name: 0.

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
- Claude Code: a helper is a subagent started with the Agent tool and `model: "sonnet"`, its
  effort set in the same call, since a subagent on another model does not take the session's.
  A skill's own `model` setting switches the whole turn and is no way to split the work: each
  model has its own prompt cache, so that turn reads the whole conversation again with nothing
  cached. A subagent starts a conversation of its own and leaves the session's cache as it was
  (Claude Code's prompt caching page). Where the organization's available models exclude the one
  named, the call runs on another.
- Web: this skill carries a runner, `runner/web/run.mjs` in this skill's own directory, the one
  that holds `rules/`. Its README — `runner/web/README.md` there — says how to run it, how to
  write the product's configuration and flows, which count lines it takes, its time limits, and
  what a headless browser does differently, a touch-emitting mouse press that never answers among
  it.
