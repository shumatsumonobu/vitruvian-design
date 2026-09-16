# gallery/

Seven pages, each beside the image the repository README shows of it, under one name —
`quire.html` and `quire.png`, `blurt.html` and `blurt.gif`. Every page is one HTML file
with no build step, one theme, exactly as its run left it; open it in a browser. The pages load
their webfonts by link, so they need a network connection for the type. The images are made by
`scripts/capture.mjs`, and `scripts/capture-log.json` records how each one was made.

This file is the source of truth for the prompts. Each block below is the whole text that was
pasted into one `/goal` — Claude Code's built-in goal loop — in a fresh directory with the
design-discipline and frontend-design skills installed (the repository [README](../README.md)
carries the install block). The repository README quotes these
blocks, and `scripts/check-readme.mjs` checks that the quotes still match. No record states
whether its run ended on the done condition or on the turn cap; what each run left open is
listed in the repository README, not here, and is the measure of how far it got.

## How a prompt is built

Every prompt has the same shape: what the page is and its one job — to stop a stranger
scrolling past; the mechanics of that kind of beauty, taken from studying shipped references
and written as mechanism (how hard a point is, where the light sits, how the density falls
off) rather than as mood; one sentence tying the beauty to the product's function; a list of
failure modes seen in earlier runs, forbidden by name; and a common tail. "The look asked for"
under each page names the kind of reference the prompt was written from, not what the run
studied — each run chose its own references, and its record, in its workspace outside this
repo, says which.

The tail, identical on six of the seven:

> One theme only, the one that serves this product best — no light/dark pair, no theme control,
> no following the system setting. Before calling it done, put your hero capture beside the
> strongest reference you studied, write three ways yours is weaker, and fix the two that matter
> most at the size it will be seen — a single image about 840 px wide. Single self-contained
> index.html, no build step; a webfont loaded by link is fine. Run init first; the derived
> declaration and its default .design/ home have my agreement in advance. Done when the screen
> renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns

The previous generation of these prompts taught the tail its current wording. Asking for both
themes — "Design both themes as their own scenes" and "Done when the screen renders in light
and dark" — led four runs out of five to add a theme switch nobody asked for; "stun as a
gallery thumbnail" led a run to optimise for a thumbnail-sized reduction. The tail now names the
conditions a reader will actually see: one theme, one image about 840 px wide.

## BLURT

`blurt.html` — an onboarding screen for a sticker app, with a three-second entrance. The look
asked for: a sheet of die-cut stickers that read as paper objects under one light. A rebuild of
an earlier page, not in this repo, made from a first version of this prompt; the prompt now
names four mechanics that page lacked — stickers that read as stickers (a kiss-cut border,
paper texture, one light, a curl), subjects named as one artist's set, the sticker burst itself
as the composition, and a noon sky with one cloud mass behind the logotype. Its tail differs
from the others in one clause: the entrance has to be verified against a recording with the
frame rate read off a measurement, and the run may take twenty turns instead of fifteen.

```text
/goal using the design-discipline and frontend-design skills, build an onboarding welcome screen for a fictional sticker app. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop — and then to play like a little show on load. The mechanics of this kind of beauty: stickers that read as stickers — each a die-cut shape with a white kiss-cut border, matte printed-paper texture, one shared light, a slight curl at one edge; the subjects one artist's set of everyday things with faces, foods, and handwritten one-word speech bubbles, forty or more, every one a character; the composition is the burst itself — densest around a chrome balloon-letter logotype at the centre and thinning toward the edges — over a vivid noon sky with one soft cloud mass behind the logotype to hold the centre; and one glass orb as the single control, this product's own button. Entrance choreography of roughly three seconds, staged like theater: the orb sinks in slowly from the foreground, hangs for a beat of anticipation, then slams the centre with an exaggerated squash; the stickers launch from the impact in three or four waves, each wave with its own direction and character, decelerating floatily and settling with a strong springy overshoot and a slight spin; once everything lands, the stickers keep an almost imperceptible idle drift so the board feels alive. Arriving by opacity alone is a failure; every sticker must travel. The beauty is functional: the stickers are what the app makes, and the burst is what sending one feels like. Forbidden: bare geometric primitives — plain spheres, stars, hearts, crosses; glossy 3D blobs with no paper edge; an even wallpaper spread with no focal mass; a flat gradient sky; a glass orb that quotes someone else's interface. Record the long duration, the overshoot, and the idle drift as declared exceptions; cross-fade under reduce-motion. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders, the entrance is verified against a recording with the frame rate read off a measurement, and the applicable design-discipline inspection counts all pass, or stop after 20 turns
```

## Quire

`quire.html` — a product-launch hero for an e-ink tablet. The look asked for: a product page as
a cathedral of white space.

