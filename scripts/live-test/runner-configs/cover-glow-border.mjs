// Configuration for live-test/scaffolds/cover-glow-border (it extends cover-declared, which extends cover),
// in the shape of skills/design-discipline/runner/web/README.md. Values come from cover-declared's
// .design/structure.md (sizes) and .design/declaration.md (the declaration).
const day = 864e5;
const monday = (() => { const d = new Date(); d.setHours(7, 30, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); })();
const log = (offsets) => JSON.stringify(offsets.map((o) => ({ at: monday + o * day, minutes: 10 })));

export default {
  serve: ".",
  sizes: [                                   // structure.md, checked sizes
    { w: 1536, h: 700 },
    { w: 360, h: 560, touch: true },
  ],
  declaration: {                             // declaration.md
    colors: [                                // colors, grey family
      { value: "#3E62AD", role: "accent" },  // asagao
      { value: "#F2F4F5", role: "surface" }, // ground
      { value: "#FFFFFF", role: "surface" }, // surface
      { value: "#2B3136", role: "text" },    // ink
      { value: "#B4232E", role: "text" },    // danger: error text and the destructive button; the file gives it none of the five roles
      { value: "#E6EAED", role: "grey" },    // grey-100
      { value: "#C9D0D5", role: "grey" },    // grey-300
      { value: "#7C868F", role: "grey" },    // grey-500
      { value: "#5F6971", role: "grey" },    // grey-600
    ],
    otherColors: ["rgba(43,49,54,0.48)", "rgba(43,49,54,0.16)"],  // elevation scale: the scrim and the shadow's color
    narrowBelow: 533,                        // clamp(2rem, 6vw, 2.75rem) reaches its lower bound under 533 px wide
    steps: [                                 // type scale, sizes worked out at the checked sizes
      { name: "count", size: [192, 108], weight: 700, letterSpacing: 0, lineHeight: 1, display: true, features: "tabular-nums" },  // clamp(6rem, 30vmin, 12rem); the guide screen
      { name: "title", size: [44, 32], weight: 700, letterSpacing: 0.02, lineHeight: 1.4, display: true },  // clamp(2rem, 6vw, 2.75rem)
      { name: "pose", size: [35, 28], weight: 700, letterSpacing: 0.02, lineHeight: 1.4 },  // clamp(1.75rem, 5vmin, 2.5rem); the guide screen
      { name: "heading", size: 20, weight: 700, letterSpacing: 0.04, lineHeight: 1.5 },
      { name: "lead", size: 18, weight: 400, letterSpacing: 0.04, lineHeight: 1.8 },
      { name: "body", size: 16, weight: 400, letterSpacing: 0.04, lineHeight: 1.8 },
      { name: "label", size: 16, weight: 700, letterSpacing: 0.04, lineHeight: 1.5 },
      { name: "caption", size: 14, weight: 400, letterSpacing: 0.04, lineHeight: 1.7 },
    ],
    families: ["M PLUS Rounded 1c"],         // typefaces
    radii: ["8px", "16px", "9999px"],        // radius scale: small, large, pill
    shadows: ["rgba(43, 49, 54, 0.16) 0px 8px 24px 0px"],   // elevation scale: overlay
    spacingUnit: 8,                          // base spacing unit
    lineLengthEm: 36,                        // maximum line length
    contentWidth: 640,                       // maximum content width, 40rem
    curves: ["cubic-bezier(0.22, 1, 0.36, 1)"],   // ease-out curve
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
      names: [".pose-name"],                 // the menu's names are set from data
      layers: [                              // structure.md, the help sheet
        { name: "help", open: ".help-open", close: ".help-close", box: "[role=dialog]", dimmed: ".help" },
      ],
    },
  ],
};
