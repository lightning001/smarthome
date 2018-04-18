'use strict'

var mongoose = require('./connection');
require('mongoose-double')(mongoose);

var schemaDevice = new mongoose.Schema({
  name : {type : String},
  img : {type : String},
  description : {type : String},
  price : {type : mongoose.Schema.Types.Double, default : 0},
  type : {type : Number}
});

var Device = mongoose.model('Device', schemaDevice, 'DEVICE');

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

Device.mInsert = (data) =>{
  return new Promise((resolve, reject) =>{
    let mDevice = new Device();
    mDevice.name = data.name;
    mDevice.img = data.img;
    mDevice.description = data.description;
    mDevice.price = data.price;
    mDevice.type = data.type;
    mDevice.save((err) =>{
      if(err){
        return reject(new Error('Error! An error occurred. Please try again later'));
      }else{
        return resolve(true);
      }
    });
  });
};

// Device.mInsert({'name' : 'Tivi', 'img' : 'https://image.ibb.co/iWJ0sS/ng.png', 'description' : 'Tivi', 'price' : 2000000, 'type' : 1})
// Device.mInsert({'name' : 'Fan', 'img' : 'https://image.ibb.co/iWJ0sS/ng.png', 'description' : 'Quạt', 'price' : 200000, 'type' : 1})
// Device.mInsert({'name' : 'Refrigerator', 'img' : 'https://image.ibb.co/iWJ0sS/ng.png', 'description' : 'Tủ lạnh', 'price' : 5000000, 'type' : 1})
// Device.mInsert({'name' : 'Light sensor', 'img' : 'https://image.ibb.co/iWJ0sS/ng.png', 'description' : 'Cảm biến ánh sáng', 'price' : 50000, 'type' : 0})


/**
@param mDevice: 1 thiết bị đầy đủ thuộc tính
*/
Device.mUpdate = (mDevice) => {
  return new Promise((resolve, reject) =>{
    mDevice.save((err, data) =>{
      if(err){
        return reject(new Error('Error! An error occurred. Please try again later'));
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
    Device.remove({_id : new mongoose.Types.ObjectId(device_ID)}, (err) =>{
      if (err) return reject(new Error('Error! An error occurred. Please try again later'));
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
    Device.find()
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
};
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Device.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    Device.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
};

// Device.getAllDevice().then(data =>console.log("Data" + JSON.stringify(data)), err =>console.log(err));

module.exports = exports = Device;
