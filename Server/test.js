'use strict'
var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
var port = process.env.PORT || 3000;
const timeout = 500;

const config = require('./control/config');
mongoose.connect(config.uri, config.options);

var mDevice = require('./control/Device');
var mUser = require('./control/User');
var mMode = require('./control/Mode');
var mRoom = require('./control/Room');
var mModeDetail = require('./control/ModeDetail');
var mDeviceInRoom = require('./control/DeviceInRoom');

server.listen(port, function() {
  console.log("Waiting statement...");
});

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

var apiRoutes = express.Router();

io.sockets.on('connection', (socket) => {
  console.log('connected: ' + socket.id);
  /**=================  USER  ============================================*/
  socket.on('login', (data)=>{
    console.log(socket.id + " login");
    mUser.login(data.email, data.password, socket, _);
  });

  socket.on('createUser' , (data)=>{
    mUser.mInsert(data.token, socket);
  });

  socket.on('updateUser', (data) => {
    mUser.mUpdate(data.token, socket);
  });

  socket.on('deleteUser', (data) => {
    mUser.mDelete(data.token, socket);
  });

  /**=================  MODE  ================================================*/

  socket.on('deviceInMode', (data) => {
    mModeDetail.getDetailMode(data.token, socket);
  });

  socket.on('createMode', (data)=>{
    mMode.mInsert(data.token, socket);
  });

  socket.on('updateMode', (data)=>{
    mMode.mUpdate(data.token, socket);
  });

  socket.on('deleteMode', (data)=>{
    mMode.mDelete(data.token, socket);
  });



  /**=================  ROOM  ================================================*/

  socket.on('createRoom', (data) => {
    mRoom.mInsert(data.token, socket);
  });

  socket.on('updateRoom', (data) => {
    mRoom.mUpdate(data.token, socket);
  });

  socket.on('deleteRoom', (data) => {
    mRoom.mDelete(data.token, socket);
  });


  /**=================  DEVICE IN ROOM  ================================================*/
  socket.on('deviceInRoom', (data) => {
    mDeviceInRoom.getDeviceInRoom(data.token, socket);
  });

  socket.on('deviceUnused', function(data) {
    mDeviceInRoom.unused(data.token, socket);
  });

  socket.on('createDevice', (data) => {
    mDeviceInRoom.mInsert(data.token, socket);
  });

  socket.on('updateDevice', (data) => {
    mDeviceInRoom.mUpdate(data.token, socket);
  });

  socket.on('deleteDevice', (data) => {
    mDeviceInRoom.mUpdate(data.token, socket);
  });
});


/**==========================================================
  ngăn chặn client nhận broadcast messages khi được connect mà vẫn chưa được authentication
**/
_.each(io.nsps, function(nsp){
  nsp.on('login', function(socket){
    if (!socket.auth) {
      console.log("removing socket from", nsp.name)
      delete nsp.connected[socket.id];
    }
  });
});
