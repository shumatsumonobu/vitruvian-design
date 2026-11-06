// あさのび — the cover screen.
const POSES = [
  { name: "キャット・カウ", seconds: 30 },
  { name: "ダウンドッグ", seconds: 30 },
  { name: "チャイルドポーズ", seconds: 30 },
  { name: "座ってひねる", seconds: 40 },
  { name: "首まわし", seconds: 20 },
];
const LOG_KEY = "asanobi-log";

const $ = (s) => document.querySelector(s);
const fmt = (n) => n.toLocaleString("ja-JP");
const help = $(".help");
const page = [...document.body.children].filter((el) => el !== help && el.tagName !== "SCRIPT");

// ---- the menu ----
const list = $(".poses");
for (const p of POSES) {
  const li = document.createElement("li");
  li.className = "pose";
  const name = document.createElement("span");
  name.className = "pose-name";
  name.textContent = p.name;
  const time = document.createElement("span");
  time.className = "pose-time";
  time.textContent = `${fmt(p.seconds)}秒`;
  li.append(name, time);
  list.append(li);
}

// ---- the log: this week's participation card ----
const DAYS = ["月", "火", "水", "木", "金", "土", "日"];
const DAY_MS = 864e5;
const LOG_TEXT = {
  firstRun: "まだ記録はありません。ストレッチを終えた日の升目に、はんこが押されます。",
  emptyWeek: "今週はまだはんこがありません。",
  unreadable: "記録を読み込めませんでした。ブラウザでこのサイトのデータ保存が止められていると、記録を読めません。設定で許可して、ページを読み込み直すと出ます。",
};

// The records, [] when there are none yet, or null when they cannot be read.
function readLog() {
  let raw;
  try { raw = localStorage.getItem(LOG_KEY); } catch { return null; }
  if (raw === null) return [];
  try {
    const log = JSON.parse(raw);
    return Array.isArray(log) ? log.filter((r) => r && Number.isFinite(r.at) && Number.isFinite(r.minutes)) : null;
  } catch { return null; }
}
function mondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
function dayColumn(name, stamped) {
  const li = document.createElement("li");
  li.className = stamped ? "day is-stamped" : "day";
  const label = document.createElement("span");
  label.className = "day-label";
  label.setAttribute("aria-hidden", "true");
  label.textContent = name;
  const cell = document.createElement("span");
  cell.className = "day-cell";
  cell.setAttribute("aria-hidden", "true");
  if (stamped) {
    const stamp = document.createElement("span");
    stamp.className = "stamp";
    stamp.textContent = "済";
    cell.append(stamp);
  }
  const spoken = document.createElement("span");
  spoken.className = "vh";
  spoken.textContent = `${name}曜日 ${stamped ? "はんこあり" : "はんこなし"}`;
  li.append(label, cell, spoken);
  return li;
}
function renderLog() {
  const log = readLog();
  const note = $("#log-note"), total = $("#log-total"), week = $(".week"), range = $("#week-range"), again = $(".start-again");
  if (log === null) {
    range.hidden = week.hidden = total.hidden = again.hidden = true;
    note.hidden = false;
    note.textContent = LOG_TEXT.unreadable;
    return;
  }
  const monday = mondayOf(new Date());
  const sunday = new Date(monday.getTime() + 6 * DAY_MS);
  const day = new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric" });
  range.textContent = `今週（${day.format(monday)}～${day.format(sunday)}）`;
  const stamped = new Set(log
    .filter((r) => r.at >= monday.getTime() && r.at < monday.getTime() + 7 * DAY_MS)
    .map((r) => (new Date(r.at).getDay() + 6) % 7));
  week.replaceChildren(...DAYS.map((name, i) => dayColumn(name, stamped.has(i))));
  const minutes = log.reduce((m, r) => m + r.minutes, 0);
  total.textContent = `これまで${fmt(log.length)}回、合計${fmt(minutes)}分`;
  total.hidden = log.length === 0;
  note.hidden = stamped.size > 0;
  note.textContent = log.length === 0 ? LOG_TEXT.firstRun : LOG_TEXT.emptyWeek;
  again.hidden = stamped.size > 0;
}
renderLog();

// ---- start ----
// Until the guide screen exists, はじめる moves to the menu. Focus goes to the menu's heading so a
// screen reader announces where the reader landed; the move is a jump, not an animation.
function goToMenu() {
  $(".routine").scrollIntoView({ block: "start" });
  $("#routine-title").focus({ preventScroll: true });
}
$(".start").addEventListener("click", goToMenu);
$(".start-again").addEventListener("click", goToMenu);

// ---- the help sheet ----
// The sheet has no address of its own: opening pushes one entry marked { help: true } on the same
// URL, and whatever closes it goes back one entry. The sheet follows the entry, so a reload, back
// and forward all show it as the history says.
const SHEET_OUT_MS = 200; // --sheet-out in styles.css
const DOUBLE_PRESS_MS = 500; // Windows' default double-click time
let opener = null;
let openedAt = -Infinity;
let closeTimer = 0;
let closing = false;

function showHelp() {
  if (help.classList.contains("is-open")) return;
  clearTimeout(closeTimer);
  help.classList.remove("is-closing");
  help.hidden = false;
  page.forEach((el) => (el.inert = true));
  help.getBoundingClientRect(); // commit the closed values so the entrance runs from them
  help.classList.add("is-open");
  openedAt = performance.now();
  $(".help-close").focus();
}
function hideHelp() {
  if (!help.classList.contains("is-open")) return;
  help.classList.remove("is-open");
  help.classList.add("is-closing");
  page.forEach((el) => (el.inert = false));
  (opener || $(".help-open")).focus();
  opener = null;
  closeTimer = setTimeout(() => {
    help.hidden = true;
    help.classList.remove("is-closing");
  }, SHEET_OUT_MS);
}
function syncHelp() {
  closing = false;
  if (history.state && history.state.help) showHelp();
  else hideHelp();
}
function openHelp() {
  if (history.state && history.state.help) return;
  opener = document.activeElement;
  history.pushState({ help: true }, "");
  showHelp();
}
function closeHelp() {
  if (closing || !(history.state && history.state.help)) return;
  closing = true;
  history.back();
}

$(".help-open").addEventListener("click", openHelp);
$(".help-close").addEventListener("click", closeHelp);
help.addEventListener("click", (e) => {
  if (e.target !== help) return;
  // The second half of a fast double press on 使い方 lands on the dimmed surface the first half
  // just put there; it is not a request to close.
  const r = $(".help-open").getBoundingClientRect();
  const onOpener = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (onOpener && e.timeStamp - openedAt < DOUBLE_PRESS_MS) return;
  closeHelp();
});
addEventListener("popstate", syncHelp);
syncHelp();
