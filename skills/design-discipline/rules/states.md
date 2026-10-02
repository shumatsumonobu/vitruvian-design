# States

A screen is not one picture. Design only the populated success case, and the rest of the screen
becomes whatever the environment happens to render when nobody was looking. Five states get
designed on every screen: loading, empty, first run, error, long content. A state that fell back
to a default instead of being designed counts as missing.

A state that cannot occur on a given screen is recorded as not applicable, with one line saying
why — a screen reading nothing has no loading state, a screen with no collection has no empty
one. A recorded exemption counts as designed. An unrecorded absence counts as missing, and the
difference between the two is whether anyone thought about it.

## Loading

- A skeleton is a promise about shape. Make one only where the shape is already known. Where the
  item count, the presence of an image, or the length of the text is still open, no honest promise
  exists, so reveal progressively rather than inventing a shape to stand in.
- A skeleton matches the layout it stands in for: same block count, same positions, same sizes.
  Compare the skeleton capture against the loaded capture. Any block that changes position or size
  between them is a defect, and so is any reflow when loading ends.
- A partial update never raises a full-screen indicator. The region that changes carries its own
  indicator, in place.
- An operation that can run past three seconds shows a determinate measure — progress, a count, a
  step number — not an indefinite indicator alone. Three seconds is this skill's default; a
  project may state its own threshold in its declaration, and whichever is stated applies
  uniformly.
- Start fetching when the press begins, not when the transition ends. The length of a transition
  is time the reader is already spending, and spending it twice is a choice.

Two further thresholds, both this skill's defaults. A cold start reaches the point of accepting
input within two seconds on middling hardware. A keystroke appears within fifty milliseconds. Past
either one the interface reads as unresponsive, whatever it happens to be doing underneath.

## Between the action and the answer

A control that waits for a round trip before it visibly changes reads as broken on a slow
connection and merely sluggish on a fast one. The default runs the other way: the interface
reflects the action at once, reconciles behind it, and rolls back loudly if the answer comes back
no.

Rolling back in silence is worse than never having reflected the action at all, because by then the
reader has moved on believing it happened. An action that cannot be undone is the exception, and it
takes the determinate wait above instead of the immediate reflection.

## Empty

- Empty means the container exists and holds nothing right now: a filter matched nothing, a search
  returned nothing, the reader removed the last item.
- Every empty state carries one line naming the cause and one control that fills the container,
  using the label that intent already uses on that screen. Where no reader action can fill it, the
  line names what will and when. A state missing either part is a defect.
- The blank space is there to be worked in. Whatever is placed in it either carries information or
  performs an action.
- A no-results state repeats the query or the active filters back, and offers the move that widens
  them.

## First run

- First run means nothing has ever existed here; empty means what existed is gone or nothing
  matched. The copy differs accordingly: first run says what this screen will hold and how to make
  the first one, empty reports what happened.
- Open the screen on a new account. Wording identical to the post-deletion state means the
  first-run state was not designed.
- First-run content disappears once one item exists. A permanent instructional banner is a defect.

## Error

- Errors are inline, next to what failed: in the region for a region, on the row for a row.
  Full-screen errors are for when nothing on the screen is usable. Errors belonging to an input
  field are placed and timed by forms.md.
- Error text names the operation that failed and the move that follows. How it is worded, the
  banned strings, and the count that finds them all live in copy.md.
- An error that requires reader action stays until resolved or dismissed. It does not disappear on
  a timer.
- A failed action preserves what the reader entered. Fill a form, force the failure, confirm the
  values survive.
- Retry appears where retrying can succeed: a rejected value has no retry, a failed request does.

## Long content

- Every text region declares its overflow behavior: wrap to a stated line count, truncate, or
  scroll. Undeclared is a defect.
- Test with content three times the expected length — this skill's default — and with one unbroken
  token longer than its container. Neither may clip a control, overlap a neighbor, or push
  anything out of the layout. Check rows at one line and at three, with controls on the same anchor
  at both heights.
- Truncation never removes what distinguishes one item from another. Where values differ at the
  end, truncate in the middle or wrap.
- Values that change in place — counts, times, prices — hold their width as the digits change, and
  the surrounding layout does not shift.
- Enlarged system text is long content too. This skill's default is to test at one step above the
  platform's default text size, or higher, recording the size tested alongside the state captures.
  Text set in a unit that setting does not scale stays the same size when the reader raises it,
  and that is a defect: the reader asked for larger text and got none.
- A collection is long content too. Fill it well past the expected item count — this skill's
  default is ten times — and every container that cannot scroll states what happens past its
  capacity: wrap to a stated count, collapse into a stated overflow, or scroll.

## Across a session

The five states are what a screen renders. These four are what happens to it when the session is
interrupted, and none of them shows up in a capture.

- **Interruption and return.** Send the product away mid-flow and bring it back. Work in progress
  is still there. Half-entered forms are work in progress.
