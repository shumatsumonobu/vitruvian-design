// Workspaces for live runs of the skill: make one from a scaffold, keep its skill copy in step,
// read what a run did, and check that a scaffold's planted defects show.
//   node scripts/live-test.mjs new <scaffold> <workspace-name> [--skill <git-ref>]
//   node scripts/live-test.mjs sync <workspace-name>
//   node scripts/live-test.mjs stats <workspace-name> [--last]
//   node scripts/live-test.mjs judge <workspace-name>
//   node scripts/live-test.mjs verify <workspace-name>
//   node scripts/live-test.mjs run <workspace-name> <entry> [--model=<id>] [--effort=<level>]
// Workspaces live under the directory in the environment variable VITRUVIAN_LIVE_TEST_DIR,
// registered in <that directory>/.live-test.json. Usage in scripts/README.md.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync, spawn } from "node:child_process";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scaffolds = path.join(repo, "live-test", "scaffolds");
const SKILLS = ["design-discipline", "design-discipline-init", "design-discipline-inspect", "design-discipline-fix", "design-discipline-review"];
const WORKING_TREE = "working tree";

const die = (msg) => { console.error(msg); process.exit(1); };
const fwd = (p) => p.replace(/\\/g, "/");

const [cmd, ...rest] = process.argv.slice(2);
const flags = rest.filter((a) => a.startsWith("--"));
const positional = [];
let skillRef = null;
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === "--skill") { skillRef = rest[++i]; if (!skillRef) die("--skill needs a git ref"); }
  else if (!rest[i].startsWith("--")) positional.push(rest[i]);
}

function liveRoot() {
  const r = process.env.VITRUVIAN_LIVE_TEST_DIR;
  if (!r) die("VITRUVIAN_LIVE_TEST_DIR is not set: set it to the directory the workspaces live in.");
  fs.mkdirSync(r, { recursive: true });
  return path.resolve(r);
}
const registryPath = (root) => path.join(root, ".live-test.json");
const readRegistry = (root) => fs.existsSync(registryPath(root)) ? JSON.parse(fs.readFileSync(registryPath(root), "utf8")) : {};
const writeRegistry = (root, reg) => fs.writeFileSync(registryPath(root), JSON.stringify(reg, null, 2) + "\n");

function workspaceName(n) {
  if (!n || /[\\/:]/.test(n) || n === "." || n === "..") die("give a workspace name (no path separators).");
  return n;
}

// The chain of scaffolds, base first.
function chain(name) {
  const out = [];
  const seen = new Set();
  for (let n = name; n; ) {
    if (seen.has(n)) die("fixture.json loop at " + n);
    seen.add(n);
    const dir = path.join(scaffolds, n);
    if (!fs.existsSync(dir)) die(`no scaffold "${n}" under live-test/scaffolds/`);
    out.unshift(dir);
    const fx = path.join(dir, "fixture.json");
    n = fs.existsSync(fx) ? JSON.parse(fs.readFileSync(fx, "utf8")).extends : null;
  }
  return out;
}
function materialise(name, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const dir of chain(name)) {
    fs.cpSync(dir, dest, { recursive: true, force: true, filter: (src) => !(path.dirname(src) === dir && path.basename(src) === "fixture.json") });
  }
}

// The skill's five directories, from the working tree or from a git ref, into <dest>/.claude/skills/.
function installSkill(dest, ref) {
  let from = path.join(repo, "skills");
  let tmp = null;
  if (ref) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vd-skill-"));
    let tarball;
    try { tarball = execFileSync("git", ["archive", "--format=tar", ref, "skills/"], { cwd: repo, maxBuffer: 1 << 28 }); }
    catch { fs.rmSync(tmp, { recursive: true, force: true }); die(`git could not archive "${ref}"`); }
    // cwd rather than -C: GNU tar reads "C:" in a path as a remote host.
    execFileSync("tar", ["-x"], { cwd: tmp, input: tarball });
    from = path.join(tmp, "skills");
  }
  const target = path.join(dest, ".claude", "skills");
  fs.mkdirSync(target, { recursive: true });
  for (const s of SKILLS) {
    const src = path.join(from, s);
    if (!fs.existsSync(src)) { if (tmp) fs.rmSync(tmp, { recursive: true, force: true }); die(`"${s}" is not in ${ref || "the working tree"}`); }
    fs.rmSync(path.join(target, s), { recursive: true, force: true });
    fs.cpSync(src, path.join(target, s), { recursive: true });
  }
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
}

