var ModeDetail = require('../model/mode_detail');

ModeDetail.getDetailMode = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('deviceInModeResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.find({'mode' : new mongoose.Types.ObjectId(data.mode)}, {'group': 'mode'}).
      populate('mode').
      populate('device').
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('deviceInModeResult', {'success': false, 'message': msg.empty.cant_find});
        } else if (!error && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('deviceInModeResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
// ModeDetail.getDetailMode('5ab47f0d52b9ed7bf00ed1c6').then(data =>console.log(JSON.stringify(data), err =>console.log(err)));

ModeDetail.unused = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('ModeDetailUnusedResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.find().
      populate({
        path : 'mode',
        match : {
          '_id' : {$nin : [new mongoose.Types.ObjectId(data.mode)]},
          'id_user' : new mongoose.Types.ObjectId(data.id_user)
        }
      }).
      populate('device').
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('ModeDetailUnusedResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('ModeDetailUnusedResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
// ModeDetail.unused('5ab47f0d52b9ed7bf00ed1c6', '5ab3333038b9043e4095ff84')
// .then(data =>console.log(JSON.stringify(data)), err =>console.log(err));

ModeDetail.findByMode = (ModeDetail) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindModeDeatilByModeResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.find({'mode' : new mongoose.Types.ObjectId(data.mode)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindModeDeatilByModeResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindModeDeatilByModeResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

ModeDetail.findByDevice = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindModeDetailByDeviceResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.find({'device' : new mongoose.Types.ObjectId(data.device)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindModeDetailByDeviceResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindModeDetailByDeviceResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

ModeDetail.findBy_id = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('FindModeDetailByIDResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.findById(new mongoose.Types.ObjectId(data._id)).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('FindModeDetailByIDResult', {'success': false, 'message': msg.empty.cant_find});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('FindModeDetailByIDResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}

ModeDetail.mInsert = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('InsertModeDetailResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      let mModeDetail = new ModeDetail();
      mModeDetail.mode = new mongoose.Types.ObjectId(data.mode);
      mModeDetail.device = new mongoose.Types.ObjectId(data.device);
      mModeDetail.save((err) =>{
        if(err) {
          console.log(err);
          socket.emit('InsertModeDetailResult', {'success' : false, 'message' : msg.error.occur})
        }else{
          console.log(true);
          socket.emit('InsertModeDetailResult', {'success': true});
        }
      });
    }
  });
}

ModeDetail.mUpdate = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('UpdateModeDetailResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('UpdateModeDetailResult', {'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          socket.emit('UpdateModeDetailResult', {'success': true});
        }
      });
    }
  });
};

ModeDetail.mDelete = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('DeleteModeDetailResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.remove({'_id' : new ObjectId(data._id)}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          socket.emit('DeleteModeDetailResult', {'success': false, 'message': msg.error.occur});
        } else {
          socket.emit('DeleteModeDetailResult', {'success': true});
        }
      });
    }
  });
};
/**
Lấy về tất cả các ModeDetail
*/

ModeDetail.getAllModeDetail = (token, socket) => {
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('AllModeDetailResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.find().
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('AllModeDetailResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('AllModeDetailResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
// ModeDetail.getAllModeDetail().then(data =>console.log(JSON.stringify(data)), err =>console.log(err));
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
ModeDetail.getByPage = (token, socket) =>{
  jwt.verify(token, config.secret_key, function(error, data) {
    if (error) {
      socket.emit('GetModeDetailPageResult', {'success': false, 'message': msg.error.occur});
    } else if (!error && data) {
      ModeDetail.find().
      skip((data.page-1) * data.quantity).
      limit(data.quantity).
      sort({id : 1, name : 1, type : 1, price : -1}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          socket.emit('GetModeDetailPageResult', {'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(data2, config.secret_key, {});
          socket.emit('GetModeDetailPageResult', {'success': true, 'token': token2});
        }
      });
    }
  });
}
module.exports = exports = ModeDetail;
