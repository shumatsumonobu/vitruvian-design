# Test plan — the rounds of live tests, each with its copies, plants, and pass lines

The general procedure — what every run is judged on, the run tables, what fires without being a
failure — is in the repo's `CONTRIBUTING.md` under Live test. This file holds what is specific to
each round: the copies, the scripts, the planted defects and decoys with what each count should
return, and the order of the runs. A new round is added at the end.

The rounds up to Round 4 ran in a working directory outside the repo, on copies named after the
scaffold they came from, before the scaffolds moved into `live-test/scaffolds/`. Read the old
names this way: `scaffold-06-baseline` is `full`, `scaffold-07-baseline` is `cover`, the `.design/`
of `scaffold-08` is `cover-declared`'s, and `scaffold-08-baseline` is `cover-glow-border`. The
scripts they name — `judge.sh`, `tools/runstats.mjs`, `tools/verify-plants-NN.mjs` — are now
`node scripts/live-test.mjs judge`, `stats`, and `verify`. scaffold-05 was not kept. The old
checks read the accessibility tree through playwright, the new ones through puppeteer, so a tree
quoted in an old round reads a little differently now: a heading as `- heading: …`, and a node's
text joined without the spaces playwright put between pieces — `ヨガマット、タオル` where an old
round quotes `ヨガマット 、 タオル`. The same nodes and roles appear.

This round compares two skills on one scaffold: the skill as committed at 4139931 (the old skill,
exported to `skills-4139931/`) and the skill after the batch from a product's month of use (the
new skill, synced from the repo). A change is kept only where the new skill finds what it was
written to find and flags no decoy.

## Copies

| Directory | Holds |
|---|---|
| `scaffold-06-baseline/` | The code before any run; `judge.sh` diffs every scaffold-06 copy against it |
| `scaffold-06/` | Discarded: the first `init`, run while the brief still named the author's window. Kept until the author says it may be deleted; nothing is read from it |
| `scaffold-06-init-old/` | The old skill; `init` runs here once, then the state is copied to the two below |
| `scaffold-06-old/` | Copy of `scaffold-06-init-old` after `init`; old skill; `inspect` only — the baseline the new skill is compared against |
| `scaffold-06-new/` | Copy of `scaffold-06-init-old` after `init`; new skill; `inspect`, `fix`, `inspect` |
| `scaffold-06-init-new/` | Copy of `scaffold-06-baseline` with the new skill; `init` only, to read the declaration the new derivation rule gives |
| `scaffold-05-new/` | Copy of `scaffold-05` as the fifth `inspect` left it; new skill; `inspect` once, the regression |
| `skills-4139931/` | The old skill, exported with `git archive` |

Each copy carries `CLAUDE.md` with the line that routes screen work to the skill and names the
language and its polite form, and its skill under `.claude/skills/`. The new-skill copies are
synced with the CONTRIBUTING loop after every edit; the old-skill copies are never synced.

## After every run

```bash
node scripts/live-test.mjs judge <copy>          # code diff against the scaffold, declaration, record
node scripts/live-test.mjs stats <copy> --last   # time, tool calls, questions, language, polite form, tokens per model, closing message
node scripts/live-test.mjs verify <copy>         # whether each planted defect still shows
```

## The brief

`README.md` grants `init`'s agreement in advance (the derived values stand, `.design/` is the
home) and states the scope of change (everything may change), so no run here puts the second or
the third question. It says half the readers are on phones and the rest on laptops, and names no
window size: the checked sizes have to come from the rule, not from the brief. A first version
named the author's window, and the old skill's `init` read it and set 1536×730 for its study on
its own — which would have hidden the difference these runs exist to measure. That `init` was
stopped and its output discarded on 2026-10-26.

## Planted defects, and what each count should return on the unrepaired code

Measured by `tools/verify-plants-06.mjs` against `scaffold-06-baseline` on 2026-10-26, one run,
Chromium headless.

| Planted | Measured | Count that should return it (new skill) |
|---|---|---|
| A transparent box pinned to the hero's foot, above the start button: 160 px tall, growing to 60 vh where the window is wider than 9 to 5 (601 px and up) or than 23 to 40 (600 px and under) | Pressed at the button's middle after scrolling it into view. Covered at 1920×969, 1536×790, 1536×730, 1366×657, 390×664, 375×553, 320×460 — windows whose height the browser's bars or the system's scaling cut. Clear at 1920×1080, 1536×864, 1440×900, 1366×768, 1280×800, 1280×720, 390×844, 375×667, 360×800, 320×720, 320×568 — full displays and the scripted default | rules/states.md, what a press lands on: 1 — found only at a checked size with the height a reader is left |
| The skip opens 10 s after a pose starts by the wall clock; pause stops the countdown, not the gate | Paused at 2 s, 9 s later the skip is open with 28 s remaining | rules/states.md, time that runs while nothing does: 1 |
| A bright blob sweeps behind the white pose name on an 8 s loop, starting off-screen | First frame 3.00 to 6.48, worst of 16 frames 1.04, at every size measured | rules/states.md, contrast over a background that moves: 1 (large text, floor 3) |
| Menu card names in English with brackets, `overflow-wrap: anywhere`, cards 9 rem wide | `Neck / Roll(Gentle / )` at 1920 and 1536 | rules/copy.md, lines opening with a closing mark: 1 |
| Japanese heading of 19 characters | `からだをのばして、 / きょうをはじめるあ / さ` at 390 wide | rules/copy.md, last line of one character: 1 |
| Separators `・` between the areas to loosen, exposed to the tree | `ほぐす所 肩・首・背中・腰` in the tree | rules/a11y.md, characters read aloud that carry nothing: 3 |
| The log line built from seven text nodes | One paragraph in Chromium's tree; seven nodes in the DOM | rules/a11y.md, a phrase read as more than one stop: 1, or not taken with no screen reader that splits it |
| The full-screen guide opens with no history entry | Back from the guide leaves the page | rules/navigation.md, containers back does not close: 1 |
| The result layer leaves after 3 s by itself | — | rules/navigation.md, layers that close with no action of the reader's: 1 |
| Pause and skip 40 px tall, 6 px apart, each with a pseudo-element reaching 6 px past it | The gap and 1 px right of pause both land on skip | rules/states.md, neighboring targets whose areas overlap: 1 |
| The confirm dialog for clearing the log (unplanned: found by the pre-run walk) | Back while it is open leaves the page (measured once, 390×844). The clear button shows only once a log exists, so a run meets the dialog only after finishing a session or writing the log itself | rules/navigation.md, containers back does not close: counted with the guide, 2 in all where the run reached it; its equal-size buttons stay a decoy |
| No checked sizes written anywhere | — | rules/layout.md, structures with no checked sizes: 1; the set the run used is in the record, with a phone height with the bars showing and a laptop window the system's scaling leaves |

## Decoys — any of these on the repair list is a false positive

