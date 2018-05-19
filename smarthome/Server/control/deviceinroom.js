var DeviceInRoom = require('../model/device_in_room');
const msg = require('../msg').en;
const config = require('../util/config');
var jwt = require('jsonwebtoken');
/**
Tìm kiếm dựa vào _id của deviceInRoom (kiểu ObjectId)
*/
DeviceInRoom.findBy_ID = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindDeviceInRoomByIDResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.findById(new mongoose.Types.ObjectId(data._id)).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindDeviceInRoomByIDResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('FindDeviceInRoomByIDResult', {'success': true, 'token': token2});
        }
      });
    }
  });
};

DeviceInRoom.getDeviceInRoom = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('deviceInRoomResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.find({'room': new mongoose.Types.ObjectId(data.room)}).
      populate('device').
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('deviceInRoomResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('deviceInRoomResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

DeviceInRoom.unused = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('deviceUnusedResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.find({'user': new mongoose.Types.ObjectId(data.user)}).
      or([{'room': null}, {'room': {$exists: false}}]).
      populate('device').
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('deviceUnusedResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('deviceUnusedResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

DeviceInRoom.search = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('SearchResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.find({'device_name': {$regex: data.device_name},
      'room': new mongoose.Types.ObjectId(data.room),
      'user': new mongoose.Types.ObjectId(data.user)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('SearchResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('SearchResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

DeviceInRoom.findByUser = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindDeviceInRoomByUserResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.find({'user': new mongoose.Types.ObjectId(data.user)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindDeviceInRoomByUserResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('FindDeviceInRoomByUserResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

DeviceInRoom.mInsert = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('createDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      let mDeviceInRoom = new DeviceInRoom();
      mDeviceInRoom.device = new mongoose.Types.ObjectId(data.device);
      mDeviceInRoom.room = new mongoose.Types.ObjectId(data.room);
      mDeviceInRoom.user = new mongoose.Types.ObjectId(data.user);
      mDeviceInRoom.device_name = data.device_name;
      mDeviceInRoom.status = data.status;

      mDeviceInRoom.save((err) => {
        if (err){
          console.log(err);
          socket.emit('createDeviceResult', {'success': false, 'message': msg.error.occur});
        }else{
          console.log(err);
          socket.emit('createDeviceResult', {'success': true});
        }
      });
    }
  });
};

/**
@param mDeviceInRoom:
*/
DeviceInRoom.mUpdate = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('updateDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.update({'_id': data._id}, {$set: data}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('updateDeviceResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('updateDeviceResult', {'success': true});
        }
      });
    }
  });
};

/**
@param deviceInRoom_ID: mã _id của thiết bị
@objective : thực hiện xóa 1 DeviceInRoom
*/
DeviceInRoom.mDelete = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('deleteDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.remove({'_id': new mongoose.Types.ObjectId(data._id)}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('deleteDeviceResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('deleteDeviceResult', {'success': true});
        }
      });
    }
  });
};
/**
Lấy về tất cả các DeviceInRoom
*/

DeviceInRoom.getAllDeviceInRoom = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('AllDeviceInRoomResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.find().
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('AllDeviceInRoomResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('AllDeviceInRoomResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
DeviceInRoom.getByPage = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('DeviceRoomPageResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      DeviceInRoom.find().
      skip((data.page - 1) * data.quantity).
      limit(data.quantity).
      sort({name: 1, type: 1, price: -1}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('DeviceRoomPageResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('DeviceRoomPageResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

module.exports = exports = DeviceInRoom;
