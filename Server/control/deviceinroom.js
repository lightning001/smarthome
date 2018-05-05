var DeviceInRoom = require('../model/device_in_room');
/**
Tìm kiếm dựa vào _id của deviceInRoom (kiểu ObjectId)
*/
DeviceInRoom.findBy_ID = (_ID) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.findById(new mongoose.Types.ObjectId(_ID), (error, data) => {
      if (error) {
        return reject(new Error('Cannot get data!' + '\n' + error));
      } else {
        return resolve(data);
      }
    });
  });
};

DeviceInRoom.getDeviceInRoom = (roomID) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find({'room': new mongoose.Types.ObjectId(roomID)})
      .populate('device')
      .exec((err, data) => {
        if (err) {
          return reject(new Error(err));
        }
        return resolve(data);
      });
  });
}

DeviceInRoom.unused = (userID) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find({
        'user': new mongoose.Types.ObjectId(userID)
      })
      .or([{
        'room': null
      }, {
        'room': {
          $exists: false
        }
      }])
      .populate('device')
      .exec((err, data) => {
        if (err) {
          return reject(new Error(err));
        }
        return resolve(data);
      });
  });
}

DeviceInRoom.search = (data) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find({
        'device_name': {
          $regex: data.device_name
        },
        'room': new mongoose.Types.ObjectId(data.room),
        'user': new mongoose.Types.ObjectId(data.user)
      })
      .exec((err, data) => {
        if (err) return reject(new Error('Cannot get data!' + '\n' + err.toString()));
        return resolve(data);
      });
  });
}

DeviceInRoom.findByUser = (userID) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find({
        'user': new mongoose.Types.ObjectId(userID)
      })
      .exec((error, data) => {
        if (error) {
          return reject(new Error('Cannot get data!' + '\n' + err));
        } else {
          return resolve(data);
        }
      });
  });
}

DeviceInRoom.mInsert = (data) => {
  return new Promise((resolve, reject) => {

    let mDeviceInRoom = new DeviceInRoom();
    mDeviceInRoom.device = new mongoose.Types.ObjectId(data.device);
    mDeviceInRoom.room = new mongoose.Types.ObjectId(data.room);
    mDeviceInRoom.user = new mongoose.Types.ObjectId(data.user);
    mDeviceInRoom.device_name = data.device_name;
    mDeviceInRoom.status = data.status;

    mDeviceInRoom.save((err) => {
      if (err) return reject(false);
      return resolve(true);
    });
  });
};

/**
@param mDeviceInRoom:
*/
DeviceInRoom.mUpdate = (data) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.update({
        '_id': data._id
      }, {
        $set: data
      })
      .exec((err, data) => {
        if (err) return reject(false);
        return resolve(true);
      });
  });
};

/**
@param deviceInRoom_ID: mã _id của thiết bị
@objective : thực hiện xóa 1 DeviceInRoom
*/
DeviceInRoom.mDelete = (_ID) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.remove({
      _id: new mongoose.Types.ObjectId(_ID)
    }, (err) => {
      if (err) return reject(false);
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các DeviceInRoom
*/

DeviceInRoom.getAllDeviceInRoom = () => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find((err, data) => {
      if (err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
DeviceInRoom.getByPage = (quantity, page) => {
  return new Promise((resolve, reject) => {
    DeviceInRoom.find()
      .skip((page - 1) * quantity)
      .limit(quantity)
      .sort({
        name: 1,
        type: 1,
        price: -1
      })
      .exec((err, data) => {
        if (err) return reject(new Error('Cannot get data. Error: \n' + err));
        return resolve(data);
      });
  });
}

module.exports = exports = DeviceInRoom;