| Decoy | Why it is not a defect |
|---|---|
| The countdown the reader started reaches 0 and moves to the next pose | A timer the reader started and can see |
| The help sheet pushes one history entry as it opens and closes on back | An entry above the page, put there by the reader's own move |
| `ヨガマット・タオル` with the `・` hidden from the tree and a visually hidden `、` in its place | The separator is hidden and the listener still hears a pause |
| The confirm dialog's cancel and delete, the same size, outline and fill | A pair presented as equals; the size-difference rule was not taken up |
| `きょうの記録を保存しました` and `記録を消しました`, transient messages with no undo, leaving after 3 s | A message that leaves on its own is rules/motion.md's; nothing to undo is offered |

Noise that is neither: the old skill and the new one may both list token, copy, or state repairs
the scaffold carries without meaning to. Those are compared between the two lists, not scored.

## Before any run

- Every run uses the same model and effort — the setting the first run used, Opus 5.5 at xhigh.
  A run on another setting is not compared.
- Read the brief against every planted defect: nothing in it may tell a session the size, the
  state, or the walk a count needs, since that is what the new rules are tested for. Kept on
  purpose: the brief states the skip gate and the pause, because the product's rule cannot be
  known otherwise; the old skill may find the gate by care alone, and the comparison says so.
- Expected of the old skill and not a decoy failure: its navigation count "entries written into
  a history the product does not own" may list the help sheet's entry, since the old wording
  forbade every entry. The new wording is what the decoy tests.

## The runs, in order

1. `scaffold-06-init-old`, old skill: `/design-discipline-init`. Then the judge copies the whole directory
   to `scaffold-06-old` and `scaffold-06-new`, and syncs the new skill into `scaffold-06-new`.
2. `scaffold-06-old`: `/design-discipline-inspect` — the baseline.
3. `scaffold-06-new`: `/design-discipline-inspect`, then `/design-discipline-fix`, then
   `/design-discipline-inspect`.
4. `scaffold-05-new`: `/design-discipline-inspect` — every repair the fifth `inspect` listed
   (14) is still listed or recorded as closed with its reason, and every repair that is new is
   correct.
5. `scaffold-06-init-new`: `/design-discipline-init` — the smallest text step and the dimmest
   text color the declaration names, against the ones `scaffold-06` got.

## The numbers compared, old against new

| Number | Read from |
|---|---|
| Planted defects on the repair list | The record, against the table above |
| Decoys on the repair list | The record, against the decoys |
| Counts not taken | The record |
| Minutes and tool calls | `runstats.mjs` |
| Closing message: characters, and whether it has every part SKILL.md names, in order | `runstats.mjs --last` |
| Messages in English; Japanese sentences ending in the polite form | `runstats.mjs` |

## Inputs the person types

None beyond the commands: the brief answers the second and third questions in advance. Where the
new closing message offers steps on the person's own device, the author may take them and report
the result in the same session; the record should then show the count as taken by the person.

## Round 2 — two small runs for the six open issues (2026-10-27)

The scaffold-06 runs were too long to settle one rule each. These two copies each take one entry
and carry only what the six open issues need. Both use the new skill as it stands after the
2026-10-27 repairs.

| Directory | Holds | Run |
|---|---|---|
| `scaffold-06-reinit/` | `scaffold-06-init-old` with the declaration removed and the record cut to the study (references, conventions, choices); the brief of scaffold-06; the code is the cover screen alone, in the template's own values (not the old declaration's, which init would otherwise read beside its derivation) | `/design-discipline-init` |
| `scaffold-07/` | The cover screen of あさのび alone (no guide, no canvas, no dialog), Japanese pose names, its styles already at the old init's declaration — colors, type steps, radius, spacing, overlay — except the webfont, which is named and not loaded; `.design/` holds that declaration, the record's agreement and study, a structure with the checked sizes, a lexicon, and a repair list of one: load the webfont | `/design-discipline-fix` — one repair, then every applicable Inspection; what that finds new is the measure |
| `scaffold-07-baseline/` | The code of `scaffold-07` before any run; `judge.sh scaffold-07` diffs against it | — |

Measured by `tools/verify-plants-07.mjs` against `scaffold-07-baseline`, one run each:
the second fast press on 使い方 lands on the sheet's dimmed surface and closes the sheet at
1536×700 and 360×560; reload with the sheet open, then back once: same page, nothing happens;
the tree reads `ほぐす所 肩・首・背中・腰` (three separators exposed), `道具 ヨガマット 、 タオル`
(hidden, with a pause), and the footer sentence with its dash; the log line is seven text nodes;
no webfont is loaded though the declaration names M PLUS Rounded 1c.

| Open issue | Run | Passes when |
|---|---|---|
| `fix` speaking English | scaffold-07 fix | Every line to the person is Japanese in its polite form, and the first comes before the first change to any file |
| The small-and-dim derivation | reinit init | The declaration's smallest step for text the reader must read, and its dimmest text color, each name the reading distance and what the text carries; set beside the old init's declaration from the same study |
| The opening fixed text | reinit init | Said first, though the brief answers the second question in advance |
| Over-counting marks | scaffold-07 fix | The three exposed `・` counted; the hidden one and the footer's dash not counted |
| Double press and reload-back | scaffold-07 fix | Both found by the closing run of every Inspection and written for the next `inspect` |
| A defect the run's own change caused | scaffold-07 fix | If loading the webfont delays the first paint, the run repairs it or undoes the load before it ends; the record ties it to the change |

Decided before the runs: if the fix speaks Japanese throughout, that settles it for a short run,
and the long-run case is watched in the products' own runs — no third run here. If it speaks
English, the two repairs did not work, and the next step is the author's call.

## Round 3 — glowing type and a border on text that is only read (2026-11-02)

One small run for the two anti-slop lines a product's handover proposed: the reach-for list
names glowing type and a border around text that is only read, and a count reads text set with a
glow as its style.

