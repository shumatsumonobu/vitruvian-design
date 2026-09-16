# Navigation

None of this shows up in a screenshot. All of it shows up the moment someone starts pressing
things. A step is not designed until three things about it are written down: what back does from
here, on every gesture that counts as back; whether returning here has to stay possible at all;
and which destination this is in the first place. A step leaving any of the three blank is
unfinished, however finished the screen looks.

## Advance or move on

Stack history when this is a place the reader will want to come back to. Replace history when
coming back would land them in a state the product has already left behind.

Back reverses navigation and nothing else. A sent message stays sent, a charge stays charged, a
deleted row stays deleted. Wherever back looks like it undid something that happened, either the
event had not actually happened yet, or that step should have replaced history instead of stacking
it.

## Choosing the container

Two questions settle almost every case. Is what sits underneath still needed while this is open?
Does this run in more than one step?

| The situation | The container | What it owns |
|---|---|---|
| Underneath is irrelevant, and there are steps | Modal | Its own history, and its own cancel and confirm |
| Underneath is irrelevant, and there is one step | Sheet sized to its content | The platform's dismiss gesture, and dismissal on touching the dimmed surface behind it |
| Underneath is irrelevant, and the content wants the whole display | Full screen | One explicit close control |
| Underneath stays visible and stays meaningful | Overlay | Nothing; the screen below keeps its controls |
| A destructive choice needs confirming | Confirmation container | The destructive verb as its own button, kept away from cancel |
| Sharing, picking a file or photo, entering credentials, browsing in place | The system-provided mechanism | Everything. Do not rebuild it |

The last row generalizes. Where the environment already supplies a control, use the one it
supplies rather than building a replica: toggles, sliders, segmented choices, date and time
pickers, contextual menus. A replica gives itself away on timing alone — a few tens of
milliseconds off the real one, and the reader registers the interface as fake without being able
to say why. Restyling the supplied control is fair; reimplementing its behavior is not.

Two follow-ups settle the arguments the table does not.

A sheet that grew past one step was the wrong container from the beginning. Count the steps; more
than one, re-present it as a modal.

Anything addressable from outside the running session belongs to navigation history rather than to
component state. If a pasted link, a notification, or a share can land there, the surface is a
route, and routes survive a reload and a cold start.

## One-way doors

Sending the reader to the home screen after they signed in, finished onboarding, or paid is a
defect, even though nothing crashed. It is the most common one in this file.

The doors themselves: signing in, reaching the end of onboarding whether by finishing or skipping,
completing a purchase, ending a session. Past any of them, no press of back leads into what
preceded it. Press back on the first screen beyond the door and the flow ends, or the product
does. It never replays onboarding, and it never shows the sign-in screen a second time.

What survives the door is the reader's place. Where a single action was what raised the sign-in —
saving, following, buying — it opens above the screen that asked and finishes that action there,
leaving the reader on the item they touched with the work done. A purchase screen opened from
inside a feature closes back onto that feature, now unlocked.

## Blocking back

Temporary state inside a screen consumes the first back and then gets out of the way: an expanded
search field closes, selection mode exits, an in-screen sheet dismisses, and the next back leaves
the screen. That is not blocking. That is the state cleaning up after itself.

Blocking proper is justified twice and no more. An irreversible request is still running, taking
seconds, showing its progress. Or a modal holds unsaved work and asks before discarding it.
Holding a reader inside a rating prompt, a funnel, or an upsell by taking back away is a defect.

## Sections are siblings, not steps

Three to five of them, and each control carries a written label alongside whatever mark stands for
it. An icon on its own is a guess the reader has to make every visit, and it is a guess they lose
often enough that icon-only navigation fails recognition outright. The label stays visible rather
than appearing on hover or on press, because the reader needs it before they commit to touching
anything.

Top-level sections stand beside one another rather than in sequence, so nothing directional plays
between them. Each keeps a history of its own, restored when the reader comes back to it. What
happens when the section already in view is selected again is a platform convention rather than a
design decision, and the Platform notes below say which convention applies where.

Screens demanding full attention — composing, playing, checking out — sit above the sections
rather than inside one. A deep link arrives with history already beneath it, so back moves within
the product instead of straight out of it.

A cold start never shows a signed-out screen to a reader who is signed in. That is the decision.
How it gets satisfied is a timing question rather than a navigation one, and holding the first
paint until session state resolves is only one of the answers — states.md carries the threshold a
cold start has to meet, and holding the paint is the easiest way to miss it.

## What to record from a flow that works

When a flow works, write down which container each step used — stacked screen, modal, sheet,
overlay — beside the words that step showed. The record's default home is `.design/record.md`.

## Inspection

Nothing in this file can be answered from the source. Walk the flow and press back at every step
before counting anything.

### The count

- Steps leaving any of the three opening questions unwritten — what back does, whether returning
  has to stay possible, which destination this is: 0.
- Steps that stack history where back re-enters a state the product has already left: 0.
- Sheets carrying more than one step: 0.
- Tasks of the same shape presented in different containers: 0.
- One-way doors where back lands anywhere other than out of the flow, or the screen that started
  it with the work completed: 0.
- Screens where back does nothing while no irreversible request is running and no modal holds
  unsaved work: 0.
- Sections that reopen at their first screen instead of where they were left: 0.
- Screens returned to by back that lost the state they were left in — scroll position, loaded
  items, an applied filter: 0.
- Deep links opened from a cold start where one press of back leaves the product: 0.
- Top-level sections: 3 to 5, or a written reason for the number chosen.
- Top-level section controls whose label is not visible without touching or hovering: 0.
- Cold starts showing a signed-out screen to a signed-in reader: 0.
- Controls reimplementing one the environment supplies, with nothing stated that the supplied one
  could not do: 0.
- Linkable surfaces held in component state rather than in navigation history: 0.

### The checks

- Every step in the flow, stacked or replaced. Walk the flow and write down which one each step
  did. A step whose back re-enters a state the product has moved past is a replace written as an
  advance.
- Every surface in the feature, listed beside its container.
- Back from every one-way door. Press back once at each door and write down where you landed.
- Section history and deep links. Switch sections, drill in, switch away, switch back, then open a
  deep link from a cold start and press back once. Write down what each produced.
- Presentation entries in the study record. If the record does not hold one entry per step of the
  studied flow, it captured layout alone and carries nothing that transfers to a different subject.

## Platform notes

The semantics above are the specification. Each environment supplies its own mechanism.

| Semantic | Native app screen stack | Web routing and history |
|---|---|---|
| Advance | push a screen onto the stack | push a history entry |
| Move on | replace the top of the stack | replace the current history entry |
| Finish a flow at a known place | dismiss back to a named screen | replace with the target route |
| Modal with steps | modal presentation wrapping its own stack | routed dialog with its own history |
| Short interruption | detented sheet | dialog or sheet, still addressable by URL when linkable |
| Overlay | transparent modal presentation | layer over the current route, route unchanged |
| Destructive confirmation | action sheet with the destructive choice styled as destructive | modal dialog with the destructive choice as its own button, separated from cancel |
| Section history | one stack per tab | one history per section, restored on switch |
| Re-selecting the current section | returns to that section's first screen | conventionally does nothing; resetting the section surprises readers |
| One-way door | guarded route group entered by replace | route guard plus a history replace |

Back is a different gesture in each place and all of them have to arrive at the same state: a
header chevron, an edge swipe, a hardware or system gesture back, and the browser back button. The
same route stack has to survive a reload, a pasted URL, and a restored session, which is why any
linkable surface cannot live in component state.
