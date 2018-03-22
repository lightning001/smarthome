'use strict'

var mongoose = require('mongoose');
var md5 = require('md5');

const uri = 'mongodb://localhost:27017/SmartHome';

const options = {
  reconnectTries: 30, // trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10 // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect(uri, options);

var SchemaTypes = mongoose.Schema.Types;

var schemaUser = new mongoose.Schema({
  id : {type : Number, required: true, index: { unique: true }},
  email : {type : String, required: true, index: { unique: true }},
  password : {type : String, required: true},
  name : {type : String},
  information : {
    street : {type : String},
    distric : {type : String},
    city : {type : String},
    postcode : {type : Number},
    phonenumber : {type : String},
    homephone : {type : String},
    dob : {type : Date},
    type : {type : String},
    status : {type : Boolean, default : false},
    startdateregister : {type : Date, default : Date.now()},
    img : {type : String, default : 'person.png'},
  }
});
schemaUser.set('toObject', { getters: true });

var User = mongoose.model('User', schemaUser, 'USER');

User.findByID = (userID) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id != 'number')
      return reject(new Error('UserID must be a number'));
    User.findOne({id : userID}, (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

User.login = (email, password) => {
  return new Promise((resolve, reject){
    //xu ly ma hoa o day
    User.findOne()
    .where('email').equals(email)
    .where('password').equals(md5(password))
    .exec((err, data){
      if(err) return reject(new Error('Login unsuccessfully!\n' +err ));
      return resolve(data);
    });
  });
}

/**
Tìm kiếm dựa vào _id của user (kiểu ObjectId)
*/
User.findBy_ID = (userID) =>{
  return new Promise((resolve, reject) =>{
    User.findById(new mongoose.Types.ObjectId(userID), (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

User.findByName = (name) =>{
  return new Promise((resolve, reject) =>{
    User.find({'name': {$regex: name}}, (err, data) =>{
      if(err){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

User.findByEmail = (email) =>{
  return new Promise((resolve, reject) =>{
    User.find({email : email}, (err, data) =>{
      if(err){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

User.mInsert = (id, email, password, name) =>{
  return new Promise((resolve, reject) =>{
    let mUser = new User();
    mUser.id = id;
    mUser.email = email;
    mUser.password = password;
    mUser.name = name;
    mUser.save((err) =>{
      if(err){
        return reject(new Error('Cannot insert User: ' + JSON.stringify(mUser) + '\n' + err));
      }else{
        return resolve(true);
      }
    });
  });
};


User.mInsert = (id, email, password, name, street, distric, city, postcode,
                phonenumber, homephone, dob, type, status, startdateregister, img) =>{
  return new Promise((resolve, reject) =>{
    let mUser = new User();
    mUser.id = id;
    mUser.email = email;
    mUser.password = md5(password);
    mUser.name = name;
    mUser.information.street = street;
    mUser.information.distric = distric;
    mUser.information.city = city;
    mUser.information.postcode = postcode;
    mUser.information.phonenumber = phonenumber;
    mUser.information.homephone = homephone;
    mUser.information.dob = dob;
    mUser.information.type = type;
    mUser.information.status = status;
    mUser.information.startdateregister = startdateregister;
    mUser.information.img = img;
    mUser.save((err) =>{
      if(err){
        return reject(new Error('Cannot insert User: ' + JSON.stringify(mUser) + '\n' + err));
      }else{
        return resolve(true);
      }
    });
  });
};


/**
@param mUser: 1 thiết bị đầy đủ thuộc tính
*/
User.mUpdate = (mUser) => {
  return new Promise((resolve, reject) =>{
    mUser.save((err, data) =>{
      if(err){
        return reject(new Error('Cannot update User: '+JSON.stringify(mUser) + '\n' + err));
      }else{
        return resolve(true);
      }
    });
  });
};


/**
@param user_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 user
*/
User.mDelete = (user_ID) =>{
  return new Promise((resolve, reject) =>{
    User.remove({_id : user_ID}, (err) =>{
      if (err) {
        return reject(new Error('Cannot delete User has _id: ' + user_ID));
      }
      else {
        console.log('Delete Successfully!');
        return resolve(true);
      }
    });
  });
};
/**
Lấy về tất cả các User
cach dung:
  User.getAllUser().then(func1(data), func2(err)).catch(func(err));
  func1(data) là giá trị khi thực hiện thành công, trả về data
  func2(err) là xảy ra lỗi khi thực hiện
*/

User.getAllUser = () => {
  return new Promise((resolve, reject) => {
    User.find((err, data) =>{
      if(err){
        return reject(new Error('Cannot get data'));
      }else{
        return resolve(data);
      }
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
User.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    User.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({id : 1, name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

User.mInsert(1, 'linhdanit@gmail.com', '12345', 'Linh Dan', '101/53/10 Mach Thi Lieu', 'Di An', 'Binh Duong', 821111,
                '0977933807', '02633873877', new Date(1995, 12, 15), 'VIP', 1, Date.now(), 'person.png')
    .then(data => console.log('Data'+data), err => console.error(err))
    .catch(err => console.log(err));

module.exports = exports = User;
