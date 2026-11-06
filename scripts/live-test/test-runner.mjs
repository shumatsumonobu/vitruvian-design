// Tests the web inspection runner (skills/design-discipline/runner/web/run.mjs) on three scaffolds
// under live-test/scaffolds/ and on one deliberate hang. Each scaffold is copied (its `extends` chain
// resolved, fixture.json left out) into scripts/.tmp/runner-test/<scaffold>/, the matching configuration
// from scripts/live-test/runner-configs/ is put at .design/harness/product.mjs, and the runner is run
// with the label "test". One line per expectation: ok or MISSED.
//
// Usage: node scripts/live-test/test-runner.mjs [--keep] [--only=cover-stamped,full,hang] [--rules=a,b]
//   --keep   leave the copies (and the runner's output in them) in scripts/.tmp/runner-test/
//   --only   run some of the checks
//   --rules  pass --rules= to the runner (an expectation that needs a rule left out is skipped)
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCAFFOLDS = join(REPO, "live-test", "scaffolds");
const CONFIGS = join(REPO, "scripts", "live-test", "runner-configs");
const RUNNER = join(REPO, "skills", "design-discipline", "runner", "web", "run.mjs");
const WORK = join(REPO, "scripts", ".tmp", "runner-test");

const args = process.argv.slice(2);
const keep = args.includes("--keep");
const only = (args.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const rulesArg = args.find((a) => a.startsWith("--rules="));
const ruleSet = rulesArg ? rulesArg.slice(8).split(",") : null;
const wanted = (n) => !only.length || only.includes(n);

let missed = 0;
const report = (ok, text) => { if (!ok) missed++; console.log(`${ok ? "ok    " : "MISSED"}  ${text}`); };

// The files of a scaffold, its `extends` chain resolved: the base first, the scaffold's own over it.
function copyScaffold(name, dest) {
  const chain = [];
  for (let n = name; n; ) {
    chain.unshift(n);
    const f = join(SCAFFOLDS, n, "fixture.json");
    n = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")).extends : null;
  }
  for (const n of chain) cpSync(join(SCAFFOLDS, n), dest, { recursive: true, filter: (src) => !src.endsWith("fixture.json") });
  return chain;
}

// Every file outside .design/, with its size and bytes' length, for the before-and-after comparison.
function listOutsideDesign(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      const rel = relative(dir, p).split("\\").join("/");
      if (rel === ".design" || rel.startsWith(".design/")) continue;
      if (e.isDirectory()) walk(p); else out.push(`${rel} ${statSync(p).size}`);
    }
  };
  walk(dir);
  return out.sort();
}

function runRunner(dir, extra = []) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [RUNNER, "test", ...extra, ...(ruleSet ? [`--rules=${ruleSet.join(",")}`] : [])], { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const ms = Date.now() - t0;
  const lines = r.stdout.split(/\r?\n/).filter(Boolean).map((l) => {
    const [rule, line, value, ...rest] = l.split(" | ");
    return { rule, line, value, where: rest.join(" | "), raw: l };
  });
  return { ms, status: r.status, lines, stdout: r.stdout, stderr: r.stderr };
}
const mmss = (ms) => `${Math.floor(ms / 60000)} min ${Math.round((ms % 60000) / 1000)} s`;
const find = (res, rule, prefix) => res.lines.find((l) => l.rule === rule && l.line.startsWith(prefix));
const num = (l) => (l && /^\d+( \|)?$/.test(l.value) ? parseInt(l.value, 10) : null);
const taken = (res, rule) => !ruleSet || ruleSet.includes(rule);

function common(name, res, before, dir) {
  report(res.status === 0 && existsSync(join(dir, ".design", "harness", "out", "test.txt")) && existsSync(join(dir, ".design", "harness", "out", "test.json")), `${name}: the run finished (exit ${res.status}) and wrote test.txt and test.json`);
  const waiting = res.lines.filter((l) => /ran past|could not run|did not start/.test(l.where));
  report(waiting.length === 0, `${name}: no step left waiting${waiting.length ? ` — ${waiting.map((l) => `${l.line.slice(0, 50)}: ${l.where}`).join(" ; ")}` : ""}`);
  const after = listOutsideDesign(dir);
  const changed = [...before.filter((x) => !after.includes(x)), ...after.filter((x) => !before.includes(x))];
  report(changed.length === 0, `${name}: nothing written outside .design/${changed.length ? ` — ${changed.join(", ")}` : ""}`);
  const bad = res.lines.filter((l) => !l.line || l.value === undefined);
  report(bad.length === 0, `${name}: every stdout line has rule | line | value | where`);
  const sheets = readdirSync(join(dir, ".design", "captures", "test")).filter((f) => f.startsWith("contact-"));
  report(!taken(res, "layout") || sheets.length >= 1, `${name}: contact sheets written (${sheets.join(", ") || "none"})`);
}

