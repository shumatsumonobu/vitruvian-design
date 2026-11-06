// Configuration for live-test/scaffolds/cover-stamped, in the shape of
// skills/design-discipline/runner/web/README.md. Values come from the scaffold's
// .design/structure.md (sizes) and .design/declaration.md (the declaration).
const day = 864e5;
// Monday 07:30 of this week, as the product counts the week (Monday first)
const monday = (() => { const d = new Date(); d.setHours(7, 30, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); })();
const log = (offsets) => JSON.stringify(offsets.map((o) => ({ at: monday + o * day, minutes: 10 })));

export default {
  serve: ".",
  sizes: [                                   // .design/structure.md, checked sizes
    { w: 360, h: 548, touch: true },
    { w: 1920, h: 900 },
  ],
  declaration: {                             // .design/declaration.md
    colors: [                                // colors, grey family
      { value: "#1F3461", role: "text" },    // ai
      { value: "#C23A22", role: "accent" },  // shu
      { value: "#FFFFFF", role: "surface" }, // kami
      { value: "#EEF2F7", role: "surface" }, // daishi
      { value: "#46587C", role: "grey" },    // ai-70
      { value: "#7486A8", role: "grey" },    // ai-rule
      { value: "#E2E8F1", role: "grey" },    // ai-10
    ],
    otherColors: ["rgba(31,52,97,0.48)", "rgba(31,52,97,0.2)"],   // elevation scale: the scrim and the shadow's color
    steps: [                                 // type scale
      { name: "display", size: [40, 32], weight: 700, letterSpacing: 0.04, lineHeight: 1.4, display: true },  // 2.5rem, 2rem under 600 px
      { name: "title", size: 20, weight: 700, letterSpacing: 0.12, lineHeight: 1.5 },
      { name: "item", size: 18, weight: 700, letterSpacing: 0.04, lineHeight: 1.5 },
      { name: "lead", size: 18, weight: 400, letterSpacing: 0.04, lineHeight: 1.8 },
      { name: "body", size: 16, weight: 400, letterSpacing: 0.04, lineHeight: 1.8 },
      { name: "label", size: 16, weight: 700, letterSpacing: 0.08, lineHeight: 1.5 },
      { name: "small", size: 15, weight: 400, letterSpacing: 0.04, lineHeight: 1.7 },
    ],
    families: ["BIZ UDPGothic"],             // typefaces
    radii: ["8px", "9999px", "50%"],         // radius scale: card, pill, circle (none is 0)
    shadows: ["rgba(31, 52, 97, 0.2) 0px -8px 32px 0px"],   // elevation scale: overlay
    spacingUnit: 8,                          // base spacing unit
    lineLengthEm: 36,                        // maximum line length
    contentWidth: 640,                       // maximum content width, 40rem
    curves: ["cubic-bezier(0.2, 0.9, 0.3, 1)"],   // ease-out curve
    tapMinimum: 24,                          // rules/states.md, Platform notes
  },
  screens: [
    {
      name: "cover",
      path: "/",
      states: {                              // structure.md, the cover's states
        populated: { storage: { "asanobi-log": log([0, 1, 2]) } },
        firstrun: { storage: {} },
        empty: { storage: { "asanobi-log": log([-20, -13]) } },
        error: { blockStorage: true },
      },
      long: { storage: { "asanobi-log": log([-40, -30, -20, -10, 0, 1, 2, 3, 4]) }, pad: 3 },
      signature: ".week",                    // declaration.md, signature
      names: [".pose"],                      // the menu's rows are set from data
      layers: [                              // structure.md, the help sheet
        { name: "help", open: ".help-open", close: ".help-close", box: "[role=dialog]", dimmed: ".help" },
      ],
    },
  ],
};
