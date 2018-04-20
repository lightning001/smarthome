'use strict'
var mongoose = require('mongoose');

var mongoose = require('./connection');

var schemaMode = new mongoose.Schema({
  mode_name : {type : String},
  id_user : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
  status : {type : Boolean},
  circle : {type : []},
  starttime : {type : Number},
  stoptime : {type : Number}

});



schemaMode.set('toObject', { getters: true });

var Mode = mongoose.model('Mode', schemaMode, 'MODE');

/**
Tìm kiếm dựa vào _id (truyền vào kiểu String) của mode (kiểu ObjectId)
*/
Mode.findBy_ID = (mode_ID) =>{
  return new Promise((resolve, reject) =>{
    Mode.findById(new mongoose.Types.ObjectId(mode_ID), (error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

Mode.findByUser = (id_user) =>{
  return new Promise((resolve, reject) =>{
    Mode.find({'id_user' : new mongoose.Types.ObjectId(id_user)}, (err, data) =>{
      if(err) return reject(new Error('Error: '+err));
      if(data.length == 0) return reject('No mode can be found');
      return resolve(data);
    });
  });
}

Mode.findByName = (name, id_user) =>{
  return new Promise((resolve, reject) =>{
    //find({ 'name' : { $regex: /Ghost/, $options: 'i' } }, function(){});
    Mode.find({'name': {$regex: name}, 'id_user' : new mongoose.Types.ObjectId(id_user)})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}



Mode.mInsert = (data) =>{
  return new Promise((resolve, reject) =>{
    let mMode = new Mode();
    mMode.mode_name = data.mode_name,
    mMode.id_user   = new mongoose.Types.ObjectId(data.id_user);
    mMode.status    = data.status;
    mMode.circle    = data.circle;
    mMode.starttime = data.starttime;
    mMode.stoptime  = data.stoptime;
    mMode.save((err) =>{
      if(err) return reject(false);
      return resolve(true);
    });
  });
};

/**
@param mMode: 1 thiết bị đầy đủ thuộc tính
*/
Mode.mUpdate = (data) => {
  return new Promise((resolve, reject) =>{
    Mode.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}, (err, data) =>{
      if(err) return reject(false);
      return resolve(true);
    });
  });
};


/**
@param mode_ID: mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)

@objective : thực hiện xóa 1 mode
*/
Mode.mDelete = (mode_ID) =>{
  return new Promise((resolve, reject) =>{
    if(typeof mode_ID != 'string')
      return reject(new Error('Mode_ID must be a String'));
    Mode.remove({'_id' : new mongoose.Types.ObjectId(mode_ID)}, (err) =>{
      if (err) return reject(false);
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các Mode
*/

Mode.getAllMode = () => {
  return new Promise((resolve, reject) => {
    Mode.find((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Mode.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    Mode.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

// Mode.getByDevice(1)
// .then(data =>console.log(data), err => console.log(err))
// .catch(err => console.log(err));

//id, mode_name, id_user, status, circle, starttime, stoptime
// Mode.mInsert(2, 'Playing', '5ab3333038b9043e4095ff84', 0, [1,2,3,4,5], 3600*12, 3600*14)
//   .then((data => console.log("" +data), err => console.log(err+'')))
//   .catch(err => console.log(err +''));
//   Mode.mInsert(3, 'Study', '5ab3333038b9043e4095ff84', 0, [5,6], 3600*7, 3600*10)
//     .then((data => console.log("" +data), err => console.log(err+'')))
//     .catch(err => console.log(err +''));

module.exports = exports = Mode;