| Directory | Holds | Run |
|---|---|---|
| `scaffold-08-baseline/` | The code of `scaffold-07-baseline` with two plants: a glow (no offset, a blur) on the cover title `.hero-title`, through a custom property `--title-glow`; a border with pill corners on each pose's seconds `.pose-time` | — |
| `scaffold-08/` | The baseline, plus `.design/`: the declaration of the scaffold-07 runs (restored from the session's printout, cut lines ended at their last full clause; recorded exceptions: none), a record with the agreement and the study, a structure with the checked sizes 1536×700 and 360×560, a lexicon; the new skill under `.claude/skills/` | `/design-discipline-inspect` |

The scaffold-07 plants are still in the code — the second fast press on 使い方, reload-back, the
exposed separators, the log line in pieces, the webfont not loaded. `inspect` finding them is
expected and not judged here.

Measured by `tools/verify-plants-08.mjs`, once, at 1536×700 and 360×560, on both directories: the
title is the one element with a glowing text shadow; all five seconds carry a border, none is
pressable; 使い方 and 閉じる are buttons with a border; the focus ring rule is in place. A capture at
360×560 shows the glow around the title and the seconds wearing the face of the 使い方 button.
The brief says nothing about light or borders.

Model and effort: Opus 5.5 at xhigh, as every run here.

| Passes when | Read from |
|---|---|
| The count "Text set with a glow as its style" returns 1, naming the cover title | The record |
| The seconds' border is on the repair list, from the decorative-element check or the reach-for list | The record and the closing message |
| Neither 使い方 nor 閉じる is on the list for its border, and the focus ring is not counted as a glow | The record |
| Every line to the person is Japanese in its polite form, the first before any file is written | `node tools/runstats.mjs scaffold-08 --last` |

Expected and not a failure: the glow also on the count "Shadow values not present in the declared
elevation scale" — that count asks whether the value drifted from the declaration, the new one
whether anyone chose a glow. The pill corners on the seconds may also be counted against the
declaration's radius sentence.

Decided before the run: if the count returns 1 and no decoy is flagged, the two lines stand. A
miss or a decoy flagged is repaired in the rule's wording, and the run is asked for again only if
the repair changes what the run reads.

## Round 4 — the look's additions and the helper (2026-11-04)

One run for the additions that let a product be bold on purpose — the visual concept and the
signature as declaration entries, a field color, the display step's jump, a reference from
outside the product's field — and for the helper that writes decided code on a smaller model.

| Directory | Holds | Run |
|---|---|---|
| `scaffold-09/` | `scaffold-07-baseline`'s code, no `.design/`, the new skill under `.claude/skills/` | `/design-discipline-init`, then `/design-discipline-fix` in the same session — the command `init` named as next, the one a product owner would run |

The brief grants init's agreement and states that everything may change, so neither run asks a
question. It says nothing about a concept, a signature, a field, or the size of the title: those
must come from the rules. The old skill's cover is `scaffold-07-baseline` as it stands — the old
init's declaration, built — captured once at 360 and 1536 wide as `compare-old-360.png` and
`compare-old-1536.png`.

Model and effort: Opus 5.5 at xhigh, as every run here.

| Passes when | Read from |
|---|---|
| The declaration holds a visual concept naming a world outside stretching apps and what showed it, and a signature with what it carries and where it appears | `.design/declaration.md` |
| The record's references include at least one from outside the field, named as such | `.design/record.md` |
| The display step states its multiple of the body step and a reason | `.design/declaration.md` |
| `fix` brings the cover to the declaration, the signature on it as the entry says | the record, and a capture of the new cover beside the old |
| No floor count lost: contrast, what a press lands on, the overlap of press areas | the record |
| A pass written by a helper, if one was used, is named in the record and was read back before its counts ran; per-model tokens from `runstats` | the record, `node scripts/live-test.mjs stats scaffold-09 --last` |
| Every line to the person is Japanese in its polite form, the first before the first tool call of any kind (the entry files' wording since the `init` below) | `runstats` |

The author judges one thing only: whether the new cover catches the eye, set beside the old.

Read after `init` (23 minutes, 50 tool calls): the visual concept is a Showa-era radio-exercise
attendance card — indigo print on white card, a vermilion stamp — shown by two references from
outside the field, a postal museum's collection page and a card printer's history page, both
named as outside the field in the record; the signature is this week's card, seven squares with a
stamp on each day done, in the place of the cover's log; the display step is 2.5 times the body
step, with a reason. Two old entry-file rules failed: a study script was written ten minutes
before the first line to the person, and one line was English, a note the session wrote to
itself. Both entry lines were rewritten — the first line now comes before the first tool call of
any kind, and every line written counts as read by the person — and synced before `fix`.

Read after `fix` (95 minutes, 116 tool calls, no question, no helper started): the cover brought to
the declaration — indigo and vermilion on white, BIZ UDPGothic, the menu as rows of a name and
right-aligned seconds, and the log replaced by this week's card with a vermilion 済 on each day
done, at the place the signature entry names. The record's last run of every Inspection holds
contrast shortfalls 0, presses landing elsewhere 0, and overlapping press areas 0. `verify` on the
result, once: the second fast press on 使い方 leaves the sheet open at both sizes, and back after a
reload with the sheet open closes it. Every line is Japanese and polite, 94 of 94, the first
before any tool call; `stats` had counted six as not polite, each a polite verb followed by a
parenthesis, and was repaired. The author, shown the old and the new cover side by side at 360
and 1536 wide with three days stamped, judged the new one clearly better.

What the run showed, repaired together before Round 5:

- No helper was started; the rule said one may write. 108k of the run's 249k output tokens went
  to an 880-line inspection script in its first 18 minutes, and 10 more minutes to mending it.
- The script took one argument, a label, so every recount after a pass ran every rule file's
  counts — eight runs of 2.5 to 3 minutes — where the `fix` row reruns only the failed counts and
  the counts on what the pass changed. No count read it.
- The cover title breaks inside a word at 600 wide and above — 「きょうをはじ / める」. The run
  found it and wrote it for the next `inspect`; no count reads it.
- The signature sits below what shows before any scroll at every checked size: the card's top at
  1104 with a view 548 tall at 360, at 1094 with a view 900 tall at 1920.
- `verify-cover.mjs` read only the address after back, and stopped where the rebuilt log has no
  `#log-line`.

Considered and left: the display step is 2.5 times the body step (40 px), smaller than the old
cover's 44 px; the declaration states the multiple and its reason, the code matches it, and a floor
on the jump would be a number with no source that a long title at 360 wide could not meet.

## Round 5 — the Round 4 repairs, on the fixed cover (2026-11-04)

One workspace and two entries for the four repairs Round 4's `fix` showed: a helper writes every
script under `.design/harness/`; an inspection script runs one rule file's counts without the
others, and a pass reruns only what the `fix` row names; a title, a heading, or a name breaks
between words, between phrases where the language sets no spaces; the signature sits in what
shows before any scroll at every checked size.

| Workspace | Scaffold | Run |
|---|---|---|
| `round-5` | `cover-stamped`: Round 4's scaffold-09 as `fix` left it — code, brief, `.design/` without the captures, the inspection script included | `/design-discipline-inspect`; then, in a new session, `/design-discipline-fix` |

Two sessions, so `stats` reads each entry's minutes and tokens on its own, and `fix` works the list
`inspect` returns, as the command `fix` named last would have a product owner do. The scaffold's
record has one line fewer than the run left: the title break it found, cut so that `inspect` meets
the break through the new count rather than the record.

Measured by `verify` on the scaffold, once, with three days stamped:

| Planted | Measured | Count that should return it |
|---|---|---|
| The cover title | 「からだをのばして、きょうをはじ / める」 at 1920×900 and 1536×900, 「…きょうをは / じめる」 at 600×800; no break inside a phrase at 360×548 | rules/copy.md, titles, headings, and names with a break inside a word or phrase: 1, at 1920×900 |
| The signature card | top 1104 at 360×548, 1094 at 1920×900 | rules/anti-slop.md, checked sizes at which the signature sits outside what shows before any scroll: 2 |
| `.design/harness/inspect.mjs` | reads one argument, a label, and runs every count each time | rules/review.md, inspection scripts that cannot run one rule file's counts without the others: 1 |

| Decoy | Why it is not a defect |
|---|---|
| The lead paragraph breaks inside a word — 「1つず / つ」 at 360, 「案内しま / す。」 at 1920 | Body text; the count reads titles, headings, and names |

Expected on `inspect`'s list and not judged: the two findings the record left for the next
`inspect` — the second fast press on 閉じる, and the 2.98:1 rule between empty squares.

Model and effort: Opus 5.5 at xhigh, as every run here.

| Passes when | Read from |
|---|---|
| `inspect` lists the title break and the signature outside what shows before any scroll at both checked sizes, and does not list the lead paragraph's breaks | `inspect`'s section of the record |
| The inspection script is changed so one rule file's counts run alone, by a helper the record names, read back before any count ran on it | the record, the script, `stats` (a Sonnet subagent) |
| `fix` repairs both: `verify` shows the title breaking between phrases at every size it reads and the card inside what shows before any scroll at both checked sizes | `verify`, the record |
| Each `fix` pass reruns only the rule files its repairs and the elements it changed point at, or names the change that reached them all; the run after the last pass runs every one | `fix`'s section of the record |
| Scripts under `.design/harness/` the session wrote or changed itself where a helper could start: 0 | the record, `stats` |
| No floor count lost; every line Japanese and polite, the first before the first tool call | the record, `stats` |
| `fix`'s minutes and Opus output tokens, beside Round 4's 95 minutes and 249k | `stats` |

The author judges the cover again, beside Round 4's.

Decided before the run: if a helper writes the scripts and `fix`'s minutes or Opus tokens fall,
the helper and the split stand. If a helper writes and neither falls, the numbers go to the author
with the choice of keeping or removing the helper rule.

Read after the first `inspect`, stopped (2026-11-04): a helper on Sonnet rewrote the inspection
script in 7 minutes so each rule file runs alone, and the session read it back before running it.
The script then waited, with no time limit, on a press sent with touch emitted for the mouse — a
method the session's brief to the helper named, and the one Round 4's `fix` had found hanging
without its record naming it. Claude Code stopped the script about half an hour later for low
memory; the session said the script was not the cause and asked for a rerun. Run again on a copy
with the memory sampled every few seconds, the script's Chrome and node peaked at 1.56 GB and
held near 950 MB while waiting at the same step; a minimal check had the touch-emitting press
return nothing in 15 seconds and a plain mouse press answer. Repaired before the run went on: a
time limit on every step a script waits on, a hung method named in the record and handed to the
helper, the helper running a script once before it returns, a count for all three, and the
headless-Chrome press in `rules/review.md`'s Platform notes. The session was told the cause and
asked to read `SKILL.md`'s What this skill writes and `rules/review.md` again before rerunning;
the inspect's numbers are read with that told.

## Round 5, again — with the runner (2026-11-04)

The first Round 5 `inspect` stopped, and the author asked for a design that runs lighter and faster
at the same quality. The skill now carries the web runner (`runner/web/`), and a run writes its
configuration instead of a script. Round 5 is run again on a fresh copy; the first copy,
`round-5`, is left as it stopped and is read no further.

| Workspace | Scaffold | Run |
|---|---|---|
| `round-5b` | `cover-stamped`, its `.design/harness/inspect.mjs` from Round 4 included | `/design-discipline-inspect`; then, in a new session, `/design-discipline-fix` |

Measured before the run, by `node scripts/live-test/test-runner.mjs --only=cover-stamped` with the
runner on the scaffold (configuration `scripts/live-test/runner-configs/cover-stamped.mjs`, which
the run does not see), GPU off: copy's break inside a word 1, at 1920×900 in the title; anti-slop's
signature outside what shows before any scroll 2; the lead paragraph's breaks not counted; 1 min
36 s. `verify` on the workspace shows the same plants as the first Round 5.

| Passes when | Read from |
|---|---|
| `inspect` lists the title break and the signature outside what shows before any scroll at both checked sizes, and does not list the lead paragraph's breaks | `inspect`'s section of the record |
| A helper writes `.design/harness/product.mjs` for the runner, and no runner of its own; the record names it; the Round 4 `inspect.mjs` is removed, or the record says why it stays and it takes no count the runner takes | the record, `.design/harness/`, `stats` (a Sonnet subagent) |
| `fix` repairs both: `verify` shows the title breaking between phrases at every size it reads, and the card inside what shows before any scroll at both checked sizes | `verify`, the record |
| Each `fix` pass runs the runner with `--rules=` for the rule files its repairs and the elements it changed point at, or names the change that reached them all | `fix`'s section of the record |
| No floor count lost; every line Japanese and polite, the first before the first tool call | the record, `stats` |
| `inspect` and `fix` minutes and Opus output tokens, beside Round 4's `fix` (95 minutes, 249k) | `stats` |

The author judges the cover again, beside Round 4's.

Read after Round 5, again (inspect 16 minutes, fix 39 minutes): every line above passed. `inspect`
listed the title's break inside a word and the signature outside what shows before any scroll at
both checked sizes, and not the lead's breaks; a helper on Sonnet wrote `.design/harness/product.mjs`
for the runner, and the Round 4 `inspect.mjs` was listed as a second script taking the runner's
counts and removed by `fix`. `fix` moved this week's card above the menu — inside what shows before
any scroll at 360×548 and 1920×900, `verify` once — and the title now breaks 「からだをのばして、 /
きょうをはじめる」 at every size `verify` reads. Its passes ran the runner on the rule files their
repairs pointed at, five of ten and then four, and every rule file after the last. Every line
Japanese and polite, 41 of 41 and 61 of 61, the first before any tool call. Opus output 29k and 50k,
Sonnet 14k and 35k: 55 minutes and 79k of the larger model's output, against Round 4's `fix`, which
read the screen first, at 95 minutes and 249k. The author judged the cover clearly better than
Round 4's, and asked that a wide screen be used in full.

What the run and a look at its screens showed, repaired together before Round 6: the width past one
column at a wide display left empty, with no rule asking what it carries; the signature quiet, its
squares filling part of the card at the wide size; the visual concept reaching the screen as two
colors only; the lead ending on 「す。」, which the one-character count did not read; the runner
counting its own blank loads as history the page wrote, and reading the load event as the point a
page accepts input; a helper writing a copy outside `.design/`; the `inspect` session starting the
browser itself to check its version. The web's measuring steps the runner owns were cut from the
rule files' Platform notes.

## Round 6 — the wide screen, the signature, the concept on the screen (2026-11-05)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-6` | `cover-card`: Round 5's `round-5b` as `fix` left it — code, brief, `.design/` without the captures, the runner configuration the helper wrote included | `/design-discipline-inspect`; then, in a new session, `/design-discipline-fix` |

Before the run, the screens of Round 5's result were looked at at both checked sizes and in every
state the record lists, against the author's ask; what they showed is the list above. The brief
and the record were read for the four plants below; neither names them.

Measured by `node scripts/live-test/verify-cover-card.mjs` on the scaffold, once, with three days
stamped:

| Planted | Measured | What should return it |
|---|---|---|
| A 640 px column in the middle of a wide display | 1280 px of 1920 empty beside it (67%), 896 of 1536 (58%), 726 of 1366 (53%); none at 360 | rules/layout.md, surfaces whose structure does not say what the width past one column carries: 1; the reach-for list in rules/anti-slop.md |
| The signature's squares filling part of their card | 336 px of a 592 px card (57%) at 1920, 1536, and 1366; 278 of 312 (89%) at 360 | rules/anti-slop.md, the check The signature, at the wide size |
| The visual concept carried in two colors | — (read by the check) | rules/anti-slop.md, the check The visual concept on the screen |
| The lead's last line 「す。」 | at 360, 1920, 1536, and 1366 | rules/copy.md, titles, headings, names, and short text whose last line holds one character: 1 (the runner) |

| Decoy | Why it is not a defect |
|---|---|
| The unreadable-record message at 360, five lines ending 「付けられます。」 | More than three lines: not short text |
| The title, two lines broken at the comma | A break between phrases |

Model and effort: Opus 5.5 at xhigh, as every run here.

| Passes when | Read from |
|---|---|
| `inspect` lists the wide display's empty width, the signature's partial fill at the wide size, the concept carried in color alone, and the lead's 「す。」, and not the decoys | `inspect`'s section of the record |
| `fix` gives the width past one column to something the structure names, or writes why the column stays; the squares fill their card at every size `verify` reads; the record names what on the screen comes from the concept beyond its colors; the lead no longer ends on one character | `verify`, `.design/structure.md`, the record |
| No floor count lost; every line Japanese and polite, the first before the first tool call | the record, `stats` |
| `inspect` and `fix` minutes and Opus output tokens, beside Round 5's (16 and 39 minutes; 29k and 50k) | `stats` |

The author judges the cover at 1536 and 360 wide, beside Round 5's.

Read after Round 6 (`inspect` 30 minutes, `fix` about 22 minutes of work; Opus output 112k and 52k,
Sonnet 22k and 6k): `inspect` listed the signature's partial fill at the wide size, the lead's
「す。」, and the empty width beside the column, and not the decoys; it did not list the visual
concept as carried in color alone, naming the ruled squares, the stamp, the spaced headings, and
the flat paper — the plant was the judge's misreading. `fix` widened the squares to fill their
card at the wide sizes (558 of 592 px, `verify` once) and grew the stamps to 48 px; the lead now
reads 「在宅の朝に、10分。/ ストレッチを案内します。」. The column stayed at 640 px on 1920 (1280 px
empty), its reason written in the structure as the declared maximum content width. Two progress
lines came out in English. The session scheduled two wake-ups as a fallback while a helper and a
measurement ran; they fired after the run had ended and did nothing.

Repaired after, with no further run: bare sides counted by the width what draws spans, lifted only by
a recorded exception; the runner's socket wait given a limit; a product's flows given the selected
rules; the platform note on why a skill's own `model` setting is not the way to split the work. The
batch ends here; the wide-display rule's final form is listed in `DESIGN.md` as not yet run.

## Round 7 — the reviewer, an exception's reason, the order of repairs, the inventory, the wide screen (2026-11-06)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-7` | `cover-wide`: Round 6's `round-6` as `fix` left it — code, brief, `.design/` without the captures, the three scripts under `.design/harness/` — with two plants | `node scripts/live-test.mjs run round-7 design-discipline-inspect`; then `node scripts/live-test.mjs run round-7 design-discipline-fix` — each through `claude -p`, nobody at the keyboard |

The brief and the record were read for the plants; neither names them. The record lists the
middle-dot exception, the decoy.

Measured by this skill's runner on a copy of the scaffold (`round-7-measure`), once:

| Planted | Measured | What should return it |
|---|---|---|
| A recorded exception: the widest size's bare sides, its reason only that the declared maximum content width is 40rem | — (read from the declaration) | rules/anti-slop.md, recorded exceptions whose reason names nothing in the product: 1 |
| The 640 px column on a 1920 display, the structure giving the maximum content width as its reason | what draws spans 592 of 1920 px before any scroll, in the populated, first-run, and empty states | rules/anti-slop.md, surfaces at the widest checked size where what draws spans less than half the view: 1, the exception above lifting nothing; rules/layout.md, surfaces whose structure does not say what the width past one column carries: 1 |
| A notice「メニューに移動しました」after はじめる, gone after 2.5 s, while the screen scrolls to the menu and focuses its heading | — (read from `app.js`) | rules/states.md, transient messages that announce only a result the screen already shows: 1 |

| Decoy | Why it is not a defect |
|---|---|
| The middle-dot exception | Its reason names the product's two rows, ほぐす所 and 道具 |
| Labels at 15 px with 0.04em, on a body set at 0.04em | Spaced as the body text is: label styles 0 on the runner |

On the same copy the runner read 0 for the two table counts and for elements invisible until the
product's code shows them. Model and effort: Opus 5.5 at xhigh, as every run here.

| Passes when | Read from |
|---|---|
| `inspect` lists the bare sides at 1920 as a repair, among the whole-screen repairs at the head of the list, and does not take the recorded exception as lifting them; counts the exception's reason, and not the middle dot's; lists the notice | `inspect`'s section of the record |
| `inspect`'s record holds the reviewer's brief as sent — the captures, what the visual concept and signature name, the check lines, the order paragraph, and nothing else — with its first word, its findings, its answer on the concept, and the session's decision on each finding | the record |
| `fix` takes the inventory before its first pass and after its last; nothing is missing that no repair names | the record, `.design/harness/out/*.inventory.json` |
| `fix` takes the bare-sides repair before any repair to one element, gives the width past one column at 1920 to something the structure names — the runner's sides count 0 — and removes the notice or makes it carry what the screen cannot show; its closing run starts a reviewer | the runner on the result, the record |
| A compaction, if one happens, named in the record with what was read again; if none happens, the line reads not exercised | the record, `stats` |
| Every line Japanese and polite; `inspect` and `fix` minutes and Opus and Sonnet output tokens, beside Round 6's (30 and about 22 minutes; 112k and 52k) | `stats` |

The author judges the cover at 1920 and 360 wide, beside Round 6's.

Read after Round 7 (`inspect` 31 minutes, `fix` 89 minutes, both through `claude -p`; Opus output
120k and 325k, Sonnet 2k; no compaction in either): every line above passed. `inspect` put the bare
sides first among the repairs, counted the exception's reason and not the middle dot's, listed the
notice, and kept the reviewer's brief, first word, eight findings, and a decision on each; it also
found that Round 6's `fix` had taken one-element repairs first and kept no inventory. `fix` took the
bare sides alone in its first pass, set the cover in two columns from 1080 px (what draws at 1920:
about 1250 of 1920 px), removed the notice, took the inventory before and after with nothing
missing, and started a reviewer in its closing run. What the run showed, repaired together before
Round 8: `fix` started three reviewers, one per closing run, the later two raising findings the first
had dismissed — about two thirds of `fix`'s output; the reviewer was handed recording frames and
tall full pages, and cut crops into the system's temporary directory to read them; the session
dismissed a reviewer's finding with a value no capture shows (a letter-spacing); eighteen progress
lines came out in English, the first right after the session wrote English comments into
`styles.css`; and the result was tidy and ordinary — a grey ground, one red button, a white card,
rows between rules, the visual concept visible on one card only. The author judged it so, and the
research behind the repair is in `DECISIONS.md`, 2026-11-06.

## Round 8 — the layout metaphor, the artwork, three directions, one reviewer (2026-11-06)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-8` | `cover-columns`: Round 7's `round-7` as `fix` left it — code, brief, `.design/` without the captures | `node scripts/live-test.mjs run round-8 design-discipline-init`; then `design-discipline-inspect`; then `design-discipline-fix` — each through `claude -p` |

The scaffold's record had six absolute paths of the lab workspace, written by the run into the
reviewer's brief, and one line naming other applications' temporary files; on 2026-11-06 the paths
were made relative to the workspace and the names removed, and the record diffed against its copy
before the change. No defect is planted: the run measures what the new entries make of a cover
whose declaration predates them. No image key is in the environment, so `init` and `fix` take the
photograph path. Model and effort: Opus 5.5 at xhigh, as every run here; the reviewer at medium,
as `rules/review.md` now says.

| Passes when | Read from |
|---|---|
| `init` writes the screen got without trying, three directions of two lines each, the one taken and why, and the layout metaphor, the artwork, and every entry the direction changed, and asks nothing | the record, the declaration, `stats` |
| The display step at the widest size is three times the body step or more; a flood is declared, or the reason none is | the declaration |
| `fix` brings a picture by the skill's image tool, credited on the screen, and the first view at 1920 and 360 takes its regions from the layout metaphor | the record, the code, the captures |
| One reviewer in `inspect` and one in `fix`; no dismissal that points at nothing a capture shows; the reviewer's answer to the poster check is not that the first view could be another product's | the record, `stats` |
| No line in English; the Opus output of `inspect` and `fix` below Round 7's 120k and 325k | `stats` |

The author judges the cover at 1920 and 360 wide, beside Round 7's.

The first `fix` stopped itself 20 minutes in, in its second pass, with the C drive at 0 bytes free:
a Python prompt another project's session had left running wrote 44 GB of errors into a background
task's output in the system's temporary directory. On 2026-11-08 the workspace was put back to where
`inspect` left it — the run's Edit calls undone from its transcript in reverse order (the declaration
then equal, character for character, to the scaffold's with `init`'s edits applied), the files it
rewrote whole taken from the scaffold, the picture, captures, and output it created removed — and
`fix` was run again from the start. `scripts/live-test.mjs run` now keeps a run's temporary files in
the lab and stops a run short of a full drive.

Read after Round 8 (`init` 14 minutes, `inspect` 28, `fix` 53, each through `claude -p`; Opus output
80k, 105k, and 179k; Sonnet 7k in `inspect` and 9k in `fix`; no question, no line in English, no
compaction): `init` wrote the screen got without trying, three directions, the one taken, the layout
metaphor (one entry card printed across the whole screen, its fields ruled in indigo), the artwork
(a public-domain 1930s photograph of radio calisthenics, as an indigo halftone), a flood, and a
display step three times the body. `inspect` and `fix` each started one reviewer, Opus at medium —
`inspect`'s in the foreground, as the `rules/review.md` it read still said (the background came in
after it ran); the two findings `fix`
dismissed each point at a capture. `fix` took the photograph through the skill's image tool and
credited it on the screen; at 1920 the cover is the ruled card across the whole width with a fold
and the photograph at the top right. Two lines fail. At 360 the photograph is below the first view:
the artwork entry `init` wrote puts it there so that the signature fits, and the artwork check sends
that to the repair list, so `fix` left it for the next `inspect`. And the reviewer's poster answer
at 360 was that only the signature sets the first view apart. The image tool wrote the author's name
twice into the credit (Commons repeats it in a hidden element); the screen was right, since the
session wrote its own credit, and the tool was repaired with a test the same day.
What the run showed, repaired together before Round 9: an artwork entry could put the picture below
the first view, which its own inspection then fails, and the display step stopped growing at 600 px,
so the 1920 cover carried a 48 px headline. Both are in `DECISIONS.md`, 2026-11-08. The cover at 1920
and 360 beside Round 7's was put in front of the author on 2026-11-08.

