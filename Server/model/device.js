'use strict'

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const uri = 'mongodb://localhost:27017/SmartHome';

const options = {
  reconnectTries: 30, // trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10 // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect(uri, options);

var SchemaTypes = mongoose.Schema.Types;

var schemaDevice = new mongoose.Schema({
  id : {type : Number, required: true, index: { unique: true }},
  name : {type : String},
  img : {type : String},
  description : {type : String},
  price : {type : SchemaTypes.Double, default : 0},
  type : {type : Number}
});

schemaDevice.set('toObject', { getters: true });

var Device = mongoose.model('Device', schemaDevice, 'DEVICE');

/**
Tìm kiếm dựa vào id của device
*/
Device.findByID = (deviceID) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id != 'number')
      return reject(new Error('DeviceID must be a number'));
    Device.findOne({id : deviceID}, (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

/**
Tìm kiếm dựa vào _id của device (kiểu ObjectId)
*/
Device.findBy_ID = (deviceID) =>{
  return new Promise((resolve, reject) =>{
    Device.findById(new mongoose.Types.ObjectId(deviceID), (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

Device.findByName = (name) =>{
  return new Promise((resolve, reject) =>{
    //find({ 'name' : { $regex: /Ghost/, $options: 'i' } }, function(){});
    Device.find({'name': {$regex: name}}, (err, data) =>{
      if(err){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

Device.mInsert = (id, name, img, description, price, type) =>{
  return new Promise((resolve, reject) =>{
    let mDevice = new Device();
    mDevice.id = id;
    mDevice.name = name;
    mDevice.img = img;
    mDevice.description = description;
    mDevice.price = price;
    mDevice.type = type;

    mDevice.save((err) =>{
      if(err){
        return reject(new Error('Cannot insert Device: ' + JSON.stringify(mDevice) + '\n' + err));
      }else{
        return resolve(true);
      }
    });
  });
};


/**
@param mDevice: 1 thiết bị đầy đủ thuộc tính
*/
Device.mUpdate = (mDevice) => {
  return new Promise((resolve, reject) =>{
    mDevice.save((err, data) =>{
      if(err){
        return reject(new Error('Cannot update Device: '+JSON.stringify(mDevice) + '\n' + err));
      }else{
        return resolve(true);
      }
    });
  });
};


/**
@param device_ID: mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)

@objective : thực hiện xóa 1 device
*/
Device.mDelete = (device_ID) =>{
  return new Promise((resolve, reject) =>{
    if(typeof device_ID != 'string')
      return reject(new Error('Device_ID must be a String'));
    Device.remove({_id : new mongoose.Type.OnjectId(device_ID)}, (err) =>{
      if (err) return reject(new Error('Cannot delete Device has _id: ' + device_ID));
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các Device
cach dung:
  Device.getAllDevice().then(func1(data), func2(err)).catch(func(err));
  func1(data) là giá trị khi thực hiện thành công, trả về data
  func2(err) là xảy ra lỗi khi thực hiện
*/

Device.getAllDevice = () => {
  return new Promise((resolve, reject) => {
    Device.find((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Device.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    Device.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({id : 1, name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

// Device.getByPage(2,2).then(data => console.log(data), err => console.log(err +''));

// Device.findBy_ID('5aa9dc4ab2b1e7dbea173b93').then(data => console.log('Data'+ data), err => console.log(err+ ''));
// Device.findByName('Light').then(data => console.log('Data'+ data), err => console.log(err+ ''));
// console.log(Device.mInsert(4, 'Refrigerator', 'fridge.png', 'Tủ lạnh', 5000000, 1 ));
// Device.getAllDevice().then(data => console.log('Data'+ data), err => console.log(err+ ''));
// Device.getAllDevice();
// console.log(Device.findByName('đèn'));

module.exports = exports = Device;
