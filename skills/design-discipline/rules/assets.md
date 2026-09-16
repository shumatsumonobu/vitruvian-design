# Artwork

Artwork the declared symbol set cannot supply: illustration, spot art for an empty surface,
imagery at the top of a screen, a product depicted on the page, an icon nobody has drawn yet. A
set assembled one image at a time reads as twelve stock images rather than one commission, and
the difference is decided before any of them exists.

The medium does not decide whether this file applies. Artwork generated as an image and artwork
drawn in code — CSS, SVG, canvas — answer to the same system; a depiction built from gradients is
still a depiction. An operable control stays with the declaration however pictorial its surface —
this file governs artwork that presents, not controls that operate. A background wash that
depicts nothing stays with the declaration and rules/anti-slop.md; this file takes imagery that
depicts something.

This file covers what the artwork has to be. How it gets produced — how many attempts, at what
size, exported how — is production work and is not settled here.

## The style system, written once

Before the first asset exists, four entries go into `.design/style-system.md`, beside the token
declaration — that is the default home, and the declaration's own home wins where the project
chose one.

- **Style family.** Exactly one, named: flat two-tone, gradient mesh, three-dimensional clay,
  paper collage, drawn line, photographic. A set carrying two families is two sets.
- **Palette.** Three to five values lifted from the token declaration, and among them the exact
  surface color the assets will sit on. Artwork composed against a surface it will never appear on
  comes back wrong at integration.
- **Light and texture.** The words themselves, not the intent: where the light comes from, how
  hard it is, whether anything is glossy. The same words carry into every asset in the set.
- **Subject grammar.** What the artwork is made of — a mascot, abstract forms, objects, people —
  and if people, rendered how.

Four entries and one subject describe any asset in the set. That repetition is the whole mechanism
by which separate images read as one hand.

## What the artwork sits on

The background is the surface value from the style system, or true transparency. Anything else
means the asset carries a rectangle of the wrong color into a layout that did not ask for one.

An asset composed on a dark ground routinely shows a halo on a light one. Where the declaration
names two themes, either make a twin per theme or place the asset only on surfaces that do not
change between them.

## Composition answers to the layout

Artwork under a headline leaves the headline's third of the frame empty, and which third is
decided before the artwork is made rather than discovered afterwards.

Subject matter follows the state it serves. Art for an empty surface is quiet — something at rest,
not a scene in progress. Celebration reads through composition, an arc or a tilt, rather than
through drawn motion lines.

## Look at the edges

Inspect every asset at four hundred percent before it goes near a layout. A halo, a matte fringe,
or compression blocking around the subject sends it back — and in drawn-in-code artwork, a seam
between shapes, banding in a gradient, or an anti-aliased edge that breaks against its surface.
These artifacts are invisible at render size and obvious the moment the asset sits on a real
surface.

Trim to the content and give every asset in the set the same padding, so a set placed in a row
does not appear to drift up and down.

## Before it ships

Look at each asset in every theme the declaration names, on the surface it will actually occupy,
not on a checkerboard.

A product icon gets its own pass. Render it small — this skill's default is to check it at 60
pixels — and if the idea stops being legible there, the idea is too complicated rather than too
small.

## When to reject

Any one of these sends the asset back. None of them is a matter of taste.

- The style has drifted from the set: different light, different palette, different line weight.
- A halo, fringe, seam, or banding shows at four hundred percent.
- Text or a watermark got baked in.
- The composition fights the layout — the subject clips at a safe-area boundary, or the focal
  point sits under a control.
- It reads as the generator's default output with no art direction on it — for drawn-in-code
  artwork, as the layout engine's default: a flat rounded rectangle standing in for a thing.
- Stripped of the text around it, the depiction stops saying what it is. A device whose screen
  shows nothing and a product with no material is a placeholder wearing the subject's spot.

## Inspection

This Inspection runs wherever the product carries artwork, generated or drawn in code. Anything
drawn to stand in for a thing the page talks about counts as artwork the product carries,
however little of the thing it shows. A product using none skips it rather than failing it, and
the skip is recorded: one line in the record naming what was surveyed and why nothing on it
depicts a thing. An unrecorded skip is a failed Inspection, not a pass.

### The count

- Style families across the product: 1.
- Assets made before the style system was written: 0.
- Assets carrying baked-in text or a watermark: 0.
- Assets not yet viewed in every theme the declaration names, on their real surface: 0.
- Assets whose focal point sits under a control or clips at a safe-area boundary: 0.
- Assets in one set carrying different padding: 0.
- Depicted objects whose capture, cropped to the object alone, stops reading as their subject: 0.

### The checks

- The style system, from `.design/style-system.md`. Read back all four entries. A missing entry
  means the set has nothing holding it together, so write it before making anything else.
- Each asset at four hundred percent. State what the edge looks like against its real surface.
- Each asset against the reject list, one line per asset.
- Each depicted object, cropped from the capture with no text in frame. Say what the crop alone
  tells a reader it is — a tablet shows a page, a bottle shows glass. "A grey rectangle" sends it
  back.
- The product icon at small size. State what remains legible.

## Platform notes

- Where a platform masks the product icon into its own shape, supply the square artwork without
  transparency and without pre-rounded corners, since the mask will cut whatever it is given.