## Round 9 — the whole sequence on a product whose look is not chosen yet (2026-11-08)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-9` | `mizuyari`: a watering log for house plants, its one list screen in the look a product gets without trying, a brief that answers every question in advance, no `.design/` | `node scripts/live-test.mjs run round-9 design-discipline-init`; then `design-discipline-inspect`; then `design-discipline-fix` — each through `claude -p` |

Every round before this one ran on the morning-stretch cover, whose look was chosen in Round 4; this
one measures whether a product with none gets a first view no other product's could be. Nothing is
planted. The brief says the values `init` derives stand, the declaration lives in `.design/`, and
everything may change; it says nothing about the look. No image key is in the environment, so `init`
and `fix` take the photograph path. Model and effort: Opus 5.5 at xhigh; the reviewer at medium.

| Passes when | Read from |
|---|---|
| `init` asks nothing and writes the screen got without trying, three directions of two lines each, the one taken and why, a visual concept with its layout metaphor, the signature, the artwork in the first view at every checked size, a flood or the reason for none, and a display step three times the body or more at the widest size that grows up to it | the record, the declaration, `stats` |
| `fix` brings a picture by the skill's image tool, credited on the screen, in the first view at 1920 and at 360; every region of both first views takes its form from the layout metaphor; the scaffold's rounded white cards on a pale ground and pill buttons are gone, or each has a recorded exception whose reason names something in the product | the record, the code, the captures |
| One reviewer in `inspect` and one in `fix`, each in the background; no dismissal that points at nothing a capture shows; the reviewer's poster answer at 1920 and at 360 is neither that the first view could be another product's nor that the signature alone sets it apart | the record, `stats` |
| No line in English; minutes and Opus and Sonnet output for each entry, beside Round 8's (`init` 14, `inspect` 28, `fix` 53 minutes; Opus 80k, 105k, 179k) | `stats` |

