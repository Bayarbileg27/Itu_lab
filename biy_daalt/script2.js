const mainBoard = document.querySelector(".main");
const cells = Array.from({ length: 16 }, (_, i) => document.getElementById(`t${i + 1}`));
const countbox = document.getElementById("count");
const restartbox = document.getElementById("restart");

const TARGET_COUNT = 4;
const LIFE_TIME = 4000;     
const WIN_SCORE = 10;

let score = 0;
let gameRunning = true;

let nextTargetId = 1;

const targetsById = new Map();

const posToId = new Map();

const overlay = document.createElement("div");
overlay.className = "gameover-overlay";
overlay.id = "gameover";
overlay.innerHTML = `
  <div class="gameover-box">
    <h1>GAME OVER</h1>
    <p>Restart дарж дахин эхлээрэй</p>
  </div>
`;
mainBoard.appendChild(overlay);

function showGameOver() {
  overlay.style.display = "flex";
}
function hideGameOver() {
  overlay.style.display = "none";
}

function randPos() {
  return Math.floor(Math.random() * 16) + 1;
}

function clearAllCells() {
  for (const c of cells) c.innerHTML = "";
}

function clearTargetTimers(t) {
  if (!t) return;
  clearTimeout(t.lifeTimer);
}

function stopAllTimers() {
  for (const t of targetsById.values()) clearTargetTimers(t);
}

function createTargetElement(id, pos) {
  const img = document.createElement("img");
  img.src = "target1.png";
  img.className = "circle";
  img.alt = "target";
  img.dataset.tid = String(id);
  img.dataset.pos = String(pos);
  return img;
}

function scheduleTimersForTarget(id) {
  const t = targetsById.get(id);
  if (!t) return;

  t.lifeTimer = setTimeout(() => {
    const cur = targetsById.get(id);
    if (!gameRunning || !cur) return;

    moveTarget(id);
  }, LIFE_TIME);
}

function placeTargetAt(pos) {
  const id = nextTargetId++;

  if (posToId.has(pos)) return;

  const img = createTargetElement(id, pos);
  cells[pos - 1].innerHTML = "";
  cells[pos - 1].appendChild(img);

  const t = { id, pos, lifeTimer: null };
  targetsById.set(id, t);
  posToId.set(pos, id);

  scheduleTimersForTarget(id);
}

function pickFreePos() {
  let p = randPos();
  while (posToId.has(p)) p = randPos();
  return p;
}

function moveTarget(id) {
  const t = targetsById.get(id);
  if (!t) return;

  clearTargetTimers(t);

  const oldPos = t.pos;
  posToId.delete(oldPos);

  const oldCell = cells[oldPos - 1];
  const oldImg = oldCell.querySelector(`img.circle[data-tid="${id}"]`);
  if (oldImg) oldImg.remove();

  const newPos = pickFreePos();

  t.pos = newPos;
  posToId.set(newPos, id);

  const newCell = cells[newPos - 1];
  newCell.innerHTML = "";
  newCell.appendChild(createTargetElement(id, newPos));

  scheduleTimersForTarget(id);
}

function removeTarget(id) {
  const t = targetsById.get(id);
  if (!t) return;

  clearTargetTimers(t);
  targetsById.delete(id);
  posToId.delete(t.pos);

  const cell = cells[t.pos - 1];
  const img = cell.querySelector(`img.circle[data-tid="${id}"]`);
  if (img) img.remove();
}

function endGame() {
  gameRunning = false;
  stopAllTimers();

  clearAllCells();
  targetsById.clear();
  posToId.clear();

  showGameOver();
}

function startGame() {
  hideGameOver();
  gameRunning = true;

  stopAllTimers();
  targetsById.clear();
  posToId.clear();
  clearAllCells();

  score = 0;
  countbox.textContent = "0";

  for (let i = 0; i < TARGET_COUNT; i++) {
    placeTargetAt(pickFreePos());
  }
}

restartbox.addEventListener("click", () => {
  startGame();
});

document.addEventListener("click", (e) => {
  if (!gameRunning) return;

  const img = e.target.closest("img.circle");
  if (!img) return;

  const id = Number(img.dataset.tid);
  if (!targetsById.has(id)) return;

  score++;
  countbox.textContent = String(score);

  if (score >= WIN_SCORE) {
    endGame();
    return;
  }

  moveTarget(id);
});

startGame();
