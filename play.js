var GRID_SIZE = 10;
var EMPTY = '.';

var CLICK_GAP = 1500;
var GAME_GAP = 7000;

var canvas = null;
var context = null;
var pixels = null;
var stop = false;

function rgbToNumber(rgb) {
  return (rgb[0] * 256 + rgb[1]) * 256 + rgb[2];
}

function getRGB(x, y) {
  x = Math.round(x);
  y = Math.round(y);
  var start = (y * canvas.width + x) * 4;
  return pixels.slice(start, start + 3);
}

function click(x, y) {
  x = Math.round(x);
  y = Math.round(y);
  var mousedown = new MouseEvent('mousedown', {clientX: x, clientY: y});
  var mouseup = new MouseEvent('mouseup', {clientX: x, clientY: y});
  var click = new MouseEvent('click', {clientX: x, clientY: y});
  canvas.dispatchEvent(mousedown);
  canvas.dispatchEvent(mouseup);
  canvas.dispatchEvent(click);
}

function rowToY(row, useClientDim) {
  var width = useClientDim ? canvas.clientWidth : canvas.width;
  var height = useClientDim ? canvas.clientHeight : canvas.height;
  return height / 2 + (row - (GRID_SIZE / 2 + 0.5)) * width / GRID_SIZE;
}

function colToX(col, useClientDim) {
  var width = useClientDim ? canvas.clientWidth : canvas.width;
  return width / 2 + (col - (GRID_SIZE / 2 + 0.5)) * width / GRID_SIZE;
}

function getGridRGB(row, col) {
  return getRGB(colToX(col, false), rowToY(row, false));
}

function clickGrid(row, col) {
  return click(colToX(col, true), rowToY(row, true));
}

function readGrid() {
  var grid = '';
  var rgbToChar = {};
  var backgroundRGB = rgbToNumber(getRGB(0, 0));
  rgbToChar[backgroundRGB] = EMPTY;
  var counter = 0;

  for (var row = 1; row <= 10; row++) {
    for (var col = 1; col <= 10; col++) {
      var rgb = rgbToNumber(getGridRGB(row, col));

      if (!(rgb in rgbToChar)) {
	rgbToChar[rgb] = counter++;
      }

      grid += rgbToChar[rgb];
    }
  }

  return grid;
}

function load(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
}

function solve() {
  if (stop) {
    return;
  }

  console.log('Starting solver...');
  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');

  pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

  load('https://dcpos.ch/brickpop/solve?gridString=' + readGrid(), function(result) {
    var moves = result.split(/\s+/);
    var numMoves = Math.floor(moves.length / 2);

    console.log(moves);
    var index = 0;

    var nextMove = function() {
      if (index >= numMoves) {
	window.setTimeout(solve, GAME_GAP);
	return;
      }

      var row = parseInt(moves[2 * index]);
      var col = parseInt(moves[2 * index + 1]);
      console.log(row + ' ' + col);
      clickGrid(row, col);
      index++;
      window.setTimeout(nextMove, CLICK_GAP);
    };

    nextMove();
  });
}
