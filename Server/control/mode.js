var Mode = require('../model/mode');
const msg = require('../msg').en;
const config = require('./config');
var jwt = require('jsonwebtoken');
/**
Tìm kiếm dựa vào _id (truyền vào kiểu String) của mode (kiểu ObjectId)
*/
Mode.findBy_ID = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindModeIDResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.findById(new mongoose.Types.ObjectId(data._id)).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindModeIDResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindModeIDResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

Mode.findByUser = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindModeUserResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.find({'id_user' : new mongoose.Types.ObjectId(data.id_user)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindModeUserResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindModeUserResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

Mode.findByName = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindModeNameResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.find({'name': {$regex: data.name}, 'id_user' : new mongoose.Types.ObjectId(data.id_user)})
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindModeNameResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindModeNameResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}



Mode.mInsert = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('InsertModeResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      let mMode = new Mode();
      mMode.mode_name = data.mode_name,
      mMode.id_user   = new mongoose.Types.ObjectId(data.id_user);
      mMode.status    = data.status;
      mMode.circle    = data.circle;
      mMode.starttime = data.starttime;
      mMode.stoptime  = data.stoptime;

      mMode.save((err) =>{
        if(err) {
          console.log(err);
          socket.emit('InsertModeResult', {'success': false, 'message': msg.error.occur});
        }else{
          console.log(true);
          socket.emit('InsertModeResult', {'success' : true});
        }
      });
    }
  });
};

/**
@param mMode: 1 thiết bị đầy đủ thuộc tính
*/
Mode.mUpdate = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('UpdateModeResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('UpdateModeResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('UpdateModeResult', {'success': true});
        }
      });
    }
  });
};


/**
@param mode_ID: mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)

@objective : thực hiện xóa 1 mode
*/
Mode.mDelete = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('DeleteModeResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.remove({'_id' : new mongoose.Types.ObjectId(mode_ID)}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('DeleteModeResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('DeleteModeResult', {'success': true});
        }
      });
    }
  });
};
/**
Lấy về tất cả các Mode
*/

Mode.getAllMode = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('AllModeResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.find().
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
        socket.emit('AllModeResult', {'success': false, 'message': msg.error.occur});
      } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('AllModeResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Mode.getByPage = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('GetModePageResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      Mode.find().
      skip((page-1)*quantity).
      limit(quantity).
      sort({name : 1, type : 1, price : -1}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('GetModePageResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('GetModePageResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
module.exports = exports = Mode;