function listFiles(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(p, base, out); else out.push(fwd(path.relative(base, p)));
  }
  return out;
}

function newCmd() {
  const [scaffold, name] = positional;
  if (!scaffold || !name) die("usage: new <scaffold> <workspace-name> [--skill <git-ref>]");
  workspaceName(name);
  const root = liveRoot();
  const dest = path.join(root, name);
  if (fs.existsSync(dest)) die(`${fwd(dest)} already exists.`);
  chain(scaffold); // fails early on an unknown scaffold
  materialise(scaffold, dest);
  installSkill(dest, skillRef);
  execFileSync("git", ["init", "-q"], { cwd: dest });
  const reg = readRegistry(root);
  reg[name] = { scaffold, skill: skillRef || WORKING_TREE, created: new Date().toISOString() };
  writeRegistry(root, reg);
  console.log(`workspace ${name}: scaffold ${scaffold}, skill ${skillRef || WORKING_TREE}`);
  console.log(`cd ${fwd(dest)} && claude`);
}

function syncCmd() {
  const name = workspaceName(positional[0]);
  const root = liveRoot();
  const dest = path.join(root, name);
  if (!fs.existsSync(dest)) die(`no workspace ${name} under ${fwd(root)}`);
  const entry = readRegistry(root)[name];
  if (entry && entry.skill !== WORKING_TREE) die(`${name} was made with --skill ${entry.skill}; it is meant to stay old, so sync leaves it.`);
  installSkill(dest, null);
  let diffs = 0;
  for (const s of SKILLS) {
    const a = path.join(repo, "skills", s), b = path.join(dest, ".claude", "skills", s);
    const fa = listFiles(a), fb = listFiles(b);
    for (const f of new Set([...fa, ...fb])) {
      const pa = path.join(a, f), pb = path.join(b, f);
      if (!fs.existsSync(pb)) { console.log(`missing in workspace: ${s}/${f}`); diffs++; }
      else if (!fs.existsSync(pa)) { console.log(`only in workspace: ${s}/${f}`); diffs++; }
      else if (!fs.readFileSync(pa).equals(fs.readFileSync(pb))) { console.log(`differs: ${s}/${f}`); diffs++; }
    }
  }
  console.log(diffs === 0 ? "0 differences" : `${diffs} differences`);
  if (diffs) process.exitCode = 1;
}

