# Forms and inputs

Most of what a person does inside a product, they do by typing into it. A form is where an
interface stops being something to look at and becomes something to operate, and it is where the
cost of a careless decision is paid by every reader on every visit rather than once at build time.

This file owns how a field behaves. Where an error appears as a screen state belongs to states.md;
what an error says belongs to copy.md; where the form sits on the page belongs to layout.md.

## Labels sit above the field and stay there

A placeholder is not a label. It disappears the moment typing starts, which is exactly when the
reader needs to know what the field wants; it leaves nothing to check the entry against when they
look back over a filled form; and it is unreliable for anyone reading the interface by ear.

A placeholder is legitimate for one job: showing the shape of an acceptable answer. Where it does
that, it reads as an example rather than as an instruction, and the label still exists above it.

The exception is the single-purpose input whose job the surrounding context names — a search
field beside its icon, a composer at the foot of a thread. Context is the visible label there,
and the accessible name still says the job.

## Every field declares what it is

A field states which input method it wants — digits, an email address, a telephone number, a web
address — and what the environment may fill it with automatically.

This is not decoration. A field that declares nothing raises the general-purpose keyboard when the
reader needed a number pad, and it defeats the stored value the reader has already given to some
other product. **The cost is paid in keystrokes, by every reader, every time.** A one-time
confirmation code has its own hint, and it is the one that saves the most typing of any of them.

## Movement order matches visible order

Moving to the next field follows what the reader sees, not the order the fields happen to sit in
the source. A form that jumps from the top field to the bottom one and back is not an ordering
choice, it is an ordering accident.

Reaching the end of the fields is enough to send the form. A reader who typed their way down should
not have to leave the keyboard to finish.

## Validate when the reader is done, not while they are working

**Not on every keystroke.** Telling somebody their email address is invalid while they are three
characters into typing it is not help; it is interruption, and it trains them to ignore the thing
that will eventually matter. Validate when the field is left, or when the form is submitted.

One exception, stated by no guideline document: **once a field has failed, watch
it as it is typed.** After an error exists, live feedback stops being an interruption and becomes
confirmation that the repair worked. The asymmetry is the point — silence before the first error,
attentiveness after it.

## Errors sit under the field and stay until fixed

The error attaches to the field that produced it, directly beneath, and remains until the value is
acceptable. It does not clear on a timer and it does not move to the top of the form where the
reader has to hunt for which field it meant.

A form failing on submission keeps every value the reader entered. That rule and the screen-level
error state belong to states.md; what the message says belongs to copy.md. This file only places it
and times it.

## The input method does not cover the field being typed into

When a keyboard, a candidate list, or any other input surface appears on screen, the field taking
the input stays visible, along with enough of its surroundings to keep the reader oriented.

**This one is only findable by raising it.** No amount of reading the source will show that a
sheet, a fixed footer, or a scroll container traps the focused field behind the keyboard, and it is
where a large share of real input defects live. Raise the input method on every screen that accepts
typing, and look.

## Submission happens once

One press, one submission. Dimming the button after the first press is not the answer, because both
presses can land before anything has dimmed. The repeated-press rule itself belongs to states.md;
this file's concern is that a form is the most common place it goes wrong.

While a submission is in flight, the reader can see that it is in flight.

## What this skill adds

The three rules below come from no guideline document. They are here because a form fails on
them more often than on anything above.

- **Mark whichever of required and optional is rarer.** Where most fields are required, mark the
  optional ones; where most are optional, mark the required ones. A form marking every field
  required has spent ink to say nothing.
- **A field with no stated use comes out.** Every field costs the reader time and costs the product
  completions. Name what each one is for, in a phrase. A field whose answer nobody consumes is not
  a small cost, it is the most expensive thing on the screen.
- **Values a reader may want to copy are selectable.** Reference numbers, addresses, codes,
  identifiers. A value that can only be retyped by hand was designed as decoration.

## Inspection

Run this on any screen that accepts typing. A screen with no fields returns zero on every line and
passes.

### The count

- Fields declaring neither an input method nor an autofill hint: 0.
- Fields using a placeholder in place of a label: 0, a single-purpose input whose job its
  context names excepted — its accessible name still carries the job.
- Fields validated on every keystroke before their first error: 0.
- Fields that have already failed and still wait for a blur before re-checking: 0.
- Submissions in flight with nothing on screen saying so: 0.
- Fields whose error message does not sit directly beneath them: 0.
- Errors that clear on a timer rather than on repair: 0.
- Fields hidden behind the input method when it is raised: 0.
- Fields whose position in the movement order differs from their position on screen: 0.
- Fields with no stated use: 0.
- Reader-facing reference values that cannot be selected: 0.
- Forms marking every field required: 0.

### The checks

- One capture per form with the input method raised, taken on the narrowest supported width, where
  the field being typed into is visible in the frame.
- The movement order, walked from the first field to submission without touching the screen. Write
  down the order it produced.
- Required against optional. State which one carries the mark and why that one is rarer here.
- Each field, with the phrase saying what its answer is used for.

## Platform notes

- Declaring the input method and the autofill hint is done differently in each environment — an
  attribute on the element, a property on the control, a content-type constant. The rule is that
  both are stated, not how.
- Where the environment supplies a form control, use it rather than a replica, per navigation.md.
  A replica loses autofill, the correct input method, and the reader's own accessibility settings
  in one move.
- Keeping the focused field clear of a raised keyboard is handled by the environment in some places
  and not at all in others. Where it is not automatic, it is built and then tested; where it is
  automatic, it is still tested, because containers that scroll or float defeat it.
