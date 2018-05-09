var Device = require('../model/device');
const msg = require('../msg').en;
const config = require('../util/config');
var jwt = require('jsonwebtoken');
/**
Tìm kiếm dựa vào _id của device (kiểu ObjectId)
*/
Device.findBy_ID = (deviceID) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindDeviceIDResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Device.findById(new mongoose.Types.ObjectId(data._id)).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindDeviceIDResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('FindDeviceIDResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

Device.findByName = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindDeviceNameResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Device.find({'name': {$regex: data.name}}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindDeviceNameResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('FindDeviceNameResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

Device.mInsert = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('InsertDeviceResult', {'success': false, 'message': msg.error.occur});
    }else if (!error && data) {
      let mDevice = new Device();
      mDevice.name = data.name;
      mDevice.img = data.img;
      mDevice.description = data.description;
      mDevice.price = data.price;
      mDevice.type = data.type;
      mDevice.save((error2)=>{
        if(error2){
          console.log(error2);
          socket.emit('InsertDeviceResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('InsertDeviceResult', {'success': true});
        }
      });
    }
  });
};

/**
@param mDevice: 1 thiết bị đầy đủ thuộc tính
*/
Device.mUpdate = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('UpdateDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Device.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('UpdateDeviceResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('UpdateDeviceResult', {'success': true});
        }
      });
    }
  });
};


/**
@param device_ID: mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)

@objective : thực hiện xóa 1 device
*/
Device.mDelete = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      console.log(error);
      socket.emit('DeleteDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Device.remove({'_id' : new mongoose.Types.ObjectId(data._id)}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('DeleteDeviceResult', {'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          socket.emit('DeleteDeviceResult', {'success': true});
        }
      });
    }
  });
};
/**
Lấy về tất cả các Device
cach dung:
  Device.getAllDevice().then(func1(data), func2(err)).catch(func(err));
  func1(data) là giá trị khi thực hiện thành công, trả về data
  func2(err) là xảy ra lỗi khi thực hiện
*/

Device.getAllDevice = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      console.log(error);
      socket.emit('AllDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Device.find({}).
      exec((error2, data2) => {
        if(error2){
        socket.emit('AllDeviceResult', {'success': false, 'message': msg.error.occur});
      } else if (!error2 && data2) {
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('AllDeviceResult', {'success': true, 'token': token2});
        }
      });
    }
  });
};
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Device.getByPage = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('GetDevicePageResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Device.find().
      skip((data.page-1)*data.quantity).
      limit(data.quantity).
      sort({name : 1, type : 1, price : -1}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('GetDevicePageResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('GetDevicePageResult', {'success': true, 'token': token2});
        }
      });
    }
  });
};

module.exports = exports = Device;
