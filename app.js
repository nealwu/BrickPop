var NUM_COLORS = 6;

var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var exec = require('child_process').exec;

var app = express();
app.use(express.static('public'));

var credentials = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8000);
httpsServer.listen(8001);

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'application/html');
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

      exec('time -p ./BrickPop < input.txt', function(err, stdout, stderr) {
	if (err) throw err;
	console.log(stderr);
	console.log(stdout);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.write(stdout);
	res.end();
      });
    });
  });
});
