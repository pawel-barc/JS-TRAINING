let time = 0;
let timer = null;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

function renderTime() {
  timeDisplay.textContent = time + "s";
}

startBtn.addEventListener("click", () => {
  if (timer !== null) return;

  timer = setInterval(() => {
    time++;
    renderTime();
  }, 1000);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  time = 0;
  renderTime();
});
