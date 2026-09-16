# Copy

The frontend-design skill covers how interface words should read: naming things the way readers
name them rather than the way the system was built, describing instead of selling, active voice,
an action keeping the same name from the control through to the confirmation, failure and emptiness
as direction rather than mood, and a conversational tone with each element doing one job. Read that
skill for the writing itself. **This file does not restate it.**

What it adds is the part that cannot be done by writing well one string at a time: an inventory
that catches the same intent wearing three labels, and the constraints translation puts on a
layout.

## One label per intent

Two strings share an intent when activating either runs the same operation or lands the reader in
the same place. A product offering "Get started" on the home screen, "Start now" in the header,
and "Begin" in the empty state has one intent wearing three labels; two of them get deleted.

The surviving phrasing goes into a lexicon listing the intent, the phrasing, and every place it
appears; its default home is `.design/lexicon.md`, beside the declaration. Every action string in
the product appears in that lexicon. Written one at a time, all
three of those labels are good strings — the defect only exists at the level of the set, which is
why it needs an inventory rather than better writing.

## Banned strings, listed once

These and their variants do not appear, and the count below finds them: "Something went wrong",
"Oops", "Sorry", "An error occurred". Nor does any error text leaving the reader with nothing to do
next. This list is the only definition of the banned strings; where an error appears and when it
clears belongs to states.md.

Filler tokens, banned on the same terms: just, simply, easily, please, actually.

Praise adjectives, which belong to a product page rather than to an interface: powerful, seamless,
effortless, revolutionary, magical, blazing, unleash, supercharge, next-generation.

The lists name the English instances. The bans sit on the intent — apology, filler, praise — and
hold in every language the product ships; each shipped language's equivalents are recorded in the
lexicon and counted the same way.

## Numbers and dates are copy

Counts are abbreviated, prices carry their currency, trailing zeros are cut, and every numeric and
date string comes out of a locale formatter rather than being assembled from parts. One quantity
rendered two ways in one product is the defect this catches.

## Facts the brief did not supply

A fact a string needs — a time, a price, a name — that neither the brief nor the product's data
supplies is not invented. The string names the job the fact would fill, and the record lists the
fact as missing from the brief.

## Translation

Rendered length changes by a large factor between languages, in both directions. No layout depends
on how long a string is: no action control sized to fit its source-language label, no title assumed
to hold one line, no truncation used as a layout device.

Verify each surface with the longest translation on hand. Where no translations exist yet, pad the
source strings by the same multiple states.md uses for its long-content test. Build sentences from
whole strings with placeholders rather than by joining fragments, because word order and agreement
do not survive concatenation.

## Inspection

Run this before a surface is called finished. All-caps label styles and glyphs appended to action
text are counted in anti-slop.md, including the exception. Run that count in the same pass.

### The count

- Distinct phrasings per intent: 1.
- Actions whose verb changes anywhere between the control and the last record of it: 0.
- Labels naming an internal mechanism: 0.
- Praise adjectives in descriptive copy: 0.
- Filler tokens: 0.
- Reader-visible strings set in title case: 0 unless the declaration records a reason. Where the
  platform's own guidelines set standard actions in title case, that is a reason, and it gets
  written down like any other.
- Banned strings and their variants: 0.
- Error strings carrying an apology, first person, an exclamation mark, or no next move: 0.
- Terms outside the named audience's vocabulary that are neither replaced nor defined at first
  use: 0.
- Numeric and date strings assembled by hand rather than produced by a locale formatter: 0.
- Quantities of the same kind rendered in two different formats: 0.
- Reader-visible facts — a time, a price, a name — with no source in the brief or the product's
  data: 0. Facts the brief lacks that the record does not list as missing: 0.
- Layouts that break under the longest translation on hand, or under source strings padded by
  the states.md multiple: 0.
- Sentences assembled by joining fragments rather than built from whole strings and
  placeholders: 0.
- Action strings absent from the lexicon: 0.

### The checks

- The inventory. Every reader-visible string in the surface is listed with its location and its
  role: action, title, section label, placeholder, status, error, empty state.
- The verb trace. Each action is followed from the control through the in-progress state, the
  confirmation, and any later record, comparing the verb at every stop.
- The lexicon diff. The inventory is compared against the lexicon entry by entry. If a string has
  no entry, it is either added to the lexicon or rewritten to a phrasing already there.
- The audience. One phrase naming the audience sits with the lexicon. If no such phrase exists,
  write it before the inventory is read.

## Platform notes

- Where a platform publishes its own words for standard actions — the cancel and confirm pair in a
  modal, the back destination, share, settings — use those words rather than a synonym, because
  readers match system chrome across every app they own. iOS, Android, and desktop web each state
  these terms in their own interface guidelines.
- Where a platform centralizes reader-visible strings in a resource catalog, the inventory reads
  the catalog. Where strings live inline in view source, it extracts quoted strings from the view
  layer instead. The resulting table is the same either way.
- Number and date rendering goes through the platform's locale formatter. Hand-built numeric and
  date formats are a defect.
