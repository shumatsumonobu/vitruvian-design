---
name: design-discipline
description: Design discipline for interfaces, so what gets built does not read as generated. Use when building, restyling, auditing, or reviewing a screen — layout, design tokens, colors, states, navigation, motion, forms, interface copy, contrast, dark mode, accessibility. Native and web alike. Pairs with frontend-design. Entries: init, review, inspect, fix.
license: MIT
---

# Design discipline

This skill runs alongside Anthropic's **frontend-design** skill and assumes it is installed. That
skill decides what a design should be — the subject it belongs to, the palette and typefaces that
suit it, the looks a generated interface falls into, how the words should read, and the
plan-then-attack-the-plan process that gets from a brief to code. It is short and dense, and nothing in it is restated here.

This skill covers what that one leaves open, and it does so in a form a reviewer can count rather
than judge:

| frontend-design settles | This skill settles |
|---|---|
| Which palette, which typefaces, and why those | The declaration that keeps them fixed across sessions |
| The looks to avoid and the tells that give them away | The count that catches drift once a direction is set |
| How the words should read | The inventory that catches one intent wearing three labels |
| The plan, and attacking the plan before writing code | Structure, states, navigation, motion, forms, artwork, accessibility, and the review loop |

If frontend-design is not installed beside this skill, say so before starting: without it the
judgment layer is missing and this skill is a checklist with nothing behind it.

## Language

Write critique, findings, and proposals in the user's language. The rule files are English; the
output to the user does not have to be. The names this skill gives stay as given, in English,
wherever they are written — the declaration's entry names, the names the scope of change is
recorded under with its not yet asked and not applicable states, the style system's four
entries, the marks structural and surface — so a later session matches on them. Values,
reasons, and what is named as kept are in the user's language.

## Ways in

Four entries exist — as commands of their own, `/design-discipline-init` and the rest, when
their directories are installed alongside this one — and a task that names none of them gets
routed to whichever fits. Building something new runs down this file in order, whichever way it began.

| Entry | What it does |
|---|---|
| `init` | Once per project. Looks for a declaration; with none, derives one from the subject by the procedure in rules/tokens.md, code or no code; where code exists, reads it beside the derivation and records where the two differ. Shows the declaration and the comparison, asks whether the values stand and where it should live — the question under What it asks you — and writes it only after both are agreed. Nothing in the code changes here. The declaration is born here and nowhere else. |
| `review` | Improving a screen that already exists. Starts at [rules/review.md](rules/review.md): operate the screen, name the deficits, gather against them, rebuild in small passes, compare. Before the rebuild, reads the declaration's scope of change (Before fix or review changes the code, below), asking once if it has not been answered. That file routes back here for whichever decisions the deficits turn out to be about. |
| `inspect` | Inspection only. Runs every applicable Inspection — the counts and checks at the end of each rule file — against the running screen, writes the results to the record, returns the repair list — one line per count that missed or check that failed, each marked structural or surface as Before fix or review changes the code defines them — and changes nothing else. |
| `fix` | Consumes a repair list, usually inspect's. Reads the declaration's scope of change (Before fix or review changes the code, below) first — asking once if it has not been answered — applies only what it allows, and writes the rest to `.design/record.md` with the reason. At most five repairs per pass, the failed counts rerun after each pass, done when the list is empty. |

Screen work arriving with no declaration in the project does not create one in passing. It stops
and proposes `init`. A brief that grants agreement in advance — to the derived values, the
default home (`.design/`), or both — satisfies init's agreement, and the run does not stop there.
On a project that already has screens, that agreement makes the derived declaration — not the
code's current values — the target every later repair works toward; how far those repairs may
go is the separate question under Before fix or review changes the code. Under `inspect`, a
repair any rule file calls for goes onto the returned list rather than being made in the pass.

## What it asks you

Three questions, each put once, in the user's language, as written here — every word
translated, the bold labels included, nothing added. Only a file path and an entry's command
name (`init`, `inspect`, `fix`, `review`) stay as written; no word in these texts is a name of
this skill, so none stays in English. What the rules say about the record and the counts is for
the session, not for the person. The third question's answer is recorded in the declaration
under the name given below it, in English; that name is never shown in the question. These
three are the only questions the skill puts to the person. Every other decision a pass meets — a
value the declaration lacks, the form a repair takes — the session makes under the declaration
and writes down (Project tokens, below); the person changes a decision by editing the
declaration.

**Before a visual direction, when the session has no browser it can drive** (the rule is under
Before you draw):

