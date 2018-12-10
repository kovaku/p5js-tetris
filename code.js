const screenWidth = 10;
const screenHeight = 24;

let board;
let tetromino;

function setup() {
  noCanvas();
  frameRate(25);
  drawTable();
  board = new TetrisBoard(screenHeight, screenWidth);
  board.setup();
  tetromino = new Tetromino(1, 5, 'todo', board);
}

function draw() {

  //Moves
  if (keyIsDown(LEFT_ARROW)) {
    tetromino.tryToMove(0, -1);
    drawTetris();
  } else if (keyIsDown(RIGHT_ARROW)) {
    tetromino.tryToMove(0, 1);
    drawTetris();
  } else if (keyIsDown(DOWN_ARROW)) {
    tetromino.drop();
    drawTetris();
  } else if (keyIsDown(32)) {
    tetromino.tryToRotate();
    drawTetris();
  }

  //Drop
  if (frameCount % 5 === 0 && !tetromino.tryToMove(1, 0)) {
    board.draw();
    board.merge(tetromino);
    tetromino = new Tetromino(1, 5, 'todo', board);
    drawTetris();
  } else {
    drawTetris();
  }
}

function drawTetris() {
  //Todo: draw only the change
  board.draw();
  tetromino.draw();
}

function updateTableCell(r, c, value) {
  select('.r' + r + 'c' + c).attribute('value', value).html('\u00B7');
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

  this.merge = function (tetromino) {
    for (let i = 0; i < tetromino.cells.length; i++) {
      let cell = tetromino.cells[i];
      this.board[tetromino.center.r + cell.r][tetromino.center.c
      + cell.c] = tetromino.color;
    }
    this.clearFullLines();
  };

  this.clearFullLines = function () {
    for (let r = 0; r < this.height; r++) {
      let isFull = true;
      for (let c = 0; c < this.width; c++) {
        isFull = isFull && (this.board[r][c] !== 0);
      }
      if (isFull) {
        for (let r_up = r; r_up >= 0 ; r_up--) {
          for (let c_up = 0; c_up < this.width; c_up++) {
            if(r_up !== 0) {
              this.board[r_up][c_up] = this.board[r_up - 1][c_up];
            } else {
              this.board[r_up][c_up] = 0;
            }
          }
        }
      }
    }
  }
}

/**
 * Constructor function for Tetromino object representing the actively falling block
 * @constructor
 */
function Tetromino(r, c, shape, board) {
  this.cells = []; // will be set using the shape
  this.color = 1; // will be set using the shape
  this.center = new Cell(r, c);
  this.board = board;

  //only for the time being, the shapes would enumerated
  this.cells.push(new Cell(-1, 1));
  this.cells.push(new Cell(-1, 0));
  this.cells.push(new Cell(0, 0));
  this.cells.push(new Cell(1, 0));

  this.tryToMove = function (r, c) {
    let temp_r = this.center.r + r;
    let temp_c = this.center.c + c;

    for (let i = 0; i < tetromino.cells.length; i++) {
      let cell = this.cells[i];
      let temp_cell_c = temp_c + cell.c;
      let temp_cell_r = temp_r + cell.r;

      if (temp_cell_c === screenWidth || temp_cell_c < 0) {
        return false;
      }
      if (temp_cell_r === screenHeight) {
        return false;
      }
      if (this.board.board[temp_cell_r][temp_cell_c] !== 0) {
        return false;
      }
    }

    //After move
    this.center.r = temp_r;
    this.center.c = temp_c;
    return true;
  };

  this.drop = function () {
    while (tetromino.tryToMove(1, 0)) {
    }
  };

  this.tryToRotate = function () {

    let temp_Cells = [];

    for (let i = 0; i < this.cells.length; i++) {
      let temp_c = 0 - this.cells[i].r;
      let temp_r = this.cells[i].c;

      let temp_cell_c = this.center.c + temp_c;
      let temp_cell_r = this.center.r + temp_r;

      if (temp_cell_c === screenWidth || temp_cell_c < 0) {
        return false;
      }
      if (temp_cell_r === screenHeight) {
        return false;
      }
      if (this.board.board[temp_cell_r][temp_cell_c] !== 0) {
        return false;
      }

      temp_Cells.push(new Cell(temp_r, temp_c))
    }

    //After rotate
    this.cells = temp_Cells;
  };

  this.draw = function () {
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      updateTableCell(this.center.r + cell.r, this.center.c + cell.c,
          this.color);
    }
  };
}

/**
 * Object representing a coordinate pair
 * @param r is the vertical coordinate of the given point
 * @param c is the horizontal coordinate of the given point
 * @constructor
 */
function Cell(r, c) {
  this.r = r;
  this.c = c;
}