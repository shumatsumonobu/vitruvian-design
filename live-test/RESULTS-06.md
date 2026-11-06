# Results — scaffold-06, old skill against new

What each run found, read by the judging session from the record, the diff, and the transcript.
One run each; a single run is not a rate.

## Run 1 — `init`, old skill, `scaffold-06-init-old` (2026-10-26)

- Code unchanged; written only under `.design/`
- 24 min, 72 tool calls, 0 questions (the brief answered the second and third; Chrome started headless by the session)
- The opening fixed text was not said: one message, the closing. The discarded first run did say it. 1 miss in 2 runs; watch run 5
- Japanese sentences ending politely 13/16; the 3 others are table cells

## Run 2 — `inspect`, old skill, `scaffold-06-old` (2026-10-26)

- Code unchanged; 45 min, 75 tool calls, 0 questions, 0 messages in English, polite 69/75
- Sizes: 1440×900, 390×844, 320×568 for the counts; the start button pressed at 12 sizes of its own choosing (1366×657, 1536×730, 1440×800, 1920×961, 390×664, 414×719 covered; 1280×720, 1440×900, 390×844, 375×667, 360×740, 320×568 clear)
- Closing message 3,415 characters: repairs by area, what could not be measured, two decisions for the person, the next command

| Planted | Found | How |
|---|---|---|
| Box covering the start button at short windows | Yes | states, elements that clip or overlap at the widths tried; pressed at 12 sizes |
| Text over the moving glow | Yes | contrast, 8 s sampled every 0.4 s at 3 widths, minimum 1.04 |
| Back from the guide leaves the page | Yes | navigation, stacked or replaced walk |
| Log line built from pieces | Yes | copy, sentences assembled from fragments |
| Back from the confirm dialog leaves the page | Yes | same walk |
| Skip opens while paused | No | the countdown running while the tab was hidden was noted (states, interruption) but not made a repair |
| `)` alone, one-character last line | No | — |
| `・` read aloud | No | judged "an enumeration mark, not decoration" |
| Result layer closing itself after 3 s | No | — |
| Overlapping press areas | No | only the 6 px gap counted as off the spacing unit |

Decoys: none flagged as false positives. The help sheet carried a real defect the decoy did not intend — after a reload, back pops its entry and nothing happens — found and correct. Also listed for the sheet: a rebuilt dialog and a double press; both real.

Reading: the covering box was found without the checked-sizes rule. What the new rules can add on this scaffold is the five not found, and the shape of the closing message.

## Run 3 — `inspect`, new skill, `scaffold-06-new` (2026-10-26)

- Code unchanged; 40 min, 98 tool calls, 0 questions, 0 messages in English, polite 25/30 (the 5 others are noun-phrase items in the not-taken list)
- Checked sizes chosen with no window named in the brief: phone 360×560 (640 less the status bar and the browser's address bar), laptop 1536×700 (1920×1080 at 125% less the taskbar and the browser's bars), each with its reason; recorded as the set this run used, the structure entry on the repair list
- Screens listed: 5, each with the sizes and states read; states the reader's operation reaches listed (10 s gate, gate open, paused, last pose, closed midway, finished)
- review.md's new lines read against itself: passes with no capture 0, screens missing 0, scripts 1 (two font-check pages take the same count)
- Closing message 3,353 characters, in the order How `inspect` and `fix` end gives: one sentence; 9 the reader cannot use the screen without; 45 the reader sees, one line each; the file-only repairs as one line; three things only the person can give; the counts not taken, with steps on the person's own phone or PC for the screen-reader walk; the next command

| Planted | Old | New | How (new) |
|---|---|---|---|
| Box covering the start button | Yes | Yes | states, press at the middle, both sizes, mouse and touch |
| Skip opens while paused | No | Yes | states, time that runs while nothing does: 2 (paused 11 s, skip open with 27 s left; tab hidden 6 s, countdown down 7) |
| Text over the moving glow | Yes | Yes | contrast at the worst moment, 1.04 |
| Back from the guide and the confirm dialog | Yes | Yes | navigation, containers back does not close: 2 |
| `)` alone | No | Yes | copy, line opening with a closing mark: 1 |
| One-character last line (Japanese heading) | No | No | the heading breaks that way at 390 wide; this run's phone size was 360, where it does not — the plant, not the rule |
| `・` read aloud | No | Yes | a11y: 6 — the three `・`, and `/` in `1 / 5`, `—` twice. Whether a screen reader at its default setting reads `/` and `—` was not checked: a possible over-count |
| Result layer closing itself | No | Yes | navigation, moving on without the reader: 1; the countdown the reader started named as excepted |
| Overlapping press areas | No | Yes | states, neighboring areas overlapping: 1 (4×50) |
| Log line built from pieces | Yes | Yes | copy, fragments joined; the screen-reader stop count not taken, steps offered |

Decoys: none flagged.

Two gaps shown, repaired and synced before `fix` (author's go, 2026-10-26):
- The closing message's middle group ran to 45 lines. Now the structural repairs the reader sees get a line each; the surface ones are one line with their number and where they are listed
- Two counts the run could take itself were deferred "to the next inspect" (the recording frame by frame; the result screen at text size 20). Now a count the run's own tools can take is taken in the run, and review.md counts one passed to the next run