- **Restart.** Close the product entirely and open it again. What was persisted comes back; what
  only ever lived in memory resets. Something the interface said it saved, gone after a restart,
  is the worst version of this failure, because the reader was told otherwise.
- **No connection.** Act with the network unavailable. The action either queues and says so, or
  fails visibly. Failing silently — the tap registers, nothing happens, nothing is said — is the
  defect this exists to catch.
- **Repeated presses.** Press a control twice, faster than the response. It navigates once and
  submits once. Dimming the control after the first press does not settle it, because both presses
  can land before anything dims.

## Forcing each state

Decide from the running screen, not from the code. Capture one screenshot per applicable state and
keep the set together — `.design/captures/` is this skill's default home for the set — with the
exemptions written beside it.

Capture the set in the primary theme. Where the declaration names a second theme, repeat in it
only the states putting text over a colored or an elevated surface — those are the ones where
contrast changes, and the rest render the same twice.

- Loading: throttle or suspend the network so the request stays in flight long enough to capture.
  If the tooling cannot hold it, hold the request from outside the product — a blocked host, a
  throttle in the harness — never by editing the product's code.
- Empty: remove every record the screen reads, or point it at an account with none.
- First run: create a new account, or clear local storage and enter through the cold-start path.
- Error: force two failures — transport (network off, host unreachable) and a rejected response
  from the server — since they run through different code.
- Long content: substitute a long string and one long unbroken token, raise the system text
  size, and populate each collection to ten times the expected items.
- Both themes, where the declaration names two: switch the appearance setting and repeat the
  captures that carry text over a colored or elevated surface.

## A control has states of its own

The five states are the screen's. Each control that fires on a press — a button, a row, a tab, a
link outside running text — has its own: at rest, pressed, focused, and disabled where it can be. A
control that stands for a current choice — a tab, a filter, a link in a navigation, a row — also
has a selected state, the environment's default selected treatment counting as one. The pressed
state is rules/motion.md's, counted there. Focus belongs to the accessibility floor rules/a11y.md
lists, counted below. Its indicator appears at once, not animated in; that has a line of its own
below, beside the floor's, and is not the floor's. A field takes focus rather than a press; its
focus is counted below and its error is rules/forms.md's. A control that is disabled shows why — in
words the reader can see, or in the state of what it acts on: the required field above it still
empty, the list it acts on with nothing selected — in room that is there before the control is
disabled, since a state change moves nothing else (A state change moves nothing else, below). A
greyed control with no reason in sight reads as broken. Hover belongs to the pointer: a hover
treatment fires only where the primary input — the input the device is mostly operated with — can
hover, and on a device whose primary input cannot hover, what stands in for it does not stay after
the tap. Neither of the hover lines below is the floor's; what must stay reachable without hover is
rules/a11y.md's.

## A state change moves nothing else

When one thing changes state — a field takes focus or fails, a transient message arrives, an
indicator appears, a help or character-count line under the field fills — nothing around it moves.
A border that thickens, an error line that pushes the form down, a message that shoves the surface:
each reads as the screen flinching. The room is there before the state is — the focus indicator
drawn outside the box, the line's height held while it is empty, the message laid over the surface
rather than into it. What the reader opens is not counted here: an expander, a section that unfolds,
a list that reorders on a filter — these move what is below them because the reader asked for more,
and rules/motion.md animates that move. The surface scrolling as a whole to bring a focused field
into view is rules/forms.md's and is not counted here.

## Hierarchy holds across all of them

Which element stays primary, and reading order against visual weight, are settled in layout.md.
Every state here holds whatever that file settled. A loading state that promotes a different
element to primary, or an error state that reorders the screen, has changed the design rather than
shown a state of it.

## Inspection

### The count

- Applicable states with no capture: 0. A state recorded as not applicable needs no capture.
- States with neither a capture nor a written exemption: 0.
- Where the declaration names two themes, states putting text over a colored or an elevated
  surface with no capture in the second: 0.
- Captures showing defaulted content: 0.
- Skeleton blocks changing position or size against the loaded capture: 0.
- Elements that move because a neighbor changed state — a border thickening, an error line or a help
  or character-count line appearing, a transient message or an indicator arriving — counting none
  that moved because the reader opened, expanded, reordered, or filtered something, none moved by
  content that updates itself arriving, which is content arriving rather than a state change, and
  not the surface scrolling as a whole to bring a focused field into view, which rules/forms.md
  owns: 0. Loading ending is the skeleton count above. Read on the running screen as each state is
  forced; where no screen can be driven, the record (`.design/record.md`) says the count was not
  taken; an untaken count is not a pass.
- Full-screen indicators raised by an action that replaces part of a screen: 0.
- Operations running past the three-second threshold with only an indefinite indicator: 0.
- Reversible actions that wait for a round trip before changing visibly: 0.
- Failed actions that roll back with nothing said about it: 0.
- Failed submissions that discard what the reader entered: 0.
- Fetches that wait for a transition to finish before starting: 0.
- Empty-state elements carrying neither information nor an action: 0.
- Empty states missing the line naming the cause, or the control that fills the container: 0.
- Screen-level errors that clear on a timer rather than on resolution or dismissal: 0.
- Long-content captures — the long string, the unbroken token, the raised text size, the filled
  collection — showing a clipped control, an overlapped neighbor, or content pushed out of the
  layout: 0.
