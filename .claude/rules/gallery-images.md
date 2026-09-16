---
paths:
  - "gallery/**"
  - "scripts/**"
---

# Gallery images — how every image under gallery/ is made

Every image under `gallery/` is produced by `scripts/capture.mjs` — never by hand-run ffmpeg or
an ad-hoc script. Each image sits beside the page it shows, under the page's own name:
`gallery/quire.html` and `gallery/quire.png`, `gallery/blurt.html` and `gallery/blurt.gif`. The
tool fixes the spec in one place, `SPEC` in `capture-spec.mjs`, and `scripts/README.md` carries
the usage, the naming, and the provenance of every value in it. A README image that did not come
through the tool is a defect, because the next one will not match it.

- Still pages: `node scripts/capture.mjs still <source> <name>`, the source a repo-relative
  path or a URL. Motion (an entrance, a starfield): `motion`. Both write to `gallery/<name>`
  with the extension the mode decides.
- Every capture is recorded in `scripts/capture-log.json` — the source as given, mode, options,
  the `SPEC` it was made under, and the file's hash. That record is what `readme-review.md` counts;
  nothing else shows an image came through the tool.
- Changing a value in `SPEC` is a change to every image at once: re-capture them all in the
  same batch (the log then shows the new `SPEC` on every entry), and update the provenance
  table in `scripts/README.md` in the same change.
