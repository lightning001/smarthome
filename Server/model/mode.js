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

var schemaMode = new mongoose.Schema({
  id : {type : Number, required: true, index: { unique: true }},
  mode_name : {type : String},
  id_user : [{type : mongoose.Types.ObjectId, ref : 'User'}],
  status : {type : Number},
  circle : {type : []},
  starttime : {type : Number},
  stoptime : {type : Number}
});

schemaMode.set('toObject', { getters: true });

var Mode = mongoose.model('Mode', schemaMode, 'MODE');

/**
Tìm kiếm dựa vào id của mode
*/
Mode.findByID = (modeID) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id != 'number')
      return reject(new Error('ModeID must be a number'));
    Mode.findOne({id : modeID}, (error, data) =>{
      if(error){
        return reject(new Error('Cannot get data!' + '\n' + err));
      }else{
        return resolve(data);
      }
    });
  });
}

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

Mode.getByUser = (id_user) =>{
  return new Promise((resolve, reject) =>{
    Mode.find({'id_user' : new mongoose.Types.ObjectId(id_user)}, (err, data) =>{
      if(err) return reject(new Error('Error: '+err));
      if(data.length == 0) return reject('No mode can be found');
      return data;
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

Mode.mInsert = (id, mode_name, id_user, status, circle, starttime, stoptime) =>{
  return new Promise((resolve, reject) =>{
    let mMode = new Mode();
    mMode.id = id;
    mMode.mode_name = mode_name,
    mMode.id_user = new mongoose.Types.ObjectId(id_user);
    mMode.status = status;
    mMode.circle = circle;
    mMode.starttime = starttime;
    mMode.stoptime = stoptime;

    mMode.save((err) =>{
      if(err) return reject(new Error('Cannot insert Mode: ' + JSON.stringify(mMode) + '\n' + err));
      return resolve(true);
    });
  });
};

/**
@param mMode: 1 thiết bị đầy đủ thuộc tính
*/
Mode.mUpdate = (mMode) => {
  return new Promise((resolve, reject) =>{
    mMode.save((err, data) =>{
      if(err) return reject(new Error('Cannot update Mode: '+JSON.stringify(mMode) + '\n' + err));
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
    Mode.remove({_id : new mongoose.Types.ObjectId(mode_ID)}, (err) =>{
      if (err) return reject(new Error('Cannot delete Mode has _id: ' + mode_ID));
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
    .sort({id : 1, name : 1, type : 1, price : -1})
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
Mode.mInsert(1, 'Working', '5ab3333038b9043e4095ff84', 1, [0,1,2,3,4], 3600*7, 3600*18)
  .then((data => console.log("" +data), err => console.log(err+'')))
  .catch(err => console.log(err +''));

module.exports = exports = Mode;
