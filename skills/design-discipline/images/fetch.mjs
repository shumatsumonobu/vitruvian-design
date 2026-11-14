// The artwork fetcher. Usage and contract: images/README.md.
//
//   node <skill>/images/fetch.mjs --subject "<what the picture shows>" --style "<how it is treated>" --name <slug>
//        [--out <dir>] [--size <w>x<h>] [--source auto|generate|photo] [--count N]
//
// Node 22 or later, no dependencies. Generates a picture where an image key is in the environment,
// takes a Wikimedia Commons photograph otherwise, writes the file and a json beside it, and prints one
// line per image: `<path> | <credit>`. A step that fails prints `not taken | <reason>` and exits 1.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

// Time limits (images/README.md, Time limits), in milliseconds. IMAGES_LIMITS_MS, a JSON object such as
// {"search":200}, replaces single limits; the tests use it to keep a wait short.
export const LIMITS = {
  search: 15_000,    // the Commons search
  metadata: 15_000,  // the Commons file information
  download: 60_000,  // one image file
  generate: 120_000, // one generation request
};
const RETRY_CAP = 10_000; // longest wait before the one retry on HTTP 429 or 503

const REPO = "https://github.com/shumatsumonobu/vitruvian-design";
const UA = `vitruvian-design-images/1.0 (${REPO})`;
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const TAIL = "No text, no watermark, no logos in the image.";

// The image keys, in the order auto looks for them. The model is the one the provider's documentation
// names; IMAGES_MODEL_<PROVIDER> in the environment replaces it where a provider retires a model.
const PROVIDERS = [
  { key: "GEMINI_API_KEY", id: "gemini", model: "gemini-nano-banana-2.1" },
  { key: "OPENAI_API_KEY", id: "openai", model: "gpt-image-1.5" },
  { key: "TOGETHER_API_KEY", id: "together", model: "black-forest-labs/FLUX.1-schnell" },
];

