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
const argv = require('yargs').argv,
  contextPath = argv.contextPath;
const config = require('./control/config');
mongoose.connect(config.uri, config.options);

var mDevice = require('./control/Device');
var mUser = require('./control/User');
var mMode = require('./control/Mode');
var mRoom = require('./control/Room');
var mModeDetail = require('./control/ModeDetail');
var mDeviceInRoom = require('./control/DeviceInRoom');
var Email = require('./util/Email');

server.listen(port, function() {
  console.log("Waiting statement...");
});

const imageDir = require('path').join(__dirname, '/image');
app.use(express.static(imageDir));
app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

app.get('/confirmregister/:link', (req, res)=>{
  let link = req.params.link;

});

var apiRoutes = express.Router();

io.sockets.on('connection', (socket) => {
  socket.on('disconnect', ()=>{
    console.log(socket.id +' disconnect');
  });
  console.log('connected: ' + socket.id);
  /**=================  USER  ============================================*/
  socket.on('client_send_login', (data) => {
    console.log(socket.id + " login");
    mUser.login(data.email, data.password, socket, _, io);
  });

  socket.on('confirm_register', (data)=>{
    console.log('confirm email');

  });

  socket.on('client_send_register', (data) => {
    mUser.mInsert(data, socket);
  });

  socket.on('client_send_update_user', (data) => {
    mUser.mUpdate(data.token, socket);
  });

  socket.on('client_send_delete_user', (data) => {
    mUser.mDelete(data.token, socket);
  });

  /**=================  MODE  ================================================*/

  socket.on('client_send_device_in_mode', (data) => {
    mModeDetail.getDetailMode(data.token, socket);
  });

  socket.on('client_send_create_mode', (data) => {
    mMode.mInsert(data.token, socket);
  });

  socket.on('updateMode', (data) => {
    mMode.mUpdate(data.token, socket);
  });

  socket.on('deleteMode', (data) => {
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
_.each(io.nsps, function(nsp) {
  nsp.on('client_send_login', function(socket) {
    if (!socket.auth) {
      console.log("removing socket from", nsp.name)
      delete nsp.connected[socket.id];
    }
  });
});
