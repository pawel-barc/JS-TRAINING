const infoDisplay = document.getElementById("info");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const timerDisplay = document.getElementById("timer");
const livesDisplay = document.getElementById("lives");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startBtn");

let timeLeft = 60;
let timer = null;
let gameActive = false;
let score = 0;
let lives = 3;
let level = 1;

let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
function randomColors() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`;
}

function gameLevel() {
  if (level === 1) {
    return { ballSize: 20, ballSpeed: 3 };
  }
  if (level === 2) {
    return { ballSize: 15, ballSpeed: 3 };
  }
  if (level === 3) {
    return { ballSize: 15, ballSpeed: 2 };
  }
  return { ballSize: 20, ballSpeed: 3 };
}

function fallingBalls() {
  if (!gameActive) return;
  const { ballSize, ballSpeed } = gameLevel();
  const ball = document.createElement("div");
  ball.classList.add("ball");
  areaWidth = gameArea.clientWidth - ballSize;
  areaHeight = gameArea.clientHeight - ballSize;
  ball.style.width = ballSize;
  ball.style.height = ballSize;
  ball.style.background = randomColors();
  gameArea.appendChild(ball);
  const x = Math.floor(Math.random() * areaWidth);
  let y = 0;
  const way = setInterval(() => {
    if (!gameActive) {
      clearInterval(way);
      return;
    }
    y += ballSpeed;
    ball.style.top = `+${y}px`;
    ball.style.left = `${x}px`;
  }, 20);
}

function startGame() {
  if (gameActive) return;
  gameArea.innerHTML = "";
  level = 1;
  startButton.disabled = true;
  timeLeft = 60;
  score = 0;
  lives = 3;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time left: ${timeLeft}`;
  livesDisplay.textContent = `Lives: ${lives}`;
  gameActive = true;
  fallingBalls();
  timer = setTimeout(() => {
    if (!gameActive) {
      clearTimeout(timer);
      return;
    }
  }, 60000);

  const timeCounter = setInterval(() => {
    if (!gameActive) {
      clearInterval(timeCounter);
      return;
    }
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft === 40) {
      level = 2;
    }
    if (timeLeft === 20) {
      level = 3;
    }
    if (timeLeft === 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  startButton.disabled = false;
  clearInterval(timeCounter);
  gameArea.innerHTML = "";
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
}

startButton.addEventListener("click", startGame);
