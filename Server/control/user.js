var User = require('../model/user');
const config = require('../util/config');
var fs = require('fs');
const msg = require('../msg').en;
var jwt = require('jsonwebtoken');
let base64url = require('base64url');

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
    if (!data || typeof data === undefined) {
      console.log(msg.not_exist.account);
      socket.emit('server_send_login', {'success': false, 'message': msg.not_exist.account});
    }
    if (data && data.length !== 0) {
      if (data.password !== password) {
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
  User.count({'email': data.email}, (error, findresult) => {
    if(error){
      socket.emit('server_send_register', {'success': false,'message': msg.error.occur});
    }else if (!error && findresult === 0) {
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

User.confirmRegister = (data, socket) =>{
  socket.emit('server_send_confirm_register', {'success': false, 'message': msg.error.confirm_register});
  let EmailManager = require('../util/Email');
  //ma hoa TOKEN cho an toan
  let token = jwt.sign(JSON.stringify({'data' : data}), config.secret_key, {algorithm : 'HS256'});
  let encode = base64url.encode(token.toString(), 'binary');
  EmailManager.confirmEmail(data.email, encode);
  socket.emit('server_send_confirm_register', {'success' : true, 'message' : msg.success.confirm_register})
}

User.responseConfirm = (encode, request, response)=>{
  let token = base64url.decode(encode, 'binary');
  jwt.verify(token, config.secret_key, (error, data) => {
    if(error){
      response.write('<html>');
      response.write('<body style="margin : auto; padding : 70px;">');
      response.write('<h1>Ôi không!<hr/></h1> <h3>Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút<h3>');
      // response.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
      // response.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
      // response.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
      response.write('</body>');
      response.write('</html>');
      response.end();
    }else if(data){
      let mData = data.data;
      let email = mData.email;
      User.find({'email' : email}).
      exec((error2, data2)=>{
        if(error2){
          console.log(error2);
          response.write('<html>');
          response.write('<body>');
          response.write('Ôi không. Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút');
          // response.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
          // response.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
          // response.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
          response.write('</body>');
          response.write('</html>');
          response.end();
        }else if(!error && data2){
          User.update({'email' : data2.email}, {$set: {'status' : true}}).
          exec((err)=>{
            console.log(error2);
            response.write('<html>');
            response.write('<body>');
            response.write('Ôi không. Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút');
            // response.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
            // response.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
            // response.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
            response.write('</body>');
            response.write('</html>');
            response.end();
            return;
          });
          let EmailManager = require('../util/Email');
          EmailManager.thankConfirmRegister(mData.email);
          response.write('<html>');
          response.write('<body>');
          response.write('Đăng ký thành công');
          // response.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
          // response.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
          // response.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
          response.write('</body>');
          response.write('</html>');
          response.end();
        }
      });

    }
  });
}

/**
@param mUser: 1 thiết bị đầy đủ thuộc tính
*/
User.mUpdate = (token, socket) => {
  //verify token de lay data
  jwt.verify(token, config.secret_key, (error, data) => {
    if (error) {
      socket.emit('updateUserResult', {'success': false,'message': msg.error.occur});
      return;
    } else if (data) {
      //kiem tra email da co hay chua
      User.find({'email': data.email}, (error2, findresult) => {
        if(error2){
          socket.emit('updateUserResult', {'success': false,'message': msg.error.occur});
          return;
        }else if(!error2 && findresult && findresult.length > 0){
          //neu email nay da co thi kiem tra xem co trung _id ko
          //neu trung thi cho phep chinh sua, do email do la cua nguoi dang yeu cau
          if(data._id === findresult._id){
            continue;
          } else {
            //khong trung thi email da ton tai, user co data._id ko dc phep dung email nay
            console.log('Email da ton tai');
            socket.emit('updateUserResult', {'success': false,'message': msg.error.exist_email});
            return;
          }
        } else if(!error2 && (typeof findresult === undefined || findresult.length === 0)){
          //ko tim thay ket qua, tuc la email nay chua co trong database, dc phep su dung
          continue;
        }else{
          return;
        }
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
