# Vocabulary

The terms every file of the skill shares, and the file that defines each. For whoever writes or
reviews a rule.

One name per concept, across every file. A term is defined in the sentence where the owning file
first uses it; every other file uses the same word.

| Term | Means | Defined in |
|---|---|---|
| the subject | The brief, the product's own material, and the references studied — what every value is derived from | `rules/tokens.md`, Deriving the declaration |
| the declaration | The file holding the person's design decisions | `SKILL.md`, What this skill writes |
| the repair list | `.design/repairs.md`: what `inspect` hands to `fix`, deleted when `fix` ends | `SKILL.md`, What this skill writes |
| the scope of change | The declaration entry answering how far repairs may go: structure kept, everything may change, report only, kept: … | `SKILL.md`, Before fix or review changes the code |
| structural, surface | The two marks `inspect` puts on a repair | `SKILL.md`, same section |
| provisional | The mark on a brand value whose material was not reached | `rules/tokens.md`, Deriving the declaration |
| the accessibility floor | The counts no recorded exception lifts | `rules/a11y.md`, opening paragraph |
| recorded exceptions | The declaration entry where a chosen default, where it goes, and its reason, or a granted change behind the screen, are written | `rules/anti-slop.md`, Exceptions are written down |
| the repair list | What `inspect` returns | `SKILL.md`, Ways in |
| a count, a check | An Inspection line returning a number; one answered in a sentence | `SKILL.md`, Ways in (`inspect` row) |
| not taken | A run's word for a count the workspace could not drive, said in its last message with what would take it | Each count that says it |
| the arrangement | What a surface opens with, what follows, what closes it | `rules/layout.md`, Declare the structure |
| the generated defaults, arrived unasked | The few shapes generated pages converge on; a shape nobody chose | `rules/layout.md`, the arrangement count; `rules/anti-slop.md` |
| the platform's own regions | A status bar, a camera cutout, a home indicator, a system navigation bar | `rules/layout.md`, The platform's own regions |
| the primary input | The input the device is mostly operated with | `rules/states.md`, A control has states of its own |
| the environment, the environment's default | The platform's toolkit or browser; what it draws when the product adds nothing | `rules/motion.md`, What drives it |
| a press answer | What a control shows within 100 to 150 ms of a press | `rules/motion.md`, What drives it |
| a claim | A string saying what this product is, does, has, or gives | `rules/copy.md`, A claim names this product |
| a title | A string naming a place — Settings, Recent | `rules/copy.md`, the string inventory |
| a transient message | A message that arrives and leaves on its own | `rules/motion.md` |
| the dimmed surface | What lies behind a modal or a sheet | `rules/navigation.md` |
| the control that summoned it | What opened a menu, a popover, a sheet | `rules/motion.md`, What drives it |
| focusable elements | The places the keyboard lands | `rules/a11y.md`, The keyboard can do what the pointer can do |
| the session, the agent | The same actor: the session in every rule; in the texts put to the person the agent speaks as I | `SKILL.md` |
| the person | The product's owner, who has never opened the skill: the reader of everything the session says to them | `SKILL.md`, What it asks you |
| the checked sizes | The widest and the narrowest supported width, each at the shortest height a reader is left there, and any window the brief, the data, or the person names | `rules/layout.md`, The sizes a screen is checked at |
| the area that answers a press | A control's target, measured where a press lands rather than where the control is drawn | `rules/states.md`, What a press lands on |
| a stop | Each place a screen reader halts and reads | `rules/a11y.md`, What the ear receives |
| taken by the person | A count the person took on their own device and reported; it stands until the code changes | `SKILL.md`, How `inspect` and `fix` end |
| the visual concept | The declaration entry naming the world outside the product's category whose look it borrows, what in the subject chose it, and its layout metaphor | `rules/tokens.md`, Declare the set first |
| the layout metaphor | The thing in the visual concept's world whose form every region of a screen takes — a route map's lines and stations, a card's ruled squares; never an interface part | `rules/tokens.md`, Declare the set first |
| the signature | The declaration entry naming the one element the product is remembered by, what it carries, and where it sits — before any scroll, on at least one screen, at every checked size; the peak of a screen the concept runs through | `rules/tokens.md`, Declare the set first |
| the artwork | The declaration entry naming the picture the first view shows at every checked size, what it depicts, how it is treated, and where it comes from | `rules/tokens.md`, Declare the set first; `rules/assets.md`, Where a picture comes from |
| the references, the directions, the definition sites | Three declaration entries: what was studied before the direction was set; the screen set aside and the three directions, with the one taken; where the code's values live | `rules/tokens.md`, Declare the set first and Deriving the declaration |
| the screen got without trying | The screen a product of this kind gets when nothing is chosen; two of the reach-for list's defaults on one screen make it | `rules/anti-slop.md`, What the model reaches for |
| a flood | A color declared as a surface it fills across a large share of the screens it names; not the accent | `rules/tokens.md`, Declare the set first |
| the product's category | The kind of product it is — a timer among timers; where the skeleton and the readers' conventions come from | `SKILL.md`, Before you draw |
| the runner | The tested script this skill carries for one platform, taking the counts any product on it needs from a rendered screen, an interaction, or a recording; the web's is `runner/web/run.mjs` | `SKILL.md`, What this skill writes |
| the reviewer | An agent on the session's own model, started in a context of its own, that answers the checks read off a capture from the captures, the visual concept and signature entries, and the check lines alone; it reads `reviewer.md` | `rules/review.md`, A reviewer who has not read the reasons |
| the inventory | What `fix` and `review` record before the first pass and after the last: where each link goes, each field's submit name, each id a link reaches, each test identifier and event name, each control and its name | `rules/review.md`, Rebuild in small passes |
| a compaction | Claude Code replacing a conversation's earlier turns with a summary when its context fills | the four entry files; `rules/review.md`, Platform notes |
| a helper | A second agent on a smaller, faster model that writes what the session decided: every script under `.design/harness/`, and a pass's repairs where the session chooses | `rules/review.md`, Rebuild in small passes |
| families that split one role by writing system | Families of one classification, each setting the characters the others do not, where the product's text spans more than one writing system; one family wherever the skill counts families | `rules/tokens.md`, Declare the set first |

Terms the skill does not use, and what it says instead: toast or notice → a transient message;
helper line → a help or character-count line, described, not named; the active state → the
selected state; navigation item → a link in a navigation; headline → a claim or a title; trigger
→ the control that summoned it; overlay → the dimmed surface; supported size → supported width,
supported device, or the checked sizes where a height counts too; hit area → the area that
answers a press; layout skeleton → the arrangement; mark, for a brand's symbol → a symbol the
product gets from the brand's own material; protected contract → what the product relies on
behind the screen, said in words; the scope → the scope of change; field, for a color filling a
surface → a flood; field, for the kind of product → the product's category (a field is a form's
input, and nothing else).
