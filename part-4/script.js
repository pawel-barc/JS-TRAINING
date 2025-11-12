const info = document.getElementById("info");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = window.document.getElementById("bestScore");
const StartButton = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const square = document.getElementById("square");

let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let gameActive = false;
let timer = null;

bestScoreDisplay.textContent = `Your best score: ${bestScore}`;

function randomPosition() {
  const areaWidth = gameArea.clientWidth - 50;
  const areaHeight = gameArea.clientHeight - 50;

  const x = Math.random() * areaWidth;
  const y = Math.random() * areaHeight;

  square.style.left = `${x}px`;
  square.style.top = `${y}px`;
}

function startGame() {
  if (gameActive) return;

  score = 0;
  gameActive = true;
  info.textContent = "Click as fast as you can!";
  scoreDisplay.textContent = `Score: ${score}`;
  square.style.display = "block";
  StartButton.disabled = true;

  randomPosition();

  timer = setInterval(randomPosition, 700);

  setTimeout(endGame, 10000);
}

function endGame() {
  clearInterval(timer);
  gameActive = false;
  square.style.display = "none";
  StartButton.disabled = false;
  info.textContent = "Game over, Click to start again!";

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestScoreDisplay.textContent = `Your best score: ${bestScore}`;
  }
}

square.addEventListener("click", () => {
  if (!gameActive) return;

  score++;
  scoreDisplay.textContent = `Your score: ${score}`;
});

StartButton.addEventListener("click", startGame);
