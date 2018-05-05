'use strict'

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
// val port = 5000;
var _ = require('underscore');
var mDevice = require('./control/Device');
var mUser = require('./control/User');
var mRoom = require('./control/Room');
var mMode = require('./control/Mode');
var mModeDetail = require('./control/Mode_Detail');
var mDeviceInRoom = require('./control/Device_In_Room');

server.listen(port, function() {
  console.log("Waiting statement...");
});

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});



io.sockets.on('connection', function(socket) {
  console.log('connected: ');
  socket.on('disconnect', function() {
    console.log('disconnect');
    // socket.emit('disconnection', 'Successful disconnection');
  });
  //#####  USER  ########################################################################
  socket.on('login', function(data) {
    console.log(socket.id + " login");
    mUser.login(data.email, data.password, socket, _);
  });

  socket.on('createUser', (data) => {
    mUser.mInsert(data).then(
      (data2) => {
        console.log('insert user ok');
        socket.emit('createUserResult', true);
      },
      (err) => {
        console.log('insert user false');
        socket.emit('createUserResult', false);
      }
    );
  });

  socket.on('updateUser', (data) => {
    mUser.mUpdate(data).then(
      (data2) => {
        console.log('update user ok');
        socket.emit('updateUserResult', true);
      },
      (err) => {
        console.log('update user false');
        socket.emit('updateUserResult', false);
      }
    );
  });

  socket.on('deleteUser', (id) => {
    mUser.mDelete(id).then(
      (data2) => {
        console.log('delete user ok');
        socket.emit('deleteUserResult', true);
      },
      (err) => {
        console.log('delete user false');
        socket.emit('deleteUserResult', false);
      }
    );
  });

  //#####  DEVICE  ###############################################################################
  socket.on('deviceInRoom', (id_room) => {
    console.log("id room: " + id_room);
    mDeviceInRoom.getDeviceInRoom(id_room)
      .then(
        (data2) => {
          console.log('Data Device In Room: ' + JSON.stringify(data2));
          socket.emit('deviceInRoomResult', {
            'error': false,
            'Result': data2
          });
        }, (err) => {
          console.log(err.toString());
          socket.emit('deviceInRoomResult', {
            'error': true,
            'Result': {
              'error': err.toString()
            }
          });
        }).catch((err) => {
        console.log(err.toString());
        socket.emit('deviceInRoomResult', {
          'error': true,
          'Result': {
            'error': true
          }
        });
      });
  });

  //lay danh sach cac thiet bi cua che do mode_id
  socket.on('deviceInMode', function(data) {
    mModeDetail.getDetailMode(data.id_mode)
      .then(
        data => {
          socket.emit('deviceInModeResult', {
            'error': false,
            'Result': data
          });
        },
        err => {
          socket.emit('deviceInModeResult', {
            'error': true,
            'Result': err
          });
        }
      ).catch(err => socket.emit('deviceInModeResult', {
        'error': true,
        'Result': err
      }));
  });

  /**
  lay cac thiet bi chua duoc gan room cua user
  @param : data: json user
  */
  socket.on('deviceUnused', function(id_user) {
    mDeviceInRoom.unused(id_user)
      .then(
        data => {
          console.log('device unused: ' + data);
          socket.emit('deviceUnusedResult', {
            'error': false,
            'Result': data
          });
        },
        err => {
          socket.emit('deviceUnusedResult', {
            'error': true,
            'Result': err
          });
        }
      );
  });

  socket.on('device_unused_mode', function(data) {

  });

  socket.on('createDevice', (data) => {
    mDeviceInRoom.mInsert(data).then(
      (data2) => {
        console.log('insert Device ok');
        socket.emit('createDeviceResult', true);
      },
      (err) => {
        console.log('insert device false');
        socket.emit('createDeviceResult', false);
      }
    );
  });

  socket.on('updateDevice', (data) => {
    mDeviceInRoom.mUpdate(data).then(
      (data2) => {
        console.log('update Device ok');
        socket.emit('updateDeviceResult', true);
      },
      (err) => {
        console.log('update Device false');
        socket.emit('updateDeviceResult', false);
      }
    );
  });

  socket.on('deleteDevice', (id) => {
    mDeviceInRoom.mDelete(id).then(
      (data2) => {
        console.log('delete Device ok');
        socket.emit('deleteDeviceResult', true);
      },
      (err) => {
        console.log('delete Device false');
        socket.emit('deleteDeviceResult', false);
      }
    );
  });

  //#######  ROOM  #####################################################################

  socket.on('createRoom', (data) => {
    mRoom.mInsert(data).then(
      (data2) => {
        console.log('insert room ok');
        socket.emit('createRoomResult', true);
      },
      (err) => {
        console.log('insert room false');
        socket.emit('createRoomResult', false);
      }
    );
  });

  socket.on('updateRoom', (data) => {
    mRoom.mUpdate(data).then(
      (data2) => {
        console.log('update Room ok');
        socket.emit('updateRoomResult', true);
      },
      (err) => {
        console.log('update Room false');
        socket.emit('updateRoomResult', false);
      }
    );
  });

  socket.on('deleteRoom', (id) => {
    mRoom.mDelete(id).then(
      (data2) => {
        console.log('delete Room ok');
        socket.emit('deleteRoomResult', true);
      },
      (err) => {
        console.log('delete Room false');
        socket.emit('deleteRoomResult', false);
      }
    );
  });

});


_.each(io.nsps, function(nsp){
 nsp.on('login', function(socket){
   if (!socket.auth) {
     console.log("removing socket from", nsp.name)
     delete nsp.connected[socket.id];
   }
 });
});
