var NUM_COLORS = 6;

var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;

var app = express();
app.set('port', 8000);
app.use(express.static('public'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + server.address().port);
});

app.get('/', function(req, res) {
  res.sendfile('public/index.html');
});

app.get('/solve', function(req, res) {
  console.log(req.query);
  var gridString = req.query.gridString;
  var gridSize = Math.sqrt(gridString.length);
  var gridStringWithNewlines = gridSize + ' ' + NUM_COLORS + '\n';

  for (var i = 0; i < gridString.length; i += gridSize) {
    gridStringWithNewlines += gridString.substr(i, gridSize) + '\n';
  }
  console.log(gridStringWithNewlines);

  exec('make', function(err, stdout, stderr) {
    if (err) throw err;

    fs.writeFile('input.txt', gridStringWithNewlines, function(err) {
      if (err) throw err;

      exec('./BrickPop < input.txt', function(err, stdout, stderr) {
	if (err) throw err;
	console.log(stderr);
	res.write(stdout);
	res.end();
      });
    });
  });
});
