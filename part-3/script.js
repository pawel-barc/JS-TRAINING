const box = document.getElementById("box");
const message = document.getElementById("message");
const bestScoreDisplay = document.getElementById("bestScore");
let startTime = 0;
let timeOutId = null;
let gameState = "iddle";

let bestScore = localStorage.getItem("bestScore");
if (bestScore === null) {
  bestScore = Infinity;
} else {
  bestScore = parseInt(bestScore);
  bestScoreDisplay.textContent = `Your best Score: ${bestScore} ms`;
}

function setBoxState(state) {
  box.classList.remove("box-wait", "box-ready", "box-too-soon", "box-result");
  if (state === "waiting") box.classList.add("box-wait");

  if (state === "ready") box.classList.add("box-ready");

  if (state === "tooSoon") box.classList.add("box-too-soon");

  if (state === "result") box.classList.add("box-result");

  gameState = state;
}

function startGame() {
  if (timeOutId) {
    clearTimeout(timeOutId);
    timeOutId = null;
  }
  setBoxState("waiting");
  message.textContent = "";
  box.textContent = "Wait...";

  const randomTime = Math.floor(Math.random() * 3000) + 1000;

  timeOutId = setTimeout(() => {
    startTime = Date.now();
    setBoxState("ready");
    box.textContent = "Click!";
    timeOutId = null;
  }, randomTime);
}

box.addEventListener("click", () => {
  if (gameState === "waiting") {
    if (timeOutId) {
      clearTimeout(timeOutId);
      timeOutId = null;
    }
    setBoxState("tooSoon");
    box.textContent = "Too soon, click to try again!";
    message.textContent = "You clicked to early!";
    return;
  }

  if (gameState === "ready") {
    const reactionTime = Date.now() - startTime;
    setBoxState("result");
    message.textContent = `Your reaction time: ${reactionTime} ms`;
    if (reactionTime < bestScore) {
      bestScore = reactionTime;
      localStorage.setItem("bestScore", bestScore);
      bestScoreDisplay.textContent = `New record: ${bestScore}`;
    }

    return;
  }

  if (
    gameState === "tooSoon" ||
    gameState === "result" ||
    gameState === "iddle"
  ) {
    startGame();
    return;
  }
});

startGame();