> Before deciding this product's look, the agent studies five real, shipped sites of the same
> kind: how they lay out the page, which buttons and menus they use, how they show progress.
> That way the design follows what works, not a stock look. That study needs a browser the
> agent can operate, such as Claude in Chrome (claude.ai/chrome). None is connected.
>
> - **Connect a browser.** The agent opens five real sites of this kind, writes down what
>   each does, and derives the design from that and your description.
> - **Continue without a browser.** The agent decides the design from your description alone,
>   with nothing real to check it against. The agent notes in `.design/record.md` that it did
>   not study the sites, and `inspect` keeps listing that as not done. You can have the sites
>   studied later.

**Before `init` writes the declaration:**

> This declaration will be the design decisions every later session follows. The agent
> derived each value from your description and wrote its reason beside it. Next to that is the
> value the code has now, for comparison only: a template's defaults are not decisions, so the
> agent adopted none of them. The agent writes nothing until you agree, and does not change the
> code here.
>
> - **Write the declaration.** The agent saves the declaration to `.design/declaration.md`. From
>   then on `inspect` lists where the code differs from the declaration, and `fix` brings the
>   code to it.
> - **Revise some values first.** Say which entries and what they should be. To keep a value
>   the code already has, name that value, and the agent writes it into the declaration as a
>   decision. The agent then shows the revised declaration and saves it when you agree.
> - **Save it elsewhere.** Say where — a section in a design document you already keep, for
>   one. The agent writes the declaration there, and later sessions read it from there.

**Before `fix` or `review` changes a product that already has screens** (the rule is under
Before fix or review changes the code):

> This product already has screens, and the repairs are about to change them. Before anything
> changes, say how far the repairs may go, so nothing you care about is touched by accident.
> The agent writes the answer into the declaration — the file `init` saved your design
> decisions to — and follows that answer every time the agent repairs this product; to change
> the answer later, edit that line.
>
> - **Keep the layout.** Where things sit, the pictures, and the animations stay as they are.
>   The agent repairs colors, fonts, spacing, corners, shadows, the loading, empty, and error
>   screens, wording, form fields, and accessibility. The agent does not make any repair that
>   would move, resize, remove, or reorder something; it lists such a repair in
>   `.design/record.md` with the reason, for you to decide on later.
> - **Change anything.** The agent makes every repair; layout, pictures, and animations may all
>   change. Under `review`, the agent rebuilds the screen until the screen is at least as good
>   as the best real product studied.
> - **Report only.** The agent changes nothing and writes the full list of repairs to
>   `.design/record.md` for you to read first. To have the repairs made, change this answer in
>   the declaration and run `fix` again.
> - **Keep these: …** Choose this, and the agent asks what must stay; name it as it appears on
>   the screen — "the spinning logo at the top, its size and position". The agent may change
>   everything else. The agent does not make any repair that would touch what you named; it
>   lists such a repair in `.design/record.md` with the reason. The agent still makes
>   accessibility repairs to what you named: a moving logo keeps moving, and holds still for
>   people who have turned animations off in their device settings.

When the person chooses Keep these, the agent puts one more line and waits:

> What must stay? Name each thing as it appears on the screen, in one line.

Recorded in the declaration as structure kept, everything may change, report only, or kept:
followed by what was named.

## Before fix or review changes the code

On a product that already has screens, `fix` and `review` ask once, before changing anything,
how far the repairs may go — the third question under What it asks you — and write the answer
into the declaration's scope of change entry; under Keep these, the names come in a second
turn, the line under that question, and the entry is written after them. An entry still
reading not yet asked — as init writes it where code exists — or missing from a declaration
written before this entry existed, is the cue to ask. Later passes read the answer there and
do not ask again; a person changes it by editing that entry.

Accessibility, in the question, is the accessibility floor as rules/a11y.md lists it: applied
under every answer but report only. A repair is structural when it changes where something
sits, how big it is, whether it exists, its order, the container that presents it, what an
artwork depicts or the colors it is drawn in, or whether a motion plays. Everything else is
surface. `inspect` marks each repair it returns with one of the two, and `fix` reads the mark
against the scope of change: under structure kept a structural repair is not applied, under
kept: a repair that would touch a named element is not applied, and either is written to
`.design/record.md` with the reason.

Where the entry reads not applicable — init found no values in the code — nobody is asked. A
brief that states the scope of change answers the question in advance, the same way it grants
init's agreement. The build loop under Before you call it done is not a repair pass and does not
ask: it builds against the declaration.

## What this skill writes, and where

Everything this skill writes into a project defaults to one hidden directory at the project
root, `.design/`. Nothing lands loose at the root.

| Path | Holds |
|---|---|
| `.design/declaration.md` | The token declaration, its scope of change included. Born in `init`, committed with the project |
| `.design/record.md` | Named deficits, count results, the study record, init's map and comparison of the code, the repair list with its marks, and what each fix pass did |
| `.design/structure.md` | The layout structure rules/layout.md calls for: one entry per surface — columns and their gap, or flow and what stops the width — and what each region does as the display narrows |
| `.design/lexicon.md` | The string inventory rules/copy.md builds: each intent, its one phrasing, every place it appears |
| `.design/style-system.md` | The artwork style system rules/assets.md calls for: family, palette, light and texture, subject grammar |
| `.design/captures/` | The state captures rules/states.md calls for |
| `.design/harness/` | Inspection scripts and their output. Disposable once the pass is over |

