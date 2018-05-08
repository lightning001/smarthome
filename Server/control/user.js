var User = require('../model/user');
const config = require('./config');
// require('../model/Mode');
// require('../model/Room');
var fs = require('fs');
const msg = require('../msg').en;
var jwt = require('jsonwebtoken');


User.login = (email, password, socket, _, io) => {
  socket.auth = false;
  console.log('Thuc hien login: '+socket.id);
  //xu ly ma hoa o day
  User.findOne().
  where('email').equals(email).
  // .where('password').equals(password)
  // where('status').equals(true).
  populate('listMode').
  populate('listRoom').
  exec((error, data) => {
    if (error) {
      console.log(error);
      socket.emit('server_send_login', {'success': false, 'message': msg.error.occur});
    }
    if (!data || typeof data == undefined) {
      console.log(msg.not_exist.account);
      socket.emit('server_send_login', {'success': false, 'message': msg.not_exist.account});
    }
    if (data && data.length != 0) {
      if (data.password != password) {
        console.log('Sai mat khau');
        socket.emit('server_send_login', {'success': false, 'message': msg.error.login_incorrect});
      } else {
        console.log(data);
        var token = jwt.sign(JSON.stringify(data), config.secret_key, {algorithm : 'HS256'});
        socket.auth = true;
        console.log('User: ' + token);
        socket.emit('server_send_login', {'success': true, 'token': token});
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
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
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
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
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
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          console.log('Token: ' + token2);
          socket.emit('FindUserEmailResult', {'success': true,'token': token2});
        }
      });
    }
  });
}

getImageName = (id) => {
  return id + new Date().getTime() + '.png';
}

User.mInsert = (data, socket) => {
  User.find({'email': data.email}, (error, findresult) => {
    if(error){
      socket.emit('server_send_register', {'success': false,'message': msg.error.occur});
    }else if (!error && (typeof findresult == undefined || findresult.length == 0)) {
      let mUser = new User();
      mUser.email = data.email;
      mUser.password = data.password;
      mUser.name = data.name;
      mUser.street = data.street;
      mUser.district = data.district;
      mUser.city = data.city;
      mUser.postcode = data.postcode;
      mUser.phonenumber = data.phonenumber;
      mUser.homephone = data.homephone;
      mUser.dob = data.dob;
      mUser.type = 'Normal';
      mUser.status = false;
      mUser.startdateregister = new Date();
      let fileName = getImageName(socket.id);
      fs.writeFile(config.upload_path + fileName, data.img);

      mUser.img = config.host + fileName;
      mUser.save((error2) => {
        console.log('User' + JSON.stringify(mUser));
        if (error2) {
          socket.emit('server_send_register', {'success': false,'message': msg.error.occur});
        } else {
          console.log('insert true');
          socket.emit('server_send_register', {'success': true});
        }
      });
    }else{
      console.log('Email exist');
      socket.emit('server_send_register', {'success': false, 'message' : msg.error.exist_email});
    }
  });
}

/**
@param mUser: 1 thiết bị đầy đủ thuộc tính
*/
User.mUpdate = (token, socket) => {
  User.find({'email': data.email}, (error, findresult) => {
    if(error){
      socket.emit('updateUserResult', {'success': false,'message': msg.error.occur});
    }else if(!error && (typeof findresult == undefined || findresult.length == 0)){
      jwt.verify(token, config.secret_key, function(error, data) {
        if (error) {
          socket.emit('updateUserResult', {'success': false,'message': msg.error.occur});
        } else if (data) {
          let fileName = getImageName(socket.id);
          fs.writeFile(fileName, data.img);
          mUser.img = config.host + fileName;
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
    }else{
        socket.emit('updateUserResult', {'success': false,'message': msg.error.exist_email});
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
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
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
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          socket.emit('GetUserPageResult', {'success': false,'token': token2});
        }
      });
    }
  });
}
module.exports = exports = User;
