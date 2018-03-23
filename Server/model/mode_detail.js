'use strict'

var mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/SmartHome';

const options = {
  reconnectTries: 30, // trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10 // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect(uri, options);

var schemaModeDetail = new mongoose.Schema({
  id_mode : {type : mongoose.Types.ObjectId, require : true, ref : 'Mode'},
  id_device : {type : mongoose.Types.ObjectId, require : true, ref : 'Device'},
});

schemaModeDetail.set('toObject', { getters: true });

var ModeDetail = mongoose.model('ModeDetail', schemaModeDetail, 'MODE_DETAIL');

ModeDetail.findByMode = (id_mode) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id_mode != 'string')
      return reject(new Error('Please check a syntax!'));
    ModeDetail.find({'id_mode' : new mongoose.Types.ObjectId(id_mode)}, (error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + err));
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
    ModeDetail.findOne({'id_device' : new mongoose.Types.ObjectId(id_device)}, (error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + err));
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
    ModeDetail.findById(new mongoose.Types.ObjectId(_id), (error, data) =>{
      if(error) return reject(new Error('Cannot get data!' + '\n' + err));
      if(data.length ==0) return reject(new Error('No Mode can find'))
        return resolve(data);
    });
  });
}

ModeDetail.mInsert = (id_mode, id_device) =>{
  return new Promise((resolve, reject) =>{
    if(typeof id_mode != 'ObjectId') return reject(new Error('Mode must be ObjectId'));
    if(typeof id_device != 'ObjectId') return reject(new Error('Device must be ObjectId'));
    let mModeDetail = new ModeDetail();
    mModeDetail.id_mode = id_mode;
    mModeDetail.id_device = id_device,
    mModeDetail.save((err) =>{
      if(err) return reject(new Error('Cannot insert ModeDetail: ' + JSON.stringify(mModeDetail) + '\n' + err));
      return resolve(true);
    });
  });
};

// ModeDetail.mInsert(1,3)
// .then(data => console.log(data), err => console.log(err))
// .catch(err => console.log(err));

/**
@param mModeDetail: 1 thiết bị đầy đủ thuộc tính
*/
ModeDetail.mUpdate = (mModeDetail) => {
  return new Promise((resolve, reject) =>{
    mModeDetail.save((err, data) =>{
      if(err) return reject(new Error('Cannot update ModeDetail: '+JSON.stringify(mModeDetail) + '\n' + err));
      return resolve(true);
    });
  });
};


/**
@param modeDetail_id: mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)

@objective : thực hiện xóa 1 modeDetail
*/
ModeDetail.mDelete = (_id) =>{
  return new Promise((resolve, reject) =>{
    if(typeof _id != 'string')
      return reject(new Error('_id must be a String'));
    ModeDetail.remove({'_id' : new mongoose.Type.ObjectId(_id)}, (err) =>{
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
