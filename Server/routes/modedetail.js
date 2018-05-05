var ModeDetail = require('../model/mode_detail');

ModeDetail.getDetailMode = (mode) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find({'mode' : new ObjectId(mode)}, {'group': 'mode'})
    .populate('mode')
    .populate('device')
    .exec(function(err, data) {
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(data);
    });
  });
}
// ModeDetail.getDetailMode('5ab47f0d52b9ed7bf00ed1c6').then(data =>console.log(JSON.stringify(data), err =>console.log(err)));

ModeDetail.unused = (mode, id_user) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find()
    .populate({
      path : 'mode',
      match : {'_id' : {$nin : [new ObjectId(mode)]}, 'id_user' : new ObjectId(id_user)}
    })
    .populate('device')
    .exec(function(err, data) {
      if(err) return reject(new Error('Error! An error occurred. Please try again later'));
      return resolve(data);
    });
  });
}
// ModeDetail.unused('5ab47f0d52b9ed7bf00ed1c6', '5ab3333038b9043e4095ff84')
// .then(data =>console.log(JSON.stringify(data)), err =>console.log(err));

ModeDetail.findByMode = (mode) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.find({'mode' : new ObjectId(mode)})
    .exec((error, data) =>{
      if(error) return reject(new Error('Error! An error occurred. Please try again later'));
      if(!data || data.length == 0)
        return reject('No ModeDetail can find');
      return resolve(data);
    });
  });
}

ModeDetail.findByDevice = (device) =>{
  return new Promise((resolve, reject) =>{
    if(typeof device != 'string')
      return reject(new Error('ModeId must be a number'));
    ModeDetail.findOne({'device' : new ObjectId(device)}, (err, data) =>{
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
    mModeDetail.mode = new ObjectId(data.mode);
    mModeDetail.device = new ObjectId(data.device);
    mModeDetail.save((err) =>{
      if(err) return reject(false);
      return resolve(true);
    });
  });
}

ModeDetail.mUpdate = (data) => {
  return new Promise((resolve, reject) =>{
    mModeDetail.update({'_id' : new mongoose.Types.ObjectId(mUser._id)}, {$set : mUser}, (err, data) =>{
      if(err) return reject(false);
      return resolve(true);
    });
  });
};

ModeDetail.mDelete = (_id) =>{
  return new Promise((resolve, reject) =>{
    ModeDetail.remove({'_id' : new ObjectId(_id)}, (err) =>{
      if (err) return reject(false);
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