`.design/` is the default; the user's choice of home wins, a section inside an existing design
document included.

## Before you draw

frontend-design covers fixing the subject and writing the plan. One thing it does not cover:

**Study shipped work instead of imagining it.** Find products already solving this problem and read
their answers. Five questions are worth carrying into each one: how the screen is divided and what
that division puts first, which control got picked for which job and what the spacing between them
does, what each step of a flow is presented as — a stacked screen, a modal, a sheet, an
overlay — what earns artwork and what stays plain text, and how progress is shown. Take the
answers and leave the surface they came wrapped in.

First on the shelf sit the platform vendors' own materials. For anything meant to feel like
Apple's work: the Human Interface Guidelines, the official Apple Design Resources kits, the WWDC
sessions "Designing Fluid Interfaces" and "Meet Liquid Glass", the Apple Design Awards gallery,
and the first-party apps themselves. For Android: Material 3 and the first-party apps. On the web
no single vendor owns the look — the floor is the browser's conventions and the accessibility
guidelines, the winners live in galleries of shipped work, and when the brief wants an OS-grade
material, the OS vendor's own sessions are the original to port from.

Some galleries now publish token sheets of shipped products — a palette, a type scale, spacing
read off the running site. Treat one as study input: it answers what a winner decided, and its
values pass through the subject into this project's own declaration rather than being pasted in
as the declaration. A sheet carries the visual layer only, so the questions about states, motion,
and flow still need the product itself, walked.

Borrow the skeleton, never the screen. Reproducing somebody else's surface one-to-one is lazy work
and legally exposed besides. The opposite failure costs more, though: a screen that discards every
convention its readers already carry makes them learn the product from nothing, and they mostly
decline.

The study discipline:

- Carry one named question into each pass. A pass with no question produces notes, not a spec.
- Walk a flow from start to finish, opening every screen along it. A sampled flow misreads the
  journey.
- Cross-product before deep in one. Convergence marks a convention; divergence marks a real choice.
- Stop when new material stops changing your spec, and not before.
- With nothing available to study, say so plainly and proceed from the subject alone.
- Where the session has no way to see pixels — no browser it can drive — say so and ask once
  whether one can be connected — the question is under What it asks you. Going on without one
  is recorded as a study not yet done, not as nothing available to study; the count in
  rules/anti-slop.md stays open until it is done.

This is a gate, not advice. Before a visual direction is set, the record holds the studied
references — this skill's default is five or more, each with one line on what it settled — or the
written sentence that nothing was available to study. A visual direction reached with neither is
a defect. Of the references studied, at least one is a product walked as a running flow rather
than read as a sheet, and the record says which. A reference studied without its pixels —
fetched as text, never rendered — does not count toward the five, and the record says for each
reference how its pixels were seen: a capture, a recording, or a walk.

Keep the record of what you rejected while planning. A later pass with no memory of it reaches for
the same defaults the earlier one argued its way out of.

## Exceptions

Every default the rule files ban lifts on one condition: the choice, and the reason it suits this
product, go into the recorded-exceptions entry of the declaration. rules/anti-slop.md states that
rule, and it governs every count in every rule file rather than only the counts in that one. A
count written as a bare 0, with no exception clause beside it, still lifts this way.

Two things never lift, and rules/anti-slop.md draws both lines: iconography, which comes from the
declared symbol set whatever the voice, and the accessibility floor, whose counts hold whatever
the declaration records.

## While you build

Open a rule file when its decision arrives. Do not read all of them up front. Every check lives
in the Inspection section of the file that owns it, and runs there — not a second time in a
second file.

