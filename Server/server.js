var mDevice = require('./model/Device');
var mUser = require('./model/User');

var express = require("express");
var app = express();
//app.use(express.static("./customer"));
var server = require("http").createServer(app);
var io = require('socket.io').listen(server);
server.listen(process.env.PORT || 5000);

io.sockets.on('connection', function(socket){
  socket.on("disconnect", function(){
    socket.emit('disconnection', 'Successful disconnection');
  });
  socket.on('login', function(username,password){
    mUser.login(username, password)
    .then(
      (data) => {
        socket.emit('User', data);
      }, (err) =>{
        socket.emit('Error', err.toString());
    })
    .catch((err) => {
      socket.emit('Error', err.toString());
    });
  });

  socket.on('get-list-device-mode', function(user_id, mode_id){
    //lay danh sach cac thiet bi cua che do mode_id
  });
  socket.on('get-list-mode', function(user_id){
    //lay danh sach cac che do cua user_id
  });
  socket.on('get-list-device-user', function(user_id){
    //lay danh sach tat ca cac thiet bi trong nhà cua user_id
  });
  socket.on('get-list-device-room', function(user_id, room_id){
    //lay danh sach cac thiet bi trong phong cua user_id+room_id
  });
});
