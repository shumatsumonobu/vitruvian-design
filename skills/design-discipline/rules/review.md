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
lands nowhere. The deficits, the surviving references, and the target lines are said to the person and
kept in the session; no file holds them.

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

**Whole screens before single elements.** `inspect` returns the list, and every pass takes from
it, in one order: first the repairs to what a whole screen shows at a checked size — nothing on
the screen big enough to be its reason, a column with the width beside it left empty, the
signature out of view before any scroll, the visual concept carried in color alone — then the
repairs to one element. A repair answering a line that reads a screen or its first view as a
whole — the first view as a poster, the visual concept on the screen, the signature in view, what
the width past one column carries, the artwork and its room, the first item in the first view,
the element the screen is built around — is a whole-screen repair however small the change it
names. Within each kind, the repair that reaches more of the screen comes first. A detail
repaired on a screen that still fails as a whole is work the whole-screen repair undoes.

**An entry describes the screen a repair builds toward; it never excuses the one rendered.** A
change to the declaration, the structure, or the style system that brings a count on a rendered
screen down while that screen stays as it was repairs nothing: the count stays open, and the
screen is what gets repaired. Where the session judges an entry wrong, the change it proposes is a
repair of its own on the list, and every count reading that entry is read again on the screen
after it.

**The session decides; a helper writes.** Naming the deficits, writing the target lines,
choosing each repair and how far it may go, and every verdict on a count or a check stay with the
session. Where the session can start a helper — a second agent on a smaller, faster model — every
script under `.design/harness/` is written, and changed, by the helper, and a pass's repairs may
be; where this skill carries a runner for the platform (SKILL.md, What this skill writes), the
scripts are the runner's configuration and the flows only this product has. The helper has not
read this skill, so the session hands it everything the work needs: each repair with its target
line; or, for a script, the rule files whose counts it takes, by path, and the screens, sizes, and
states it reads them at — for a runner's configuration, the runner's README by path in their
place; the declaration entries the work touches; the lines of `.design/harness/hung.md`, which name methods that hung or
returned nothing; the sentence below on running a script from its file; and the files — the
helper writes nowhere but `.design/` and the files it is given. A helper that wrote or
changed a script runs it once before it returns, and returns its output with the change. A
script runs from its file, never fed to an interpreter on its standard input — the session's own
one-off scripts included: where the interpreter is reached through a launcher that does not pass
standard input on, the interpreter waits at its prompt with nothing to read, and the command never
ends; a helper hung so in one run, and the run with it. When the
helper returns, the session reads every change back against the repair or the count it serves
before any count from it is used, and the session says, as it works, what a helper wrote. Where no helper can be
started, the session writes the code itself.

Where the declaration's scope of change — the answers SKILL.md defines under What it asks
you — keeps the structure, or names kept elements, the rebuild leaves them as they are and the
target lines are written around them; a deficit that would need them changed is said to the person as one
the scope of change forbids, not repaired. A deficit whose repair would change what the product
relies on behind what the reader receives is said the same way (SKILL.md, Before fix or review
changes the code).

**What the product relies on is counted, not remembered.** Before its first pass `fix`, and
`review` before its rebuild, takes an inventory of every screen it may touch, at every checked
size: where each link goes, the name each field submits its value under, each id a link reaches,
each test identifier and event name the screen's code carries, and each control with the name it
carries. After the last pass the inventory is taken again and the two are compared in the run; a
runner writes them under `.design/harness/`, and they go with its other output when the run ends. An item in the first and missing from
the second that no repair on the list names is a change to what the product relies on, or a
control removed: the pass that removed it is undone, or the item is left to the person as SKILL.md
says.

Each pass ends by running the Inspection sections that the deficits point at, rather than all of
them: tokens.md and anti-slop.md where the deficit was visual, layout.md where it was in alignment,
grouping, or hierarchy — states.md where a state was missing or defaulted, navigation.md where a
transition or a back path was wrong, motion.md where the motion was, copy.md where the words were,
forms.md where the deficit was in a field, assets.md where the artwork was, charts.md where it was
in a chart, and a11y.md where it was in what a screen reader or the keyboard receives.

## A reviewer who has not read the reasons

The session that wrote or read the declaration's reasons is the weakest judge of whether the
screens carry them: it sees what was meant. `inspect`, and `fix` in its first closing run of every
Inspection, hand the checks answered by looking at a capture — the signature, the visual concept,
the first view as a poster, and the artwork in rules/anti-slop.md among them — to a reviewer, once
in the run: an agent started in a context of its own, on the session's own model, since a verdict
is the session's work and not a helper's.

