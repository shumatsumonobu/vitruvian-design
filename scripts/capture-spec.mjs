// The capture spec. This is the one place the values live; scripts/README.md has the provenance
// of each. capture.mjs reads it to capture; check-readme.mjs reads it to compare against the log.
export const SPEC = {
  width: 1440,
  height: 900,
  chrome: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  still: { settleMs: 1500, colors: 64 },          // banding in a gradient: --colors 128; many hues plus gradients: 256
  motion: { frames: 45, stepMs: 120, colors: 128, dither: 'bayer:bayer_scale=5' },
  sizeHintBytes: { still: 300 * 1024, motion: 5 * 1024 * 1024 },
};

// The part of SPEC that decides what an image looks like — what capture-log.json records per
// image. The Chrome path and the size hints do not change the pixels, so they are left out.
export const specForLog = () => ({
  width: SPEC.width, height: SPEC.height, still: { ...SPEC.still }, motion: { ...SPEC.motion },
});
