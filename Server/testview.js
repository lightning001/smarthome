var app = require('express')(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 5000;

  server.listen(port, function() {
	  console.log("Waiting statement...");
	});

	app.get('/register', function(req, res) {
	  res.send();
	});