The session does not read the reviewer's instructions, `reviewer.md` in this skill's directory
beside SKILL.md. It starts the reviewer with that path and hands it, as paths and quoted lines,
four things: the first view of every screen, in every state, at every checked size, as still
captures the size of the view — no recording, no full-page capture, no sheet of reduced captures;
what the declaration's visual concept, signature, and artwork entries name — the world the look
is borrowed from and its layout metaphor, the element the product is remembered by and where it
sits, and, where the declaration names artwork, what the picture depicts, the screens it names, and
how it is cut down at the narrowest size — in the entries' own words, without what chose them;
the lines it is to answer — checks, and counts read by looking at a still capture — each with its
rule file; and the paragraph Whole screens before single elements, above. Nothing else — no count's
result, no other declaration entry, no repair list: a reviewer handed the reasons reads the reasons.
Nothing less either: every screen, state, and checked size the run read, and every line read
off a capture.

The reviewer starts once the captures exist and works while the session takes and reads the
counts; the repair list is written once both are in. The reviewer changes nothing and writes
nothing. It returns a first word — `recapture`, `fix`, or
`clear` — then its findings, at most eight, whole screens first; one answer on whether the visual
concept and the signature describe the screens in front of it; and one change that would make the
screen impossible to mistake for another product's, which the session lists as a repair where the
scope of change allows it. The session decides each finding the way it decides a count: a repair
on the list, or dismissed, and a finding is dismissed only where a capture
contradicts it — what it says is missing is there, or what it says is there is not, at the screen
and size it names — with the capture and the place in it named as the session dismisses it. A finding the session reads
differently, with no capture that contradicts it, is a repair: the reviewer is there because the
session is the weaker judge of its own screen. A value the screen does not show, a letter-spacing
or a token's name, contradicts nothing. `recapture` means a capture was missing or showed the wrong thing; the session captures
again and starts a new reviewer, once — a second `recapture` ends the review, and the session says
which captures could not be made. After the repairs a review called for, the session reads its
own recaptures against each finding, as a pass reads a count again; the review is not started a
second time. Where no agent can be started, the session reads `reviewer.md`
and answers it from the captures before it reads any count line of the run, and says
that the review ran in the session.

## The screen sits in a flow

A screen that passes on its own can still be wrong in its journey. Walk one step before it and one
step after.

Watch the entrance transition and the exit. Confirm the state carried in is the state carried out.
Press back and see where it lands. Where what you are looking at got presented in any container —
a modal, a sheet, an overlay, a full screen — or past a one-way door, confirm that the
presentation matches what the surface actually **is** — navigation.md decides that, and it is the
failure a screenshot cannot show.

## Inspection

Every line here is read against the run itself — what the session did, wrote, and said in it —
and answered before the run ends; no file is kept for them. The first four lines of the count are
`review`'s own. The lines from Repairs applied between one look and the next to Deficits from the
original list are read by a run that applied repairs — `review`'s rebuild or `fix`'s passes —
against its own passes and its changes to the code. The three lines on the reviewer, and the two
after them — the list's order, and counts read lower after an entry changed — are read by `inspect`
and `fix` against their own run. The lines
from Changes to the code on are read by every run — `init`, `inspect`, `fix`, `review` — against
what that run itself changed, wrote, and read: a rule a run reads once at its start is the rule a
long run forgets, and these are where that showed.

### The count

- Deficits named before any reference was gathered: 3 or more, or fewer with a written line saying
  what was operated and why nothing else surfaced.
- Deficits stated as moods rather than as things confirmable from a screenshot: 0.
- Surviving references with no line saying what they earn their place for: 0.
- Target lines that cannot be confirmed against a screenshot: 0.
- Repairs applied between one look and the next: 5 or fewer, which is this skill's default. Count
  them per pass.
- Passes after which every rule file's counts ran — the run after the last pass excepted — with
  no change named, in the session, that reached them all: 0.
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
- Defects the run's own changes caused that are still in place when it ends: 0.
- Repairs `fix`'s closing run of every Inspection listed — reviewer findings among them — that the
  scope of change allows and that the run left for the next `inspect` while its closing pass held
  fewer than five (SKILL.md, the `fix` entry in Ways in): 0.
- Repairs a pass took to one element while a repair to what a whole screen shows stood open on
  the list: 0.
- Items in the inventory taken before the first pass — where a link goes, the name a field
  submits under, an id a link reaches, a test identifier or event name, a control and its name —
  that the inventory after the last pass lacks and no repair on the list names, and runs that
  applied repairs with no inventory taken before and after: 0.
- Deficits from the original list still present at the end, those the scope of change forbids,
  those whose repair would change what the product relies on behind what the reader receives
  (SKILL.md, Before fix or review changes the code), and those whose repair `fix` leaves for an
  entry marked provisional (rules/tokens.md) excepted, each left on the list as such: 0.
