#!/usr/bin/env node
// Gathers every rule file's Inspection and Platform notes, word for word, into
// skills/design-discipline/inspections.md, so a run that inspects reads one file instead of twelve.
// The rule files own every line; inspections.md is built, never edited.
//
//   node scripts/build-inspections.mjs           write inspections.md
//   node scripts/build-inspections.mjs --check   print how many lines differ from what would be built; the target is 0
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = join(REPO, "skills", "design-discipline");
const OUT = join(SKILL, "inspections.md");

// The order SKILL.md's table lists the rule files in.
const table = readFileSync(join(SKILL, "SKILL.md"), "utf8");
const order = [...new Set([...table.matchAll(/^\| \[rules\/([a-z0-9-]+)\.md\]/gm)].map((m) => m[1]))];
if (!order.length) { console.error("no rule files found in SKILL.md's table"); process.exit(1); }

const parts = [
  "# Inspections",
  "",
  "Every rule file's Inspection and Platform notes, gathered word for word, in the order SKILL.md",
  "lists the files. A run that inspects reads this file; where a line points at a section above it,",
  "that section is in the rule file named in the heading. This file is built from the rule files by",
  "the skill's repository and is not edited: a rule changes in its rule file.",
];
for (const name of order) {
  const text = readFileSync(join(SKILL, "rules", `${name}.md`), "utf8").replace(/\r\n/g, "\n");
  const at = text.indexOf("\n## Inspection\n");
  if (at < 0) { console.error(`rules/${name}.md has no "## Inspection" heading`); process.exit(1); }
  // Headings go one level down, under the file's own heading.
  const body = text.slice(at + 1).trimEnd().replace(/^(#{2,5}) /gm, "#$1 ");
  parts.push("", `## rules/${name}.md`, "", body);
}
const built = parts.join("\n") + "\n";

if (process.argv.includes("--check")) {
  const have = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  const a = built.split("\n"), b = have.split("\n");
  let diff = Math.abs(a.length - b.length);
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) diff++;
  console.log(`inspections.md lines that differ from the rule files: ${diff}`);
  process.exit(diff ? 1 : 0);
}
writeFileSync(OUT, built);
console.log(`wrote skills/design-discipline/inspections.md: ${order.length} rule files, ${built.split(/\s+/).length} words`);
