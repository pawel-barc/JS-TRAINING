const info = document.getElementById("info");
const displayScore = document.getElementById("score");
const displayTimer = document.getElementById("timer");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startBtn");

let score = 0;
let timeLeft = 20;
let gameActive = false;
let timer = null;
let spawnInterval = null;

let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

function spawnBall() {
  const ball = document.createElement("div");
  ball.classList.add("ball");

  const areaWidth = gameArea.clientWidth - 40;
  const areaHeight = gameArea.clientHeight - 40;

  const x = Math.random() * areaWidth;
  const y = Math.random() * areaHeight;

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  ball.style.background = randomColor();

  ball.addEventListener("click", () => {
    if (!gameActive) return;
    score++;
    displayScore.textContent = `Score: ${score}`;
    ball.remove();
  });

  gameArea.appendChild(ball);

  setTimeout(() => {
    if (gameArea.contains(ball)) ball.remove();
  }, 1500);
}

function newGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  timeLeft = 20;
  displayScore.textContent = `Score: ${score}`;
  displayTimer.textContent = `Time left: ${timeLeft}`;
  startButton.disabled = true;
  gameArea.innerHTML = "";

  spawnInterval = setInterval(spawnBall, 600);

  timer = setInterval(() => {
    timeLeft--;
    displayTimer.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(timer);
  gameActive = false;
  startButton.disabled = false;
  gameArea.innerHTML = "";
  alert(`Game over, Your score: ${score}`);
  if (score > bestScore) {
    bestScore = score;
    alert(`It's the best score ever: ${score}`);
    localStorage.setItem("bestScore", bestScore);
  }
}

startButton.addEventListener("click", newGame);