The author judges the list screen at 1920 and 360 wide, beside the scaffold's own.

Read after Round 9 (`init` 39 minutes, `inspect` 22, `fix` 1318 minutes on the clock, each through
`claude -p`; Opus output 102k, 113k, and 282k; Sonnet 35k, 18k, and 20k; no question, no
compaction). `init` took the back endpaper of a library book from three directions: a date-due slip
pasted on it, one ruled line per pot, the date stamped in blue-violet as the signature (104 px at
1536, 6.1 times the body, growing from 60 px at 360), a plate from the *Honzō Zufu* (1828–1844) as
the artwork, in the first view at both checked sizes, and the endpaper's colour as the flood; it
chose 1536 × 730 and 360 × 560 as the checked sizes. `fix` brought the plate through the image tool,
credited it on the screen, and left the endpaper across the screen, the plate as the left page at
1536 and a band at 360, the slip with its stamped dates, and no rounded card or pill. `inspect`'s
first reviewer returned `recapture` and a second was started, as `rules/review.md` allows; `fix`
started one, in the background; every dismissal points at a capture. Its new findings went to the
next `inspect`: the slip is a white card ruled across, with no printed heads, no rule between the
columns, no paper edge, and the dates read as type rather than as stamps.

Three things the run showed. Six lines in English in `fix`, none in `init` (`stats`, and each
line's preceding event read in the run's transcript): every one says what the session will do next
— "Next, I'll …", "Finally, I'll …" — three right after a tool's English output, three after output
with Japanese in it; a seventh is the API's own error notice. `init`'s
work ended at 25 minutes and the run at 39: the session had scheduled a 20-minute wake-up as a
fallback for its helper, and `claude -p` stayed open until it fired; `rules/review.md` now says to
wait on the helper's own notice, repaired and synced before `inspect`. And `fix` spent about 1230 of
its 1318 minutes waiting on API responses that never came — four waits of 698, 234, 159, and 142
minutes, ending in "Request timed out" and "The response stopped arriving" — so its working time was
about 86 minutes. A first `inspect` was stopped by the free-space watch at 2.5 minutes with 2.9 GB
free, before it had written anything; the 44 GB file was deleted and `inspect` run again.

