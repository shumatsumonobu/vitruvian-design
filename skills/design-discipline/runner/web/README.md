# The web inspection runner

A tested script that takes, on a web product, the counts any web product's screens need from a
rendered page, an interaction, or a recording. A session — or the helper it starts
(rules/review.md, Rebuild in small passes) — writes one configuration file for the product and
runs this script; it does not write a runner of its own. Counts the runner does not take are taken
as the rule files say: from the source, the record, a device, or the session's own look at a
capture.

## Running it

From the product's root, with Node 22 or later and Chrome on the machine:

```
node <skill>/runner/web/run.mjs <label> [--rules=states,copy] [--config=.design/harness/product.mjs] [--gpu]
```

- `<skill>` is the directory of this skill, `design-discipline/` beside the entry commands.
- `<label>` names the run: `2026-11-04-inspect`, `pass3`. Captures go to
  `.design/captures/<label>/`, the results to `.design/harness/out/<label>.txt` and `.json`.
- `--rules=` takes rule file names — tokens, anti-slop, layout, states, navigation, motion, copy,
  forms, assets, a11y — and runs only the steps those files' counts need. With none, all of them.
- The browser is `chrome-headless-shell` where one is installed or named in `CHROME_PATH`, and the
  installed Chrome otherwise, and the `.json` names the one it used; the session does not start a
  browser itself to find or check it. Its profile and temporary files stay under
  `.design/harness/` and are removed when the run ends. `CHROME_FLAGS` adds flags to its command
  line.
- The browser draws without the GPU unless `--gpu` is given. Without it a run holds less memory —
  about 1.1 to 1.5 GB against 1.6 GB, on the scaffolds this runner is tested on — but software
  drawing can drop frames a device would not, so the frame-rate check is read from a run of
  `--rules=motion --gpu`.
- A step that runs past a limit leaves the tab in doubt. Where the tab no longer answers, the
  runner opens a new one and goes on; where no tab answers, every later line is not taken at once,
  naming the step after which the browser stopped.

The script writes nothing outside `.design/` and changes nothing in the product. It serves the
directory the configuration names over a local port, or opens the address it names.

## What it prints

One line per count, in the order of the rule files:

```
states | Controls where a press at the middle of the drawn control lands on something other than the control | 1 | 375x553 populated: button.water-now → div.scrim
copy | Titles, headings, and names whose last line holds one character | 0 |
layout | Distinct left edges within one column | data | 375x553: 20 20 36 ...
motion | Press feedback outside 100 to 150 ms | not taken | step "press .water-now" ran past 15 s (Input.dispatchMouseEvent)
```

- The second column is the count line's own words, as far as its first colon, so the line can be
  found in the rule file.
- A number is the count as the rule file defines it, taken at every checked size and state the
  configuration names.
- `data` marks a measurement the session reads and judges — edges, gaps, the words around a line
  break — where the count needs a meaning the page does not carry.
- `not taken` names the step and the method that ran past its time limit, or the reason the step
  could not run. The session writes it to the record as not taken, with that method named.

The `.json` holds every measurement behind each line. `contact-<w>x<h>.png` in the capture
directory sets every state's capture side by side at a reduced scale, for the session to look at
once instead of opening each capture.

## Time limits

Every step the script waits on has a limit, and a step past it is printed as not taken; the run
goes on to the next step.

| Wait | Limit |
|---|---|
| One message to the browser and its answer | 15 s |
| A page load | 30 s |
| Webfonts settling after a load | 5 s |
| The whole run | 10 min |

The limits are this skill's defaults (NOTICE). A configuration may raise one where its product
needs more, with the reason in a comment beside it.

## What a headless browser does differently

A method that hung or returned nothing is never used here, and is listed so a product flow does not
use it either; so is what a headless browser draws only on a condition.

- A mouse press sent while `Emulation.setEmitTouchEventsForMouse` is on: no answer, in two runs
  (2026-11-04). A press at a phone's size is a plain mouse press with touch emulation on.
- A form's own validation messages are drawn only while the browser emulates focus
  (`Emulation.setFocusEmulationEnabled`); without it their position and persistence read as absent,
  and revalidation after a failed submit reads as not happening. A flow that reads a form turns it
  on.

## The configuration

`.design/harness/product.mjs`, written from the declaration and the structure — each value with a
comment naming the entry it comes from. The example is an invented plant-watering app; every value
in a real configuration comes from the product's own declaration and structure.

