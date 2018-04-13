'use strict'

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
// val port = 5000;

// var mDevice = require('./model/Device');
var mUser = require('./model/User');
var mRoom = require('./model/Room')
var mMode = require('./model/Mode');
// var mModeDetail = require('./model/Mode_Detail');

server.listen(port, function(){
  console.log("Waiting statement...");
});

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.sockets.on('connection', function(socket){
  console.log('connected: ');
  socket.on('disconnect', function(){
    console.log('disconnect');
    // socket.emit('disconnection', 'Successful disconnection');
  });
  socket.on('login', function(data){
    console.log(socket.id + " login");
  mUser.getRoom_Mode_User_Login(data.email, data.password)
    .then(
      (data2) => {
        console.log('Data: '+JSON.stringify(data2));
        socket.emit('LoginResult', {'error': false, 'Result' : JSON.stringify(data2)});
      }
      , (err) =>{
      console.log(err.toString());
      socket.emit('LoginResult', {'error': true, 'Result': {'error' : err.toString()}});
    }).catch((err) => {
      console.log(err.toString());
      socket.emit('LoginResult', {'error': true, 'Result': {'error' : true}});
    });
  });

  //lay danh sach cac thiet bi cua che do mode_id
  socket.on('get-list-device-in-mode', function(mode_id){
    mModeDetail.getDetailMode(mode_id)
    .then(
      data =>{
        socket.emit('Data', data);
      },
      err =>{
        socket.emit('Error', '{error : \"' + err + '\"}');
      }
    ).catch(err => socket.emit('Error', '{error : \"' + err + '\"}'));

  });
  //lay danh sach cac che do cua user_id
  socket.on('get-list-mode', function(user_id){
  });
  //lay danh sach tat ca cac thiet bi trong nhà cua user_id
  socket.on('get-list-device-user', function(user_id){
  });
  //lay danh sach cac thiet bi trong phong cua user_id+room_id
  socket.on('get-list-device-room', function(user_id, room_id){
  });
});