| File | Owns | Open when |
|---|---|---|
| [rules/tokens.md](rules/tokens.md) | The declaration, its entries, and its derivation | Writing or amending the declaration: color, typeface, spacing, radius, elevation, symbol set, springs, easing, voice, recorded exceptions, number and date formats |
| [rules/layout.md](rules/layout.md) | Structure, alignment, grouping by space, density, reflow, and the one primary job per screen | Arranging anything on a screen: structure, alignment, grouping, density, what the primary action is and where it sits, what happens as the display narrows |
| [rules/anti-slop.md](rules/anti-slop.md) | The exception rule, and the master count for everything the declaration fixes, plus emoji, all-caps labels, and glyphs appended to action text | A visual direction has been picked, and again before any flow gets a visual review |
| [rules/states.md](rules/states.md) | The five states, forcing each one, exemptions, the long-content test, session interruptions, reflecting an action before its answer arrives, the response thresholds | A screen loads data, can be empty, can be reached on a new account, can fail, can receive long content, or has to answer a tap before the answer comes back |
| [rules/navigation.md](rules/navigation.md) | Advance against move on, container semantics, one-way doors, blocking back | Adding a screen, modal, sheet, or overlay; deciding back behavior; anything a link can open |
| [rules/motion.md](rules/motion.md) | The frequency gate, purpose, springs against timing, the recorded verification and its frame-rate bar | Adding animation or a gesture, or a transition that feels wrong |
| [rules/copy.md](rules/copy.md) | One label per intent, the string inventory and the lexicon, banned strings, translation | More than one screen carries action labels, or the product will be translated |
| [rules/forms.md](rules/forms.md) | Labels, what a field declares about itself, movement order, when to validate, where errors sit, the raised input method, submitting once | The screen accepts typing: any field, any form, anything validated or submitted |
| [rules/assets.md](rules/assets.md) | The style system for artwork, generated or drawn in code; what it sits on, its edges, and the reject list | Artwork the declared symbol set cannot supply, generated as an image or drawn in code: illustration, spot art, a product depicted on the page |
| [rules/a11y.md](rules/a11y.md) | Accessible names, image descriptions, color as sole carrier, focus in and back, keyboard parity, announcements, hover as a hint | The screen has icon-only controls, images, modals, custom controls, meaning carried by color, or outcomes that arrive after the action — and once more before done, since its two walks close the floor |
| [rules/review.md](rules/review.md) | What better has to mean, naming deficits, gathering against them, and the comparison that ends the work | The task is improving a screen that already exists rather than building one |

## Project tokens

1. Look for a declaration already written into the project. Read it and build against it.
2. With none present, run `init`. The declaration gets derived, shown, and agreed before anything
   is built against it — never written in passing.
3. Later sessions read that file first and amend it. A screen needing a value the file lacks is a
   request to amend the file, answered by the session, not put to the person — rules/tokens.md
   states how.

## Before you call it done

Run the build and look at the screen. Nothing below can be answered by reading the source, and no
screen closes because it looked fine on the way past.

Fix in small passes. At most five repairs between one look and the next — regressions hide inside
batches, and a batch that fixes four things and breaks a fifth reads as progress until somebody
finds the fifth.

- The study record: it exists, and every adopted pattern names the reference it came from.
- Run three inspections in one pass, in this order: rules/tokens.md, which checks that the
  declaration is complete; rules/anti-slop.md, which holds the master count for everything the
  declaration fixes; rules/copy.md, which holds the string inventory. When a count comes back
  wrong, fix it and rerun that count before going on.
- Run the Inspection in rules/layout.md against the rendered screen at its widest and its
  narrowest supported width.
- Capture loading, empty, first run, error, and long content for every screen, forcing each state
  rather than reasoning about it. rules/states.md holds the forcing procedure, the exemption rule,
  and what each capture has to show.
- Walk every back path in the flow, one-way doors included, and record where each one lands.
  rules/navigation.md holds what a landing has to satisfy.
- Record the whole flow in one take and run the Inspection in rules/motion.md against that
  recording. A still frame cannot report how a transition behaved; the recording is the only
  evidence there is.
- Run the Inspection in rules/states.md against the rendered screens, including the four session
  interruptions. Where the declaration names two themes, light and dark resolving from the one
  declaration is the part of it inspected in rules/tokens.md.
- Time a cold start to the first accepted input, and a keystroke to the character appearing. Both
  thresholds live in rules/states.md.
- Where the screen accepts typing, run the Inspection in rules/forms.md with the input method
  actually raised. Nothing in that file can be answered from the source.
- Where the screen carries artwork — generated as an image or drawn in code — run the Inspection
  in rules/assets.md against every asset on it.
- Run the Inspection in rules/a11y.md — the counts, then its two walks: the platform's screen
  reader once through the main flow, and the same flow again with the pointer put away. Neither
  walk can be answered from the source.

Then walk the whole thing as somebody arriving for the first time, three times over.

1. **The happy path.** Do what the product is asking to be done, in the order it asks.
2. **The skeptic path.** Take every way out the product offers: decline each permission, dismiss
   each prompt, step past anything that can be stepped past, and refuse to sign in until something
   forces it. A product that works only for the compliant reader works for a minority of them.
3. **The abuse path.** Bad input, no connection, interrupted mid-flow, every control pressed
   twice, and back pressed from everywhere — above all at the first screen past every one-way
   door, where it has to fail to reopen what came before.

## Numbers

A number written as this skill's default is stated by no guideline document. It is here because
a rule with no number cannot be inspected. A project may state its own value instead, and where
it does, the project's value applies everywhere. Numbers taken from WCAG 2.2, Apple's Human
Interface Guidelines, or Android's accessibility guidance are attributed line by line in NOTICE.
