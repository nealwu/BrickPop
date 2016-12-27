var GRID_SIZE = 10;
var CELL_WIDTH = 80;
var CIRCLE_FRACTION = 0.75;

var canvas = document.querySelector('canvas');
canvas.width = GRID_SIZE * CELL_WIDTH;
canvas.height = GRID_SIZE * CELL_WIDTH;
var context = canvas.getContext('2d');

for (var i = 0; i < GRID_SIZE; i++) {
  for (var j = 0; j < GRID_SIZE; j++) {
    context.beginPath();
    context.arc(CELL_WIDTH * (i + 0.5), CELL_WIDTH * (j + 0.5), CELL_WIDTH * 0.5 * CIRCLE_FRACTION, 0, 2 * Math.PI, false);
    context.fillStyle = ['red', 'yellow', 'green', 'blue', 'purple', 'gray'][Math.floor(Math.random() * 6)];
    context.fill();
    context.closePath();
  }
}
