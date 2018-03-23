'use strict'

var mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/SmartHome';

const options = {
  reconnectTries: 30, // trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10 // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect(uri, options);

var SchemaTypes = mongoose.Schema.Types;

var schemaRoom = new mongoose.Schema({
  id : {type : Number, required: true, index: { unique: true }},
  id_user : {type: mongoose.Types.ObjectId, required : true, ref : 'User'},
  room_name : {type : String, required : true, default : 'Unknown Room'},
  img : {type : String, default : 'room.png'}
});


var Room = mongoose.model('Room', schemaRoom, 'ROOM');

Room.findByID = (roomID) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id != 'number')
      return reject(new Error('RoomID must be a number'));
    Room.findOne({id : roomID}, (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}


/**
Tìm kiếm dựa vào _id của room (kiểu ObjectId)
*/
Room.findBy_ID = (roomID) =>{
  return new Promise((resolve, reject) =>{
    Room.findById(new mongoose.Types.ObjectId(roomID), (error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

Room.findByName = (name, userID) =>{
  return new Promise((resolve, reject) =>{
    Room.find({'room_name': {$regex: name}, 'id_user' : new mongoose.Types.ObjectId(userID)}, (err, data) =>{
      if(err){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

Room.findByUser = (id_user) =>{
  return new Promise((resolve, reject) =>{
    Room.find({'id_user' : new mongoose.Types.ObjectId(id_user)}, (err, data) =>{
      if(err) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

Room.mInsert = (id, id_user, room_name, img) =>{
  return new Promise((resolve, reject) =>{
    let mRoom = new Room();
    mRoom.id = id;
    mRoom.id_user = id_user;
    mRoom.room_name = room_name;
    mRoom.img = img;
    mRoom.save((err) =>{
      if(err) return reject(new Error('Cannot insert Room: ' + JSON.stringify(mRoom) + '\n' + err));
      return resolve(true);
    });
  });
}

/**
@param mRoom: 1 thiết bị đầy đủ thuộc tính
*/
Room.mUpdate = (mRoom) => {
  return new Promise((resolve, reject) =>{
    mRoom.save((err, data) =>{
      if(err) return reject(new Error('Cannot update Room: '+JSON.stringify(mRoom) + '\n' + err));
      return resolve(true);
    });
  });
};

/**
@param room_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 room
*/
Room.mDelete = (room_ID) =>{
  return new Promise((resolve, reject) =>{
    Room.remove({_id : new mongoose.Type.ObjectId(room_ID)}, (err) =>{
      if (err) return reject(new Error('Cannot delete Room has _id: ' + room_ID));
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các Room
cach dung:
  Room.getAllRoom().then(func1(data), func2(err)).catch(func(err));
  func1(data) là giá trị khi thực hiện thành công, trả về data
  func2(err) là xảy ra lỗi khi thực hiện
*/

Room.getAllRoom = () => {
  return new Promise((resolve, reject) => {
    Room.find((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Room.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    Room.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({id_user : 1, room_name : 1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

module.exports = exports = Room;
