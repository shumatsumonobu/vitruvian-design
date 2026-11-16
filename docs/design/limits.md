# Limits

What the skill cannot do, or has not been shown to do, as it stands. For whoever decides what to
build or test next. Each line is a present fact; the runs behind the measured ones are in
`live-test/TESTPLAN.md`.

## Not designed

- **The end of `review`.** Each pass of `review` runs only the Inspections the deficits point at,
  and the work ends on the comparison. It has no closing run of every applicable Inspection, as
  `fix` has.
- **A wrong mark.** `inspect` may mark a repair structural that the definition in `SKILL.md` calls
  surface. No count reads the marks against the definition.
- **The drawn width at the widest size.** The count on a wide screen whose drawing spans less than
  half the view reads whatever draws, so a full-width rule, or a header with something at each end,
  brings it to 0 while the content stays a narrow column. Reading the regions the structure names
  would close it, and changes what the runner measures.
- **Candidates read and not taken up.** A count for placeholder text and vague action labels, a
  rule for nested radii, and a specimen page `init` draws beside the declaration.

## Not reachable from a session

- **Counts that need a device.** The platform's own regions, hover after a tap, focus zoom, a
  screen reader's walk, and the frame rate on the slowest supported hardware. Without the device or
  its simulator a run says them as not taken and ends with them open, unless the person takes them
  on a device of their own.
- **The runner's reach.** Web only. It runs on the installed Chrome; its `chrome-headless-shell`
  branch has not been run. Without the GPU the browser holds less memory and can drop frames a
  device would not, so the frame-rate check is read from a run with `--gpu`. With the GPU on, a tab
  can stop answering; the runner opens a new one and goes on.
- **The picture's generation path.** `images/fetch.mjs` has generated only against stubs. Its
  photograph path has run against Wikimedia Commons.
- **Effort from the entry files.** A skill's `effort` frontmatter did nothing where an entry was
  started as a command under `claude -p`; a run takes the session's effort level.

## Shown on one product, one run each

- **The whole sequence** — `init`, `inspect`, `fix` — on a product whose look was not chosen yet,
  and each piece of it: the layout metaphor, the artwork at every checked size, the three
  directions, the reviewer and its one start, the order of repairs, the inventory, `fix`'s closing
  pass, the first item in the first view, the repair list written and deleted, and the gathered
  Inspections.
- **Medium effort against xhigh.** Medium took about three fifths of the time and two fifths of
  the larger model's output, and listed the same repairs to whole screens.
- **Many screens.** The runner reads every rule on one screen at two checked sizes in 1 to 3
  minutes, the browser holding 1.1 to 1.5 GB. No product with many screens has been measured.
- **The helper's saving, apart from the runner's.** The two arrived together; what each saves
  alone has not been measured.

## Known to fail

- **The language of a progress line.** In a long run a few lines that say what the session will do
  next come out in English, whatever the user's language. The cause is not found. The entry files'
  lines on language, Claude Code's `language` setting, and a hook adding a sentence after every
  tool result each left some.
- **The two summaries.** The Owns column of While you build in `SKILL.md` and the table in
  `README.md` summarize the rule files and are not lists of every count; the Open when column and
  the rule files are the source, and a summary can fall behind them.