```text
/goal using the design-discipline and frontend-design skills, build a product-launch hero for a fictional minimalist e-ink tablet. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop. The mechanics of this kind of beauty: a serif headline at a scale that owns the frame, one product render so finely drawn it looks photographed — real material, real shadow, a beautiful page of a book on its screen — and white space staged like a cathedral around exactly two objects. Nothing else on the page. The beauty is functional: the page on the screen is the product doing its one job. Forbidden: a product that reads as a flat rounded rectangle; timid type. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns
```

## Asterism

`asterism.html` — a landing hero for a collective-knowledge platform. The look asked for: named
star clusters on a deep sky. An earlier direction, a brain drawn in stars, was dropped after
three runs — a silhouette to reproduce was the failure mode, and clusters with their own
geography remove it.

```text
/goal using the design-discipline and frontend-design skills, build a landing hero for a fictional collective-knowledge platform. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop. The mechanics of this kind of beauty: thousands of small, hard, crisp canvas-drawn light-cores clustered into constellations on a deep navy ground rather than pure black — sharpness is what reads as light; softness reads as dirt — big soft glows reserved for a dozen hero stars at most, three luminous hues, and each cluster carrying a small quiet label naming a field of knowledge. One line of copy, one action. The beauty is functional: every point is one note somebody kept, every cluster is a field the community built, and the sky is what they know together. Forbidden: large blurry sprite blobs; a murky mid-field; forcing the sky into any silhouette — the clusters make their own geography. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns
```

## Dispatch

`dispatch.html` — a landing page for an email API. The look asked for: layered near-blacks with
one neon hue.

```text
/goal using the design-discipline and frontend-design skills, build a landing page for a fictional email API for developers. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop. The mechanics of this kind of beauty: blacks with depth — layered near-blacks that read as velvet, never one flat #000 — one neon hue that genuinely glows, with bloom and a reflection pooling on the surface beneath it, and a code block lit like the only prop on a dark stage. Everything that is not the neon or the code sits barely above black. The beauty is functional: the code shows the API doing its one job — sending an email — and the neon marks the line that does it. Forbidden: a second accent hue; flat darkness; a code block that reads as a grey box. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns
```

## The Roast Ledger

`roast-ledger.html` — a sales dashboard for a coffee roaster. The look asked for: serif
analytics set on warm paper.

```text
/goal using the design-discipline and frontend-design skills, build a sales-analytics dashboard for a fictional specialty coffee roaster. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop. The mechanics of this kind of beauty: it reads as a beautifully printed broadsheet — warm paper ground, serif numerals so large they are the poster, charts drawn as fine engravings in hairline ink strokes with nothing that looks like a chart library, and margins generous enough to feel expensive. The beauty is functional: every chart stays honestly readable — engraving is how the data dresses, never what replaces it. Forbidden: grey dashboard chrome; default chart styling; small timid numbers. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns
```

## Lamplight

`lamplight.html` — a landing page for a team of AI agents. The look asked for: a fully
illustrated world in one hand.

```text
/goal using the design-discipline and frontend-design skills, build a landing page for a fictional team of AI agents. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop. The mechanics of this kind of beauty: a fully illustrated world in one commissioned hand — a row of characterful agent portraits, each distinct but unmistakably one artist's set, drawn scenery carrying the whole page, the interface furniture almost disappearing into the illustration. All artwork as inline SVG, one declared style system governing every drawing. The beauty is functional: each portrait is an agent with a nameable job, and the scenery shows that work being done. Forbidden: clip-art mismatch between drawings; a decorated page instead of an illustrated world; portraits that read as circles with initials. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns
```

## Deep field

`deep-field.html` — a typographic poster mapping deep space. The look asked for: display type so
large it becomes the map.

```text
/goal using the design-discipline and frontend-design skills, build a typographic poster-page mapping deep space. Its one job is to stun as a single image in a gallery — a stranger scrolling past must stop. The mechanics of this kind of beauty: enormous display type, letter-spaced until the words themselves become the map, running edge to edge of the frame — scale so aggressive it feels like standing under it — over a living starfield that stays behind the type. Nothing but typography, and typography is enough. The beauty is functional: the letters map something real — names and distances a reader can actually read. Forbidden: type that fits comfortably; decoration competing with the letters; a starfield that upstages the words. One theme only, the one that serves this product best — no light/dark pair, no theme control, no following the system setting. Before calling it done, put your hero capture beside the strongest reference you studied, write three ways yours is weaker, and fix the two that matter most at the size it will be seen — a single image about 840 px wide. Single self-contained index.html, no build step; a webfont loaded by link is fine. Run init first; the derived declaration and its default .design/ home have my agreement in advance. Done when the screen renders and the applicable design-discipline inspection counts all pass, or stop after 15 turns
```
