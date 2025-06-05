const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 10;

let leftY = canvas.height / 2 - paddleHeight / 2;
let rightY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(0, leftY, paddleWidth, paddleHeight, "white");
  drawRect(canvas.width - paddleWidth, rightY, paddleWidth, paddleHeight, "white");
  drawBall(ballX, ballY, ballSize, "white");
}

function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY *= -1;
  }

  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= leftY &&
    ballY <= leftY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightY &&
    ballY <= rightY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  const speed = 10;
  if (e.key === "w") leftY -= speed;
  if (e.key === "s") leftY += speed;
  if (e.key === "ArrowUp") rightY -= speed;
  if (e.key === "ArrowDown") rightY += speed;
});

gameLoop();
