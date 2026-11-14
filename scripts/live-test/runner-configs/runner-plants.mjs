// Configuration for live-test/fixtures/runner-plants: a page with planted cases for the runner's newer counts.
export default {
  serve: ".",
  sizes: [
    { w: 360, h: 640, touch: true },
    { w: 1280, h: 800 },
  ],
  declaration: {},
  screens: [
    { name: "plants", path: "/", states: { populated: {} } },
    { name: "typeset", path: "/typeset.html", states: { populated: {} } },
    { name: "answer-below", path: "/answer-below.html", states: { populated: {} }, answer: { el: ".plant-list > li:first-child", state: "populated", control: "button" } },
    { name: "answer-in", path: "/answer-in.html", states: { populated: {} }, answer: { el: ".plant-list > li:first-child", state: "populated", control: "button" } },
  ],
};