async function scaffoldRun(name, expectations) {
  const dir = join(WORK, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  copyScaffold(name, dir);
  mkdirSync(join(dir, ".design", "harness"), { recursive: true });
  cpSync(join(CONFIGS, `${name}.mjs`), join(dir, ".design", "harness", "product.mjs"));
  const before = listOutsideDesign(dir);
  const res = runRunner(dir);
  console.log(`--- ${name}: ${res.lines.length} lines, ${mmss(res.ms)}`);
  common(name, res, before, dir);
  expectations(res);
  writeFileSync(join(WORK, `${name}.out.txt`), res.stdout + "\n--- stderr\n" + res.stderr);
  if (!keep) rmSync(dir, { recursive: true, force: true });
  return res.ms;
}

mkdirSync(WORK, { recursive: true });
const times = {};

if (wanted("cover-stamped")) {
  times["cover-stamped"] = await scaffoldRun("cover-stamped", (res) => {
    const wb = find(res, "copy", "Titles, headings, and names set over more than one line with a break inside a word");
    if (taken(res, "copy")) {
      report(num(wb) === 1 && /1920x900/.test(wb.where) && /はじ/.test(wb.where), `cover-stamped: copy, a break inside a word = 1, at 1920x900 in the title (${wb ? wb.value + " | " + wb.where.slice(0, 160) : "no line"})`);
      // The lead's breaks inside a word are not counted (body text); its last line 「す。」 is (short text, one character).
      const leadBreaks = res.lines.filter((l) => l.rule === "copy" && l.line.startsWith("Titles, headings, and names set over more than one line") && /hero-lead/.test(l.where) && l.value !== "data");
      report(leadBreaks.length === 0, `cover-stamped: the lead paragraph's breaks inside a word are not counted${leadBreaks.length ? ` — ${leadBreaks.map((l) => l.where.slice(0, 100)).join(" ; ")}` : ""}`);
      const one = find(res, "copy", "Titles, headings, names, and short text standing on its own");
      report(num(one) >= 1 && /hero-lead/.test(one.where) && /す。/.test(one.where), `cover-stamped: copy, a last line of one character counts the lead's 「す。」 (${one ? one.value + " | " + one.where.slice(0, 160) : "no line"})`);
    }
    if (taken(res, "anti-slop")) {
      const sig = find(res, "anti-slop", "Where the declaration names a signature");
      report(num(sig) === 2, `cover-stamped: anti-slop, signature outside the first view = 2 (${sig ? sig.value : "no line"})`);
      const sides = find(res, "anti-slop", "Surfaces at the widest checked size where what draws");
      report(num(sides) === 1 && /1920x900/.test(sides.where), `cover-stamped: anti-slop, the 640 px column at 1920 counted as bare sides = 1 (${sides ? sides.value + " | " + sides.where.slice(0, 120) : "no line"})`);
    }
    if (taken(res, "navigation")) {
      const hist = find(res, "navigation", "Entries written beneath the page the reader arrived on");
      report(num(hist) === 0, `cover-stamped: navigation, entries written beneath the arrival = 0, the runner's own blank loads not counted (${hist ? hist.value + " | " + hist.where.slice(0, 120) : "no line"})`);
    }
    if (taken(res, "states")) {
      const cold = res.lines.filter((l) => l.rule === "states" && l.line.startsWith("Measured cold starts"));
      report(cold.some((l) => /ready for input \d+ ms/.test(l.where)), `cover-stamped: states, the cold start is read as ready for input (${cold.map((l) => l.value + " | " + l.where.slice(0, 120)).join(" ; ") || "no line"})`);
    }
  });
}

if (wanted("cover-glow-border")) {
  times["cover-glow-border"] = await scaffoldRun("cover-glow-border", (res) => {
    if (!taken(res, "anti-slop")) return;
    const g = find(res, "anti-slop", "Text set with a glow as its style");
    report(num(g) === 1 && /\.hero-title/.test(g.where), `cover-glow-border: anti-slop, text set with a glow = 1, naming .hero-title (${g ? g.value + " | " + g.where.slice(0, 120) : "no line"})`);
    report(!!g && !/pose-time|help-open|help-close|button|outline/.test(g.where), "cover-glow-border: the bordered buttons and the focus ring are not counted as glow");
  });
}

if (wanted("full")) {
  times.full = await scaffoldRun("full", (res) => {
    const check = (rule, prefix, test, text) => {
      if (!taken(res, rule)) return;
      const l = find(res, rule, prefix);
      report(!!l && test(l), `full: ${rule}, ${text} (${l ? l.value + " | " + l.where.slice(0, 200) : "no line"})`);
    };
    check("states", "Controls where a press at the middle", (l) => num(l) >= 1 && /(1536x730|390x664)/.test(l.where) && /\.start/.test(l.where), "a press at the middle of the start button lands on the box over it, >= 1 at 1536x730 or 390x664");
    check("states", "Neighboring targets whose areas", (l) => num(l) >= 1 && /pause|next/.test(l.where), "pause and skip overlap, >= 1");
    check("states", "Text contrast below", (l) => num(l) >= 1 && /pose-name|player-pose/.test(l.where) && (/worst of/.test(l.where)) && Math.min(...[...l.where.matchAll(/(\d+\.\d+):1/g)].map((m) => +m[1])) <= 1.5, "the white pose name over the moving blob, worst moment near 1:1");
    check("copy", "Lines opening with a closing bracket", (l) => num(l) >= 1, "lines opening with a closing bracket >= 1");
    check("a11y", "Characters that carry something only to the eye", (l) => num(l) === 3 && !/、/.test(l.where), "characters that carry something only to the eye = 3, the three exposed separators, no comma inside a sentence");
    check("navigation", "Modals, sheets, and full screens that back does not close", (l) => num(l) >= 1 && /guide/.test(l.where), "the full-screen guide that back does not close >= 1");
  });
}

if (wanted("hang")) {
  // A flow that calls r.eval on a promise that never settles: the step must come back as not taken within
  // the 15 s limit for one message, and the run must finish.
  const dir = join(WORK, "hang");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, ".design", "harness"), { recursive: true });
  copyScaffold("cover-stamped", dir);
  writeFileSync(join(dir, ".design", "harness", "product.mjs"), `import base from ${JSON.stringify(pathToFileURL(join(CONFIGS, "cover-stamped.mjs")).href)};
export default { ...base, flows: async (r) => { await r.eval(() => new Promise(() => {})); } };
`);
  const before = listOutsideDesign(dir);
  const res = (() => {
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [RUNNER, "test", "--rules=layout"], { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 300000 });
    return { ms: Date.now() - t0, status: r.status, stdout: r.stdout, stderr: r.stderr, lines: r.stdout.split(/\r?\n/).filter(Boolean).map((l) => { const [rule, line, value, ...rest] = l.split(" | "); return { rule, line, value, where: rest.join(" | ") }; }) };
  })();
  times.hang = res.ms;
  console.log(`--- hang: ${res.lines.length} lines, ${mmss(res.ms)}`);
  const f = res.lines.find((l) => l.rule === "flows");
  report(!!f && f.value === "not taken" && /ran past 15 s \(Runtime\.evaluate\)/.test(f.where), `hang: the flow's line comes back not taken, naming the step and the method (${f ? f.where : "no line"})`);
  report(res.status === 0 && existsSync(join(dir, ".design", "harness", "out", "test.txt")), `hang: the run finished (exit ${res.status})`);
  const after = listOutsideDesign(dir);
  report(before.join("\n") === after.join("\n"), "hang: nothing written outside .design/");
  if (!keep) rmSync(dir, { recursive: true, force: true });
}

