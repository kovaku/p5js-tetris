const screenWidth = 10;
const screenHeight = 24;

let center = 2;

let tetromino = [];
let board;

function setup() {
  noCanvas();
  frameRate(1);
  drawTable();
  setupBoard();
  tetromino.push(new Vector(-1, 1));
  tetromino.push(new Vector(-1, 0));
  tetromino.push(new Vector(0, 0));
  tetromino.push(new Vector(1, 0));
}

function draw() {
  drawBoard();
  drawTetromino();
  rotateTetromino();
}

function rotateTetromino() {
  for (let i = 0; i < tetromino.length; i++) {
    tetromino[i].rotate();
  }
}

function drawTetromino() {
  for (let i = 0; i < tetromino.length; i++) {
    let vector = tetromino[i];
    updateTableCell(center + vector.y, 5 + vector.x, 1);
  }
  center++;
}

function drawBoard() {
  for (let r = 0; r < screenHeight; r++) {
    for (let c = 0; c < screenWidth; c++) {
      updateTableCell(r, c, board[r][c]);
    }
  }
}

function updateTableCell(r, c, value) {
  select('.r' + r + 'c' + c).attribute('value', value).html(value);
}

function setupBoard() {
  board = new Array(screenHeight);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(screenWidth);
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = 0;
    }
  }
}

function drawTable() {
  let boardElement = createDiv().addClass('board');
  for (let row = 0; row < screenHeight; row++) {
    let rowElement = createDiv();
    boardElement.child(rowElement);
    for (let column = 0; column < screenWidth; column++) {
      rowElement.child(createDiv()
      .addClass('r' + row + 'c' + column)
      .addClass('cell'));
    }
  }
}

function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.rotate = function () {
    let temp_x = 0 - this.y;
    this.y = this.x;
    this.x = temp_x;
  }
}