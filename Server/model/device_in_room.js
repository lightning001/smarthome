'use strict'

var mongoose = require('./connection');
require('./device');
require('./user');
require('./room');

var schemaDeviceInRoom = new mongoose.Schema({
  id_device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Device'},
  id_room : {type : mongoose.Schema.Types.ObjectId, ref : 'Room'},
  id_user : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'User'},
  device_name : {type : String},
  status : {type : Number, require : true}
});

var DeviceInRoom = mongoose.model('DeviceInRoom', schemaDeviceInRoom, 'DEVICEINROOM');

/**
Tìm kiếm dựa vào _id của deviceInRoom (kiểu ObjectId)
*/
DeviceInRoom.findBy_ID = (_ID) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.findById(new mongoose.Types.ObjectId(_ID), (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + error));
      }else{
        return resolve(data);
      }
    });
  });
};

DeviceInRoom.getDeviceInRoom = (roomID) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.find({'id_room' : new mongoose.Types.ObjectId(roomID)})
    // .populate('id_room')
    .populate('id_device')
    // .populate('id_user')
    .exec((err, data) =>{
      if(err) {console.log(err);return reject(new Error(err));}
      return resolve(data);
    });
  });
}

// DeviceInRoom.getDeviceInRoom('5ab5bcba66a8743898db512c').then(data => console.log(JSON.stringify(data)), err =>console.log(err.toString()));

DeviceInRoom.findByName = (name, id_room) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.find({'device_name': {$regex: name}, 'id_room' : new mongoose.Types.ObjectId(id_room)}, (err, data) =>{
      if(err) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

DeviceInRoom.mInsert = (data) =>{
  return new Promise((resolve, reject) =>{

    let mDeviceInRoom = new DeviceInRoom();
    mDeviceInRoom.id_device = new mongoose.Types.ObjectId(data.id_device);
    mDeviceInRoom.id_room = new mongoose.Types.ObjectId(data.id_room);
    mDeviceInRoom.device_name = data.device_name;
    mDeviceInRoom.status = data.status;

    mDeviceInRoom.save((err) =>{
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(true);
    });
  });
};

// DeviceInRoom.mInsert({'id_device' : '5ad695bb8ccca527b0176399', 'id_room' : '5ab5bcba66a8743898db512c', 'device_name' : 'Quat phong khach 1', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695bb8ccca527b0176399', 'id_room' : '5ab5bcba66a8743898db512c', 'device_name' : 'Quat phong khach 2', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bcba66a8743898db512c', 'device_name' : 'Bong den 1', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bcba66a8743898db512c', 'device_name' : 'Bong den 2', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bcba66a8743898db512c', 'device_name' : 'Bong den 3', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bcba66a8743898db512c', 'device_name' : 'Bong den 4', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695bb8ccca527b0176399', 'id_room' : '5ab5bd2c413df81ccc5ca8b8', 'device_name' : 'Quat phong ngu', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695bb8ccca527b017639a', 'id_room' : '5ab5bd2c413df81ccc5ca8b8', 'device_name' : 'Tu lanh', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bd2c413df81ccc5ca8b8', 'device_name' : 'Bong den 5', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bd2c413df81ccc5ca8b8', 'device_name' : 'Bong den 6', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695bb8ccca527b0176399', 'id_room' : '5ab5bd2c413df81ccc5ca8b9', 'device_name' : 'Quat nha bep', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bd2c413df81ccc5ca8b9', 'device_name' : 'Bong den 7', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bd2c413df81ccc5ca8b9', 'device_name' : 'Bong den 8', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bd2c413df81ccc5ca8ba', 'device_name' : 'Bong den 9', 'status' : 0 });
// DeviceInRoom.mInsert({'id_device' : '5ad695ba8ccca527b0176398', 'id_room' : '5ab5bd2c413df81ccc5ca8ba', 'device_name' : 'Bong den 10', 'status' : 0 });


/**
@param mDeviceInRoom:
*/
DeviceInRoom.mUpdate = (mDeviceInRoom) => {
  return new Promise((resolve, reject) =>{
    mDeviceInRoom.save((err, data) =>{
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(true);
    });
  });
};


/**
@param deviceInRoom_ID: mã _id của thiết bị
@objective : thực hiện xóa 1 DeviceInRoom
*/
DeviceInRoom.mDelete = (_ID) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.remove({_id : new mongoose.Types.ObjectId(_ID)}, (err) =>{
      if (err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các DeviceInRoom
*/

DeviceInRoom.getAllDeviceInRoom = () => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
// DeviceInRoom.getAllDeviceInRoom().then(data =>console.log(JSON.stringify(data)), err =>console.log(err));
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
DeviceInRoom.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

module.exports = exports = DeviceInRoom;
