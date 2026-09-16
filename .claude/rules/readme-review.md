---
paths:
  - "README.md"
  - "CHANGELOG.md"
  - "gallery/**"
  - "skills/design-discipline/README.md"
---

# README review — the lenses for README, CHANGELOG, and the gallery

Applies to the public story: `README.md`, `CHANGELOG.md`, the skill's own README, and the pages
and images in `gallery/`. README is the trunk — it is what makes a stranger try the skill — so
the review weighs two failures the same: text that is wrong, and text a reader does not use.
The counts below catch the first; only a reader catches the second, so the checks carry it. A
count is either 0 or it is a repair. A score, when the author asks for one, is a summary for
the author: each score names the defects behind it, and the repairs come from the defects, not
from the score. (The author is the person who owns this repo and runs these sessions; the
author decides what the README says.)

## The counts

The mechanical ones are printed by `node scripts/check-readme.mjs` (`--pages` also opens every
gallery page). It reads the prose of the three documents — `README.md`, `CHANGELOG.md`,
`skills/design-discipline/README.md` — outside code blocks; the prompt and product-entry counts
apply to `README.md` alone, which is the only document that carries them. The rest are read off
the text by the reviewer.

- Numbers in the text a reader does not act or decide on. Remove them and say it in words; a
  number a reader does not use is noise over the point. Of the numbers that stay, those with no
  measurement named for them — a run's `.design/record.md`, a capture, a command's output; a
  source that cannot be reached makes the number a repair: remove it or mark it unverified. A
  number rewritten from memory is a defect, not a rounding: 0.
- Claims stronger than their measurement — "all closed" with one repair open, "verified" where
  the record says "not run": 0.
- Items a run's `.design/record.md` (in the run's workspace, outside this repo) marks as not
  run, not verified, or open, that the text presents as done. A record that cannot be reached
  makes the claim it would support a repair, the same as an unreachable number: 0.
- Sentences a reader does nothing with — how the repo was made, what changed between runs, what
  a mechanism is for internally: 0. Build history belongs in `gallery/README.md` or the author's
  handover notes; internal mechanics in the skill's own README. Why this is counted: every other
  count here catches text that is wrong, and none catches text that is surplus, so a review that
  runs the counts alone adds and never removes. The pattern it guards against, seen once: a
  paragraph explaining a table's terms was added above the table instead of the table being
  written in plain words, and the history of how the prompts were rewritten was added to the
  gallery intro instead of staying in `gallery/README.md`.
- Links and image references that do not resolve, in the three documents
  (`check-readme.mjs`): 0.
- Images in `gallery/` the README does not reference (`check-readme.mjs`): 0.
- Images the README references with no entry in `scripts/capture-log.json`, or whose bytes differ
  from the entry. The log is written by `scripts/capture.mjs` for every capture and is the
  only evidence an image came through it — the rule is `gallery-images.md`
  (`check-readme.mjs`): 0.
- Images whose capture-log entry records a `SPEC` other than the current one. A change to `SPEC`
  re-captures every image in the same batch (`check-readme.mjs`): 0.
- Product entries in `README.md` — the `###` headings under "Seven pages, one prompt each" —
  whose heading, image name, and page name do not agree. The image and the page sit together in
  `gallery/` under one name. Heading to name: lower case, a leading "the" dropped, every run of
  characters that is not a letter or a digit becomes one hyphen — The Roast Ledger,
  `gallery/roast-ledger.png`, `gallery/roast-ledger.html` (`check-readme.mjs`): 0.
- Prompts quoted in `README.md` whose words differ from a block in `gallery/README.md`,
  whitespace and line folding ignored. A quoted prompt is a ```text block whose first word is
  `/goal`; quote prompts no other way. A template a reader can paste is not a quoted prompt; it
  goes in a fence with no language, which the count does not read (`check-readme.mjs`): 0.
- Praise adjectives in the prose of the three documents (`check-readme.mjs` lists candidates;
  the count is on the intent — praise — and the word list is examples): 0. Quoted prompts are
  exempt; they are the record of what was asked.
- Verdict marks and emoji in the prose of the three documents, code blocks excluded
  (`check-readme.mjs`): 0. Yes and no are words.
- Gallery pages that do not render — blank, or a console error on load
  (`check-readme.mjs --pages`): 0.

## The checks

- The stranger's words: name each term the text uses that a reader who has not opened the
  skill would not have, and where the text gives it to them — or say that it does not.
- The first screen: say what a stranger sees first on the repo page, and whether that is the
  thing the repo wants them to see.
- One voice: read the newest section against the oldest. Say where the register changes.
- Each section's job: for every heading, one sentence on what a reader gets from it that no
  other section gives. A section with no answer is a candidate for removal.
- What was left out: say what the text does not claim, and whether a reader could mistake the
  silence for a claim.
- The workspace prompt: where a run's workspace is reachable, diff its `prompt.txt` against the
  matching block in `gallery/README.md` and say the result; where it is not reachable, say so.
- What was cut: for every section, say what was removed since the last review and why the
  reader is better without it. A review that only added is suspect — the counts cannot tell
  surplus from substance; only a reader can.

## The procedure

1. Run `node scripts/check-readme.mjs --pages`, then review yourself with the counts and checks
   above — first as the stranger, then as the editor who cuts.
2. An agent pass is the author's call, not a default step. When the author asks for one after a
   large rewrite: one agent reviews the text against these lenses and proposes findings, a
   second agent tries to refute each finding, and only the findings that survive are
   adjudicated — at most one such round, high-confidence findings only. Your own batch hides
   defects from you; the round exists for that, not for volume.
3. Before applying anything, list every repair as before → after → why it holds, and wait for
   the author's go-ahead. Then apply in one batch.
4. Run `check-readme.mjs` again; the batch is not done until every line it prints is 0. Say
   what was cut.