// ---- stats: what a person went through in each run, read from the session transcripts ----
function statsCmd() {
  const name = workspaceName(positional[0]);
  const showLast = flags.includes("--last");
  const ws = path.resolve(liveRoot(), name);
  const projects = path.join(os.homedir(), ".claude", "projects");
  const encoded = ws.replace(/[^A-Za-z0-9]/g, "-");
  const found = fs.existsSync(projects) ? fs.readdirSync(projects).find((d) => d.toLowerCase() === encoded.toLowerCase()) : null;
  if (!found) die("no transcripts at " + fwd(path.join(projects, encoded)));
  const dir = path.join(projects, found);

  const polite = /(です|ます|ました|ません|でした|ましょう|ください|でしょうか|ませんか)[。！？」）)]*$/;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl"))
    .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs })).sort((a, b) => a.t - b.t);
  const readRows = (p) => fs.readFileSync(p, "utf8").split("\n").filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

  // Token totals per model; each message id counted once, with the last entry's usage.
  function usageByModel(sources) {
    const byId = new Map();
    for (const { rows, where } of sources) {
      rows.forEach((r, i) => {
        const m = r.message;
        if (r.type !== "assistant" || !m || !m.usage) return;
        byId.set(m.id || `${where}:${i}`, { model: m.model || "(unknown)", u: m.usage, where });
      });
    }
    const out = new Map();
    for (const { model, u, where } of byId.values()) {
      const t = out.get(model) || { in: 0, out: 0, cw: 0, cr: 0, main: 0, sub: 0 };
      t.in += u.input_tokens || 0; t.out += u.output_tokens || 0;
      t.cw += u.cache_creation_input_tokens || 0; t.cr += u.cache_read_input_tokens || 0;
      t[where]++;
      out.set(model, t);
    }
    return out;
  }

  for (const { f } of files) {
    const rows = readRows(path.join(dir, f));
    const subDir = path.join(dir, f.replace(/\.jsonl$/, ""), "subagents");
    const subs = fs.existsSync(subDir)
      ? fs.readdirSync(subDir).filter((x) => x.endsWith(".jsonl")).map((x) => readRows(path.join(subDir, x))) : [];
    const ts = rows.map((r) => r.timestamp).filter(Boolean).sort();
    let entry = "", tools = 0, asks = 0;
    const texts = [];
    for (const r of rows) {
      const m = r.message;
      if (!m) continue;
      if (r.type === "user") {
        const s = typeof m.content === "string" ? m.content : (m.content || []).map((c) => c.text || "").join(" ");
        const hit = s.match(/<command-name>\/?(design-discipline[\w-]*)<\/command-name>/);
        if (hit && !entry) entry = hit[1];
      }
      if (r.type === "assistant" && Array.isArray(m.content)) {
        for (const c of m.content) {
          if (c.type === "tool_use") { tools++; if (c.name === "AskUserQuestion") asks++; }
          if (c.type === "text" && c.text.trim()) texts.push(c.text.trim());
        }
      }
    }
    if (!entry && !texts.length) continue;
    const mins = ts.length ? Math.round((Date.parse(ts.at(-1)) - Date.parse(ts[0])) / 60000) : 0;
    const english = texts.filter((t) => (t.match(/[぀-ヿ一-鿿]/g) || []).length < t.length * 0.05).length;
    let jp = 0, pol = 0;
    for (const t of texts) {
      for (const line of t.split(/\n/)) {
        for (const s of line.split(/(?<=。)/)) {
          const x = s.trim().replace(/[*`|]/g, "");
          if (!/[぀-ヿ]/.test(x) || !x.endsWith("。")) continue;
          jp++; if (polite.test(x.replace(/[（(][^（）()]*[）)]。$/, "。"))) pol++;
        }
      }
    }
    const chars = texts.reduce((n, t) => n + t.length, 0);
    console.log(`${f.slice(0, 8)}  ${entry || "(no entry)"}  ${ts[0] || ""}  ${mins} min  tools ${tools}  questions ${asks}`);
    console.log(`  messages ${texts.length}, ${chars} chars, closing ${texts.at(-1)?.length || 0} chars, in English ${english}, Japanese sentences ending politely ${pol}/${jp}`);
    const usage = usageByModel([{ rows, where: "main" }, ...subs.map((r) => ({ rows: r, where: "sub" }))]);
    for (const [model, t] of usage) {
      console.log(`  model ${model}: in ${t.in}, out ${t.out}, cache write ${t.cw}, cache read ${t.cr} (main ${t.main} msgs, subagents ${t.sub} msgs)`);
    }
    if (showLast && texts.length) console.log("  ---- closing message ----\n" + texts.at(-1) + "\n");
  }
}

// ---- judge: what a judge reads after a run ----
function judgeCmd() {
  const name = workspaceName(positional[0]);
  const root = liveRoot();
  const ws = path.join(root, name);
  if (!fs.existsSync(ws)) die(`no workspace ${name} under ${fwd(root)}`);
  const entry = readRegistry(root)[name];
  if (entry) {
    const tmpRoot = path.join(repo, "scripts", ".tmp");
    fs.mkdirSync(tmpRoot, { recursive: true });
    const base = fs.mkdtempSync(path.join(tmpRoot, "judge-"));
    try {
      materialise(entry.scaffold, base);
      console.log(`===== code diff of ${name} against scaffold ${entry.scaffold} (empty = code unchanged) =====`);
      const rr = spawnSync("diff", ["-r", "-u", "--exclude=.design", "--exclude=.claude", "--exclude=.git", base, ws], { encoding: "utf8", maxBuffer: 1 << 28 });
      process.stdout.write((rr.stdout || "").replaceAll(base, "scaffold").replaceAll(fwd(base), "scaffold").replaceAll(ws, name).replaceAll(fwd(ws), name));
      if (rr.error) console.log("(diff could not run: " + rr.error.message + ")");
    } finally {
      fs.rmSync(base, { recursive: true, force: true });
    }
  } else {
    console.log(`===== code diff of ${name}: not registered, so there is no scaffold to diff against =====`);
  }
  const show = (title, p, none) => {
    console.log(`\n===== ${title} =====`);
    if (!fs.existsSync(p)) return console.log(none);
    if (fs.statSync(p).isDirectory()) {
      for (const e of fs.readdirSync(p, { withFileTypes: true })) {
        const st = fs.statSync(path.join(p, e.name));
        console.log(`${e.isDirectory() ? "d" : "-"} ${String(st.size).padStart(8)} ${st.mtime.toISOString().slice(0, 16)} ${e.name}`);
      }
    } else process.stdout.write(fs.readFileSync(p, "utf8"));
  };
  show(".design/ files", path.join(ws, ".design"), "(no .design yet)");
  show("declaration", path.join(ws, ".design", "declaration.md"), "(no declaration yet)");
  show("repair list", path.join(ws, ".design", "repairs.md"), "(no repair list: none written yet, or fix has ended)");
}

function verifyCmd() {
  const name = workspaceName(positional[0]);
  const root = liveRoot();
  const ws = path.join(root, name);
  if (!fs.existsSync(ws)) die(`no workspace ${name} under ${fwd(root)}`);
  const entry = readRegistry(root)[name];
  if (!entry) die(`${name} is not registered, so there is no scaffold to pick a check by.`);
  const script = path.join(repo, "scripts", "live-test", `verify-${entry.scaffold}.mjs`);
  if (!fs.existsSync(script)) { console.log(`There is no check for scaffold ${entry.scaffold}.`); return; }
  const r = spawnSync(process.execPath, [script, ws], { stdio: "inherit" });
  process.exitCode = r.status ?? 1;
}

// A run with nobody at the keyboard: the entry typed as its slash command through `claude -p`, in
// the workspace, on the model and effort every round uses, permissions in auto mode. A question the
// run puts ends it, so the scaffold's brief answers in advance what the run would ask. The stream goes
// to a log beside the workspace, never into it; the transcript lands where `stats` reads it.
function dirBytes(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    try { n += e.isDirectory() ? dirBytes(p) : fs.statSync(p).size; } catch { /* gone while counting */ }
  }
  return n;
}

function largestFile(dir, best = null) {
  if (!fs.existsSync(dir)) return best;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    try {
      if (e.isDirectory()) best = largestFile(p, best);
      else { const n = fs.statSync(p).size; if (!best || n > best.n) best = { p, n }; }
    } catch { /* gone while counting */ }
  }
  return best;
}

// Python processes started after the given time and still running (Windows: through PowerShell).
function leftoverPython(since) {
  if (process.platform !== "win32") return [];
  const ps = "Get-CimInstance Win32_Process -Filter \"Name like 'python%'\" | ForEach-Object { \"$($_.ProcessId)`t$($_.CreationDate.ToUniversalTime().ToString('o'))`t$($_.CommandLine)\" }";
  const r = spawnSync("powershell", ["-NoProfile", "-Command", ps], { encoding: "utf8" });
  return (r.stdout || "").split(/\r?\n/).filter(Boolean).map((l) => { const [pid, at, cmd] = l.split("\t"); return { pid, at: Date.parse(at), cmd: (cmd || "").slice(0, 120) }; })
    .filter((p) => p.at >= since);
}

function runCmd() {
  const name = workspaceName(positional[0]);
  const entry = positional[1];
  const entries = SKILLS.slice(1);
  if (!entries.includes(entry)) die(`give an entry: ${entries.join(", ")}`);
  const root = liveRoot();
  const ws = path.join(root, name);
  if (!fs.existsSync(ws)) die(`no workspace ${name} under ${fwd(root)}`);
  const opt = (k, d) => { const f = flags.find((x) => x.startsWith(`--${k}=`)); return f ? f.slice(k.length + 3) : d; };
  const model = opt("model", "claude-opus-5-5");
  const effort = opt("effort", "xhigh");
  const at = new Date().toISOString().replace(/[:.]/g, "-");
  const log = path.join(root, `${name}.${entry}.${at}.jsonl`);
  const args = ["-p", `/${entry}`, "--model", model, "--effort", effort, "--permission-mode", "auto",
    "--output-format", "stream-json", "--verbose"];
  // Every temporary file the run makes (Claude Code's own, its background tasks' output, the
  // browser's, the scripts') goes under <root>/.tmp/<workspace>, emptied when the next run of that
  // workspace starts, so the system temp directory gets none of it.
  const tmp = path.join(root, ".tmp", name);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const env = { ...process.env, CLAUDE_CODE_TMPDIR: tmp, TEMP: tmp, TMP: tmp, TMPDIR: tmp };
  // Claude Code under -p stops background work 10 minutes after the session's last turn; a run whose
  // session waits on a helper's notice, as rules/review.md asks, needs longer, so the run allows 60.
  env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS = String(60 * 60 * 1000);
  // Where python is a pyenv-win shim, a script fed to it on standard input never reaches Python, and
  // the command waits at a Python prompt for ever — a helper hung so in Round 11. The interpreter the
  // shim stands for goes first on the path, so the run's python reads its standard input.
  const real = process.platform === "win32" ? spawnSync("pyenv", ["which", "python"], { encoding: "utf8", shell: true }) : null;
  const py = real && real.status === 0 ? real.stdout.trim().split(/\r?\n/).pop() : "";
  if (py && fs.existsSync(py)) {
    const key = Object.keys(env).find((k) => k.toUpperCase() === "PATH") || "PATH";
    env[key] = path.dirname(py) + path.delimiter + env[key];
  }
  console.log(`${entry} in ${fwd(ws)}, ${model} at ${effort}; stream to ${fwd(log)}; temporary files in ${fwd(tmp)}`);
  // A full disk stops a run halfway with nothing to show, so the run is stopped first, with the
  // reason on the console, when free space on the workspace's drive falls below MIN_FREE_GB or its
  // temporary files pass MAX_TMP_GB. A command that never ends — a Python prompt started by a heredoc
  // with no lines, in the runs seen — goes on writing into a background task's output there.
  const MIN_FREE_GB = 3;
  const MAX_TMP_GB = 5;
  const freeGB = () => { const s = fs.statfsSync(root); return (s.bavail * s.bsize) / 2 ** 30; };
  if (freeGB() < MIN_FREE_GB) die(`${freeGB().toFixed(1)} GB free on the workspace's drive, below ${MIN_FREE_GB} GB; not started`);
  const out = fs.createWriteStream(log);
  const child = spawn("claude", args, { cwd: ws, env, stdio: ["ignore", "pipe", "inherit"] });
  const started = Date.now();
  const watch = setInterval(() => {
    const free = freeGB(), tmpGB = dirBytes(tmp) / 2 ** 30;
    if (free >= MIN_FREE_GB && tmpGB <= MAX_TMP_GB) return;
    const why = free < MIN_FREE_GB ? `${free.toFixed(1)} GB free on the workspace's drive, below ${MIN_FREE_GB} GB` : `temporary files at ${tmpGB.toFixed(1)} GB, over ${MAX_TMP_GB} GB`;
    const big = largestFile(tmp);
    console.log(`[${((Date.now() - started) / 60000).toFixed(1)} min] ${why}; stopping the run. Temporary files: ${tmpGB.toFixed(1)} GB in ${fwd(tmp)}${big ? `, the largest ${fwd(big.p)} at ${(big.n / 2 ** 30).toFixed(1)} GB` : ""}`);
    clearInterval(watch);
    if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"]); else child.kill();
  }, 30000);
  let buf = "";
  child.stdout.on("data", (chunk) => {
    out.write(chunk);
    buf += chunk.toString("utf8");
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i); buf = buf.slice(i + 1);
      let ev; try { ev = JSON.parse(line); } catch { continue; }
      const min = ((Date.now() - started) / 60000).toFixed(1);
      if (ev.type === "assistant") for (const c of ev.message?.content ?? []) {
        if (c.type === "text" && c.text.trim()) console.log(`[${min} min] ${c.text.trim().split("\n")[0].slice(0, 160)}`);
        if (c.type === "tool_use" && c.name === "AskUserQuestion") console.log(`[${min} min] the run asked a question; with nobody to answer it, it ends here`);
      }
      if (ev.type === "result") console.log(`[${min} min] result: ${ev.subtype}${ev.is_error ? " (error)" : ""}, ${ev.num_turns ?? "?"} turns`);
    }
  });
  child.on("close", (code) => {
    clearInterval(watch);
    out.end();
    console.log(`exit ${code} after ${((Date.now() - started) / 60000).toFixed(1)} min; temporary files ${(dirBytes(tmp) / 2 ** 20).toFixed(0)} MB; read it with: node scripts/live-test.mjs stats ${name} --last`);
    // A Python prompt with nothing to read (`python -`) started during the run is stopped: it does
    // nothing but wait. Any other Python process started in that time is listed, not stopped, since
    // one started by something else would look the same.
    for (const p of leftoverPython(started)) {
      if (/\bpython[\w.]*"?\s+-\s*$/i.test(p.cmd) && process.platform === "win32") {
        spawnSync("taskkill", ["/PID", p.pid, "/T", "/F"]);
        console.log(`stopped a Python prompt the run left: PID ${p.pid}, ${p.cmd}`);
      } else console.log(`still running since the run: PID ${p.pid}, ${p.cmd}`);
    }
    process.exitCode = code ?? 1;
  });
}

const commands = { new: newCmd, sync: syncCmd, stats: statsCmd, judge: judgeCmd, verify: verifyCmd, run: runCmd };
if (!commands[cmd]) die("usage: node scripts/live-test.mjs new|sync|stats|judge|verify|run ...");
commands[cmd]();
