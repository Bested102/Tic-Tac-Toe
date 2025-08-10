let boardEl = document.querySelector(".board");
let cells = document.querySelectorAll(".board .cell");
let resultEl = document.querySelector(".result");
let resetEl = document.querySelector(".reset");
let cellValues = Array(9).fill("");
let lastMove = -1;
let gameRunning = true;
let cheatedLastMove = false;
let isFirstMove = true;

resetEl.addEventListener("click", resetGame);
let wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let winningCombinations = [];
wins.forEach((win) => {
  winningCombinations.push(
    { moves: [win[0], win[1]], missing: win[2] },
    { moves: [win[0], win[2]], missing: win[1] },
    { moves: [win[1], win[2]], missing: win[0] }
  );
});
setBoard();

cells.forEach((cell, i) => {
  cell.addEventListener("click", () => {
    handleCellClick(cell, i);
  });
});

function setBoard() {
  cells.forEach((e, i) => {
    e.textContent = cellValues[i];
    e.className = `${e.className} ${cellValues[i]}`;
  });
}

function handleCellClick(cell, index) {
  if (cell.classList.contains("selected") || !gameRunning) return;
  lastMove = index;
  cell.classList.add("selected");
  cellValues[index] = "x";
  if (!isFirstMove) {
    let random = Math.random();
    if (random <= 0.4) cheatMove(lastMove);
  }
  isFirstMove = false;
  setBoard();
  checkGameStatus();
  if (!gameRunning) return;
  if (cheatedLastMove) {
    cheatedLastMove = false;
    return;
  }
  makeComputerMove();
}

function checkGameStatus() {
  gameRunning = false;
  if (checkWin("x")) {
    cheatMove(lastMove);
    setBoard();
    checkGameStatus();
  } else if (checkWin("o")) {
    resultEl.textContent = "Computer wins!";
  } else if (cellValues.every((value) => value !== "")) {
    resultEl.textContent = "It's a draw!";
  } else {
    gameRunning = true;
  }
}

function checkWin(player) {
  let playerMoves = cellValues
    .map((value, index) => (value === player ? index : -1))
    .filter((index) => index !== -1);

  return wins.some((win) => win.every((index) => playerMoves.includes(index)));
}

function findMove() {
  let winningMove = findWinningMove("o");
  if (winningMove !== -1) {
    return winningMove;
  }

  let blockingMove = findWinningMove("x");
  if (blockingMove !== -1) {
    return blockingMove;
  }
  return -1;
}

function findWinningMove(player) {
  let playerMoves = cellValues
    .map((value, index) => (value === player ? index : -1))
    .filter((index) => index !== -1);

  const combo = winningCombinations.find(
    (e) =>
      e.moves.every((index) => playerMoves.includes(index)) &&
      cellValues[e.missing] === ""
  );
  return combo ? combo.missing : -1;
}

function makeComputerMove() {
  let computerMove = findMove("o");
  if (computerMove !== -1) {
    cellValues[computerMove] = "o";
  } else {
    let randomMove = Math.floor(Math.random() * 9);
    while (cellValues[randomMove] !== "") {
      randomMove = Math.floor(Math.random() * 9);
    }
    cellValues[randomMove] = "o";
  }
  setBoard();
  checkGameStatus();
}

function cheatMove(i) {
  cellValues[i] = "o";
  cheatedLastMove = true;
}

function resetGame() {
  cellValues.fill("");
  cells.forEach((cell) => {
    cell.className = "cell";
  });
  lastMove = -1;
  gameRunning = true;
  cheatedLastMove = false;
  isFirstMove = true;
  resultEl.textContent = "";
  setBoard();
}
