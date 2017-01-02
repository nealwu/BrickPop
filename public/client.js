var GRID_SIZE = 10;
var CELL_DIM = 80;
var GRID_DIM = GRID_SIZE * CELL_DIM;
var CIRCLE_FRACTION = 0.9;
var CIRCLE_RADIUS = CELL_DIM * 0.5 * CIRCLE_FRACTION;
var PALETTE_GAP = 0.5 * CELL_DIM;

var NUM_COLORS = 6;
var COLORS = ['red', 'yellow', 'green', 'blue', 'purple', 'saddlebrown'];
var EMPTY = '.';

var DR = [-1, 0, 1, 0];
var DC = [0, 1, 0, -1];

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var paintColor = NUM_COLORS + 1;

// Set up an extra column for the painting palette
canvas.width = (GRID_SIZE + 1) * CELL_DIM + PALETTE_GAP;
canvas.height = Math.max(GRID_SIZE, NUM_COLORS + 2) * CELL_DIM;

// Performs a deep copy of a 2D array of primitives
function copy2D(input) {
  var result = [];

  for (var i = 0; i < input.length; i++) {
    var row = [];

    for (var j = 0; j < input[i].length; j++) {
      row.push(input[i][j]);
    }

    result.push(row);
  }

  return result;
}

function getScore() {
  var scoreElem = document.getElementById('score');
  return parseInt(scoreElem.firstChild.nodeValue);
}

function updateScore(score) {
  var scoreElem = document.getElementById('score');
  scoreElem.removeChild(scoreElem.firstChild);
  scoreElem.appendChild(document.createTextNode(score));
}

