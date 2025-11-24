const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ============PLAYER============ //
// Object player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 5,
  dx: 0,
};

function drawPlayer() {
  ctx.fillStyle = "#00eaff";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(player.x - player.width / 2, player.y + player.height);
  ctx.lineTo(player.x + player.width / 2, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

function updatePlayer() {
  player.x += player.dx;
  if (player.x < player.width / 2) {
    player.x = player.width / 2;
  }
  if (player.x > canvas.width - player.width / 2) {
    player.x = canvas.width - player.width / 2;
  }
}

// ============BULLETS - WEAPONS============ //
let weaponType = "single";
const bullets = [];
function shoot() {
  if (weaponType === "single") shootSingle();
  if (weaponType === "double") shootDouble();
  if (weaponType === "triple") shootTriple();
  if (weaponType === "laser") shootLaser();
}

function shootSingle() {
  bullets.push({
    x: player.x,
    y: player.y,
    width: 5,
    height: 10,
    speed: 7,
  });
}

function shootDouble() {
  bullets.push({
    x: player.x + 20,
    y: player.y + 35,
    width: 5,
    height: 10,
    speed: 7,
  });

  bullets.push({
    x: player.x - 20,
    y: player.y + 35,
    width: 5,
    height: 10,
    speed: 7,
  });
}

function shootTriple() {
  bullets.push({
    x: player.x + 20,
    y: player.y + 35,
    dx: 0,
    dy: -7,
    width: 5,
    height: 10,
  });

  bullets.push({
    x: player.x - 20,
    y: player.y + 35,
    dx: -2,
    dy: -7,
    width: 5,
    height: 10,
  });
  bullets.push({
    x: player.x,
    y: player.y,
    dx: 2,
    dy: -7,
    width: 5,
    height: 10,
  });
}

function shootLaser() {
  bullets.push({
    x: player.x,
    y: player.y - 30,
    width: 8,
    height: 60,
    speed: 15,
    laser: true,
  });
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    if (b.dx !== undefined) b.x += b.dx;
    if (b.dy !== undefined) b.y += b.dy;
    else b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  }
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((b) => {
    ctx.fillRect(b.x - b.width / 2, b.y, b.width, b.height);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "q") {
    player.dx = -player.speed;
  }
  if (e.key === "ArrowRight" || e.key === "d") {
    player.dx = player.speed;
  }
  if (e.code === "Space") {
    shootTriple();
  }
});

document.addEventListener("keyup", (e) => {
  if (
    e.key === "ArrowLeft" ||
    e.key === "q" ||
    e.key === "ArrowRight" ||
    e.key === "d"
  ) {
    player.dx = 0;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawPlayer();

  updateBullets();
  drawBullets();

  requestAnimationFrame(gameLoop);
}

gameLoop();