if (wanted("freeze")) {
  // A layer whose opening never lets the page go (an endless loop): the tab stops answering, the runner
  // opens a new one, and the steps after it are taken there.
  const dir = join(WORK, "freeze");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, ".design", "harness"), { recursive: true });
  copyScaffold("cover-stamped", dir);
  writeFileSync(join(dir, ".design", "harness", "product.mjs"), `import base from ${JSON.stringify(pathToFileURL(join(CONFIGS, "cover-stamped.mjs")).href)};
export default { ...base, screens: base.screens.map((s) => ({ ...s, layers: [{ name: "freeze", open: (r) => r.eval("setTimeout(() => { for (;;) {} }, 0), true"), box: "body" }, ...(s.layers || [])] })) };
`);
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [RUNNER, "test", "--rules=layout,a11y"], { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 400000 });
  times.freeze = Date.now() - t0;
  const lines = r.stdout.split(/\r?\n/).filter(Boolean).map((l) => { const [rule, line, value, ...rest] = l.split(" | "); return { rule, line, value, where: rest.join(" | ") }; });
  console.log(`--- freeze: ${lines.length} lines, ${mmss(times.freeze)}`);
  let json = {};
  try { json = JSON.parse(readFileSync(join(dir, ".design", "harness", "out", "test.json"), "utf8")); } catch {}
  report(r.status === 0 && !!json.lines, `freeze: the run finished (exit ${r.status})`);
  report((json.notes || []).some((n) => /a new tab was opened/.test(n)), `freeze: a new tab was opened after the tab stopped answering (${(json.notes || []).filter((n) => /tab/.test(n)).join(" ; ") || "no note"})`);
  const names = lines.find((l) => l.rule === "a11y" && l.line.startsWith("Operable controls with no accessible name"));
  report(!!names && /^\d+( \|)?$/.test(names.value),`freeze: a step after the freeze was taken in the new tab (a11y names: ${names ? names.value : "no line"})`);
  report(times.freeze < 300000, `freeze: finished in ${mmss(times.freeze)}, under 5 min`);
  if (!keep) rmSync(dir, { recursive: true, force: true });
}

console.log("--- times");
for (const [k, v] of Object.entries(times)) console.log(`${k}: ${mmss(v)}`);
console.log(missed ? `${missed} expectation(s) MISSED` : "every expectation ok");
process.exit(missed ? 1 : 0);
