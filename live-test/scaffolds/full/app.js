// あさのび — the guided morning stretch.
const POSES = [
  { name: "Cat-Cow(Slow)", seconds: 30 },
  { name: "Downward Dog(Hold)", seconds: 30 },
  { name: "Child's Pose(Rest)", seconds: 30 },
  { name: "Seated Twist(Each Side)", seconds: 40 },
  { name: "Neck Roll(Gentle)", seconds: 20 },
];
const MIN_SECONDS = 10;
const LOG_KEY = "asanobi-log";

const $ = (s) => document.querySelector(s);
const page = [$(".site-header"), $("main"), $(".site-footer")];

// ---- the menu on the page ----
const list = $(".poses");
for (const p of POSES) {
  const li = document.createElement("li");
  li.className = "pose-card";
  const name = document.createElement("span");
  name.className = "pose-name";
  name.textContent = p.name;
  const time = document.createElement("span");
  time.className = "pose-time";
  time.textContent = `${p.seconds} 秒`;
  li.append(name, time);
  list.append(li);
}

// ---- the log ----
function readLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; }
}
function renderLog() {
  const log = readLog();
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const week = log.filter((r) => r.at > weekAgo).length;
  const minutes = log.reduce((m, r) => m + r.minutes, 0);
  $(".log-empty").textContent = log.length === 0
    ? "まだ記録がありません。1 回終えると、ここに回数と時間が出ます。"
    : "";
  $("#log-line").replaceChildren("今週 ", String(week), " 回", "、", "合計 ", String(minutes), " 分");
  $(".log-clear").hidden = log.length === 0;
}
renderLog();

// ---- transient messages ----
let toastTimer = 0;
function toast(text) {
  const t = $(".toast");
  t.textContent = text;
  t.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-shown"), 3000);
}

// ---- the glow behind the guided session ----
const canvas = $(".glow");
const ctx = canvas.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let glowRunning = false;
let glowStart = 0;
let glowPausedAt = 0;
function sizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
}
function drawGlow(t) {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "#0b0d12";
  ctx.fillRect(0, 0, w, h);
  const phase = (t / 8000) % 1;
  const x = -0.3 * w + phase * 1.6 * w;
  const y = h * 0.3;
  const r = Math.max(w, h) * 0.28;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, "rgba(235, 255, 250, 1)");
  g.addColorStop(0.35, "rgba(120, 230, 210, 0.85)");
  g.addColorStop(1, "rgba(120, 230, 210, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const g2 = ctx.createRadialGradient(w, h, 0, w, h, r);
  g2.addColorStop(0, "rgba(217, 98, 43, 0.5)");
  g2.addColorStop(1, "rgba(217, 98, 43, 0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
}
function glowLoop(now) {
  if (!glowRunning) return;
  drawGlow(now - glowStart);
  requestAnimationFrame(glowLoop);
}
function glowPlay() {
  sizeCanvas();
  if (reduce) { drawGlow(0); return; }
  glowStart = performance.now() - glowPausedAt;
  glowRunning = true;
  requestAnimationFrame(glowLoop);
}
function glowPause() {
  glowRunning = false;
  glowPausedAt = performance.now() - glowStart;
}
addEventListener("resize", () => { if (!$(".player").hidden) sizeCanvas(); });

// ---- the guided session ----
let index = 0;
let remain = 0;
let tick = 0;
let gateTimer = 0;
let paused = false;
let opener = null;

function showPose() {
  const p = POSES[index];
  $("#pose-index").textContent = String(index + 1);
  $("#pose-total").textContent = String(POSES.length);
  $("#pose-name").textContent = p.name;
  remain = p.seconds;
  $("#remain").textContent = String(remain);
  const next = $(".next");
  next.disabled = true;
  $("#gate-note").textContent = `${MIN_SECONDS} 秒たつと「次へ」で進めます`;
  clearTimeout(gateTimer);
  gateTimer = setTimeout(() => {
    next.disabled = false;
    $("#gate-note").textContent = "「次へ」で先に進めます";
  }, MIN_SECONDS * 1000);
}

function startTick() {
  clearInterval(tick);
  tick = setInterval(() => {
    if (paused) return;
    remain -= 1;
    $("#remain").textContent = String(Math.max(remain, 0));
    if (remain <= 0) advance();
  }, 1000);
}

function advance() {
  if (index < POSES.length - 1) {
    index += 1;
    showPose();
  } else {
    finish();
  }
}

function openPlayer() {
  opener = document.activeElement;
  index = 0;
  paused = false;
  $(".pause").textContent = "一時停止";
  page.forEach((el) => (el.inert = true));
  $(".player").hidden = false;
  showPose();
  startTick();
  glowPlay();
  $(".pause").focus();
}

function closePlayer() {
  clearInterval(tick);
  clearTimeout(gateTimer);
  glowPause();
  $(".player").hidden = true;
  page.forEach((el) => (el.inert = false));
  if (opener) opener.focus();
}

function finish() {
  const minutes = Math.round(POSES.reduce((s, p) => s + p.seconds, 0) / 60);
  const log = readLog();
  log.push({ at: Date.now(), minutes });
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
  closePlayer();
  $("#result-line").textContent = `きょうは ${POSES.length} つのポーズ、${minutes} 分のばしました。`;
  $(".result").hidden = false;
  setTimeout(() => {
    $(".result").hidden = true;
    renderLog();
    toast("きょうの記録を保存しました");
  }, 3000);
}

$(".start").addEventListener("click", openPlayer);
$(".player-close").addEventListener("click", closePlayer);
$(".next").addEventListener("click", () => { if (!$(".next").disabled) advance(); });
$(".pause").addEventListener("click", () => {
  paused = !paused;
  $(".pause").textContent = paused ? "再開" : "一時停止";
  if (paused) glowPause(); else glowPlay();
});

// ---- the help sheet ----
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

// ---- clearing the log ----
const confirmBox = $(".confirm");
$(".log-clear").addEventListener("click", () => confirmBox.showModal());
$(".confirm-cancel").addEventListener("click", () => confirmBox.close());
$(".confirm-delete").addEventListener("click", () => {
  localStorage.removeItem(LOG_KEY);
  confirmBox.close();
  renderLog();
  toast("記録を消しました");
  $(".start").focus();
});
