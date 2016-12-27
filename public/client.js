var GRID_SIZE = 10;
var CELL_WIDTH = 80;
var CIRCLE_FRACTION = 0.8;

var COLORS = ['red', 'yellow', 'green', 'blue', 'purple', 'saddlebrown'];
var EMPTY = '.';

var canvas = document.querySelector('canvas');
canvas.width = GRID_SIZE * CELL_WIDTH;
canvas.height = GRID_SIZE * CELL_WIDTH;
var context = canvas.getContext('2d');

function updateDisplay(grid) {
  for (var r = 1; r <= GRID_SIZE; r++) {
    for (var c = 1; c <= GRID_SIZE; c++) {
      context.beginPath();
      context.arc(CELL_WIDTH * (c - 0.5), CELL_WIDTH * (r - 0.5), CELL_WIDTH * 0.5 * CIRCLE_FRACTION, 0, 2 * Math.PI, false);
      context.fillStyle = grid[r][c] === EMPTY ? 'white' : COLORS[grid[r][c] - '0'];
      context.fill();
      context.closePath();
    }
  }
}

function slideDown(grid) {
  var fill_row;
  var fill_col = 1;

  for (var c = 1; c <= GRID_SIZE; c++) {
    fill_row = GRID_SIZE;

    for (var r = GRID_SIZE; r >= 1; r--) {
      if (grid[r][c] != EMPTY) {
        grid[fill_row][fill_col] = grid[r][c];

        if (r != fill_row || c != fill_col) {
          grid[r][c] = EMPTY;
        }

        fill_row--;
      }
    }

    if (fill_row < GRID_SIZE) {
      fill_col++;
    }
  }
}

var grid = [];

for (var r = 0; r <= GRID_SIZE + 1; r++) {
  var row = [];

  for (var c = 0; c <= GRID_SIZE + 1; c++) {
    row.push(EMPTY);
  }

  grid.push(row);
}

window.setInterval(function() {
  var r = Math.floor(Math.random() * GRID_SIZE + 1);
  var c = Math.floor(Math.random() * GRID_SIZE + 1);
  var color = Math.floor(Math.random() * (COLORS.length + 1));

  if (color < COLORS.length) {
    grid[r][c] = String.fromCharCode(color + '0'.charCodeAt(0));
  } else {
    grid[r][c] = EMPTY;
  }

  slideDown(grid);
  updateDisplay(grid);
}, 50);
