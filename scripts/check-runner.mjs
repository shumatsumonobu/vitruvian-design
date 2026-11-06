// Checks the web inspection runner's list of count lines against the rule files.
// Usage: node scripts/check-runner.mjs
//
// 1. Every count line the runner takes (COUNTS in skills/design-discipline/runner/web/run.mjs) must be a count
//    line of its rule file, word for word as far as the first colon. Lines not found are printed; the target is 0.
// 2. The count lines of layout, states, navigation, motion, copy, a11y, and anti-slop that the runner does not
//    take are printed, for a reviewer to read: each is taken from the source, the record, a device, or a look.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = join(REPO, "skills", "design-discipline");
const { COUNTS } = await import(pathToFileURL(join(SKILL, "runner", "web", "run.mjs")).href);

// The count lines of one rule file: the bullets under "### The count", a bullet's continuation lines joined
// with single spaces, cut at the first colon.
function countLines(rule) {
  const text = readFileSync(join(SKILL, "rules", `${rule}.md`), "utf8").split(/\r?\n/);
  const start = text.findIndex((l) => /^### The count/.test(l));
  if (start < 0) return [];
  const bullets = [];
  let open = false;
  for (const l of text.slice(start + 1)) {
    if (/^#{1,3} /.test(l)) break;
    if (l.startsWith("- ")) { bullets.push(l.slice(2)); open = true; }
    else if (open && /^\s+\S/.test(l)) bullets[bullets.length - 1] += " " + l.trim();
    else if (!l.trim()) open = false;
  }
  return bullets.map((b) => b.split(":")[0].trim());
}

const cache = {};
const linesOf = (rule) => (cache[rule] ||= countLines(rule));

const notFound = COUNTS.filter((c) => !linesOf(c.rule).includes(c.line));
console.log(`runner lines not found in their rule file: ${notFound.length}`);
for (const c of notFound) console.log(`  ${c.rule} | ${c.line}`);

console.log("\ncount lines the runner does not take (read from the source, the record, a device, or a look at a capture):");
for (const rule of ["layout", "states", "navigation", "motion", "copy", "a11y", "anti-slop"]) {
  const taken = new Set(COUNTS.filter((c) => c.rule === rule).map((c) => c.line));
  const rest = linesOf(rule).filter((l) => !taken.has(l));
  console.log(`\n${rule}: ${rest.length} of ${linesOf(rule).length}`);
  for (const l of rest) console.log(`  - ${l}`);
}
process.exit(notFound.length ? 1 : 0);
