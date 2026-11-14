// Tests for skills/design-discipline/images/fetch.mjs. Run from the repo root: node scripts/check-images.mjs
// No network: global fetch is replaced by a stub. `--live` makes one real Commons search instead.
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { run } from "../skills/design-discipline/images/fetch.mjs";

const realFetch = globalThis.fetch;
let missed = 0;
const check = (what, cond) => { console.log(`${cond ? "ok" : "MISSED"} ${what}`); if (!cond) missed++; };
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");
const json = (o, status = 200, headers = {}) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...headers } });
const tmp = () => mkdtempSync(join(tmpdir(), "check-images-"));

const page = (license, artist, width, height, n) => ({ title: `File:${n}.jpg`, imageinfo: [{ url: `https://upload.test/${n}.jpg`, thumburl: `https://upload.test/thumb/${n}.jpg`, width, height, mime: "image/jpeg", descriptionurl: `https://commons.wikimedia.org/wiki/File:${n}.jpg`,
  extmetadata: { LicenseShortName: { value: license }, LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/4.0" }, Artist: { value: artist } } }] });
function commonsStub(log = []) {
  const pages = [page("CC BY-SA 4.0", '<a href="https://example.org/jane">Jane</a><span style="display: none;">Jane</span>', 2400, 1350, "good"), page("All rights reserved", "Bob", 2400, 1350, "closed"), page("CC BY 4.0", "Amy", 300, 200, "small")];
  return async (url) => {
    const u = new URL(url); log.push(u.href);
    if (u.host === "commons.wikimedia.org") {
      if (u.searchParams.get("list") === "search") return json({ query: { search: pages.map((p) => ({ title: p.title })) } });
      return json({ query: { pages } });
    }
    if (u.host === "upload.test") return new Response(PNG);
    throw new Error(`unexpected ${url}`);
  };
}
async function go(argv, env, stub) {
  globalThis.fetch = stub; const lines = [];
  const code = await run(argv, env, (l) => lines.push(l));
  return { lines, code, text: lines.join("\n") };
}
const args = (d, extra = []) => ["--subject", "morning stretch", "--style", "flat illustration", "--name", "hero", "--out", d, ...extra];

try {
  if (process.argv.includes("--live")) {
    const dir = resolve("scripts/.tmp", `images-live-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    globalThis.fetch = realFetch;
    const lines = [];
    const code = await run(["--subject", "morning stretch", "--style", "photograph", "--name", "live", "--source", "photo", "--out", dir], {}, (l) => { lines.push(l); console.log(l); });
    console.log(`files written: ${readdirSync(dir).join(" ")}`);
    rmSync(dir, { recursive: true, force: true });
    check("live: one Commons photograph taken", code === 0 && lines.some((l) => l.includes(" | Photo: ")));
  } else {
    let d = tmp(), log = [];
    let r = await go(args(d), {}, commonsStub(log));
    check("no key: auto takes the photo path and says so", r.lines[0].startsWith("source: photo") && r.lines[0].includes("no GEMINI_API_KEY"));
    check("three Commons files: only the CC BY-SA one is kept, image and json written", r.code === 0 && readdirSync(d).sort().join() === "hero.jpg,hero.json" && readFileSync(join(d, "hero.jpg")).equals(PNG));
    const m = JSON.parse(readFileSync(join(d, "hero.json"), "utf8"));
    check("credit line carries author, license and Wikimedia Commons", r.text.includes("Photo: Jane, CC BY-SA 4.0, Wikimedia Commons") && m.credit === "Photo: Jane, CC BY-SA 4.0, Wikimedia Commons");
    check("author HTML is stripped to text", m.author === "Jane");
    check("json holds page URL, license URL and original size", m.source === "photograph" && m.page.includes("File:good") && m.licenseUrl.startsWith("https://creativecommons.org") && m.originalWidth === 2400 && m.originalHeight === 1350);
    check("requests go only to Commons and the file host", log.every((u) => /^https:\/\/(commons\.wikimedia\.org|upload\.test)\//.test(u)));
    rmSync(d, { recursive: true, force: true });

    d = tmp(); const KEY = "sk-fake-key-123456";
    let sent = null;
    r = await go(args(d), { OPENAI_API_KEY: KEY }, async (url, init) => {
      if (url !== "https://api.openai.com/v1/images/generations") throw new Error(`unexpected ${url}`);
      sent = { auth: init.headers.authorization, body: JSON.parse(init.body) };
      return json({ data: [{ b64_json: PNG.toString("base64") }] });
    });
    const gm = JSON.parse(readFileSync(join(d, "hero.json"), "utf8"));
    check("OPENAI_API_KEY set: auto takes the generate path and says so", r.lines[0].startsWith("source: generate") && r.lines[0].includes("OPENAI_API_KEY"));
    check("generated image written; json says generated with the model", readFileSync(join(d, "hero.png")).equals(PNG) && gm.source === "generated" && gm.provider === "openai" && r.text.includes(`Image generated with ${gm.model}`) && gm.credit === `Image generated with ${gm.model}` && gm.pricePerImage === null);
    check("prompt sent holds subject, style and the no-text tail", sent.body.prompt.includes("morning stretch") && sent.body.prompt.includes("flat illustration") && /no text, no watermark, no logos/i.test(sent.body.prompt) && gm.prompt === sent.body.prompt);
    check("the key is sent in the header and never printed", sent.auth === `Bearer ${KEY}` && !r.text.includes(KEY));
    rmSync(d, { recursive: true, force: true });

    d = tmp();
    const cs = commonsStub();
    r = await go(args(d), { TOGETHER_API_KEY: "tg-fake" }, async (url, init) => (new URL(url).host === "api.together.ai" ? json({}, 401) : cs(url, init)));
    check("generation fails: the photograph is tried and the failure is printed", r.code === 0 && r.text.includes("generation not taken: generation: HTTP 401") && r.text.includes("Photo: Jane"));
    rmSync(d, { recursive: true, force: true });

    d = tmp();
    const t0 = Date.now();
    r = await go(args(d), { IMAGES_LIMITS_MS: '{"search":300}' }, () => new Promise(() => {}));
    check("a stub that never answers ends with not taken naming the step, inside the limit", r.code === 1 && /^not taken \| search/.test(r.lines.at(-1)) && Date.now() - t0 < 2000);
    check("nothing is written when nothing is taken", !existsSync(join(d, "hero.json")));
    rmSync(d, { recursive: true, force: true });

    d = tmp(); let calls = 0; const cs2 = commonsStub();
    r = await go(args(d), {}, async (url, init) => (new URL(url).searchParams.get("list") === "search" && ++calls === 1 ? new Response("", { status: 429, headers: { "retry-after": "0" } }) : cs2(url, init)));
    check("a 429 then a 200 is retried once and succeeds", r.code === 0 && calls === 2 && existsSync(join(d, "hero.jpg")));
    calls = 0;
    r = await go(args(d), {}, async () => { calls++; return new Response("", { status: 503, headers: { "retry-after": "0" } }); });
    check("a second 503 is not retried again: not taken after two requests", r.code === 1 && calls === 2 && /^not taken \| search/.test(r.lines.at(-1)));
    rmSync(d, { recursive: true, force: true });
  }
} finally { globalThis.fetch = realFetch; }

if (process.argv.includes("--live")) process.exitCode = missed ? 1 : 0;
else { console.log(missed ? `${missed} missed` : "every expectation ok"); process.exitCode = missed ? 1 : 0; }
