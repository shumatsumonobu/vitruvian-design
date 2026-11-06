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
const page = [$(".site-header"), $("main"), $(".site-footer")];

// ---- the menu ----
const list = $(".poses");
for (const p of POSES) {
  const li = document.createElement("li");
  li.className = "pose-card";
  const name = document.createElement("span");
  name.className = "pose-name";
  name.textContent = p.name;
  const time = document.createElement("span");
  time.className = "pose-time";
  time.textContent = `${p.seconds}秒`;
  li.append(name, time);
  list.append(li);
}

// ---- the log ----
function readLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; }
}
function renderLog() {
  const log = readLog();
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const week = log.filter((r) => r.at >= monday.getTime()).length;
  const minutes = log.reduce((m, r) => m + r.minutes, 0);
  const fmt = (n) => n.toLocaleString("ja-JP");
  $(".log-empty").hidden = log.length > 0;
  $("#log-line").hidden = log.length === 0;
  $("#log-line").replaceChildren("今週", fmt(week), "回", "、", "合計", fmt(minutes), "分");
}
renderLog();

// ---- start ----
$(".start").addEventListener("click", () => {
  $(".routine").scrollIntoView({ behavior: "smooth" });
});

// ---- the help sheet ----
let opener = null;
function openHelp() {
  opener = document.activeElement;
  history.pushState({ help: true }, "");
  $(".help").hidden = false;
  page.forEach((el) => (el.inert = true));
  $(".help-close").focus();
}
function hideHelp() {
  $(".help").hidden = true;
  page.forEach((el) => (el.inert = false));
  if (opener) opener.focus();
}
$(".help-open").addEventListener("click", openHelp);
$(".help-close").addEventListener("click", () => history.back());
$(".help").addEventListener("click", (e) => { if (e.target === $(".help")) history.back(); });
addEventListener("popstate", () => { if (!$(".help").hidden) hideHelp(); });
