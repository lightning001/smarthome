'use strict'

var mongoose = require('./connection');
require('./Mode');
require('./Room');

var SchemaTypes = mongoose.Schema.Types;

var schemaUser = new mongoose.Schema({
  email : {type : String, required: true, index: { unique: true }},
  password : {type : String, required: true},
  name : {type : String},
  street : {type : String},
  district : {type : String},
  city : {type : String},
  postcode : {type : Number},
  phonenumber : {type : String},
  homephone : {type : String},
  dob : {type : Date},
  type : {type : String},
  status : {type : Boolean, default : false},
  startdateregister : {type : Date, default : Date.now()},
  img : {type : String, default : 'person.png'},
}, { toJSON : {virtuals: true}});

schemaUser.virtual(  'listMode', {ref : 'Mode', localField : '_id', foreignField : 'id_user', justOne : false});
schemaUser.virtual(  'listRoom', {ref : 'Room', localField : '_id', foreignField : 'id_user', justOne : false});
schemaUser.virtual('listDevice', {ref : 'DeviceInRoom', localField : '_id', foreignField : 'user', justOne : false});

schemaUser.set('toObject', { getters: true });

var User = mongoose.model('User', schemaUser, 'USER');

User.login = (email, password) => {
  return new Promise((resolve, reject) =>{
    //xu ly ma hoa o day
    User.findOne()
    .where('email').equals(email)
    .where('password').equals(password)
    .where('status').equals(true)
    .populate('listMode')
    .populate('listRoom')
    .exec((err, data) =>{
      if(err) return reject(new Error('Login unsuccessfully!\n' +err ));
      if(!data || typeof data == undefined) return reject('Email or password is incorrected');
      return resolve(data);
    });
  });
}



/**
Tìm kiếm dựa vào _id của user (kiểu ObjectId) truyền vào string
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

User.findBy_ID('5ad95080734d1d2de1f48f1d').then(data =>console.log('My data: ' + JSON.stringify(data)), err =>console.log(err.toString()));

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

User.findByEmail = (mEmail) =>{
  return new Promise((resolve, reject) =>{
    User.findOne({email : mEmail}, (err, data) =>{
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      if(!data || data.length ==0) return reject('Can\'t find email: '+mEmail);
      else return resolve(data);
    });
  });
}



User.mInsert = (data) =>{
  return new Promise((resolve, reject) =>{
    User.findByEmail(email).then(
      (data) => {// neu da co email nay thi tra ve loi da ton tai
        return reject(new Error('Email is already exists'));
      }, (error) =>{
        let mUser = new User();
        mUser.email = data.email;
        mUser.password = data.password;
        mUser.name = data.name;
        mUser.save((err) =>{
          if(err){
            return reject(new Error('Error! An error occurred. Please try again later'));
          }else{
            return resolve(true);
          }
        });
      });
  });
}

User.mInsert = (data) =>{
  return new Promise((resolve, reject) =>{
    User.findByEmail(data.email).then(
      (data2) => {// neu da co email nay thi tra ve loi da ton tai
        return reject(new Error('Email is already exists'));
      },
      (error) =>{
        let mUser = new User();
        mUser.email             = data.email;
        mUser.password          = data.password;
        mUser.name              = data.name;
        mUser.street            = data.street;
        mUser.distric           = data.distric;
        mUser.city              = data.city;
        mUser.postcode          = data.postcode;
        mUser.phonenumber       = data.phonenumber;
        mUser.homephone         = data.homephone;
        mUser.dob               = data.dob;
        mUser.type              = data.type;
        mUser.status            = data.status;
        mUser.startdateregister = data.startdateregister;
        mUser.img               = data.img;
        mUser.save((err) =>{
          if(err) return reject(false);
          return resolve(true);
        });
      });
    });
}

/**
@param mUser: 1 thiết bị đầy đủ thuộc tính
*/
User.mUpdate = (mUser) => {
  return new Promise((resolve, reject) =>{
    let u = new User();
    u._id               = mUser._id;
    u.email             = mUser.email;
    u.password          = mUser.password;
    u.name              = mUser.name;
    u.street            = mUser.street;
    u.distric           = mUser.distric;
    u.city              = mUser.city;
    u.postcode          = mUser.postcode;
    u.phonenumber       = mUser.phonenumber;
    u.homephone         = mUser.homephone;
    u.dob               = mUser.dob;
    u.type              = mUser.type;
    u.status            = mUser.status;
    u.startdateregister = mUser.startdateregister;
    u.img               = mUser.img;

    u.save((err, data) =>{
      if(err){
        return reject(false);
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
    User.remove({'_id' : new mongoose.Type.ObjectId(user_ID)}, (err) =>{
      if (err) {
        return reject(false);
      }
      else {
        return resolve(true);
      }
    });
  });
};

/**
Lấy về tất cả các User
*/
User.getAllUser = () => {
  return new Promise((resolve, reject) => {
    User.find((err, data) =>{
      if(err){
        return reject(new Error('Error! An error occurred. Please try again later'));
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
    .sort({name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(data);
    });
  });
}

// User.login('test01@gmail.com', '123456')
// .then(data =>{
//   console.log('My data: ' + JSON.stringify(data));
// }).catch(err =>console.log(err.toString()));

// User.getRoom_Mode_User('5ab3333038b9043e4095ff84')
// .then(data =>{
//   console.log('My data: ' + data.toString());
// }).catch(err =>console.log(err.toString()));

// User.login('linhdanit1512@gmail.com', '123456').then(data => console.log(data), err => console.log(err));
// User.findByEmail('linhdanit@gmail.com').then(data => console.log(data), err => console.log(err));
// User.mInsert(2, 'linhdanit1512@gmail.com', '123456', 'Linh Dan', '101/53/10 Mach Thi Lieu', 'Di An', 'Binh Duong', 821111,
//                 '0977933807', '02633873877', new Date(1995, 12, 15), 'VIP', 1, Date.now(), 'person.png')
//     .then(data => console.log('Data'+data), err => console.error(err))
//     .catch(err => console.log(err));

module.exports = exports = User;
