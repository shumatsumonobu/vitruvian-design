# Motion

More perceived quality per line of code comes from motion than from anywhere else on the surface,
which is exactly why it gets overbuilt first. Four questions settle every animation, answered in
this sequence: how often, what for, what drives it, how it gets verified. Starting at "which
curve" is how a product ends up animating everything.

## How often

Place the moment by how often one person meets it. The band decides everything downstream.

| Met this often | Treatment |
|---|---|
| A hundred times a day or more — switching sections, keyboard, scrolling, going back | The environment's default, nothing added |
| Tens of times a day — pressing, selecting a row | Barely noticeable, finished inside 150 ms |
| Occasionally — sheets, modals, transient in-app messages | 200 to 300 ms on a declared ease-out curve |
| Once, or near enough — a first run, a one-off celebration | Delight is allowed here and nowhere else |

Both the 300 ms ceiling and the 200 ms floor are this skill's own defaults.

Clearing this gate with no animation code written is a result, not a gap. An unclear band resolves
by deleting the animation.

## What for

One word, drawn from this set: feedback, continuity, state change, cut avoidance, explanation,
delight. A purpose needing a sentence is not a purpose, and the animation does not get built.
Figures and text a reader is partway through hold still, because style is not a reason to move
something a person is trying to read.

## What drives it

A finger on the surface means a spring. Nothing touching it means a duration and a curve. Getting
this backwards is the loudest tell there is: a sheet released from a fling that then plays a fixed
timing reads as dead, and a button springing for the better part of a second reads as a toy.

### Driven by a finger

Continuity comes first. The animation begins at whatever value the property actually holds when
the grab lands, not at its resting value, and a touch arriving mid-flight takes over from wherever
the property sits at that instant rather than from where it was headed.

Energy comes next. The velocity at release goes into the spring, the destination is the one
projected momentum points at so a short fast flick still commits, and boundaries rubber-band
rather than stopping dead.

Vocabulary comes last. Two springs cover a whole product: one settling without oscillation, one
softer for surfaces carrying momentum. Both are named in the token declaration and reused from
there.

Overshoot belongs only where a finger supplied the momentum. Nothing a person did not throw
bounces.

### Driven by time

- Press feedback fires on the press-in, runs 100 to 150 ms, and never waits for the release.
  Buttons and cards press to about 0.97 of their size; a list row answers with a background
  highlight, never a scale; a bar icon answers with opacity.
- Everything else stays inside the ceiling of its band and eases out. Declare the curve in the
  token declaration; whatever easing the environment ships by default is not a declaration. An
  entrance that eases in is a defect on its own.
- An entrance opens at 95 percent of full size behind a fade, never from nothing.
- Whatever an entrance costs, its exit costs about seven-tenths of that, retracing the path the
  entrance took.
- A menu or popover grows out of whatever summoned it. A dialog centered on the screen has no
  origin to grow from and is exempt.

## Feedback the eye does not receive

Where the environment can answer through touch or sound, that answer is punctuation rather than
narration. It marks something the reader did: a value crossing a step, a surface arriving where it
was thrown, an outcome reported.

- It arrives in the frame the visual answer arrives in, never behind it. Landing late reads as a
  second event rather than as one event answered twice.
- One per action. A gesture that fires on every unit it crosses becomes noise, and the reader
  stops reading it.
- Never the only channel. Anything conveyed by touch or sound alone is unavailable to a reader who
  cannot receive it, and to every reader with the setting turned off.
- Never on a continuous gesture and never inside a loop. Scrolling is continuous.

## What moves, and what it costs

- A card becoming the hero of the next screen holds its radius and its aspect ratio across the
  transition. Two objects swapping reads as two objects; one object moving reads as one.
- A list may enter staggered by position, but the stagger stops at the eighth item and the rest
  arrive together.
- A container whose children reorder or resize animates the layout change itself — filter chips,
  an expanding card, a reordering list are where that spend shows.
- Content scrolling under a translucent bar meets a fade or a blur at the boundary, not a hard
  clip.

## The tells

