'use strict'

var mongoose = require('./connection');
require('./Mode');
require('./Device_In_Room');


var ObjectId = mongoose.Types.ObjectId;

var schemaModeDetail = new mongoose.Schema({
  id_mode : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Mode'},
  id_device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
});

var ModeDetail = mongoose.model('ModeDetail', schemaModeDetail, 'MODEDETAIL');

ModeDetail.getDetailMode = (id_mode) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find({'id_mode' : new ObjectId(id_mode)}, {'group': 'id_mode'})
    .populate('id_mode')
    .populate('id_device')
    .exec(function(err, data) {
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(data);
    });
  });
}

ModeDetail.getDetailMode('5ab47f0d52b9ed7bf00ed1c6').then(data =>console.log(JSON.stringify(data), err =>console.log(err)));

ModeDetail.findByMode = (id_mode) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find({'id_mode' : new ObjectId(id_mode)})
    .exec((error, data) =>{
      if(error) return reject(new Error('Error! An error occurred. Please try again later'));
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
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
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
      if(error) return reject(new Error('Error! An error occurred. Please try again later'));
      if(data.length ==0) return reject(new Error('No Mode can find'))
        return resolve(data);
    });
  });
}

// var DeviceOnRoom = require('./Device_In_Room');
// var Mode = require('./Mode');

ModeDetail.mInsert = (data) =>{
  return new Promise((resolve, reject) =>{
    let mModeDetail = new ModeDetail();
    mModeDetail.id_mode = new ObjectId(data.id_mode);
    mModeDetail.id_device = new ObjectId(data.id_device);
    mModeDetail.save((err) =>{
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(true);
    });
  });
}

// ModeDetail.mInsert({'id_mode' : '5ab47f0d52b9ed7bf00ed1c6', 'id_device' : '5ad69946c28bc8368823b6a0'});
// ModeDetail.mInsert({'id_mode' : '5ab47f0d52b9ed7bf00ed1c6', 'id_device' : '5ad69946c28bc8368823b6a1'});
// ModeDetail.mInsert({'id_mode' : '5ab47f0d52b9ed7bf00ed1c6', 'id_device' : '5ad69946c28bc8368823b6a2'});
// ModeDetail.mInsert({'id_mode' : '5ab47f0d52b9ed7bf00ed1c6', 'id_device' : '5ad69946c28bc8368823b6a4'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3d', 'id_device' : '5ad69946c28bc8368823b6a3'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3d', 'id_device' : '5ad69946c28bc8368823b6a5'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3d', 'id_device' : '5ad69946c28bc8368823b6a7'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3d', 'id_device' : '5ad69946c28bc8368823b6a8'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3e', 'id_device' : '5ad69946c28bc8368823b6a8'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3e', 'id_device' : '5ad69946c28bc8368823b6a6'});
// ModeDetail.mInsert({'id_mode' : '5ab480050dd33e6804b27e3e', 'id_device' : '5ad69946c28bc8368823b6a9'});

ModeDetail.mUpdate = (data) => {
  return new Promise((resolve, reject) =>{
    let mModeDetail = new ModeDetail();
    mModeDetail._id = new ObjectId(data._id);
    mModeDetail.id_mode = new ObjectId(data.id_mode);
    mModeDetail.id_device = new ObjectId(data.id_device);
    mModeDetail.save((err, data) =>{
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(true);
    });
  });
};

ModeDetail.mDelete = (_id) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.remove({'_id' : new ObjectId(_id)}, (err) =>{
      if (err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các ModeDetail
*/

ModeDetail.getAllModeDetail = () => {
  return new Promise((resolve, reject) => {
    ModeDetail.find()
    .exec((err, data) =>{
      if(err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
// ModeDetail.getAllModeDetail().then(data =>console.log(JSON.stringify(data)), err =>console.log(err));
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
