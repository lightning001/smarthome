'use strict'

var mongoose = require('mongoose');
require('./Mode');
require('./Device_In_Room');
var ObjectId = mongoose.Types.ObjectId;
const uri = 'mongodb://localhost:27017/SmartHome';

const options = {
  reconnectTries: 30, // trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10 // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect(uri, options);

var schemaModeDetail = new mongoose.Schema({
  id_mode : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Mode'},
  id_device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
});

schemaModeDetail.set('toObject', { getters: true });

var ModeDetail = mongoose.model('ModeDetail', schemaModeDetail, 'MODE_DETAIL');

ModeDetail.getDetailMode = (id_mode) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find({'id_mode' : new ObjectId(id_mode)}, {'group': 'id_mode'})
    .populate('id_mode')
    .populate('id_device')
    .exec(function(err, data) {
      if(err) return reject(new Error('Error' +err));
      return resolve(JSON.stringify(data));
    });
  });
}


// ModeDetail.getDetailMode('5ab47f0d52b9ed7bf00ed1c6')
// .then(data => console.log(data), err => console.log(err))
// .catch(err => console.log(err));

ModeDetail.findByMode = (id_mode) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id_mode != 'string') return reject(new Error('mode must be a string!'));
    ModeDetail.find({'id_mode' : new ObjectId(id_mode)})
    .exec((error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + error));
      if(!data || data.length == 0)
        return reject('No ModeDetail can find');
      return resolve(data);
    });
  });
}

ModeDetail.findByDevice = (id_device) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id_device != 'string')
      return reject(new Error('ModeId must be a number'));
    ModeDetail.findOne({'id_device' : new ObjectId(id_device)}, (err, data) =>{
      if(err) return reject(new Error('Cannot get data!' + '\n' + err));
      if(data && data.length ==0)
        return reject('No ModeDetail can find');
      return resolve(data);
    });
  });
}

/**
Tìm kiếm dựa vào _id (truyền vào kiểu String) của modeDetail (kiểu ObjectId)
*/
ModeDetail.findBy_id = (_id) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.findById(new ObjectId(_id), (error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + error));
      if(data.length ==0) return reject(new Error('No Mode can find'))
        return resolve(data);
    });
  });
}

// var DeviceOnRoom = require('./Device_In_Room');
// var Mode = require('./Mode');

ModeDetail.mInsert = (id_mode, id_device) =>{
  return new Promise((resolve, reject) =>{
    let mModeDetail = new ModeDetail();
    mModeDetail.id_mode = new ObjectId(id_mode);
    mModeDetail.id_device = new ObjectId(id_device);
    mModeDetail.save((err) =>{
      if(err) return reject(new Error('Cannot insert ModeDetail: ' + JSON.stringify(mModeDetail) + '\n' + err));
      return resolve(true);
    });
  });
}

// ModeDetail.mInsert(new ObjectId('5ab47f0d52b9ed7bf00ed1c6'), new ObjectId('5ab5c49fadfc4664640c883a'));
// ModeDetail.mInsert(new ObjectId('5ab47f0d52b9ed7bf00ed1c6'), new ObjectId('5ab5c49fadfc4664640c883c'));
// ModeDetail.mInsert(new ObjectId('5ab480050dd33e6804b27e3d'), new ObjectId('5ab5c49fadfc4664640c883b'));
// ModeDetail.mInsert(new ObjectId('5ab480050dd33e6804b27e3d'), new ObjectId('5ab5c49fadfc4664640c883a'));
// ModeDetail.mInsert(new ObjectId('5ab480050dd33e6804b27e3e'), new ObjectId('5ab5c49fadfc4664640c883f'));
// ModeDetail.mInsert(new ObjectId('5ab480050dd33e6804b27e3e'), new ObjectId('5ab5c49fadfc4664640c883e'));
// ModeDetail.mInsert(new ObjectId('5ab480050dd33e6804b27e3e'), new ObjectId('5ab5c49fadfc4664640c8840'));

ModeDetail.mUpdate = (mModeDetail) => {
  return new Promise((resolve, reject) =>{
    mModeDetail.save((err, data) =>{
      if(err) return reject(new Error('Cannot update ModeDetail: '+JSON.stringify(mModeDetail) + '\n' + err));
      return resolve(true);
    });
  });
};

ModeDetail.mDelete = (_id) =>{
  return new Promise((resolve, reject) =>{
    if(typeof _id != 'string')
      return reject(new Error('_id must be a String'));
    ModeDetail.remove({'_id' : new ObjectId(_id)}, (err) =>{
      if (err) return reject(new Error('Cannot delete ModeDetail has _id: ' + modeDetail_id));
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các ModeDetail
*/

ModeDetail.getAllModeDetail = () => {
  return new Promise((resolve, reject) => {
    ModeDetail.find((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
ModeDetail.getByPage = (quantity, page) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find()
    .skip((page-1)*quantity)
    .limit(quantity)
    .sort({id : 1, name : 1, type : 1, price : -1})
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data. Error: \n'+ err));
      return resolve(data);
    });
  });
}

module.exports = exports = ModeDetail;
