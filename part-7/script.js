// References to HTML elements
const infoDisplay = document.getElementById("info");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const timerDisplay = document.getElementById("timer");
const livesDisplay = document.getElementById("lives");
const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const startButton = document.getElementById("startBtn");

// Game state variables
let timeLeft = 60;
let timeCounter = null;
let gameActive = false;
let score = 0;
let lives = 3;
let level = 1;
let basketX = 0;
let basketSpeed = 15;
let basketWidth = 80;
let ballFallingInterval = null;

// Best score loaded from local storage
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;

// Function generates random colors for the balls
function randomColors() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`;
}

// Returns ball size and falling speed depending on the current level
function gameLevel() {
  if (level === 1) {
    return { ballSize: 20, ballSpeed: 3 };
  }
  if (level === 2) {
    return { ballSize: 15, ballSpeed: 3 };
  }
  if (level === 3) {
    return { ballSize: 10, ballSpeed: 2 };
  }
  return { ballSize: 20, ballSpeed: 3 };
}

// Sets the basket to the initial centered bottom position
function initBasketPosition() {
  const areaWidth = gameArea.clientWidth;
  basketX = Math.floor((areaWidth - basketWidth) / 2);
  basket.style.left = `${basketX}px`;
}

// Keyboard controls for moving the basket left or right inside the game area
document.addEventListener("keydown", (e) => {
  if (!gameActive) return;

  const areaWidth = gameArea.clientWidth;
  if (e.key === "ArrowLeft") {
    basketX -= basketSpeed;
    if (basketX < basketWidth / 2) basketX = basketWidth / 2;
  }

  if (e.key === "ArrowRight") {
    basketX += basketSpeed;
    if (basketX > areaWidth - basketWidth / 2) {
      basketX = areaWidth - basketWidth / 2;
    }
  }
  basket.style.left = `${basketX}px`;
});

// Creates and animates a falling ball
function fallingBalls() {
  if (!gameActive) return;
  const { ballSize, ballSpeed } = gameLevel();
  const ball = document.createElement("div");
  ball.classList.add("ball");
  const areaWidth = gameArea.clientWidth - ballSize;
  const areaHeight = gameArea.clientHeight - ballSize;
  ball.style.width = ballSize + "px";
  ball.style.height = ballSize + "px";
  ball.style.background = randomColors();
  gameArea.appendChild(ball);
  const x = Math.floor(Math.random() * areaWidth);
  let y = 0;

  // Interval updates ball position (falling animation)
  const way = setInterval(() => {
    if (!gameActive) {
      clearInterval(way);
      return;
    }

    // Move ball downward
    y += ballSpeed;
    ball.style.top = `${y}px`;
    ball.style.left = `${x}px`;

    // Collision detection (ball caught by basket)
    if (checkCollision(ball, basket)) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      ball.remove();
      clearInterval(way);
      return;
    }

    // LBall hits the ground, lose one life
    if (y > gameArea.clientHeight - ballSize) {
      lives--;
      livesDisplay.textContent = `Lives: ${lives}`;
      ball.remove();
      clearInterval(way);
      if (lives <= 0) {
        endGame();
      }
    }
  }, 20);
}

// Collision detection using bounding rectangles
function checkCollision(ball, basket) {
  const ballRect = ball.getBoundingClientRect(); // DOM property return exact dimension and position of the element
  const basketRect = basket.getBoundingClientRect();

  return !(
    ballRect.bottom < basketRect.top ||
    ballRect.top > basketRect.bottom ||
    ballRect.right < basketRect.left ||
    ballRect.left > basketRect.right
  );
}

// Main function, start the game, resets values, initializes timers and ball spawner
function startGame() {
  if (gameActive) return;
  gameArea.innerHTML = "";
  gameArea.appendChild(basket);
  initBasketPosition();

  startButton.disabled = true;
  level = 1;
  timeLeft = 60;
  score = 0;
  lives = 3;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time left: ${timeLeft}`;
  livesDisplay.textContent = `Lives: ${lives}`;
  gameActive = true;

  // Creates a falling ball every 1.2 sec
  ballFallingInterval = setInterval(fallingBalls, 1200);

  // Countdown timer and level progression
  timeCounter = setInterval(() => {
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

// Stops the game, saves best score, clears intervals and game area
function endGame() {
  gameActive = false;
  startButton.disabled = false;
  clearInterval(timeCounter);
  clearInterval(ballFallingInterval);
  gameArea.innerHTML = "";
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
}

startButton.addEventListener("click", startGame);
