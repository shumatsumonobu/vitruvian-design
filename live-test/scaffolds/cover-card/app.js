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
  blocked: "記録を読み込めませんでした。ブラウザでこのサイトのデータ保存が止められていると、記録を読めません。設定で許可して、ページを読み込み直すと出ます。",
  broken: "記録を読み込めませんでした。この端末に保存された記録の形が正しくありません。ブラウザの設定でこのサイトのデータを消すと、記録をはじめから付けられます。",
};

// The records, [] when there are none yet; "blocked" when storage cannot be read at all, "broken"
// when what is stored is not a list of records.
function readLog() {
  let raw;
  try { raw = localStorage.getItem(LOG_KEY); } catch { return "blocked"; }
  if (raw === null) return [];
  try {
    const log = JSON.parse(raw);
    return Array.isArray(log) ? log.filter((r) => r && Number.isFinite(r.at) && Number.isFinite(r.minutes)) : "broken";
  } catch { return "broken"; }
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
  const note = $("#log-note"), total = $("#log-total"), week = $(".week"), range = $("#week-range");
  const monday = mondayOf(new Date());
  const sunday = new Date(monday.getTime() + 6 * DAY_MS);
  const day = new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric" });
  range.textContent = `今週（${day.format(monday)}～${day.format(sunday)}）`;
  if (typeof log === "string") {
    week.hidden = total.hidden = true;
    note.hidden = false;
    note.textContent = LOG_TEXT[log];
    return;
  }
  const stamped = new Set(log
    .filter((r) => r.at >= monday.getTime() && r.at < monday.getTime() + 7 * DAY_MS)
    .map((r) => (new Date(r.at).getDay() + 6) % 7));
  week.replaceChildren(...DAYS.map((name, i) => dayColumn(name, stamped.has(i))));
  const minutes = log.reduce((m, r) => m + r.minutes, 0);
  total.textContent = `これまで${fmt(log.length)}回、合計${fmt(minutes)}分`;
  total.hidden = log.length === 0;
  note.hidden = stamped.size > 0;
  note.textContent = log.length === 0 ? LOG_TEXT.firstRun : LOG_TEXT.emptyWeek;
}
renderLog();

// ---- start ----
// Until the guide screen exists, はじめる moves to the menu. Focus goes to the menu's heading so a
// screen reader announces where the reader landed; the move is a jump, not an animation. The jump
// waits out a fast double tap, so the second tap lands on はじめる itself rather than on the menu
// the first one brought under the finger; the press answer (styles.css) shows at once.
const START_MOVE_MS = 300; // a fast double tap's interval on a phone
let moveTimer = 0;
function goToMenu() {
  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => {
    $(".routine").scrollIntoView({ block: "start" });
    $("#routine-title").focus({ preventScroll: true });
  }, START_MOVE_MS);
}
$(".start").addEventListener("click", goToMenu);

// ---- the help sheet ----
// The sheet has no address of its own: opening pushes one entry marked { help: true } on the same
// URL, and whatever closes it goes back one entry. The sheet follows the entry, so a reload, back
// and forward all show it as the history says.
const SHEET_OUT_MS = 200; // --sheet-out in styles.css
const DOUBLE_PRESS_MS = 500; // Windows' default double-click time
const helpOpen = $(".help-open");
let opener = null;
let closeTimer = 0;
let arriveTimer = 0;
let closing = false;

// For one double-press window after opening, the dimmed surface lets presses through and 使い方
// stays live beneath it, so the second half of a fast double press lands on 使い方 itself, which
// does nothing while the sheet is open.
function showHelp() {
  if (help.classList.contains("is-open")) return;
  clearTimeout(closeTimer);
  help.classList.remove("is-closing");
  help.hidden = false;
  page.forEach((el) => (el.inert = true));
  helpOpen.closest("header").inert = false;
  $(".logo").inert = true;
  helpOpen.tabIndex = -1; // live for the press only: Tab and focus stay in the sheet
  help.getBoundingClientRect(); // commit the closed values so the entrance runs from them
  help.classList.add("is-open", "is-arriving");
  $(".help-close").focus();
  arriveTimer = setTimeout(() => {
    help.classList.remove("is-arriving");
    helpOpen.closest("header").inert = true;
  }, DOUBLE_PRESS_MS);
}
function hideHelp() {
  if (!help.classList.contains("is-open")) return;
  clearTimeout(arriveTimer);
  help.classList.remove("is-open", "is-arriving");
  help.classList.add("is-closing");
  page.forEach((el) => (el.inert = false));
  $(".logo").inert = false;
  helpOpen.removeAttribute("tabindex");
  const back = opener || helpOpen;
  back.focus();
  opener = null;
  closeTimer = setTimeout(() => {
    // A second press on 閉じる during the exit focuses it; give focus back once the sheet is gone.
    const lost = help.contains(document.activeElement) || document.activeElement === document.body;
    help.hidden = true;
    help.classList.remove("is-closing");
    if (lost) back.focus();
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

helpOpen.addEventListener("click", openHelp);
// While the sheet is open, a press on 使い方 must not pull focus out of the sheet.
helpOpen.addEventListener("mousedown", (e) => { if (help.classList.contains("is-open")) e.preventDefault(); });
$(".help-close").addEventListener("click", closeHelp);
help.addEventListener("click", (e) => { if (e.target === help) closeHelp(); });
addEventListener("popstate", syncHelp);
syncHelp();