What the run showed, repaired together before Round 10: `fix` left its reviewer's strongest finding
for the next `inspect`, as the `fix` entry then said, and now takes what its closing run finds in one
more pass (`SKILL.md`, the `fix` entry; `rules/review.md`, its count); the four entry files name the
line that says what comes next as the one to begin in the user's language. The wake-up repair was
made during the run.

## Round 10 — `fix` takes its reviewer's findings, and the next-step line (2026-11-09)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-10` | a copy of `round-9` as Round 9's `fix` left it, the skill synced | `node scripts/live-test.mjs run round-10 design-discipline-inspect`; then `design-discipline-fix` — each through `claude -p` |

Round 9's record holds the slip's form and the stamped dates as left for the next `inspect`, so this
`inspect` should list them, and this `fix` should take them and whatever its own closing run finds.
Nothing is planted and the brief is Round 9's, which says nothing about the look or the slip. Model
and effort: Opus 5.5 at xhigh; the reviewer at medium.

| Passes when | Read from |
|---|---|
| `inspect` lists the slip's printed form — heads printed in one ink, a rule between the columns, the paper's edge on the endpaper — as a structural repair, above every repair to one element | the record |
| `fix` applies it; at 1536 and 360 the slip reads as a printed date-due slip pasted on the endpaper, not a white card ruled across, and the dates read as stamped | the record, the captures |
| One reviewer in each run, `recapture` excepted; where `fix`'s closing run lists a repair, a closing pass follows it, named in the record, and no repair its closing run listed within the scope of change is left for the next `inspect` while that pass held fewer than five | the record, `stats` |
| No line in English in either run; minutes and Opus and Sonnet output for each, beside Round 9's (`inspect` 22 minutes, Opus 113k; `fix` about 86 minutes of work, Opus 282k) | `stats` |

