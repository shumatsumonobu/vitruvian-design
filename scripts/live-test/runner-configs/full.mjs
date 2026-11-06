// Configuration for live-test/scaffolds/full, in the shape of skills/design-discipline/runner/web/README.md.
// The scaffold has no .design/. The sizes are the two a session is left with: a phone with the browser's
// bars shown, a laptop window under 125 percent scaling. The declaration values are READ FROM THE CODE
// (styles.css :root and the rules below it), not from a declaration: they are what the page does.
const day = 864e5;
const monday = (() => { const d = new Date(); d.setHours(7, 30, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); })();
const log = (offsets) => JSON.stringify(offsets.map((o) => ({ at: monday + o * day, minutes: 10 })));

export default {
  serve: ".",
  sizes: [
    { w: 390, h: 664, touch: true },         // chosen: a phone with the browser's bars shown
    { w: 1536, h: 730 },                     // chosen: a laptop window under 125 percent scaling
  ],
  declaration: {                             // read from styles.css, not a declaration
    colors: [                                // :root
      { value: "#faf8f3", role: "surface" }, // --paper
      { value: "#1d1b18", role: "text" },    // --ink
      { value: "#5f5a52", role: "grey" },    // --muted
      { value: "#d9622b", role: "accent" },  // --accent
      { value: "#0b0d12", role: "flood" },   // --night
    ],
    otherColors: ["rgba(0,0,0,0.4)"],        // the scrims of .help and .confirm::backdrop
    families: ["Hiragino Sans"],             // --font, first of the stack
    radii: ["8px", "16px"],                  // --radius and calc(var(--radius) * 2); 0 is not listed
    shadows: [],                             // the code uses none
    spacingUnit: 8,                          // --space
    contentWidth: 1024,                      // max-width: 64rem on the header, hero, routine, and log
    tapMinimum: 24,                          // rules/states.md, Platform notes
  },
  screens: [
    {
      name: "cover",
      path: "/",
      states: {
        populated: { storage: { "asanobi-log": log([0, 1, 2]) } },
        firstrun: { storage: {} },
      },
      long: { storage: { "asanobi-log": log([-40, -30, -20, -10, 0, 1, 2, 3, 4]) }, pad: 3 },
      names: [".pose-name", ".player-pose"],
      layers: [
        { name: "help", open: ".help-open", close: ".help-close", box: "[role=dialog]", dimmed: ".help" },
        // the full-screen guide: nothing is written to the history when it opens. A press at the middle of
        // the start button lands on the transparent box over it at these sizes, so the guide is opened with
        // the page's own click on the button; the keyboard check opens it from the button with Enter.
        { name: "guide", open: async (r) => { await r.eval(() => { document.querySelector(".start").click(); return true; }); }, opener: ".start", close: ".player-close", box: ".player" },
        // the result layer: reached by finishing the session, which the page's own finish() does; it leaves by itself
        {
          name: "result",
          open: async (r) => { await r.eval(() => { document.querySelector(".start").click(); finish(); return true; }); },
          box: ".result",
          skipBack: true,
        },
      ],
    },
  ],
};
