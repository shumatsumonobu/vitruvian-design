# Decisions

Why the rules read as they do. One section per decision: what was decided, why — the run or
the defect that forced it — and where it now lives, so a later change starts from the reason
instead of rediscovering it. New decisions go under a new dated heading; the rules themselves
live in the files named, not here.

## 2026-11-05 — Round 6, the last run of this batch

Round 6 ran `inspect` (30 minutes, 112k output tokens of the larger model) and `fix` (52k) on
Round 5's cover. The signature's squares now fill their card at the wide size, the stamps grew
from 32 to 48 px, and the lead no longer ends on 「す。」. The visual concept was not listed as
carried in color alone: the session named the ruled squares, the stamp, the spaced headings, and
the flat paper as the card's, and that reading holds — the plant was the judge's misreading.

**Bare sides are a default, not a choice a sentence makes.** The session kept the 640 px column at
1920 wide and wrote its reason in the structure: the declared maximum content width. The rule had
allowed one column with a reason, and the value under question became the reason. The author asked
for the screen to be used. A column with bare background either side is now counted, by the width
what draws spans against the view, and only the recorded exceptions entry lifts it, as every
default; the content width and the line length stop text and are not a reason. This form has not
been run. Lives in `rules/layout.md` and `rules/anti-slop.md`; the half is this skill's default.

**Switching models costs the cache; a helper does not.** The author asked whether moving between
models is a poor trade, having measured that a conversation switched from one model to another
reads its whole history again uncached. Claude Code's prompt caching page says the same — each
model has its own cache, a skill's own `model` setting is such a switch — and that a subagent
starts its own conversation and leaves the parent's cache as it was. The helper is a subagent, and
the session stays on its model; the platform note now gives that as the reason a skill's `model`
setting is not the way to split the work. Lives in `rules/review.md`, Platform notes.

**The runner.** Opening its debugging socket had no limit, and a product's flows could not tell
which rule files were selected; both were repaired.

## 2026-11-05 — Round 5, and what a wide screen is for

Round 5 ran `inspect` and `fix` on the cover Round 4 left, with the web runner and a helper: 55
minutes and 79k output tokens of the larger model, against Round 4's 95 minutes and 249k. The
signature moved above the menu and shows before any scroll at both checked sizes; the title breaks
between phrases. The author judged the new cover clearly better, and asked for the screen to be
used in full.

**What a wide display's width is for.** At 1920 wide the cover kept a 640 px column in the middle,
1280 px of the width empty. The rules made that the easy answer: tokens.md asks for a maximum
content width and a line length, anti-slop.md counts what runs past them, and layout.md asks what
each region does as the display narrows — nothing asked what the width past one column carries.
The structure now says it — a region beside another, the content or the signature grown, or one
column kept for a reason — and a phone's column centered on a wide display is named among what
arrives unasked. Lives in `rules/layout.md`, Reflow is declared; `rules/anti-slop.md`.

**The signature and the concept on the screen.** The signature rendered as its entry said, and
still read quiet: small stamps, thin rules, its squares filling part of its card at the wide size.
The visual concept — a Showa radio-exercise card — reached the screen as two colors and nothing
else. Both checks read the declaration and not the screen; each now names what on the screen
carries it. Lives in `rules/anti-slop.md`, The checks.

**A one-character last line, in short text too.** The cover's lead ended on 「す。」 at every size.
The count read titles, headings, and names, and counted the full stop as a character. Short text
standing on its own — three lines or fewer — is read too, punctuation not counted. Lives in
`rules/copy.md`.

**Cut.** The web's measuring steps in the rule files' Platform notes — forcing states, raising the
text size, what a press lands on, contrast over what moves, reading lines, listing the tree — are
what the runner does, and each was a second statement of it; they were removed, and the headless
browser's validation behaviour moved to the runner's README. The runner line in `rules/review.md`
that counted a second script taking a runner's count said what the two-scripts line already said,
and the two became one. CONTRIBUTING's tables for scaffolds no longer kept were removed. The runner
itself read two counts wrong in Round 5 — the history it writes between loads, and the load event
taken for the point a page accepts input — and both were repaired.

**Found late.** The empty sides and the quiet signature were already in Round 4's captures. A run is
now asked for only after the last run's screens have been looked at, at every checked size, against
what the author asked for.

## 2026-11-04 — Where a product is bold, and who writes the scripts

A designer's published poster prompt was read against the skill. Every rule in the skill
subtracts: it counts what nobody chose and removes it. Nothing decided where a product is bold,
and a screen held to one accent in three places, neutrals everywhere else, and references from its
own category comes out quiet and like its neighbours. The author wanted products that are not
ordinary and that catch the eye. Asked whether the person should be asked more, the author said
no: much of this the person cannot judge, and more questions make the skill worse. So the session
decides and shows; no question was added.

**The visual concept and the signature.** The plan the frontend-design skill writes holds a
concept, but a session that never saw the plan builds the next screen, so the two decisions that
make a product recognisable are entries in the declaration: the world outside its category whose
look it borrows, and the one element it is remembered by, where the boldness is spent and around
which everything stays quiet. `init` shows them first, in a sentence or two at the top of the text
before it writes. On Round 4's cover (`live-test/TESTPLAN.md`) the derivation chose a Showa-era
radio-exercise attendance card, and `fix` rebuilt the cover's log as this week's card with a
vermilion stamp on each day done; the author, shown the old and new covers side by side, judged
the new one clearly better. Lives in `rules/tokens.md`; the checks in `rules/tokens.md` and
`rules/anti-slop.md`.

