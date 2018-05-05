var Room = require('../model/room');

Room.getAllDeviceUser = (token, socket) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      socket.emit('AllDeviceUserResult', {'success': false, 'message': msg.error.occur});
    } else if (data) {
      Room.find({'id_user': data2.id_user}).
      populate('listDevice').
      exec((error, data2) => {
        if (error) {
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
      Room.find({'_id' = data._id}).
      populate('id_user').
      exec((error, data2) => {
        if (error) {
          console.log(error);
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
      exec((error, data2) => {
        if (error){
          console.log(error);
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
      exec((error, data2) =>  {
        if (error){
          console.log(error);
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
      exec((error, data2) =>  {
        if (error){
          console.log(error);
          socket.emit('FindRoomByUserResult', {'success': false, 'message': msg.error.occur});
        } else{
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindRoomByUserResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

Room.mInsert = (token) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('InsertRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      let mRoom = new Room();
      mRoom.id_user = new mongoose.Types.ObjectId(data.id_user);
      mRoom.room_name = data.room_name;
      mRoom.img = data.img;
      mRoom.save((error) => {
        if (error){
          console.log(error);
          socket.emit('InsertRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          socket.emit('InsertRoomResult', {'success': true});
        }
      });
    }
  });
}

/**
@param mRoom: 1 thiết bị đầy đủ thuộc tính
*/
Room.mUpdate = (data) => {
  jwt.verify(token, config.secret_key, (error, data1) => {
    if (error) {
      console.log(error);
      socket.emit('UpdateRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.update({'_id': new mongoose.Types.ObjectId(data1._id)}, {$set: data1}).
      exec((error) =>  {
        if (error){
          console.log(error);
          socket.emit('UpdateRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          socket.emit('UpdateRoomResult', {'success': true});
        }
      });
    }
  });
};

/**
@param room_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 room
*/
Room.mDelete = (room_ID) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('DeleteRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.remove({'_id': new mongoose.Types.ObjectId(room_ID)}).
      exec((error) =>  {
        if (error){
          console.log(error);
          socket.emit('DeleteRoomResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          socket.emit('DeleteRoomResult', {'success': true});
        }
      });
    }
  });
};
/**
Lấy về tất cả các Room
*/

Room.getAllRoom = () => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('AllRoomResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.find().exec((error, data2) =>  {
        if (error){
          console.log(error);
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
Room.getByPage = (quantity, page) => {
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      console.log(error);
      socket.emit('FindRoomByUserResult', {'success': false,'message': msg.error.occur});
    }else{
      Room.find().
      skip((page - 1) * quantity).
      limit(quantity).
      sort({id_user: 1,room_name: 1}).
      exec((error, data2) =>  {
        if (error){
          console.log(error);
          socket.emit('FindRoomByUserResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindRoomByUserResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

module.exports = exports = Room;
