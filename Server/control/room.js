var Room = require('../model/room');
const msg = require('../msg').en;
const config = require('./config');
var jwt = require('jsonwebtoken');

Room.getAllDeviceUser = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      socket.emit('AllDeviceUserResult', {'success': false, 'message': msg.error.occur});
    } else if (data) {
      Room.find({'id_user': data.id_user}).
      populate('listDevice').
      exec((error2, data2) => {
        if (error2) {
          socket.emit('AllDeviceUserResult', {'success': false, 'message': msg.error.occur});
        } else {
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('AllDeviceUserResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

var getUser = function(token, socket) {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('GetUserRoomResult', {'success': false,'message': msg.error.occur});
    } else if (data) {
      Room.find({'_id' : data._id}).
      populate('id_user').
      exec((error2, data2) => {
        if (error2) {
          console.log(error2);
          socket.emit('GetUserRoomResult', {'success': false,'message': msg.error.occur});
        } else {
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('GetUserRoomResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

/**
Tìm kiếm dựa vào _id của room (kiểu ObjectId)
*/
Room.findBy_ID = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('FindRoomByIdResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.findById(new mongoose.Types.ObjectId(data._id)).
      exec((error2, data2) => {
        if (error2){
          console.log(error2);
          socket.emit('FindRoomByIdResult', {'success': false, 'message': msg.error.occur});
        } else{
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindRoomByIdResult', {'success': true,'token': token2});
        }
      });

    }
  });
}

Room.findByName = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('FindRoomByNameResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.find({'room_name': {$regex: data.name},'id_user': new mongoose.Types.ObjectId(data.id_user)}).
      exec((error2, data2) =>  {
        if (error2){
          console.log(error2);
          socket.emit('FindRoomByNameResult', {'success': false, 'message': msg.error.occur});
        } else{
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindRoomByNameResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

Room.findByUser = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('FindRoomByUserResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.find({'id_user': new mongoose.Types.ObjectId(data.id_user)}).
      exec((error2, data2) =>  {
        if (error2){
          console.log(error2);
          socket.emit('FindRoomByUserResult', {'success': false, 'message': msg.error.occur});
        } else{
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindRoomByUserResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

Room.mInsert = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('createRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      let mRoom = new Room();
      mRoom.id_user = new mongoose.Types.ObjectId(data.id_user);
      mRoom.room_name = data.room_name;
      mRoom.img = data.img;
      mRoom.save((error2) => {
        if (error2){
          console.log(error2);
          socket.emit('createRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          socket.emit('createRoomResult', {'success': true});
        }
      });
    }
  });
}

/**
@param mRoom: 1 thiết bị đầy đủ thuộc tính
*/
Room.mUpdate = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('updateRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.update({'_id': new mongoose.Types.ObjectId(data._id)}, {$set: data}).
      exec((error2) =>  {
        if (error2){
          console.log(error2);
          socket.emit('updateRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          socket.emit('updateRoomResult', {'success': true});
        }
      });
    }
  });
};

/**
@param room_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 room
*/
Room.mDelete = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('deleteRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.remove({'_id': new mongoose.Types.ObjectId(data._id)}).
      exec((error2) =>  {
        if (error2){
          console.log(error2);
          socket.emit('deleteRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          socket.emit('deleteRoomResult', {'success': true});
        }
      });
    }
  });
};
/**
Lấy về tất cả các Room
*/

Room.getAllRoom = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('AllRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.find().exec((error2, data2) =>  {
        if (error2){
          console.log(error2);
          socket.emit('AllRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('AllRoomResult', {'success': true,'token': token2});
        }
      });
    }
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Room.getByPage = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('GetRommPageResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.find().
      skip((data.page - 1) * data.quantity).
      limit(data.quantity).
      sort({id_user: 1,room_name: 1}).
      exec((error2, data2) =>  {
        if (error2){
          console.log(error2);
          socket.emit('GetRommPageResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('GetRommPageResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

module.exports = exports = Room;
