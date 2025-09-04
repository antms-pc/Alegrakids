const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');

const COLS = 10, ROWS = 20, BLOCK_SIZE = 20;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let gameOver = false;

const shapes = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  L: [[1,0],[1,0],[1,1]],
  J: [[0,1],[0,1],[1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]]
};

let current = createPiece();

function createPiece() {
  const keys = Object.keys(shapes);
  const shape = shapes[keys[Math.floor(Math.random() * keys.length)]];
  return {
    shape,
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0
  };
}

function drawBlock(x, y, color = '#f48fb1') {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => row.forEach((val, x) => {
    if (val) drawBlock(x, y);
  }));
  current.shape.forEach((row, dy) => row.forEach((val, dx) => {
    if (val) drawBlock(current.x + dx, current.y + dy, '#ce93d8');
  }));
}

function move(dx) {
  current.x += dx;
  if (collide()) current.x -= dx;
}

function rotate() {
  const rotated = current.shape[0].map((_, i) => current.shape.map(row => row[i])).reverse();
  const old = current.shape;
  current.shape = rotated;
  if (collide()) current.shape = old;
}

function drop() {
  current.y++;
  if (collide()) {
    current.y--;
    merge();
    clearLines();
    current = createPiece();
    if (collide()) {
      gameOver = true;
      gameOverDiv.classList.remove('hidden');
    }
  }
  drawBoard();
}

function collide() {
  return current.shape.some((row, dy) => row.some((val, dx) => {
    let x = current.x + dx;
    let y = current.y + dy;
    return val && (board[y]?.[x] || x < 0 || x >= COLS || y >= ROWS);
  }));
}

function merge() {
  current.shape.forEach((row, dy) => row.forEach((val, dx) => {
    if (val) board[current.y + dy][current.x + dx] = 1;
  }));
}

function clearLines() {
  board = board.filter(row => {
    if (row.every(val => val)) {
      score += 10;
      scoreDiv.innerText = `Pontuação: ${score}`;
      return false;
    }
    return true;
  });
  while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
}

function restartGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  scoreDiv.innerText = `Pontuação: 0`;
  gameOver = false;
  gameOverDiv.classList.add('hidden');
  current = createPiece();
  drawBoard();
}

// Teclado
document.addEventListener('keydown', e => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft') move(-1);
  else if (e.key === 'ArrowRight') move(1);
  else if (e.key === 'ArrowUp') rotate();
  else if (e.key === 'ArrowDown') drop();
});

// Botões visuais
document.getElementById('btn-left').addEventListener('click', () => move(-1));
document.getElementById('btn-right').addEventListener('click', () => move(1));
document.getElementById('btn-rotate').addEventListener('click', () => rotate());
document.getElementById('btn-down').addEventListener('click', () => drop());

// Velocidade reduzida para crianças
setInterval(() => {
  if (!gameOver) drop();
}, 1000); // 1 segundo entre quedas
