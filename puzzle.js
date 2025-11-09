document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("score");
  const gameOverDisplay = document.getElementById("game-over");
  const restartButton = gameOverDisplay.querySelector("button");

  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 20;
  canvas.width = COLS * BLOCK_SIZE;
  canvas.height = ROWS * BLOCK_SIZE;

  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let score = 0;
  let currentPiece = null;
  let gameOver = false;
  let descendoRapido = false;

  const pieces = [
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1], [1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[1, 1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]]
  ];

  const pieceTypes = ["T", "O", "S", "Z", "I", "J", "L"];

  const pieceScores = {
    O: 1,
    I: 2,
    T: 3,
    S: 4,
    Z: 4,
    L: 5,
    J: 5
  };

  function drawBlock(x, y, color = "#4CAF50") {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) drawBlock(x, y);
      });
    });
    if (currentPiece) drawPiece(currentPiece);
  }

  function drawPiece(piece) {
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) drawBlock(piece.x + dx, piece.y + dy, "#ffb6c1");
      });
    });
  }

  function spawnPiece() {
    const index = Math.floor(Math.random() * pieces.length);
    const shape = pieces[index];
    const type = pieceTypes[index];
    currentPiece = {
      shape,
      type,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0
    };
    if (collides(currentPiece)) {
      gameOver = true;
      gameOverDisplay.classList.remove("hidden");
    }
  }

  function collides(piece) {
    return piece.shape.some((row, dy) =>
      row.some((value, dx) => {
        if (!value) return false;
        const x = piece.x + dx;
        const y = piece.y + dy;
        return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x]);
      })
    );
  }

  function merge(piece) {
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          const x = piece.x + dx;
          const y = piece.y + dy;
          if (y >= 0) board[y][x] = 1;
        }
      });
    });
    score += pieceScores[piece.type] || 1;
    scoreDisplay.textContent = `Pontuação: ${score}`;
  }

  function rotate(piece) {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    const clone = { ...piece, shape: rotated };
    if (!collides(clone)) piece.shape = rotated;
  }

  function move(dx, dy) {
    if (!currentPiece || gameOver) return;
    const clone = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
    if (!collides(clone)) {
      currentPiece.x += dx;
      currentPiece.y += dy;
    } else if (dy === 1) {
      merge(currentPiece);
      clearLines();
      spawnPiece();
    }
  }

  function clearLines() {
    board = board.filter(row => {
      if (row.every(cell => cell)) {
        score += 10;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        return false;
      }
      return true;
    });
    while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
  }

  function gameLoop() {
    if (!gameOver) {
      move(0, 1);
      drawBoard();
      setTimeout(gameLoop, 700);
    }
  }

  function quedaRapida() {
    if (descendoRapido && !gameOver) {
      move(0, 1);
      drawBoard();
      setTimeout(quedaRapida, 100);
    }
  }

  const btnDown = document.getElementById("btn-down");
  btnDown.addEventListener("mousedown", () => {
    descendoRapido = true;
    quedaRapida();
  });
  btnDown.addEventListener("mouseup", () => {
    descendoRapido = false;
  });
  btnDown.addEventListener("mouseleave", () => {
    descendoRapido = false;
  });

  document.getElementById("btn-left").addEventListener("click", () => move(-1, 0));
  document.getElementById("btn-right").addEventListener("click", () => move(1, 0));
  document.getElementById("btn-rotate").addEventListener("click", () => rotate(currentPiece));

  restartButton.addEventListener("click", () => {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    scoreDisplay.textContent = "Pontuação: 0";
    gameOver = false;
    gameOverDisplay.classList.add("hidden");
    spawnPiece();
    drawBoard();
    gameLoop();
  });

  spawnPiece();
  drawBoard();
  gameLoop();
});