```js
export default {
  serve: ".",                      // the directory served as the site's root; or url: "http://localhost:5173/"
  sizes: [                         // .design/structure.md, checked sizes
    { w: 375, h: 553, touch: true },
    { w: 1440, h: 789 },
  ],
  declaration: {                   // .design/declaration.md
    colors: [                      // every declared color with its role: accent, text, surface, grey, flood
      { value: "#2B2A33", role: "text" },
      { value: "#0F7B6C", role: "accent" },
    ],
    otherColors: ["rgba(43,42,51,0.4)"],          // declared values that are not palette entries: a scrim, a shadow's color
    steps: [                       // type scale: size in px, or [wide, narrow] where it changes under a width
      { name: "display", size: [48, 34], weight: 600, letterSpacing: 0, lineHeight: 1.15, display: true },
      { name: "body", size: 17, weight: 400, letterSpacing: 0, lineHeight: 1.5 },
    ],
    families: ["Source Serif 4", "Inter"],
    radii: ["6px", "9999px"],
    shadows: ["rgba(0, 0, 0, 0.12) 0px 2px 8px 0px"],
    spacingUnit: 8,
    lineLengthEm: 34,              // maximum line length
    contentWidth: 720,             // maximum content width, px
    curves: ["cubic-bezier(0.16, 1, 0.3, 1)"],
    tapMinimum: 24,                // rules/states.md, Platform notes
  },
  screens: [
    {
      name: "garden",
      path: "/",
      states: {                    // each state: what the page finds before its own scripts run
        populated: { storage: { "plants": "<json>" } },
        firstrun: { storage: {} },
        empty: { storage: { "plants": "[]" } },
        error: { blockStorage: true },
      },
      long: { storage: { "plants": "<json with many plants and long names>" }, pad: 3 },  // rules/states.md, Long content
      signature: ".watering-calendar",  // the signature entry, where it appears on this screen
      names: [".plant-name"],      // names set from data, read with titles and headings for line breaks
      layers: [                    // what opens over the screen
        { name: "add", open: ".add-plant", close: ".sheet-close", box: "[role=dialog]", dimmed: ".scrim" },
      ],
    },
  ],
  flows: async (r) => {},          // the product's own operations, written with the runner's helpers below
};
```

States are made before the page's own scripts run — storage seeded or blocked, media features
set, the connection cut or slowed — and never by changing the product's code.

The long-content state is read twice: once with the longest real values its storage gives, which
every row reads, and once with each string repeated `pad` times, which only the rows on a layout
breaking read (rules/copy.md, Translation; rules/states.md, Long content). The line-break rows of
rules/copy.md read real values only — a padded string is not a value the product shows.

## Product flows

`flows` receives one object with the runner's helpers. A flow uses them and reports through
`r.count` or `r.data`; it does not talk to the browser by other means.

| Helper | Does |
|---|---|
| `r.load(screen, state, { size, media, pad, big })` | Opens a screen in a state at a size |
| `r.press(selector)`, `r.pressAt(x, y)` | A mouse press at the middle of what the selector finds, or at a point |
| `r.key(name)` | One key: Tab, Enter, Escape, ArrowDown |
| `r.eval(fn, ...args)` | Runs a function in the page and returns its value |
| `r.shot(name, { full })` | A capture into the run's capture directory |
| `r.record(name, async () => { ... })` | A screencast of what the function does, frames into the capture directory |
| `r.wait(ms)` | A wait, for what has no event to wait on |
| `r.rules` | The rule files `--rules=` selected; a flow runs only the steps those files' counts need |
| `r.count(rule, line, value, where)`, `r.data(rule, line, value)` | A result line |

Every helper carries the runner's time limits.

## What it takes

Every row is taken at each checked size, in each state the screen names, and over each layer
open, unless the row says otherwise.

