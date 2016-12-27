var express = require('express');
var app = express();
app.set('port', 8000);
app.use(express.static('public'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + server.address().port);
});

var router = express.Router();

router.get('/', function(req, res) {
  res.sendfile('public/index.html');
});

app.use(router);