function updateDisplay(grid) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Start by drawing out a grid
  for (var i = 0; i <= GRID_SIZE; i++) {
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(i * CELL_DIM, 0);
    context.lineTo(i * CELL_DIM, GRID_DIM);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(0, i * CELL_DIM);
    context.lineTo(GRID_DIM, i * CELL_DIM);
    context.stroke();
    context.closePath();
  }

  for (var r = 1; r <= GRID_SIZE; r++) {
    for (var c = 1; c <= GRID_SIZE; c++) {
      if (grid[r][c] === EMPTY) {
	continue;
      }

      // Draw a colored circle
      context.beginPath();
      context.arc(CELL_DIM * (c - 0.5), CELL_DIM * (r - 0.5), CIRCLE_RADIUS, 0, 2 * Math.PI);
      context.fillStyle = COLORS[grid[r][c] - '0'];
      context.fill();
      context.closePath();
    }
  }

  // Draw the palette
  for (var i = 0; i <= NUM_COLORS + 1; i++) {
    var x = GRID_SIZE * CELL_DIM + PALETTE_GAP;
    var y = i * CELL_DIM;
    context.beginPath();
    context.rect(x, y, CELL_DIM, CELL_DIM);
    context.fillStyle = i < NUM_COLORS ? COLORS[i] : 'white';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();

    if (i === NUM_COLORS + 1) {
      // Draw an X which represents exiting out of the palette
      var adjust = CELL_DIM * 0.15;
      context.beginPath();
      context.lineWidth = 4;
      context.moveTo(x + adjust, y + adjust);
      context.lineTo(x + CELL_DIM - adjust, y + CELL_DIM - adjust);
      context.stroke();
      context.moveTo(x + CELL_DIM - adjust, y + adjust);
      context.lineTo(x + adjust, y + CELL_DIM - adjust);
      context.stroke();
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
      if (grid[r][c] !== EMPTY) {
        grid[fill_row][fill_col] = grid[r][c];

        if (r !== fill_row || c !== fill_col) {
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
var history = [];
var historyPosition = 0;
var historyLimit = 0;
var visited = [];
var visitID = 0;

function printGrid() {
  for (var r = 1; r <= GRID_SIZE; r++) {
    var row = '';

    for (var c = 1; c <= GRID_SIZE; c++) {
      row += grid[r][c];
    }

    console.log(row);
  }
}

function displayChangesAndSave() {
  slideDown(grid);
  updateDisplay(grid);
  history[historyPosition++] = [copy2D(grid), getScore()];
  historyLimit = historyPosition;
}

// Construct arrays
for (var r = 0; r <= GRID_SIZE + 1; r++) {
  var gridRow = [];
  var visitedRow = [];

  for (var c = 0; c <= GRID_SIZE + 1; c++) {
    gridRow.push(EMPTY);
    visitedRow.push(0);
  }

  grid.push(gridRow);
  visited.push(visitedRow);
}

function searchAndPop(row, col, color) {
  visited[row][col] = visitID;
  grid[row][col] = EMPTY;

  var count = 1;

  for (var dir = 0; dir < 4; dir++) {
    var nrow = row + DR[dir];
    var ncol = col + DC[dir];

    if (visited[nrow][ncol] !== visitID && grid[nrow][ncol] === color) {
      count += searchAndPop(nrow, ncol, color);
    }
  }

  return count;
}

function playerMove(row, col) {
  console.log('playerMove: ' + row + ' ' + col);

  if (grid[row][col] === EMPTY) {
    return;
  }

  visitID++;
  var color = grid[row][col];
  var popped = searchAndPop(row, col, color);

  if (popped === 1) {
    grid[row][col] = color;
    return;
  }

  console.log('Popped ' + popped);

  var score = getScore() + popped * (popped - 1);
  updateScore(score);
  displayChangesAndSave();
  console.log(history);
}

canvas.addEventListener('click', function(e) {
  var rect = canvas.getBoundingClientRect();
  var x = e.pageX - rect.left;
  var y = e.pageY - rect.top;

  var row = Math.floor(y / CELL_DIM) + 1;
  var col = Math.floor(x / CELL_DIM) + 1;

  // Detect clicks on the palette
  if (x > GRID_DIM) {
    if (x >= GRID_DIM + PALETTE_GAP && x <= GRID_DIM + PALETTE_GAP + CELL_DIM) {
      var index = row - 1;

      if (index <= NUM_COLORS + 1) {
	paintColor = index;
      }
    }

    return;
  }

  var centerX = (col - 0.5) * CELL_DIM;
  var centerY = (row - 0.5) * CELL_DIM;
  var squaredDistance = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);

  if (squaredDistance > CIRCLE_RADIUS * CIRCLE_RADIUS) {
    return;
  }

  if (paintColor <= NUM_COLORS) {
    grid[row][col] = paintColor < NUM_COLORS ? String.fromCharCode(paintColor + '0'.charCodeAt(0)) : EMPTY;
    displayChangesAndSave();
  } else {
    playerMove(row, col);
  }
}, false);

function loadHistory(position) {
  var data = history[position];
  grid = copy2D(data[0]);
  updateDisplay(grid);
  updateScore(data[1]);
}

document.getElementById('back-button').onclick = function() {
  if (historyPosition <= 1) {
    return;
  }

  historyPosition--;
  loadHistory(historyPosition - 1);
};

document.getElementById('forward-button').onclick = function() {
  if (historyPosition >= historyLimit) {
    return;
  }

  historyPosition++;
  loadHistory(historyPosition - 1);
};

document.getElementById('reset-button').onclick = function() {
  for (var r = 1; r <= GRID_SIZE; r++) {
    for (var c = 1; c <= GRID_SIZE; c++) {
      grid[r][c] = EMPTY;
    }
  }

  displayChangesAndSave();
};

document.getElementById('randomize-button').onclick = function() {
  for (var r = 1; r <= GRID_SIZE; r++) {
    for (var c = 1; c <= GRID_SIZE; c++) {
      var color = Math.floor(Math.random() * NUM_COLORS);
      grid[r][c] = String.fromCharCode(color + '0'.charCodeAt(0));
    }
  }

  displayChangesAndSave();
};

document.getElementById('solve-button').onclick = function() {
  // TODO
};

document.getElementById('randomize-button').onclick();