| Rule file | Count line, as far as its first colon | Result |
|---|---|---|
| anti-slop | Accent hues rendered in the UI | number |
| anti-slop | Tinted near-blacks standing in for black | data |
| anti-slop | Typeface families in the flow | number |
| anti-slop | Display sizes rendered on one screen | number |
| anti-slop | Text rendered at a size, weight, letter-spacing, or line-height that matches no declared type-scale step, or without the OpenType features the step declares | number |
| anti-slop | Text blocks whose measured line length runs past the declared cap | number |
| anti-slop | Vertically scrolling surfaces whose content measures wider than the declared maximum content width | number |
| anti-slop | Radius values outside the declared scale | number |
| anti-slop | Shadow values not present in the declared elevation scale | number |
| anti-slop | Spacing values not a multiple of the declared base unit, the allowance for the platform's own regions (rules/layout.md) excepted | number |
| anti-slop | Text set with a glow as its style — light spreading outward from the glyphs, however it is drawn | number |
| anti-slop | Surfaces at the widest checked size where what draws — text, a border, a fill other than the page's own background, an image — spans less than half the view's width, counting none the recorded exceptions name | number, read before any scroll |
| anti-slop | Where the declaration names a signature, checked sizes at which it sits outside what shows before any scroll on every screen its entry names | number |
| layout | Distinct left edges within one column, counting only those with no stated reason | data |
| layout | Groups whose internal gap is equal to or larger than the gap separating them from their neighbors | data |
| layout | Controls styled as primary | number |
| layout | Regions that hide on the narrow display with no stated alternative route to their content | data |
| states | Elements that move because a neighbor changed state — a border thickening, an error line or a help or character-count line appearing, a transient message or an indicator arriving — counting none that moved because the reader opened, expanded, reordered, or filtered something, none moved by content that updates itself arriving, which is content arriving rather than a state change, and not the surface scrolling as a whole to bring a focused field into view, which rules/forms.md owns | number |
| states | Long-content captures — the long string, the unbroken token, the raised text size, the filled collection — showing a clipped control, an overlapped neighbor, or content pushed out of the layout | number |
| states | Text that stays the same size when the platform's text size is raised one step | number |
| states | Tap targets below the platform's stated minimum, measured as the area that answers a press | number |
| states | Controls where a press at the middle of the drawn control lands on something other than the control or what it contains — at every checked size in the screen's resting state, and in each captured state at the sizes it was captured at | number |
| states | Neighboring targets whose areas that answer a press overlap | number |
| states | Text contrast below 4.5 to 1 for body text and 3 to 1 for large text and non-text controls, in every theme the declaration names, and, over a background that moves or changes on its own, at its least favorable moment as Text over what moves reads it | number |
| states | Focus indicators that animate in rather than appearing at once, read on the running screen as focus arrives | number |
| states | Focusable controls with no visible keyboard focus | number |
| states | Elements that clip, overlap, or leave the layout at any checked size (rules/layout.md), the narrowest width and the shortest height among them | number |
| states | Actions that fail with no connection and say nothing | data |
| states | Controls that navigate twice or submit twice on a fast double press, and second presses that land on what the first press put under the pointer or uncovered, every control pressed | number |
| states | Measured cold starts over two seconds, or keystrokes over fifty milliseconds | number, the cold start only: ready for input at the later of DOMContentLoaded and the first paint; the load event as data |
| navigation | Screens where back does nothing while no irreversible request is running and no modal holds unsaved work | number |
| navigation | Modals, sheets, and full screens that back does not close, back leaving the product or the screen beneath instead | number |
| navigation | Screens and layers that navigate, close, or move on without an action of the reader's — a timer the reader started and can see, a timeout the product must enforce that says so before it acts, and a transient message excepted | number, over six seconds idle |
| navigation | Entries written beneath the page the reader arrived on, into a history the product does not own | number |
| motion | Controls that fire on a press with no press answer at all, the environment's default counting as one and a link inside running text excepted | number |
| motion | Press feedback outside 100 to 150 ms, or firing on the release rather than the press-in, the environment's default excepted | number |
| motion | Press answers off the vocabulary — a button or card away from about 0.97, a list row scaling, a bar icon answering with more than opacity, the environment's default excepted | data |
| motion | Entrances that ease in | number |
| motion | Entrances opening from nothing rather than from about 95 percent behind a fade | number |
| motion | Exits declared longer than about seven-tenths of the entrance they reverse | number |
| motion | Controls that are reachable once a transition ends but ignore input while it plays | number |
| motion | Elements that translate, scale, or slide once the reduce-motion preference is turned on | number |
| motion | Content the reader can see moving, blinking, or scrolling on its own for more than five seconds, shown at the same time as other content, with no control on the screen to pause, stop, or hide it — motion that is the whole content, that the reader started, or that indicates a wait the reader is in excepted | number |
| motion | Motion running on a spring or a curve the declaration does not name | number |
| copy | Layouts that break under the longest translation on hand, or under source strings padded by the states.md multiple | number |
| copy | Labels of controls with a shape drawn around them — buttons, tabs, links in a navigation or a menu — set on more than one line at any supported width, under the longest translation on hand or, where none exists, the source label | number |
| copy | Lines opening with a closing bracket, a closing quotation mark, or punctuation that belongs to the line before, under the longest real values at the width of every checked size | number |
| copy | Titles, headings, names, and short text standing on its own — three lines or fewer — whose last line holds one character, punctuation not counted, under the same values | number |
| copy | Titles, headings, and names set over more than one line with a break inside a word — inside a phrase, where the language sets no spaces between words — under the same values | number, a break inside a word; data, the words either side of every other break |
| a11y | Operable controls with no accessible name | number |
| a11y | Controls whose accessible name does not contain their visible label | number |
| a11y | Characters that carry something only to the eye — a separator between items, an ornament, a glyph repeating the word beside it — left in the tree, and separators hidden so that two words run together | number |
| a11y | Modals, sheets, and full-screen takeovers that open without taking focus, let it escape while open, or fail to return it on close | number |
| a11y | Focusable elements reached in an order that differs from the visual order | number |
| a11y | Surfaces on which the reader's own zoom is disabled, or capped short of the 200 percent the accessibility guidelines name — the one line here the source can answer | number |

A word, for the break count, is a segment `Intl.Segmenter` gives at word granularity in the page's
language. The motion rows read the animations the page runs (`document.getAnimations()`) during a
press, a layer opening and closing, and six seconds idle; a recording of the narrowest size is
written when `motion` is selected. The frame-rate check in rules/motion.md is read from the
intervals the runner prints under `data`, at a fourfold CPU slowdown.