- Runs that got no reviewer's first word, findings, answer on the visual concept, and
  one change, and reviews that ran in the session where an agent could have started: 0.
- Reviewer findings neither put on the list as a repair nor dismissed, and reviewer briefs, as
  sent, that carried more than the four things this file names, or less — a screen, a state, or a
  checked size the run read, or a line read off a capture, left out: 0.
- Reviewer findings dismissed without naming the capture, and the place in it, that contradicts
  what the finding says, and reviewers started more than once in a run, `recapture` excepted: 0.
- Repair lists the run returned or worked with a repair to one element above a repair to what a
  whole screen shows, a repair answering a line that reads a screen or its first view as a whole
  counting as a whole-screen repair: 0.
- Counts on a rendered screen that the run reads lower after a change to the declaration, the
  structure, or the style system while that screen stayed as it was: 0.
- Changes to the code that belong to no repair on the list: 0. A rule, a setting, or a
  script that served only what a listed repair removed belongs to that repair. Under `init` and `inspect`, which apply no repairs, every change is untied.
- Files the run wrote outside `.design/` (SKILL.md, What this skill writes) and outside the
  product's own code — a browser profile or a script in the system's temporary directory
  included: 0. The run lists what it wrote, and the list is read against the file system.
- Passes the run reports for counts about the rendered screen, its motion, or a walk, with no
  capture, recording, or walk this run made named beside them: 0.
- Where this run read any count on a rendered screen, screens the product has missing from the
  list the run gives as it reads them — each screen with the checked sizes (rules/layout.md) and states it was read at,
  or the reason it was not read: 0.
- Counts the run says a script took with no script named beside them that is still under
  `.design/harness/`, and two scripts there taking the same count — a runner this skill carries for
  the platform and a script a run wrote or an earlier run left among them: 0.
- Inspection scripts under `.design/harness/` that cannot run one rule file's counts without the
  others: 0.
- Scripts under `.design/harness/` that this run wrote or changed itself where it could start a
  helper: 0.
- Values in a runner's configuration that differ from the declaration or the structure entry its
  comment names, values with no entry named, and keys the runner's README lists that the
  configuration leaves out where the declaration or the structure holds the entry — a
  configuration an earlier run wrote, before the runner gained the key, among them: 0.
- Steps in scripts under `.design/harness/` that wait with no time limit, methods that hung or
  returned nothing in this run that `.design/harness/hung.md` does not name, and steps using a
  method it names: 0.
- Counts the run gives as not taken that the run's own browser, recording, or scripts could
  have taken — the next run named as what would take one among them: 0.
- Scripts the run, or its helper, fed to an interpreter on its standard input rather than running
  them from a file: 0.
- Code or scripts a helper wrote whose counts the session used before reading them back against
  the repair or the count they serve, and helper work the session did not name as it worked: 0.
- Compactions of the conversation the run did not tell the person of, and steps taken after one
  before SKILL.md and the rule files of the step were read again: 0.
- Files under `.design/` that hold a date, an account of a run, or an item already done;
  `.design/repairs.md` still in place when `fix` ends, report only excepted; and
  `.design/record.md` read or written (SKILL.md, What this skill writes): 0.

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
  named, the call runs on another. A helper or a reviewer started in the background announces its
  own end, and the session waits on that notice, with no wake-up of its own scheduled: under
  `claude -p` a pending wake-up holds the run open until it fires — in one run, 14 minutes after the
  work had ended.
- Claude Code: a reviewer is a subagent started with the Agent tool, the session's own model named
  in the call — a call naming none takes whatever default subagent model is configured — run in
  the background as soon as the captures exist, so that the session takes and reads the counts while
  it works, and its effort set to medium in the call: a review reads captures, and Claude's prompting page for Opus 5.5 reports that model reading
  visual material accurately even at its lowest effort. A subagent starts with none of the
  session's conversation, which is what the review needs. The frame-rate run waits until the
  reviewer returns, since a busy machine drops frames a device would not.
- Claude Code: a file under `.design/` is written with the Edit or Write tool, not through a shell
  redirection — a long section holding quotes breaks the shell's parsing, and in three runs of three
  the section that tried was written twice.
- Claude Code: after a compaction, Claude Code re-attaches the start of each skill the
  conversation invoked, and of what a tool read only what the summary says: SKILL.md and the rule
  files, read by the Read tool, are gone until read again (Claude Code's skills page).
- Web: this skill carries a runner, `runner/web/run.mjs` in this skill's own directory, the one
  that holds `rules/`. Its README — `runner/web/README.md` there — says how to run it, how to
  write the product's configuration and flows, which count lines it takes, its time limits, and
  what a headless browser does differently, a touch-emitting mouse press that never answers among
  it.