- Text that stays the same size when the platform's text size is raised one step: 0.
- Text regions with no declared overflow behavior: 0.
- Tap targets below the platform's stated minimum: 0.
- Text contrast below 4.5 to 1 for body text and 3 to 1 for large text and non-text controls, in
  every theme the declaration names: 0. Both ratios are the minimum level of the accessibility
  guidelines.
- Focus indicators that animate in rather than appearing at once, read on the running screen as
  focus arrives: 0. Where no screen can be driven, the record says the count was not taken; an
  untaken count is not a pass.
- Hover treatments applied with no condition that the input can hover, where any supported device's
  primary input cannot hover: 0. Where every supported device's primary input can hover, 0.
- Hover treatments that persist after a tap, on a device whose primary input cannot hover, counting
  none already counted on the line above: 0. Where every supported device's primary input can hover,
  0. Where no touch screen can be driven, the record says the count was not taken; an untaken count
  is not a pass.
- Disabled controls with no reason on the screen — neither words saying why, nor the state of what
  the control acts on showing it — a control disabled while its submission is in flight excepted,
  the in-flight indication rules/forms.md requires being its reason: 0.
- Controls that stand for a current choice — tabs, filters, links in a navigation, rows — with no
  visible selected state, the environment's default selected treatment counting as one: 0.
- Focusable controls with no visible keyboard focus: 0.
- Elements that clip, overlap, or leave the layout as the display narrows to the narrowest
  supported width: 0.
- Flows losing work in progress when the product is sent away and brought back: 0.
- Values the interface reported as saved that are gone after a restart: 0.
- Actions that fail with no connection and say nothing: 0.
- Controls that navigate twice or submit twice on a fast double press: 0.
- Measured cold starts over two seconds, or keystrokes over fifty milliseconds: 0.

### The checks

- The capture set for this screen, listed, with any exemptions and the reason for each. Name any
  capture that came from a default rather than from a decision, since those count as missing.
- The four session interruptions, each one performed rather than reasoned about, with what
  happened written beside it.
- The two response thresholds. Time a cold start to the first accepted input, and a keystroke to
  the character appearing. Write both numbers; an unmeasured threshold is a missing capture, not
  a pass.

## Platform notes

Forcing the states:

- Web: network throttling and request blocking in the browser developer tools; a fresh profile or
  cleared site data for first run.
- iOS: airplane mode or the network link conditioner in the simulator; erase all content on the
  simulator for first run.
- Android: emulator network profiles and airplane mode; clear app storage for first run.
- Desktop: disconnect the network or point the client at an unreachable host; a new user profile
  for first run.

Interrupting a session:

- Web: switch tabs or minimize for interruption; reload for restart; the offline toggle in the
  browser developer tools for no connection.
- iOS and Android: send to the background and return for interruption; terminate from the task
  switcher and relaunch for restart; airplane mode for no connection.
- Desktop: minimize or switch applications for interruption; quit and reopen for restart;
  disconnect the network adapter for no connection.

Switching themes:

- Web: the appearance setting in the browser developer tools, or the operating system's own
  appearance setting.
- iOS and Android: the appearance setting in system settings, or the simulator and emulator
  equivalents.
- Desktop: the operating system's appearance setting.

Enlarged text and the narrowest supported width:

- Web: the browser's minimum font size or page zoom; the device toolbar or a resized window for
  width.
- iOS: Dynamic Type in the simulator's settings, one step or more above the default; the smallest
  supported device for width.
- Android: Font size in system settings; Display size or a small-screen emulator profile for width.
- Desktop: the display-scaling setting of the operating system; a resized window for width.

Minimum tap target, as each platform states it:

- Apple platforms: 44 by 44 points — the Human Interface Guidelines' default control size; the
  minimum they state is 28 by 28, and this skill holds the default.
- Android: 48 by 48 density-independent pixels.
- Web: 24 by 24 CSS pixels at the minimum level of the accessibility guidelines, with the
  criterion's exception — a smaller target passes where a circle of that size centered on it
  crosses no other target's circle — and 44 by 44 at the enhanced level.
- Desktop: the control metrics stated by the host operating system.

Hover, and what stands in for it:

- Web: a browser applies the hover style on the first tap and leaves it there; the condition that
  the input can hover is `@media (hover: hover)`.
- iOS and Android, native: where the toolkit exposes hover — a trackpad or a mouse on a tablet —
  both counts apply as written, the touch screen still being the primary input; where it exposes
  none, there is nothing to condition and nothing to persist, and both counts report 0. A web
  surface on those systems follows the Web line above.
- Desktop: every supported device's primary input can hover, and both counts report 0.
