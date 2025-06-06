const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('pauseOverlay');
const scoreDisplay = document.getElementById('score');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 100, BALL_SIZE = 15;
const PADDLE_SPEED = 12;
let ballSpeedX = 6, ballSpeedY = 5;

let paused = false;
let leftScore = 0, rightScore = 0;
let keys = {};

let leftY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;

function togglePause() {
  paused = !paused;
  overlay.style.display = paused ? 'flex' : 'none';
  if (!paused) requestAnimationFrame(gameLoop);
}

function resetBall() {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballSpeedX *= -1;
}

function update() {
  // Move paddles
  if (keys['w'] && leftY > 0) leftY -= PADDLE_SPEED;
  if (keys['s'] && leftY + PADDLE_HEIGHT < HEIGHT) leftY += PADDLE_SPEED;
  if (keys['ArrowUp'] && rightY > 0) rightY -= PADDLE_SPEED;
  if (keys['ArrowDown'] && rightY + PADDLE_HEIGHT < HEIGHT) rightY += PADDLE_SPEED;

  // Ball physics
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) ballSpeedY *= -1;

  // Paddle collision
  if (ballX <= 30 && ballY + BALL_SIZE >= leftY && ballY <= leftY + PADDLE_HEIGHT) ballSpeedX *= -1;
  if (ballX + BALL_SIZE >= WIDTH - 30 && ballY + BALL_SIZE >= rightY && ballY <= rightY + PADDLE_HEIGHT) ballSpeedX *= -1;

  // Scoring
  if (ballX <= 0) { rightScore++; resetBall(); }
  if (ballX + BALL_SIZE >= WIDTH) { leftScore++; resetBall(); }

  scoreDisplay.textContent = `${leftScore} : ${rightScore}`;
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'white';
  ctx.fillRect(30, leftY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(WIDTH - 30 - PADDLE_WIDTH, rightY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  ctx.fillRect(WIDTH / 2 - 1, 0, 2, HEIGHT);
}

function gameLoop() {
  if (!paused) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Keyboard controls
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key.toLowerCase() === 'p') togglePause();
});
window.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// Touch controls
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
overlay.addEventListener('click', togglePause);
canvas.addEventListener('click', () => { if (paused) togglePause(); });

function handleTouch(e) {
  const rect = canvas.getBoundingClientRect();
  for (const t of e.touches) {
    const y = t.clientY - rect.top;
    if (t.clientX < rect.width / 2) leftY = Math.min(Math.max(0, y - PADDLE_HEIGHT / 2), HEIGHT - PADDLE_HEIGHT);
    else rightY = Math.min(Math.max(0, y - PADDLE_HEIGHT / 2), HEIGHT - PADDLE_HEIGHT);
  }
  e.preventDefault();
}

gameLoop();
