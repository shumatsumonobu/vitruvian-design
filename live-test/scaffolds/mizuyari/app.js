// みずやり帳 — the list screen.
const POTS_KEY = "mizuyari-pots";
const DAY = 24 * 60 * 60 * 1000;

// The first visit starts with four pots, last watered some days ago.
function seed() {
  const today = startOfDay(Date.now());
  return [
    { id: "monstera", name: "モンステラ", place: "リビングの窓ぎわ", everyDays: 7, last: today - 7 * DAY },
    { id: "pothos", name: "ポトス", place: "本棚の上", everyDays: 5, last: today - 2 * DAY },
    { id: "sansevieria", name: "サンスベリア", place: "玄関", everyDays: 14, last: today - 16 * DAY },
    { id: "basil", name: "バジル", place: "台所の出窓", everyDays: 2, last: today - 1 * DAY },
  ];
}

const $ = (s) => document.querySelector(s);
const page = [$(".site-header"), $("main"), $(".site-footer")];

function startOfDay(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
function readPots() {
  try { const v = JSON.parse(localStorage.getItem(POTS_KEY)); return Array.isArray(v) ? v : null; } catch { return null; }
}
function writePots(pots) { localStorage.setItem(POTS_KEY, JSON.stringify(pots)); }
const fmt = (t) => { const d = new Date(t); return `${d.getMonth() + 1}月${d.getDate()}日`; };

let pots = readPots() || seed();

function render() {
  const today = startOfDay(Date.now());
  const list = $(".pot-list");
  list.textContent = "";
  let due = 0;
  for (const p of pots) {
    const next = p.last + p.everyDays * DAY;
    const late = Math.round((today - next) / DAY);
    if (late >= 0) due++;
    const li = document.createElement("li");
    li.className = "pot-card" + (late >= 0 ? " is-due" : "");
    const name = document.createElement("h3");
    name.className = "pot-name";
    name.textContent = p.name;
    const place = document.createElement("p");
    place.className = "pot-place";
    place.textContent = p.place;
    const dates = document.createElement("p");
    dates.className = "pot-dates";
    dates.textContent = `最後 ${fmt(p.last)}　次 ${fmt(next)}` + (late > 0 ? `（${late}日すぎ）` : late === 0 ? "（きょう）" : "");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "water";
    btn.textContent = "水をやった";
    btn.addEventListener("click", () => {
      p.last = today;
      writePots(pots);
      render();
      $("#today-line").focus();
    });
    li.append(name, place, dates, btn);
    list.append(li);
  }
  const line = $("#today-line");
  line.tabIndex = -1;
  line.textContent = due === 0 ? "きょう水がほしい鉢はありません。" : `きょう水がほしい鉢は ${due} つです。`;
}
render();

// ---- help ----
const help = $(".help");
const opener = $(".help-open");
function openHelp() {
  help.hidden = false;
  for (const el of page) el.inert = true;
  $(".help-close").focus();
}
function closeHelp() {
  help.hidden = true;
  for (const el of page) el.inert = false;
  opener.focus();
}
opener.addEventListener("click", openHelp);
$(".help-close").addEventListener("click", closeHelp);
help.addEventListener("click", (e) => { if (e.target === help) closeHelp(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !help.hidden) closeHelp(); });