Two patterns mark a build as machine-made: every section arriving on a fade and an upward slide,
and every card answering a hover. They show up whatever the subject is, which is the whole
giveaway.

One choreographed moment — a single load sequence, or a single reveal, with nothing beside it —
carries a screen further than effects sprayed across it. Motion answering a reader's own tap earns
its place, because it reports what changed.

## Reduce motion

With the preference on, anything spatial becomes a cross-fade, and environment-supplied
transitions render the way the environment renders them. A spatial animation shipped with no
declared cross-fade fallback is an accessibility defect, not polish scheduled for later.

## Verification is a recording

A screenshot settles layout and reports nothing about motion. Record the flow end to end and put
it through everything it can do: transitions and back paths, sheets presented and dragged and
dismissed and abandoned mid-drag, the keyboard arriving and leaving, taps repeated faster than the
animation finishes, scroll flung to both ends.

Then two passes over that recording, each with its own job. The first runs at normal speed and
judges feel. The second steps frame by frame and hunts defects: a frame painted before styling
lands, a frame carrying the wrong theme partway through a transition, a surface taking the wrong
color for a single frame, dropped frames, a layout jumping or rendering twice, a spring clipping
content or overshooting onto it.

## Inspection

### The count

- Animations in the change with no band beside them, or with more than one: 0. Write every
  animation out with its band before counting anything else.
- Custom animation code in the hundred-times-a-day band: 0. A line of it is a defect, not a
  preference.
- Finger-driven surfaces released into a fixed timing, or time-driven animations played as a
  spring: 0.
- Overshoot on motion no finger threw: 0.
- Animations whose purpose is not exactly one of feedback, continuity, state change, cut
  avoidance, explanation, delight: 0. A purpose that takes a sentence to state counts as no
  purpose.
- Dismissal thresholds that commit on distance alone: 0. Every dismissal threshold reads distance
  or velocity, either one alone being enough to commit.
- Declared durations over 300 ms with no gesture behind them and no reason offered in review: 0.
- Declared durations under the 200 ms floor of the occasional band, or over the 150 ms ceiling of
  the tens-of-times-a-day band: 0.
- Press feedback outside 100 to 150 ms, or firing on the release rather than the press-in: 0.
- Press answers off the vocabulary — a button or card away from about 0.97, a list row scaling, a
  bar icon answering with more than opacity: 0.
- Entrances that ease in: 0.
- Entrances opening from nothing rather than from about 95 percent behind a fade: 0.
- Exits declared longer than about seven-tenths of the entrance they reverse: 0.
- Staggers running past the eighth item: 0.
- Menus and popovers not growing out of what summoned them, centered dialogs exempt: 0.
- Shared elements changing radius or aspect ratio mid-transition: 0.
- Content meeting a translucent bar at a hard clip: 0.
- Non-gesture entrance animations on one screen: 1 at most. If a screen carries more, the reason
  is stated in review.
- Spatial animations without a declared cross-fade fallback: 0.
- Non-visual feedback firing more than once per action, or on a continuous gesture: 0.
- Outcomes reported through touch or sound alone, with no visual counterpart: 0.
- Elements that translate, scale, or slide once the reduce-motion preference is turned on: 0, with
  the whole flow walked and not just one screen.

### The checks

- Frame rate. Sixty frames per second held through every transition, on the slowest hardware the
  product supports. Read off a measurement, not judged by eye.
- Glitches still in the recording after the fixes. Name each one the two passes turned up and say
  what became of it. A single wrong frame left in there means the work continues.

## Platform notes

Non-visual feedback is available in different amounts per environment: a full haptic vocabulary on
handheld hardware, a single coarse vibration in a browser where the reader has granted it, and
usually nothing on a desktop. Where the vocabulary is coarse or absent, drop the channel rather
than approximating it — a buzz standing in for three distinct signals carries less than no signal.

How a frame rate gets measured is a matter for whatever profiling the environment provides, and
this skill does not prescribe it. What it does prescribe is where the reading has to come from:
the slowest hardware the product claims to support, because that is where motion stops reading as
motion and starts reading as a fault.
