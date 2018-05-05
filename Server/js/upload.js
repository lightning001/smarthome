
// var express  = require('express');
var connect = require('connect');
var app = require('express')();
var server = require('http').createServer(app);
var port = process.env.PORT || 8000;

// Configuration
// app.use(express.static(__dirname + '/public'));
// app.use(connect.cookieParser());
// app.use(connect.logger('dev'));
// app.use(connect.bodyParser());

// app.use(connect.json());
// app.use(connect.urlencoded());

// Routes

require('./routes.js')(app);

server.listen(port, ()=>{
  console.log('The App runs on port ' + port);
});
