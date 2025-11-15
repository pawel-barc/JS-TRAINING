const infoDisplay = document.getElementById("info");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const timerDisplay = document.getElementById("timer");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startBtn");

let timeLeft = 60;
let score = 0;
let timer = null;
let gameActive = false;
let timeCounter = null;
let lives = 3;
let level = 1;

let growTimers = [];

let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;

// Random colors of the circles
function randomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`;
}

// Diffrent levels
function getLevelConfig() {
  if (level === 1) {
    return { growSpeed: 70, growAmount: 2, maxSize: 60 };
  }
  if (level === 2) {
    return { growSpeed: 50, growAmount: 2, maxSize: 60 };
  }
  if (level === 3) {
    return { growSpeed: 50, growAmount: 2, maxSize: 50 };
  }
  return { growSpeed: 70, growAmount: 2, maxSize: 60 };
}

function createCircle() {
  if (!gameActive) return;
  const { growSpeed, growAmount, maxSize } = getLevelConfig();
  const circle = document.createElement("div");
  circle.classList.add("circle");

  const widthArea = gameArea.clientWidth - 50;
  const heightArea = gameArea.clientHeight - 50;

  const x = Math.random() * widthArea;
  const y = Math.random() * heightArea;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.background = randomColor();

  gameArea.appendChild(circle);

  const grow = setInterval(() => {
    if (!gameActive) {
      clearInterval(grow);
      return;
    }
    if (circle.clientWidth >= maxSize) {
      clearInterval(grow);
      circle.remove();
      endLive();
      return;
    }

    const newSize = circle.clientWidth + growAmount;
    circle.style.width = newSize + "px";
    circle.style.height = newSize + "px";
  }, growSpeed);

  growTimers.push(grow);

  circle.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = `Your score: ${score}`;
    clearInterval(grow);
    circle.remove();
    createCircle();
  });
}

function endLive() {
  if (!gameActive) return;
  lives--;
  infoDisplay.textContent = `Your lives: ${lives}`;
  if (lives <= 0) {
    endGame();
    return;
  }

  setTimeout(() => {
    createCircle();
  }, 200);
}

function startGame() {
  if (gameActive) return;

  level = 1;
  startButton.disabled = true;
  gameArea.innerHTML = "";
  score = 0;
  timeLeft = 60;
  lives = 3;
  scoreDisplay.textContent = `Your score: ${score}`;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  infoDisplay.textContent = `Your lives: ${lives}`;
  gameActive = true;
  createCircle();

  timer = setTimeout(() => {
    if (!gameActive) return;
    endGame();
  }, 60000);

  timeCounter = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft === 40) level = 2;
    if (timeLeft === 20) level = 3;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  gameActive = false;
  startButton.disabled = false;
  growTimers.forEach((id) => clearInterval(id));
  growTimers = [];
  clearInterval(timeCounter);
  gameArea.innerHTML = "";
  if (score > bestScore) {
    alert(`New best score: ${score}`);
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  alert(`Game over! Your score: ${score}`);
}

startButton.addEventListener("click", startGame);