**One reference from outside the category.** The skeleton and the conventions readers carry come
from products of the same kind; the look comes from somewhere they have not been. The number of
references stays five, one of them from outside. A product whose declaration was written before
this had no way to add one, so `init` run on it studies one and derives only the two entries.
Lives in `SKILL.md`, Before you draw and the `init` row; counted in `rules/anti-slop.md`.

**A flood, the display step's jump, artwork and text, people.** A color may fill a large surface
as a flood without becoming a second accent. The display step states its multiple of the body
step and the reason, and a scale climbing in small even steps is named among what arrives unasked;
a floor on the jump was left out, a number with no source that a long title at the narrowest width
could not meet. Artwork and text decide which sits in front before the artwork is made, where the
rule had kept text off the artwork's upper third. People drawn as a generator's default — one
evened face, a sales smile, crossed arms — are rejected. Each screen captured shrunk was left out:
what is shrunk, and to what size, would each need a source. Lives in `rules/tokens.md`,
`rules/anti-slop.md`, `rules/assets.md`.

**The session decides; a helper writes the scripts.** The author asked that judgment stay on the
larger model and the writing of decided code go to a smaller one. A skill's own `model` setting
switches the rest of the turn (Claude Code's skills page), so the split is a second agent. It was
written first as something the session may do. In Round 4's `fix`, 95 minutes, no helper was
started, and 108k of the run's 249k output tokens went to an 880-line inspection script in its
first 18 minutes. Every script under `.design/harness/` now goes to a helper where one can be
started; a pass's repairs may. What it saves is not yet measured. Lives in `rules/review.md`,
Rebuild in small passes and its Platform notes.

**An inspection script runs one rule file alone.** `fix` has always rerun only the failed counts
and the counts on what a pass changed, but the script the run wrote took one argument, a label, so
every recount ran every count — eight runs of 2.5 to 3 minutes — and no count read it. The harness
entry now says a script runs one rule file's counts without the others, and two counts read the
script and the passes. Lives in `SKILL.md`, What this skill writes; counted in `rules/review.md`.

**A step waits only so long; a method that hung is named.** Round 5's `inspect` handed a helper
nine new measurements, one of them a press sent with touch emitted for the mouse — the method
Round 4's `fix` had found hanging and dropped, though its record said only that a synthesized tap
gave no click. The helper wrote what it was told; the script waited on that press with no limit,
and Claude Code stopped it half an hour later when the machine ran low on memory. Its own memory
stayed near 950 MB while it waited, so it was the wait, not a leak. Every step a script waits on
now has a time limit, a method that hung is named in the record, the session hands those names to
the helper, and the helper runs a script once before it returns. Lives in `SKILL.md`, What this
skill writes, and `rules/review.md`; the press is listed in the web runner's README, under
What a headless browser does differently.

**A runner the skill carries, instead of one each run writes.** The author asked for a design that
runs lighter and faster at the same quality. Of the 221 count lines, 118 need only the source or the
record; the rest need a rendered screen, an interaction, or a recording. The two scripts runs had
written were about half the same parts — the browser's plumbing, contrast, press targets, line
reading, the comparison against the declaration — written again for each product and tested by
nobody. The web runner holds those parts once, tested on three scaffolds, a hang, and a frozen
tab, and a run writes only its configuration and the flows only its product has. Measured once
each against the old script: a full reading of one screen in 1 to 3 minutes against 2.5 to 3, the
browser at 1.1 to 1.5 GB with the GPU off against 1.6 GB. The larger saving is the script no run
writes — 880 lines and 108k output tokens in Round 4 — and Round 5 measures it. Two counts first
read wrong and were repaired before any run: line breaks were read on strings padded three times,
which no product shows, and a comma inside a sentence was counted as a mark for the eye.
[Playwright](https://playwright.dev/), axe-core, and a CSS analyzer were read and left out: each is
an npm dependency in the product, and axe-core's rules differ from these counts. Lives in
`runner/web/`; named in `rules/review.md`'s Platform notes; tested by `scripts/live-test/test-runner.mjs`.

**A title breaks between phrases; the signature sits before any scroll.** Round 4's cover title
broke 「きょうをはじ / める」 at 600 wide and above; the run saw it and wrote it down, but no
count read it. The signature was built where its entry put it, at the log's place, below what
shows before any scroll at both checked sizes; an element nobody sees on arrival is not the one
they remember. Each became a rule with a count. The web notes — `word-break: auto-phrase` from
Chrome 119 under `lang="ja"`, `keep-all` with `<wbr>` elsewhere — were read in Chrome's developer
blog and MDN. Lives in `rules/copy.md`, `rules/tokens.md`, `rules/anti-slop.md`.

**One name each: a flood, the product's category.** The batch had used field for a color filling a
surface and for the kind of product, beside a form's input field. A field is a form's input and
nothing else.

**The first line before any tool call; every line in the person's language.** Round 4's `init`
wrote a script ten minutes before its first line to the person and left one note to itself in
English; the entry files said "before any tool call that writes a file" and "speak to the person".
They now say before the first tool call of any kind, and that every line written is read by the
person. The 95-minute `fix` that followed kept every line Japanese and polite, the first before
any tool call — the first run over an hour seen to hold since the entry files carried the rule.

## 2026-10-25 to 2026-11-02 — A month of one product under the skill

One product, a music app, ran the skill for a month and sent fifteen proposals from its own
record, each with the defect behind it. Each was weighed against one question — would it make the
skill better on every product, or only on that one — and against two ways a new rule makes a
skill worse: it flags what is fine elsewhere, or it lengthens every run. Ten went in as proposed,
three went in narrowed, five were left out (`DESIGN.md`, Read and left out).

**The checked sizes.** The product's two worst misses came from checking at a device's listed
size: a laptop scaled by the system, a phone with the browser's bars showing, each left a height
no check had used. A screen is now checked at the widest and narrowest supported width, each at
the shortest height a reader is left there, with each size's reason in the structure. Only the
layout counts, the press count, and the overlap count read every checked size; state captures
stay at the widest and the narrowest, so the reads do not multiply. A first draft read every
count at every size; it was narrowed for that reason. Lives in `rules/layout.md`, The sizes a
screen is checked at.

**What a press lands on.** A full-width box that drew nothing covered the product's main button
on short windows; neither the eye nor the keyboard finds that. A press at the middle of each
control is now read at every checked size, the target is the area that answers, and two areas do
not overlap. It is a piece of the accessibility floor: a control nobody can press is unusable
whatever the scope of change. Lives in `rules/states.md`, What a press lands on.

**Time that runs while nothing does; text over what moves; the states the reader's operation
reaches.** A gate that opens after a minimum listening time opened while the music was paused;
text over an animated background passed a still frame and failed at its brightest moment, four
measurements in four; the product's own review captures — playing, finished, after pass — were
none of the five states. Each became a rule and a count. Lives in `rules/states.md`, Across a
session, Text over what moves, What the reader's own operation reaches.

**Back closes what covers the screen; nothing moves on by itself.** The product's full-screen
player had no history entry, so back left the site; a result layer closed itself. Writing that
rule exposed a contradiction already in the file: "a history the product does not own is never
written to" forbade the web's own Advance. The trap is an entry beneath the page the reader
arrived on, and the sentence now says so. Lives in `rules/navigation.md`.

**What the ear receives.** On an iPhone the product's separators were read aloud one by one, a
figure split into three stops, and stops followed position rather than markup. A mark for the
eye only is hidden from the tree whatever screen reader the reader uses — tracking which reader
reads which mark was considered and dropped, since readers and versions differ — and punctuation
inside a sentence is the sentence's own. The first count over-counted a title's dash for want of
that sentence. Lives in `rules/a11y.md`, What the ear receives.

**Line breaks, small and dim, a beat on a change of state, decisions on every screen.** A name
with a bracket left `)` alone on a line; the product's author corrected type size or dimming four
times; a glow at an unlock was too brief to be seen; a font decided on one screen was not carried
to the others. Each became a rule with a count or a check; the derivation now takes the larger
step and the brighter tone where the reading distance leaves a choice, and the next `init` on the
same study set its smallest step 1rem against 0.875rem and its secondary text 7.09 to 1 against
5.08. Lives in `rules/copy.md`, `rules/tokens.md`, `rules/motion.md`.

**The runs' own discipline.** A pass about the rendered screen names the capture, recording, or
walk behind it; every screen the product has is listed; the scripts that take counts are kept
rather than thrown away, so the next pass counts again; a count the run's own tools could take is
not passed to the next run; and `fix` repairs or undoes what its own changes caused. Lives in
`rules/review.md`, the last lines of the count, and `SKILL.md`, Ways in.

**How `inspect` and `fix` end.** Two runs' closing messages were walls: forty-nine repairs in no
order, with the material only the person could supply buried among them. The end now has a fixed
order — what was done; the repairs heaviest first, only the floor's and the reader-visible
structural ones a line each; what only the person can give; what was not taken and what would
take it, with steps on the person's own device; the next command. A count the person takes on
their device is taken. Lives in `SKILL.md`, What it asks you.

**The first line, the language, and the full closing run — in the entry files.** `fix` spoke English
in both of its long runs, from its first line, while writing the record in Japanese. Two sentences
in `SKILL.md` — a typed command is not writing in a language; say one line before the first file is
written — did not reach it; the same line in the entry file did, in the next run, four minutes long.
The same short run showed `fix` checking only the counts its one repair touched; that too moved into
the entry file; no `fix` has run since to show it holds. `init`'s opening text went unsaid in three
runs of three: it promises to save only when the person says so, which is false where the brief
agrees in advance, and the session skipped it rather than say it. The text is now said where the
person will be asked, and the first line says what `init` is about to do where the brief has agreed.
Lives in the four entry files and `SKILL.md`, What it asks you; the lessons, in `CLAUDE.md`.

**The runs that settled it.** One scaffold carried the planted defects; the old skill and the new
inspected the same state. The old found five of ten, the new nine — the tenth was planted at a
width neither run checked — and neither flagged a decoy. Two real defects the old run found the
new one did not try; their rules had not changed, and one run each is not a rate. The language,
the first line, the derivation, and the opening text were then settled on one-screen workspaces
in runs of four to six minutes, after the full scaffold had taken twenty-five to ninety. A first
version of the scaffold named the author's window in its brief, which handed the old skill the
size the new rule exists to find; that run was stopped and the brief rewritten. Lives in
`CONTRIBUTING.md`, Live test, and `CLAUDE.md`, Reviewing.

**Glowing type, and a border on text that is only read.** After the month's proposals, the same
product rebuilt a reward screen three times, its words in glowing neon each time, before its owner
named the look as generated; one bordered catalog number survived the rebuild. Both now stand on
the reach-for list, and a count reads text set with a glow as its style. The proposal's count
excused a shadow grounding an edge; that phrase was dropped, since `rules/tokens.md` gives a
shadow one job, elevation. A glow that plays once as a beat stays with the count
`rules/motion.md` points at, so one glow is not read by two counts. A border needed no new count:
the decorative-element check already asks every border what it carries. One `inspect` on a
one-screen workspace, twelve minutes, returned the glow count as 1 on the title, listed the
border on the pose times, and flagged neither the bordered buttons nor the focus ring. Lives in
`rules/anti-slop.md`.

## 2026-09-30 to 2026-10-02 — The third scaffold's runs, and the skill read whole twice

Of the nine gaps the third scaffold's runs had shown by this point, seven could have been found by
reading — the lens existed, and had been run over the day's diff rather than over the skill. So the
whole skill was read once, as the session that executes it, for five things: a step named with no
way to do it, a thing said to the person with no fixed text, a file written with no named home, an
instruction that has `inspect` touch the product, and a name that differs between files. Sixteen
showed. The lines said when frontend-design or the skill itself is missing, when screen work arrives
with no declaration, and when `init` has nothing left to do are fixed texts now, and the marks on
the repair list are said once in the person's words where the list begins. `init` run again keeps
what the person wrote. A brief's agreement in advance is a line in the brief, in any words. The
motion, navigation, and accessibility Inspections say what the record holds when nothing can be
driven, as the others did. The rebuild's captures and the motion recording have their home under
`.design/captures/`. Forcing a loading state no longer edits the product's code. Photographs are
named wherever artwork's media are. Lives in the files named, and in `SKILL.md` under What it asks
you, Ways in, and Before you call it done.

The run that followed, `inspect` on the third scaffold, showed the flow side of the families rule
unwritten. The scaffold's headings listed the Japanese family first, so headings set figures in
it while body text set them in the Latin family — the same characters in two families, the case
the rule says makes them two — and the families count in `rules/anti-slop.md` still read the pair
as one, from the declaration alone, because the condition stood only on the declaration's count in
`rules/tokens.md`. The count in the flow now carries the condition too: the pair is one while the
flow sets no character in two of them. The same run put the marks' meaning once above the repair
list rather than beside each of forty-eight rows, which reads better than the rule asked for, so
the rule now says once, where the list begins.

The second `inspect` on the same scaffold showed four more. `rules/tokens.md` sent rendered type
values to `rules/anti-slop.md`, which had no count for them, so the session invented one; the
count exists now. The first run had skipped the raised-text capture without the record showing a
gap, because the long-content count did not name its captures; it names the four. Raising the
text size changed nothing on the scaffold, every size being in pixels, and nothing counted it —
a capture no count reads is not worth taking, so text that stays the same size is counted. The
tap-target count had read the web minimum without the spacing exception its criterion carries,
and repaired a navigation that passes the criterion; the Platform notes carry the exception, and
NOTICE says the number is read with it. And the first run had counted a browser's validation
messages as absent because a headless browser draws them only under focus emulation; the how is
in `rules/forms.md` under Platform notes.

The `fix` run put the third question through the AskUserQuestion tool, and the tool shows
nothing after its options: the guarantees that hold under every answer went at the end of the
question's text, the only place left. The rule had asked for them below the answers, a place the
tool does not have; it now names both places.

The same `fix` run repaired the deep-link count by writing an entry into the browser's history
beneath the page, so that back stayed on the site — on the web a trap, since that history is the
reader's and shared across sites. The rule had been written from the native stack, which the
product owns and may synthesize. It now states the concern, a way into the product, names the
mechanism each case takes, and counts entries written into a history the product does not own.
Lives in `rules/navigation.md`, the deep-link paragraph, its count, and Platform notes.

The second `fix` run spoke English from its second line to its final report, and two earlier runs in
the same session had let an English line through. Not the context being summarized mid-run — the
transcript holds no such boundary. The person had typed nothing but commands in that session, every
file the run read between its lines was English or code, and the only words asking for the person's
language sat at the run's start, under an hour of tool calls. The place that is read on every turn
is the project's `CLAUDE.md`, so the one line the README asks for there now names the language as
well as the skill; the rule in `SKILL.md` under Language is unchanged, being right. The fifth
`inspect`, the first run with the line in place, kept Japanese but dropped the polite form the skill
asks for — the author's own global instructions ask for plain speech, and they too are read on every
turn — so the line names the form as well. Lives in both READMEs under Install and in
`CONTRIBUTING.md` under Live test.

The same shape — a rule read once at a run's start that a long run forgets, with nothing reading
it after — was then looked for across the skill. Two more had it. The homes under What this
skill writes, and the sentence that nothing is written outside the workspace, had no count: the
first study's script went to the system's temporary directory and the first `fix` kept its
browser profile there, and no run would ever have listed either. And the count on code changes
tied to no repair was read only by a run holding a fix pass, so an `inspect` or `init` that
edited the product read nothing against itself. Both lines now stand last in `rules/review.md`'s
count and every run reads them against what it changed and wrote before it ends. The other rules
of that shape — five repairs per pass, the scope of change, what the product relies on behind the
screen — already had a count, and the first two caught a drift in the runs of this day; the
courtesy and the words of what is said to the person have no count and cannot, since the record
does not hold them, and the live run is what reads those, as CLAUDE.md says.

On a second copy of the scaffold, the person answered the second question with Change some
values first and gave one color. The run changed that color, re-derived the error color and a
type step that had depended on it, named the three in one line, and put the question again —
without showing the declaration. The answer's text had said "I'll show the revised decisions",
and the run read naming as showing. The text now says the whole set is shown again, with the
person's changes in and every re-derived value marked, and `rules/tokens.md` gains the step that
says what happens to a value the person sets: it is theirs, its reason is that they set it with
the derived value beside it, only entries whose reason named it are derived again, and the
showing of step 4 is repeated. Lives in `SKILL.md`, What it asks you, and `rules/tokens.md`,
Deriving the declaration.

On the same copy, the person answered Save somewhere else with a file that did not exist, and
the run asked a fourth question — whether it might create the file. The three questions are the
only questions, and every other decision is the session's; the follow-up line now says the file
is created if it does not exist, so the person knows and the session has nothing to ask. Lives
in `SKILL.md`, What it asks you, the line put after Save somewhere else.

After thirteen repairs found one at a time, the whole skill was read once more for the five
shapes those repairs had: a branch no fixed text covers, so the session asks a fourth question;
a count a file points at that the pointed-at file does not hold; a rule written from one
platform's mechanism; a rule read once at a run's start that nothing reads after; a verb a
session can satisfy with less than was meant. Six more showed. The largest: a declaration saved
somewhere other than `.design/declaration.md` had no way to be found again — nothing said the
record names the home or that an entry reads from it — so the record names it and every entry
reads from there. The follow-up line creates the section as well as the file. `rules/motion.md`
gains the count on rendered springs and curves that `rules/tokens.md` had pointed at; the
reference count in `rules/anti-slop.md` now holds that one reference was walked; the typeface
stand-in is stated without naming the web; and the harness row names a browser's working files.
Lives in the files named.

Then the author asked why none of this had been found before the runs, and the answer was one
cause: the reviews had read sentences, and the defects lay between sentences — on the path from
an answer the person gives to what the session writes to what the next run reads. So the skill
was reviewed once more by walking every such path to its end, one written line each, forty-two
of them. Five could not be written to the end: Save as shown named `.design/declaration.md`
even where the person had chosen another home; a brief stating the scope of change left it
unsaid that `init` writes the entry, so `fix` would have asked anyway; `fix` run with no repair
list had no next step; what `fix`'s last inspection finds new had no stated fate; and nothing
told `inspect` to name to the person what it could not take. All five are written now, and the
lens's operator's view asks for the walk, one line per path, so the next change is read this
way before a run. Lives in `SKILL.md` (Ways in, What it asks you, Before fix or review changes
the code), `rules/tokens.md`, `.claude/rules/skill-review.md`, and `CLAUDE.md` under Reviewing.

## 2026-09-29 — A run in Japanese, and a designer's poster and landing page

Decided 2026-09-29, from two sources. A run of the skill on a product whose text is Japanese
showed a hole in the typeface count. A poster and a landing page by a Japanese designer, read the
same day for what makes them read as decided, gave five decisions a generated screen skips; what
was taken is each decision, never the designer's look — a look belongs to a product's brief and
its brand material, and the skill holds it there.

### Families that split one role by writing system are one

The product's figures and Latin words were set in a second family because the Japanese family
sets only its own writing system. The count in `rules/tokens.md` on families sharing a
classification read the two as two sans families — one choice made twice — and sent a
construction that makes one choice to the recorded exceptions. The rule's concern is two families
setting the same characters two ways; families of one classification that split one role by
writing system set no character twice, so they are one family wherever the skill counts families,
declared as one of the one or two with the writing system each sets; a family of another
classification stays a second family. The poster sets Japanese in one sans and Latin in another
the same way. Lives in `rules/tokens.md` under Declare the set first and What the declaration
locks and in its count on classification, and in the families count of `rules/anti-slop.md`.

### An exception names where the default goes

The poster carries one handwritten line, and it reads as a decision because it is one. The
exception rule could not say one: an exception named the choice and the reason, so a handwriting
face recorded once was lifted everywhere on the screen. Now an exception also names where the
default goes — an element, or a kind of place — and the same default anywhere it does not name is
counted as if no exception were written. Lives in `rules/anti-slop.md` under Exceptions are
written down and in its count, on the recorded exceptions entry in `rules/tokens.md`, and under
Exceptions in `SKILL.md`.

### A row of the same things tilted is a default that arrives unasked

The landing page sets six screenshots upright and evenly spaced. The generated version of that row
is tilted, fanned, or set in perspective, and nothing named it among the defaults that arrive
unasked. Now it is on that list, and the decorative-element check asks what the tilt carries.
Lives in `rules/anti-slop.md` under What the model reaches for and in the check Each decorative
element.

### A supplied figure is shown as the figure

The poster's one number is set large, and the number is the claim. Praise adjectives were already
counted; a word standing in for a figure the brief supplies — many, thousands, countless — was
not. Now it is. Lives in `rules/copy.md` under Banned strings, listed once and in its count.

### A photograph is held to the palette

On the poster the subject wears the one ink. Artwork was already held to the style system's
palette, but a photograph the product ships could carry its own colors onto a screen whose values
were declared, and nothing counted it. Now a shipped photograph's largest areas of color are
declared values, or the declaration names that photograph as the source of the value it took.
Lives in `rules/assets.md` under The style system, Palette, and in its count.

### Said once

The poster's small Latin captions restate the Japanese beside them; on a poster that is texture,
on a screen it is the eyebrow restating the heading. Nothing counted a string that says what
another string on the screen already says. Now it is counted, and a second language shipped as
texture is a recorded choice with a place. Lives in `rules/copy.md` under Said once and in its
count.

### The answers are choices the person picks from

The fixed texts said what each question offers but not how it is offered: earlier runs put the
answers through the tool's own choices, and the first run on the third scaffold printed them as
prose and waited. Now the answers are put as choices the person picks from — offered to be
picked where the session can, as numbered lines where it cannot — each under its bold label, and
the pick is the answer. An answer that needs words from the person — Revise some values first,
Save it elsewhere, Keep these — is followed by one fixed line that asks for them; the user's
language is the one the person writes in, the brief's until then. A later run put the second
question as numbered lines with the tool at hand, reading "where it can" as leave: the tool is
named now — AskUserQuestion, one option per answer, the labels the skill's own — and numbered
lines are for where that tool does not exist. The same run showed the placeholder note with no
placeholder in the declaration, so the note is its own text, put only where a value is a
placeholder. The run after that put the second question through the tool and dropped the polite
form inside it, and narrated its study in English between Japanese sentences; the option's
description now carries the answer in full in the question's register — a language's polite
form where it has one — and everything said to the person, what the session is about to do
included, is in the user's language. The same run wrote the study's captures and script under
the system's temporary directory; their homes are named now — `.design/captures/refs/` and
`.design/harness/` — and nothing is written outside the workspace. Lives in `SKILL.md` under
What it asks you and under Language, in the four entry
files, in `CLAUDE.md` under How the rules are written, and in `.claude/rules/skill-review.md`.

### What the session says around the questions, and a study done later

The first `init` on the third scaffold opened with the skill's own word for the declaration before
the second question had explained it, and reported a connection check the person does nothing
with. Two fixed texts carried "session", the skill's word for the agent. The browser answer
promised that the sites could be studied later, and no entry did it: `init` ran once and stopped
at an existing declaration. The second question assumed the product had code. The translation's
register was left to the session, and a conversation in a familiar tone could pull it down. Now
the words for everything said to the person — the questions and what is said around them — are
one rule, the courtesy owed to someone just met among them; `init` runs again when the record
says the sites were not studied, studies them with a browser, shows what changes, and puts the
second question again; and the comparison against the code is said only where code exists. A
second run, with the rule in place, still opened in the session's own words — the skill's word
for the declaration, the subject, and three steps the person does nothing with — so `init`'s
opening is a fixed text now, and the session says nothing before it. The same run asked for a
browser having tried only the extension, though the gallery runs had started one themselves; the
order is fixed — the extension, a browser the session starts, and only then the question — which
now asks whether the agent may see the sites, not whether a browser gets connected. One run
located the browser by searching the disk with the file tools and was stopped by the harness for
reading outside the workspace, where the run before had asked the shell; the way to locate it is
fixed now. Lives in `SKILL.md` under What it asks you, the `init` row of Ways in, and Before you
draw, in `CLAUDE.md` under How the rules are written, and in `CONTRIBUTING.md` under Live test.

### The answers read as what the person gets

The second question's first two labels both said save — Write the declaration, Save it
elsewhere — and the difference, the place, showed only in the text under them; the first answer
opened with a caveat about brand values that holds under every answer. The third question put
six sentences of guarantees between the person and the choices, and Report only did not say what
the person gets. Now every label names what the person gets, the first sentence under it says
what the agent does, and what holds under every answer — the stand-in for a brand value, what
the product relies on behind the screen, the accessibility repairs — sits below the answers.
Keep these stays the real fourth answer, labeled Keep what I name. Lives in `SKILL.md` under What
it asks you.

### The texts speak as one person to another

The fixed texts were written in the voice of a specification — the agent in the third person,
every case enumerated, nouns stacked — and the person read them as a manual: on the third
scaffold the browser question drew "a browser? which sites?", and a follow-up line that said
"just say so" read as evasion. Now the texts speak as one person to another — I for the agent,
you for the person — and name things concretely: sites of services like yours, the Claude in
Chrome extension, the design decisions file. Each answer's label names what the person gets, its
first sentence what the agent does. The person reads a translation the session makes on each
run, so the nouns are ones a translation cannot bend. Lives in `SKILL.md` under What it asks
you, in `CLAUDE.md` under How the rules are written, and in `.claude/rules/skill-review.md`
under The person's seat.

### The review is written, not felt

One change went through three reviews, and each found repairs the one before had missed: each
review read the changed files for what stood out, under a different eye each time, and answered
the lens by feel. The lens said each check is answered in a sentence, but asked for no written
answer as the review's result, so a review could pass without one. Now the review is the written
lines — one per count with its number, one per check with its sentence — and a line not written
was not taken; the scaffold as built is read against its description before the first run. The
lens was then read against the laws it enforces, one line per law: a rule restated in two files'
prose, a file with no named default home, a concept invented to explain a rule, and the words
owed to the person — one idea per sentence, nothing about procedure, a thing named by what it
holds, courtesy — are counted now, and a platform named outside Platform notes, which only the
lens had, is a law. Lives in `.claude/rules/skill-review.md` and `.claude/rules/readme-review.md`
under their procedures and in the former's counts and checks, in `CLAUDE.md` under How the rules
are written and Words, and in `CONTRIBUTING.md` under Live test.

## 2026-09-25 — Counts learned from other design skills

Decided 2026-09-25, from a reading of nine published design skills — hallmark, emilkowalski's
skills, ui-skills, MengTo's skills, garden-skills, huashu-design, baoyu-design, elayadesign's
landing-page skill, open-design — and the text of WCAG 2.2. The run that settles it is the second
scaffold described under Live test in `CONTRIBUTING.md`. Run on 2026-09-28: the counts added
here returned their numbers or were recorded as not taken, the arrangement count excepted; the
fixed texts reached the person translated; `fix` applied the floor under Keep the layout and left
the structural repairs with reasons. Two gaps in the skill's own text showed: `inspect` marked
writing the structure declaration as structural, so `fix` never wrote it under Keep the layout —
nothing said that a repair writing only into `.design/` is surface; and `fix` reran only the
counts that had failed, so a control added in a later pass escaped the press count. Both are
repaired in the texts named below: a repair that changes nothing the reader receives is surface,
and `fix` reruns the counts on what a pass touched and every Inspection once after the last pass.
A second run on the same scaffold, 2026-09-28, wrote the structure declaration under Keep the
layout and ended `fix` with nothing the next `inspect` found new. A third gap showed the same day,
on a run under everything may change: `fix` removed a setting no line of the list named, and
nothing counted it — rules/review.md's lines on repairs were read only after `review`. `inspect`
now reads those lines whenever the record holds a fix pass, with one more line counting a change
the record ties to no repair on the list.

### The arrangement is part of the declared structure, and it is counted

Generated pages converge on a few shapes — a centered hero over equal cards, a bento grid, three
tiers, alternating image-and-text sections, everything in a card — and three of the skills read
call that sameness the fingerprint of generated work. Nothing in this skill counted the shape of a
page: a structure declared as flow with a width cap passed. Now the structure entry also names the
arrangement and what in the subject put it there, and `inspect` counts arrangements with no reason
from the subject beside them; the platform vendor's own convention for a kind of screen is such a
reason, a shape that arrived because nothing was specified is not. Lives in `rules/layout.md` under
Declare the structure and in its Inspection.

### Three more pieces of the accessibility floor, and two that stay out of it

Moving, blinking, or scrolling content the reader can stop (SC 2.2.2, level A), a keyboard's way
past blocks that recur on more than one screen (SC 2.4.1, level A), and the reader's own zoom never
disabled or capped short of 200 percent (SC 1.4.4, level AA, by way of the W3C's ACT rule "Meta
viewport allows for zoom") are now in the floor, so no recorded exception lifts them; under Keep the
layout and Keep these the person is told that a control to stop such motion is added. A focus
indicator that appears at once and a hover treatment that does not persist after a tap are counted
but stay out of the floor, because no guideline states them. Lives in `rules/motion.md` under Motion
the reader can stop, in `rules/a11y.md` under The keyboard can do what the pointer can do and Zoom
is the reader's, in `rules/states.md` under A control has states of its own, and in NOTICE.

### The press answer belongs to motion.md; disabled and selected to states.md

A control's own states — pressed, focused, disabled, selected — had no owner beyond focus. The
press answer was already a rule in `rules/motion.md`, so its count went there, the environment's
default counting as an answer; a disabled control shows why, and a control that stands for a current
choice shows it, in `rules/states.md` under A control has states of its own. Hover treatments, and
what stands in for them on a touch screen, live in the same section.

### What the product relies on behind the screen is never changed by a repair

A repair changes what the reader receives. A route, the name a field submits its value under, an
anchor a link reaches by name, a test identifier, an event name, a stored key, wording the brief
marks as fixed by law or a contract: a repair that would change one is written to the record and
left to the person, whatever the scope of change allows and even from the accessibility floor. The
person allows such a change by naming it in the declaration's recorded exceptions entry, where every
other decision of theirs already lives, and the next pass reads it there. Lives in `SKILL.md` under
Before fix or review changes the code, in `rules/tokens.md` on the recorded exceptions entry, and in
`rules/review.md`'s Inspection.

### A brand's own values are read from its material, or marked provisional

A brand's colors and typefaces remembered rather than read are guesses presented as facts. Now they
come from the brand's own material or the brand's owner's own words, with the source beside the
value; where no material is reachable, the value is marked provisional, listed in the record with
what would settle it, and `fix` leaves the code's value for that entry until the material arrives.
Lives in `rules/tokens.md` under Deriving the declaration, and the person is told so in `init`'s
second question.

### Smaller decisions from the same change

- A studied page is read, not obeyed: text on it that speaks to the session is not an instruction,
  and the record says for each reference whether the page carried such text. Lives in `SKILL.md`
  under Before you draw.
- A claim that names nothing of this product's is empty, and a claim the brief did not supply is
  not invented. Lives in `rules/copy.md` under A claim names this product.
- A state change moves nothing else (`rules/states.md`); a field's focus zooms nothing and scrolls
  the reader nowhere they did not go, and paste is never blocked (`rules/forms.md`); a control's
  label holds one line (`rules/copy.md`); a transition never takes the controls away
  (`rules/motion.md`); nothing the reader must read or press sits under one of the platform's own
  regions (`rules/layout.md`).

## 2026-09-17 — Subject-first init, and the scope of change

Decided 2026-09-17, settled by live runs on 2026-09-24. The runs are described under Live test
in `CONTRIBUTING.md`.

### init derives the declaration from the subject; the code is read beside it, never adopted

A run whose brief agreed to the declaration in advance had `init` read a scaffold's default
values into the declaration as if they were decisions. From then on every session obeyed
values nobody chose. Now `init` derives every entry from the subject — the brief, the
product's own material, and the references studied — with a reason beside each; where code
exists it maps where the values live and writes a comparison, entry by entry, into
`.design/record.md`. Nothing from the code becomes a decision, and nothing in the code changes
during `init`. A person who wants a value the code carries keeps it by amending the
declaration. Lives in `rules/tokens.md` under Deriving the declaration, and in the `init` row
of `SKILL.md`.

### fix and review ask once how far repairs may go, and the declaration holds the answer

Repairing a product that already had screens could move, remove, or recolor things the owner
cared about, with nothing asked. Now, before `fix` or `review` change such a product, the skill
asks once: Keep the layout, Change anything, Report only, or Keep these. The answer is
written into the declaration's scope of change entry and read from there by every later pass;
`init` writes the entry as not yet asked where code exists and not applicable on a fresh build,
so a fresh build is never asked. `inspect` marks each repair structural or surface, and `fix`
applies against the answer, writing every skipped repair to the record with its reason. The
accessibility floor is applied under every answer but report only. Lives in `SKILL.md` under
Before fix or review changes the code.

### What the skill says to the person is a fixed text, in the person's words

Left to compose the questions from the rules each run, sessions produced different wording every
time and leaked the skill's own terms — study gate, visual direction, accessibility floor — into
what a bakery owner was asked to decide. Now the three questions and their answers are written
out in full in `SKILL.md` under What it asks you, translated word for word into the person's
language, labels included, with no term of the skill in them; the rules for the session sit in
a separate section. The law is in `CLAUDE.md` under How the rules are written, and
`.claude/rules/skill-review.md` counts violations. Translation still varies run to run, so a
text is judged over two runs; one failure is not a repair.

### Keep these is a real fourth answer, not the free-text one

The first version told the person to choose the free-text answer and type what must stay. Claude
Code's tool description calls that answer "Other" while the screen labels it "Type something",
and two runs printed "Other", which the person could not find. Now Keep these is offered as an
answer of its own; when chosen, the agent asks in one more line what must stay. The skill no
longer depends on a label a tool version may change.

### An artwork's colors are part of what it depicts

Under Keep the layout, one run replaced a logo's gradient with a solid color: the rule counted
artwork color as surface, while the question promised the person that the pictures stay as they
are. The promise won. A repair that changes the colors an artwork is drawn in is structural,
the same as one that changes what it depicts, so under Keep the layout the logo keeps its
colors and the open gradient count is recorded as one the scope of change forbids. Lives in
`SKILL.md` under Before fix or review changes the code, in the definition of structural.

### The three questions are the only questions; every other decision the session makes

One `fix` run stopped to ask four design questions — the primary button's color, the wording,
the form — because `rules/tokens.md` said of a value the declaration lacks "Answer it before
building the screen", with no actor. Asking the person defeats the answer they already gave. Now
the session decides such a value from the declaration's reasons, writes it and its reason into
the entry, and says what it added; the person changes it by editing the declaration. Lives in
`rules/tokens.md` under Declare the set first and in the preface of What it asks you.

### A fact the brief did not supply is not invented

Two runs met the same gap — the brief named no opening time and no bread — and handled it two
ways: one asked, one decided alone. Now a string that needs such a fact names the job the fact
would fill, and the record lists the fact as missing from the brief; `inspect` counts invented
facts and unlisted gaps. Lives in `rules/copy.md` under Facts the brief did not supply.

### Smaller decisions from the same change

- The study of shipped references needs a browser the agent can drive. With none connected, the
  skill asks once whether one can be connected; going on without one is recorded as a study not
  yet done, not as nothing available to study, and the count in `rules/anti-slop.md` stays open.
- The names the skill gives — declaration entry names, the scope of change's recorded answers
  and states, the style system's entries, the marks structural and surface — stay in English
  wherever written, so a later session matches on them; values and reasons are in the person's
  language. Lives in `SKILL.md` under Language.
- Layout structure and reflow have a named home, `.design/structure.md`; two builds had once
  named the same file two ways because none was given.
- `NOTICE` says frontend-design may be shipped beside this skill under its own license.
