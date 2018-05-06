var User = require('../model/user');
const config = require('./config');
// require('../model/Mode');
// require('../model/Room');
const msg = require('../msg').en;
var jwt = require('jsonwebtoken');


User.login = (email, password, socket, _) => {
  socket.auth = false;
  //xu ly ma hoa o day
  User.findOne().
  where('email').equals(email).
  // .where('password').equals(password)
  where('status').equals(true).
  populate('listMode').
  populate('listRoom').
  exec((error, data) => {
    if (error) {
      socket.emit('loginResult', {'success': false, 'message': msg.error.occur});
    }
    if (!data || typeof data == undefined) {
      socket.emit('loginResult', {'success': false, 'message': msg.not_exist.account});
    }
    if (data && data.length != 0) {
      if (data.password != password) {
        socket.emit('loginResult', {'success': false, 'message': msg.error.login_incorrect});
      } else {
        var token = jwt.sign(data, config.secret_key, {expiresIn: 86400});
        socket.auth = true;
        console.log(data);
        socket.emit('loginResult', {'success': true, 'token': token});
        _.each(io.nsps, function(nsp) {
          if (_.findWhere(nsp.sockets, {id: socket.id})) {
            console.log("restoring socket to", nsp.name);
            nsp.connected[socket.id] = socket;
          }
        });
      }
    }
  });
}

/**
Tìm kiếm dựa vào _id của user (kiểu ObjectId) truyền vào string
*/
User.findBy_ID = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindUserIDResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      User.findById(new mongoose.Types.ObjectId(data._id), (error2, data2) => {
        if(error2){
          socket.emit('FindUserIDResult', {'success': false, 'message': msg.empty.cant_find});
        } else if (!error2 && data2) {
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindUserIDResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

// User.findBy_ID('5ad95080734d1d2de1f48f1d').then(data =>console.log('My data: ' + JSON.stringify(data)), error =>console.log(error.toString()));

User.findByName = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindUserNameResult', {'success': false, 'message': msg.error.occur});
    } else if (data) {
      User.find({'name': {$regex: data.name}}, (error2, data2) => {
        if (error2) {
          socket.emit('FindUserNameResult', {'success': false,'message': msg.error.occur});
        } else if (!data2) {
          socket.emit('FindUserNameResult', {'success': false,'message': msg.empty.cant_find});
        } else if (!error2 && data2) {
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindUserNameResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

User.findByEmail = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindUserEmailResult', {'success': false,'message': msg.error.occur});
    } else if (data) {
      User.find({'email': data.email}, (error2, data2) => {
        if (error2) {
          socket.emit('FindUserEmailResult', {'success': false,'message': msg.error.occur});
        } else if (!data2) {
          socket.emit('FindUserEmailResult', {'success': false,'message': msg.empty.cant_find});
        } else if (!error2 && data2) {
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindUserEmailResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

User.mInsert = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('createUserResult', {'success': false,'message': msg.error.occur});
    } else if (data) {
      User.find({'email': data.email}, (error2, data2) => {
        if (!error2 && (typeof data2 == undefined || data2.length == 0)) {
          let mUser = new User();
          mUser.email = data2.email;
          mUser.password = data2.password;
          mUser.name = data2.name;
          mUser.save((error3) => {
            if (error3) {
              socket.emit('createUserResult', {'success': false,'message': msg.error.occur});
            } else {
              console.log('insert '+ true);
              socket.emit('createUserResult', {'success': true});
            }
          });
        }
      });
    }
  });
}

User.mInsert2 = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('createUserResult', {'success': false,'message': msg.error.occur});
    } else if (data) {
      User.find({'email': data.email}, (error2, data2) => {
        if (!error2 && (typeof data2 == undefined || data2.length == 0)) {
          let mUser = new User();
          mUser.email = data2.email;
          mUser.password = data2.password;
          mUser.name = data2.name;
          mUser.street = data2.street;
          mUser.distric = data2.distric;
          mUser.city = data2.city;
          mUser.postcode = data2.postcode;
          mUser.phonenumber = data2.phonenumber;
          mUser.homephone = data2.homephone;
          mUser.dob = data2.dob;
          mUser.type = data2.type;
          mUser.status = data2.status;
          mUser.startdateregister = data2.startdateregister;
          mUser.img = data2.img;
          mUser.save((error3) => {
            if (error3) {
              socket.emit('createUserResult', {'success': false,'message': msg.error.occur});
            } else {
              console.log('insert true');
              socket.emit('createUserResult', {'success': true});
            }
          });
        }
      });
    }
  });
}

/**
@param mUser: 1 thiết bị đầy đủ thuộc tính
*/
User.mUpdate = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('updateUserResult', {'success': false,'message': msg.error.occur});
    } else if (data) {
      User.update({'_id': new mongoose.Types.ObjectId(data._id)}, {$set: data}).
      exec((error2) => {
        if (error2) {
          console.log(error2);
          socket.emit('updateUserResult', {'success': false,'message': msg.error.occur});
        } else {
          console.log('update' + true);
          socket.emit('updateUserResult', {'success': true});
        }
      });
    }
  });
}

/**
@param user_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 user
*/
User.mDelete = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('deleteUserResult', {'success': false,'message': msg.error.occur});
    } else if (data) {
      User.remove({'_id': new mongoose.Type.ObjectId(data._id)}).
      exec((error2) => {
        if (error2) {
          console.log(error2);
          socket.emit('deleteUserResult', {'success': false,'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('deleteUserResult', {'success': true});
        }
      });
    }
  });
};

/**
Lấy về tất cả các User
*/
User.getAllUser = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      console.log(error);
      socket.emit('GetAllUserResult', {'success': false, 'message': msg.error.occur});
    } else {
      User.find((error2, data2) => {
        if (error2) {
          console.log(error2);
          socket.emit('GetAllUserResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('GetAllUserResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
User.getByPage = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      console.log(error);
      socket.emit('GetUserPageResult', {'success': false, 'message': msg.error.occur});
    } else {
      User.find().
      skip((data.page - 1) * data.quantity).
      limit(data.quantity).
      sort({name: 1, type: 1, price: -1}).
      exec((error2, data2) => {
        if (error2) {
          console.log(error2);
          socket.emit('GetUserPageResult', {'success': false,'message': msg.error.occur});
        } else {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('GetUserPageResult', {'success': false,'token': token2});
        }
      });
    }
  });
}
module.exports = exports = User;