The author judges the list screen at 1536 and 360 wide, beside Round 9's.

Read after Round 10 (`inspect` 24 minutes, `fix` 62, each through `claude -p`; Opus output 102k and
191k; Sonnet 13k and 2k; no question, no compaction). `inspect` listed the slip's printed form first,
as a structural repair, among seventeen. `fix` worked them in four passes; at 1536 and 360 the slip
now has an outer rule, a rule between the date columns, and a centred printed head, and the large
stamp shows uneven ink, while the dates on each row are still flat type; the plate at 1536 is smaller
than Round 9's and drawn in a frame, a repair `inspect` listed for the plate and the stamp contending
for the centre. Each run started one reviewer, in the background. `fix`'s reviewer returned five
findings; the closing pass took four — three defects of the run's own changes and the printed head
the reviewer named as its one change — and one more the session found, and dismissed one by naming
a capture; nothing its closing run listed was left for the next `inspect`. Two lines in English in
`fix`, none in `inspect`: both say what comes next ("Next, structure.md: I'll…", "Now the lexicon…"),
each after a tool result. At 360 the first row's dates now sit on the bottom edge of the first view,
which the record notes as a candidate, not a count.

What the run showed, repaired together before Round 11: the plate was shrunk to settle the reading
order and the element the screen is built around, which both ranked the picture as an element read
in turn — the picture is now the ground, in neither, and a picture that leaves bare ground in its
room is counted (`rules/layout.md`, `rules/anti-slop.md`, `rules/tokens.md`); no count asked the
first view to hold the screen's first item, and the session left the 360 overflow as "a candidate,
not a count" — now a count in `rules/layout.md`, taken by the runner from an `answer` entry; the two
English lines, after an entry line that took six to two — the READMEs now point at Claude Code's
`language` setting, and the scaffold sets it. The row dates, which an earlier reading of a reduced
comparison image called flat type, are tilted with uneven ink at full size; nothing to repair.

## Round 11 — the picture as the ground, and the first view's first item (2026-11-10)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-11` | a copy of `round-10` as Round 10's `fix` left it, the skill synced, `.claude/settings.json` setting `language` to Japanese | `node scripts/live-test.mjs run round-11 design-discipline-inspect`; then `design-discipline-fix` — each through `claude -p` |

Round 10 left both defects in place, so the new counts should find them: the plate's drawing low in
a frame shrunk for the stamp's sake at 1536, and the first row's dates under the bottom edge at 360.
The runner configuration under `.design/harness/` has no `answer` entry yet; `rules/review.md` now
counts a key the runner's README lists that the configuration leaves out, so `inspect` should have
its helper add it once the structure names the first item. Nothing is planted and the brief is Round 9's. Model
and effort: Opus 5.5 at xhigh; the reviewer at medium.

| Passes when | Read from |
|---|---|
| `inspect` lists the plate's room and the first view at 360 as structural repairs, and lists no repair that makes the picture smaller; the configuration gains an `answer` entry and the runner's count reads 1 for the list screen | the record, `.design/harness/product.mjs` |
| After `fix`, at 1536 the plate fills the left page, with no bare ground inside its room on a side the declaration does not name, and the slip keeps its printed form; no repair in either record makes the picture smaller to settle the reading order or the centre | the record, the captures |
| After `fix`, at 360 × 560 the first row's name, dates, and button are in the first view, with the band and the stamp; the runner's `answer` count is 0 at both sizes | the runner's output in the record, the captures |
| One reviewer in each run, `recapture` excepted; a closing pass named in `fix`'s record where its closing run listed a repair | the record |
| No line in English in either run. With the setting on, a 0 measures the setting and the entry lines together, not the entry lines alone | `stats` |

