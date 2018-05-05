'use strict'

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
// val port = 5000;
require('./database/config');
// var mDevice = require('./model/Device');
// var mUser = require('./model/User');
// var mRoom = require('./model/Room');
// var mMode = require('./model/Mode');
// var mModeDetail = require('./model/Mode_Detail');
// var mDeviceInRoom = require('./model/Device_In_Room');

require('./js/routes.js')(app);

server.listen(port, function() {
  console.log("Waiting statement...");
});

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

const AuthenticationController = require('./controllers/authentication'),
  UserController = require('./controller/user');
const apiRoutes = express.Router(),
  userRoutes = express.Router();

apiRoutes.use('user', authRoutes);
