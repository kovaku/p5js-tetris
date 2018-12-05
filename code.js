const screenWidth = 10;
const screenHeight = 24;

let board;
let tetromino;

function setup() {
  noCanvas();
  frameRate(1);
  drawTable();
  board = new TetrisBoard(screenHeight, screenWidth);
  board.setup();
  tetromino = new Tetromino(5, 1, 'todo');
}

function draw() {
  board.draw();
  tetromino.move(0, 1).rotate().draw();
}

function updateTableCell(r, c, value) {
  select('.r' + r + 'c' + c).attribute('value', value).html(value);
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

function TetrisBoard(height, width) {
  this.height = height;
  this.width = width;
  this.board = [];

  this.setup = function () {
    this.board = new Array(this.height);
    for (let r = 0; r < this.board.length; r++) {
      this.board[r] = new Array(this.width);
      for (let c = 0; c < this.board[r].length; c++) {
        this.board[r][c] = 0;
      }
    }
  };

  this.draw = function () {
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        updateTableCell(r, c, this.board[r][c]);
      }
    }
  };
}

/**
 * Constructor function for Tetromino object representing the actively falling block
 * @constructor
 */
function Tetromino(x, y, shape) {
  this.cells = []; // will be set using the shape
  this.color = 1; // will be set using the shape
  this.center = new Cell(x, y);

  //only for the time being, the shapes would enumerated
  this.cells.push(new Cell(-1, 1));
  this.cells.push(new Cell(-1, 0));
  this.cells.push(new Cell(0, 0));
  this.cells.push(new Cell(1, 0));

  this.move = function (x, y) {
    this.center.y = this.center.y + x;
    this.center.y = this.center.y + y;
    return this;
  };

  this.rotate = function () {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].rotate();
    }
    return this;
  };

  this.draw = function () {
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      updateTableCell(this.center.y + cell.y, this.center.x + cell.x,
          this.color);
    }
  };
}

/**
 * Object representing a coordinate pair
 * @param x is the horizontal coordinate of the given point
 * @param y is the vertical coordinate of the given point
 * @constructor
 */
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.rotate = function () {
    let temp_x = 0 - this.y;
    this.y = this.x;
    this.x = temp_x;
  }
}