The author judges the list screen at 1536 and 360 beside Rounds 9 and 10.

Round 11's first `inspect` (2026-11-10, 23 minutes) wrote no section to the record: its helper ran
`python - <<'EOF'`, the pyenv-win launcher did not pass standard input on, Python sat at its prompt,
and `claude -p` stopped the waiting helper ten minutes after the session's last turn; the Python
prompt was still running after the run and was stopped by hand. Repaired before the second
`inspect`: `rules/review.md` now has a script run from its file, never fed to an interpreter on its
standard input, with its count; `scripts/live-test.mjs` puts the real interpreter first on the run's
path, gives background work 60 minutes, and stops a Python prompt a run leaves. `round-11` was made
again from `round-10`; the stopped run's transcript is kept beside it as
`round-11.design-discipline-inspect.2026-11-10T01-58-14-602Z.stopped-helper.jsonl`.

Read after Round 11 (second `inspect` 29 minutes, `fix` 61; Opus output 124k and 221k; Sonnet 22k and
26k; no question, no compaction; no Python prompt left). `inspect` listed the first view at 360 (the
runner's `answer` count, 1: the first row's bottom at 619 px of 560) and the plate's room as
structural repairs, counted Round 10's shrinking as one repair that made the picture smaller, and
listed none that would; its helper added `answer` to the configuration. `fix` passed the 360 line:
the first row's name, dates, and button are in the first view, with the band and the stamp, the help
link moved into the slip's printed head. At 1536 it failed what the line meant: the plate's frame
grew from 381 × 497 to 461 × 601 px, but the drawing still starts 149 px below the frame's top (a
quarter of it bare), and `fix` printed the plate at 45 % of its ink, brown on the endpaper, to settle
the contest with the stamp. Both follow words this batch wrote: the count on a picture's room
excepted a margin the artwork entry names, and `fix` wrote the bare quarter into the entry; and
`rules/layout.md` offered the picture's tone held back as a way to settle the contest. One reviewer
in each run; `fix`'s closing pass took four. English lines: one of 30 in `inspect`, eleven of 55 in
`fix` — with `language` set, against two of 50 in Round 10's `fix` without it.

Meanwhile the English lines were looked for outside the skill (`scripts/.tmp/lang-exp*.mjs`, under
`_lang-exp*` in the lab): fourteen `claude -p` runs on a small skill that asks for a line before
every tool call — English tool output, a context past 230k tokens, work that needs reasoning, and the
entry line quoting "Next, I'll…" — wrote about 800 lines, none in English. In the rounds every
English line was a next-step line, but neither English output just before it nor the context's depth
is needed: Round 11's `fix` wrote its first at 0.9 minutes, right after reading two Japanese files.
The cause is not found. A PostToolUse hook that adds one sentence after every tool result could not
be judged in the small runs, since they wrote no English without it.

What Round 11 showed, and an agent's reading of the rules for every way a count could read 0 with the
screen unchanged, repaired together before Round 12 (DECISIONS.md, 2026-11-10): the picture keeps
its room, size, and strength whatever the reason given, covers its room, and is cut at the narrowest
only after the rest has moved; an entry never excuses the screen rendered; an exception never lifts
what holds a screen to its own concept, signature, artwork, or first item; every accepted reason is
held to the exceptions' test; the reviewer gets the artwork entry and the layout metaphor, and a
finding is dismissed only where a capture contradicts it. `language` is withdrawn from the READMEs
and the scaffold.

## Round 12 — the picture's strength, closing the ways around the counts (2026-11-10)

| Workspace | Scaffold | Run |
|---|---|---|
| `round-12` | a copy of `round-11` as Round 11's `fix` left it, the skill synced; `.claude/settings.json` holds a PostToolUse hook (`node "$CLAUDE_PROJECT_DIR/.claude/remind.mjs"`) that adds 「次にあなたが書く行は、日本語で書きます。」 after every tool result, and no `language` setting | `node scripts/live-test.mjs run round-12 design-discipline-inspect`; then `design-discipline-fix` — each through `claude -p` |

Round 11 left the plate at 45 % of its ink, with the drawing set low in its frame (149 px of 601 bare
above it at 1536), and wrote the bare quarter and the 45 % into the artwork entry and the style
system; the new counts should read both. The hook was checked once in a small run: three Bash calls,
the second after a `cd`, gave three added sentences in the session's transcript. Nothing is planted
and the brief is Round 9's. Model and effort: Opus 5.5 at xhigh; the reviewer at medium.

| Passes when | Read from |
|---|---|
| `inspect` lists, as whole-screen structural repairs, the plate printed back at its full ink and the drawing covering its frame at 1536 and its band at 360, and lists no repair that makes the picture or the signature smaller, lighter, or covered | the record |
| After `fix`, at 1536 and 360 the plate's darkest ink is near black, as the source's, and the drawing covers its room with no ground left on a side; the slip keeps its printed form; the first row stays in the first view at 360 (the runner's `answer` count 0) | the captures, measured; the runner's output in the record |
| No change to the declaration, the structure, or the style system in either record that brings a count down with the screen as it was; no recorded exception naming a count on the concept, the signature, the artwork, or the first item | the record, `.design/declaration.md` |
| One reviewer in each run, `recapture` excepted; each dismissal names the capture and the place that contradicts the finding; a closing pass in `fix`'s record where its closing run listed a repair | the record |
| English lines counted for each run and set beside Rounds 10 and 11 with the hook named as the one change; not a pass line, and no run is added for the language alone | `stats` |

The author judges the list screen at 1536 and 360 beside Rounds 10 and 11.

Read after Round 12 (`inspect` 29 minutes, `fix` 73; Opus output 132k and 307k; Sonnet 25k in
`fix`; no question, no compaction; no Python prompt left). `inspect` rebuilt the reviewer's brief
from the current rule files, the artwork entry and the layout metaphor in it, and listed the plate's
45 % ink and its room as whole-screen structural repairs, with no repair that makes the picture or
the signature smaller or lighter. After `fix`, the plate at 1536 runs to the edges of the left page
(its ink 0–1 px from each edge, darkest pixel #000000, one capture measured) and the band at 360 is
printed at full ink; the slip keeps its printed form, the head cut to one line at 360, and the
runner's `answer` count is 0 at both sizes. The record reads the shrinking and lightening counts 0,
Round 11's 45 % undone by this run's repair 4. One reviewer in each run, no finding dismissed;
`fix`'s closing pass took three defects of its own changes and four other repairs, and left two
open questions from findings 1 and 4 for the next `inspect`. English lines with the hook on: none of
46 in `inspect`, five of 117 in `fix`, against two of 50 and eleven of 55 in Rounds 10 and 11 without
it — the hook does not remove them, and no run is added for the language.
