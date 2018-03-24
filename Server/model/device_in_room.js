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

var schemaDeviceInRoom = new mongoose.Schema({
  id : {type : Number, require : true},
  id_device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Device'},
  id_room : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Room'},
  device_name : {type : String},
  status : {type : Number, require : true}
});

schemaDeviceInRoom.set('toObject', { getters: true });

var DeviceInRoom = mongoose.model('DeviceInRoom', schemaDeviceInRoom, 'DEVICE_IN_ROOM');
/**
Tìm kiếm dựa vào _id của deviceInRoom (kiểu ObjectId)
*/
DeviceInRoom.findBy_ID = (_ID) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.findById(new mongoose.Types.ObjectId(_ID), (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

DeviceInRoom.findByName = (name, id_room) =>{
  return new Promise((resolve, reject) =>{
    //find({ 'name' : { $regex: /Ghost/, $options: 'i' } }, function(){});
    DeviceInRoom.find({'device_name': {$regex: name}, 'id_room' : new mongoose.Types.ObjectId(id_room)}, (err, data) =>{
      if(err) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

DeviceInRoom.mInsert = (id, id_device, id_room, device_name, status) =>{
  return new Promise((resolve, reject) =>{

    let mDeviceInRoom = new DeviceInRoom();
    mDeviceInRoom.id = id;
    mDeviceInRoom.id_device = new mongoose.Types.ObjectId(id_device);
    mDeviceInRoom.id_room = new mongoose.Types.ObjectId(id_room);
    mDeviceInRoom.device_name = device_name;
    mDeviceInRoom.status = status;

    mDeviceInRoom.save((err) =>{
      if(err) return reject(new Error('Cannot insert DeviceInRoom: ' + JSON.stringify(mDeviceInRoom) + '\n' + err));
      return resolve(true);
    });
  });
};

// DeviceInRoom.mInsert(1, '5ab5bcba66a8743898db512c', '5aa9dc4ab2b1e7dbea173b93', 'Bong den phong khach 1', 0);
// DeviceInRoom.mInsert(2, '5ab5bcba66a8743898db512c', '5aa9dc4ab2b1e7dbea173b93', 'Bong den phong khach 2', 0);
// DeviceInRoom.mInsert(3, '5ab5bcba66a8743898db512c', '5aa9dc66b2b1e7dbea173ba0', 'Cam bien as phong khach', 0);
// DeviceInRoom.mInsert(4, '5ab5bd2c413df81ccc5ca8b8', '5aa9dc4ab2b1e7dbea173b93', 'Bong den phong ngu 1', 0);
// DeviceInRoom.mInsert(5, '5ab5bd2c413df81ccc5ca8b8', '5aa9dc4ab2b1e7dbea173b93', 'Bong den phong ngu 2', 0);
// DeviceInRoom.mInsert(6, '5ab5bd2c413df81ccc5ca8b8', '5aa9dc5db2b1e7dbea173b9e', 'Den huynh quang 1', 0);
// DeviceInRoom.mInsert(7, '5ab5bd2c413df81ccc5ca8b8', '5aa9dc5db2b1e7dbea173b9e', 'Den huynh quang 2', 0);

/**
@param mDeviceInRoom:
*/
DeviceInRoom.mUpdate = (mDeviceInRoom) => {
  return new Promise((resolve, reject) =>{
    mDeviceInRoom.save((err, data) =>{
      if(err) return reject(new Error('Cannot update DeviceInRoom: '+JSON.stringify(mDeviceInRoom) + '\n' + err));
      return resolve(true);
    });
  });
};


/**
@param deviceInRoom_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 DeviceInRoom
*/
DeviceInRoom.mDelete = (_ID) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.remove({_id : new mongoose.Types.ObjectId(_ID)}, (err) =>{
      if (err) return reject(new Error('Cannot delete DeviceInRoom has _id: ' + deviceInRoom_ID));
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
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
DeviceInRoom.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    DeviceInRoom.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({id : 1, name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

module.exports = exports = DeviceInRoom;