class Stop extends Error {}
const stop = (step, why) => { throw new Stop(`${step}: ${why}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
  const a = { source: "auto", count: 1, size: "1280x720", out: "assets" };
  const known = ["subject", "style", "name", "out", "size", "source", "count"];
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith("--")) return { error: `unexpected argument ${k}` };
    const key = k.slice(2);
    if (!known.includes(key)) return { error: `unknown option ${k}` };
    if (i + 1 >= argv.length) return { error: `${k} needs a value` };
    a[key] = argv[++i];
  }
  if (!a.subject) return { error: "--subject is needed" };
  if (!a.name || !/^[a-z0-9][a-z0-9-]*$/i.test(a.name)) return { error: "--name needs a slug of letters, digits and hyphens" };
  const m = /^(\d+)x(\d+)$/.exec(a.size);
  if (!m) return { error: "--size is <width>x<height>, such as 1280x720" };
  a.w = +m[1]; a.h = +m[2];
  if (!["auto", "generate", "photo"].includes(a.source)) return { error: "--source is auto, generate or photo" };
  a.count = Number(a.count);
  if (!Number.isInteger(a.count) || a.count < 1 || a.count > 10) return { error: "--count is a whole number from 1 to 10" };
  a.style = a.style || "";
  return a;
}

// One network step: a limit on the whole wait (body included), one retry on 429 or 503.
async function net(step, limitMs, url, init, read) {
  for (let attempt = 0; ; attempt++) {
    let timer;
    const limit = new Promise((_, no) => { timer = setTimeout(() => no(new Stop(`${step} ran past ${limitMs / 1000} s`)), limitMs); });
    try {
      const work = (async () => {
        const res = await globalThis.fetch(url, { ...init, signal: AbortSignal.timeout(limitMs) });
        if ((res.status === 429 || res.status === 503) && attempt === 0) return { retry: res };
        if (!res.ok) stop(step, `HTTP ${res.status} from ${new URL(url).host}`);
        return { value: await read(res) };
      })();
      work.catch(() => {});
      const r = await Promise.race([work, limit]);
      if (r.retry) {
        const s = Number(r.retry.headers?.get?.("retry-after"));
        await sleep(Math.min(Number.isFinite(s) ? s * 1000 : 1000, RETRY_CAP));
        continue;
      }
      return r.value;
    } catch (e) {
      if (e instanceof Stop) throw e;
      const timedOut = e?.name === "TimeoutError" || e?.name === "AbortError";
      throw new Stop(timedOut ? `${step} ran past ${limitMs / 1000} s` : `${step}: ${e?.cause?.code || e?.message || e}`);
    } finally { clearTimeout(timer); }
  }
}

// Commons repeats a name inside an element hidden with display: none; that copy is dropped first.
const strip = (html) => String(html || "").replace(/<(\w+)[^>]*display:\s*none[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, " ").trim();

// ---- photographs: Wikimedia Commons ----
const LICENSE = /^(cc0|public domain|pd(?:[- ]|$)|cc[- ]by(?:[- ]sa)?(?:[- ]\d|\s|$))/i;
const MIMES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

async function photos(a, limits) {
  const H = { headers: { "user-agent": UA, accept: "application/json" } };
  const q = (o) => `${COMMONS}?${new URLSearchParams({ format: "json", formatversion: "2", ...o })}`;
  const found = await net("search", limits.search, q({ action: "query", list: "search", srsearch: a.subject, srnamespace: "6", srlimit: "30" }), H, (r) => r.json());
  const titles = (found?.query?.search || []).map((x) => x.title);
  if (!titles.length) stop("search", `Commons has no file for "${a.subject}"`);
  const info = await net("metadata", limits.metadata, q({ action: "query", titles: titles.slice(0, 20).join("|"), prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: String(a.w) }), H, (r) => r.json());
  const target = a.w / a.h;
  const kept = [];
  for (const p of info?.query?.pages || []) {
    const ii = p.imageinfo?.[0];
    if (!ii || !MIMES[ii.mime]) continue;
    const m = ii.extmetadata || {};
    const lic = strip(m.LicenseShortName?.value);
    if (!LICENSE.test(lic)) continue;
    if (!ii.width || !ii.height || ii.width < a.w / 2) continue;
    kept.push({ ii, lic, licUrl: strip(m.LicenseUrl?.value) || null, author: strip(m.Artist?.value) || "Unknown author", page: ii.descriptionurl,
      wide: ii.width >= a.w, off: Math.abs(Math.log(ii.width / ii.height / target)) });
  }
  if (!kept.length) stop("search", `${titles.length} Commons files for "${a.subject}", none with an open license, a bitmap type and at least ${Math.ceil(a.w / 2)} px width`);
  kept.sort((x, y) => (y.wide - x.wide) || (x.off - y.off));
  const out = [];
  for (const k of kept.slice(0, a.count)) {
    const ii = k.ii, url = ii.thumburl && ii.width > a.w ? ii.thumburl : ii.url;
    const bytes = await net("download", limits.download, url, { headers: { "user-agent": UA } }, async (r) => Buffer.from(await r.arrayBuffer()));
    out.push({ bytes, ext: MIMES[ii.mime], meta: { source: "photograph", page: k.page, author: k.author, license: k.lic, licenseUrl: k.licUrl, originalWidth: ii.width, originalHeight: ii.height,
      credit: `Photo: ${k.author}, ${k.lic}, Wikimedia Commons` } });
  }
  return out;
}

// ---- generation ----
const nearest = (w, h, list) => list.reduce((b, s) => (Math.abs(Math.log(w / h / s[0])) < Math.abs(Math.log(w / h / b[0])) ? s : b));

function prompt(a) { return [a.subject, a.style].filter(Boolean).join(". ").replace(/\.*$/, ".") + " " + TAIL; }

async function generate(a, p, env, limits) {
  const model = env[`IMAGES_MODEL_${p.id.toUpperCase()}`] || p.model;
  const text = prompt(a);
  const key = env[p.key];
  const base = { source: "generated", provider: p.id, model, prompt: text, size: a.size, pricePerImage: null, credit: `Image generated with ${model}` };
  const post = (url, headers, body) => net("generation", limits.generate, url, { method: "POST", headers: { "content-type": "application/json", "user-agent": UA, ...headers }, body: JSON.stringify(body) }, (r) => r.json());
  const results = [];
  const b64 = (s, mime) => ({ bytes: Buffer.from(s, "base64"), mime });
  if (p.id === "gemini") {
    // https://aistudio.google.com/docs/image-generation (REST example: POST /v1beta/interactions,
    // x-goog-api-key header, model + input; the image is a content block of type "image" with base64
    // data in a model_output step). Imagen is shut down in the Gemini API (https://aistudio.google.com/docs/imagen).
    // The documentation shows no raw response JSON, so the image is looked up by its block type.
    const ratio = nearest(a.w, a.h, [[1, "1:1"], [16 / 9, "16:9"]]);
    const body = { model, input: [{ type: "text", text }], response_format: { type: "image", aspect_ratio: ratio[1] } };
    for (let i = 0; i < a.count; i++) {
      const j = await post("https://generativelanguage.googleapis.com/v1beta/interactions", { "x-goog-api-key": key, "api-revision": "2026-05-20" }, body);
      const blk = findImage(j);
      if (!blk) stop("generation", "the Gemini response held no image block");
      results.push(b64(blk.data, blk.mime_type));
    }
  } else if (p.id === "openai") {
    // https://developers.openai.com/api/reference/resources/images/methods/generate
    // POST /v1/images/generations, Bearer key; size is one of 1024x1024, 1536x1024, 1024x1536;
    // the images are data[].b64_json. That page says gpt-image-1 is shut down, so the default is gpt-image-1.5.
    const size = nearest(a.w, a.h, [[1, "1024x1024"], [1.5, "1536x1024"], [1 / 1.5, "1024x1536"]])[1];
    const j = await post("https://api.openai.com/v1/images/generations", { authorization: `Bearer ${key}` }, { model, prompt: text, n: a.count, size, output_format: "png" });
    for (const d of j?.data || []) if (d.b64_json) results.push(b64(d.b64_json, "image/png"));
    base.size = size;
  } else {
    // https://docs.together.ai/reference/post-images-generations
    // POST /v1/images/generations, Bearer key; model, prompt, width, height, n, response_format;
    // the images are data[].b64_json.
    const r8 = (n) => Math.max(64, Math.round(n / 8) * 8);
    const scale = Math.min(1, 1440 / Math.max(a.w, a.h));
    const width = r8(a.w * scale), height = r8(a.h * scale);
    const j = await post("https://api.together.ai/v1/images/generations", { authorization: `Bearer ${key}` }, { model, prompt: text, width, height, n: a.count, response_format: "base64" });
    for (const d of j?.data || []) if (d.b64_json) results.push(b64(d.b64_json, "image/png"));
    base.size = `${width}x${height}`;
  }
  if (!results.length) stop("generation", `${p.id} returned no image`);
  return results.slice(0, a.count).map((r) => ({ bytes: r.bytes, ext: extOf(r.bytes, r.mime), meta: { ...base } }));
}

function findImage(o) {
  if (!o || typeof o !== "object") return null;
  if (o.type === "image" && typeof o.data === "string") return o;
  if (typeof o.inlineData?.data === "string") return { data: o.inlineData.data, mime_type: o.inlineData.mimeType };
  for (const v of Object.values(o)) { const f = findImage(v); if (f) return f; }
  return null;
}
function extOf(b, mime) {
  if (b[0] === 0xff && b[1] === 0xd8) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50) return "png";
  if (b.subarray(8, 12).toString() === "WEBP") return "webp";
  return MIMES[mime] || "png";
}

// ---- the run ----
export async function run(argv, env = process.env, out = console.log) {
  const a = parseArgs(argv);
  if (a.error) { out(`not taken | arguments: ${a.error}`); return 1; }
  let limits = { ...LIMITS };
  try { limits = { ...limits, ...JSON.parse(env.IMAGES_LIMITS_MS || "{}") }; } catch { out("not taken | arguments: IMAGES_LIMITS_MS is not JSON"); return 1; }
  const provider = PROVIDERS.find((p) => env[p.key]);
  const failed = [];
  let got = null;
  const attempt = async (fn) => { try { got = await fn(); } catch (e) { if (!(e instanceof Stop)) throw e; failed.push(e.message); } };
  if (a.source === "generate") {
    if (!provider) { out("not taken | generation: --source generate was given and none of GEMINI_API_KEY, OPENAI_API_KEY, TOGETHER_API_KEY is in the environment"); return 1; }
    out(`source: generate (--source generate, ${provider.key} found)`);
    await attempt(() => generate(a, provider, env, limits));
  } else if (a.source === "photo") {
    out("source: photo (--source photo)");
    await attempt(() => photos(a, limits));
  } else if (provider) {
    out(`source: generate (${provider.key} found in the environment)`);
    await attempt(() => generate(a, provider, env, limits));
    if (!got) { out(`generation not taken: ${failed[0]}; trying a Commons photograph`); await attempt(() => photos(a, limits)); }
  } else {
    out("source: photo (no GEMINI_API_KEY, OPENAI_API_KEY or TOGETHER_API_KEY in the environment)");
    await attempt(() => photos(a, limits));
  }
  if (!got) { out(`not taken | ${failed.join("; then ")}`); return 1; }
  const dir = resolve(a.out);
  try {
    mkdirSync(dir, { recursive: true });
    got.forEach((g, i) => {
      const base = got.length > 1 ? `${a.name}-${i + 1}` : a.name;
      const file = join(dir, `${base}.${g.ext}`);
      writeFileSync(file, g.bytes);
      writeFileSync(join(dir, `${base}.json`), JSON.stringify(g.meta, null, 2) + "\n");
      out(`${file} | ${g.meta.credit}`);
    });
  } catch (e) { out(`not taken | write: ${e.code || e.message}`); return 1; }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await run(process.argv.slice(2));
}
