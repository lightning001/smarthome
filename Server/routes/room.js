var Room = require('../model/room');

Room.getAllDeviceUser = (userID) => {
  return new Promise((resolve, reject) => {
    Room.aggregate([{
      $lookup: {
        from: 'DEVICEINROOM',
        localField: '_id',
        foreignField: 'room',
        as: 'listDevice'
      }
    }, {
      $match: {
        'listDevice': {
          $ne: []
        },
      }
    }]).exec((err, data) => {
      if (err) return reject(new Error(err));
      return resolve(data);
    });
  });
}

var getUser = function(id_user) {
  return new Promise((resolve, reject) => {
    Room.aggregate([{
      $lookup: {
        from: 'User', // join voi bang Mode
        localField: 'id_user', //truong join o bang Room
        foreignField: '_id', // truong join o bang User
        as: 'User'
      }
    }]).exec((err, data) => {
      if (err) return reject(new Error('Error' + err));
      return resolve(data);
    });
  });
}

/**
Tìm kiếm dựa vào _id của room (kiểu ObjectId)
*/
Room.findBy_ID = (roomID) => {
  return new Promise((resolve, reject) => {
    Room.findById(new mongoose.Types.ObjectId(roomID), (error, data) => {
      if (error) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

Room.findByName = (name, userID) => {
  return new Promise((resolve, reject) => {
    Room.find({
      'room_name': {
        $regex: name
      },
      'id_user': new mongoose.Types.ObjectId(userID)
    }, (err, data) => {
      if (err) {
        return reject(new Error('Cannot get data!' + '\n' + err));
      } else {
        return resolve(data);
      }
    });
  });
}

Room.findByUser = (id_user) => {
  return new Promise((resolve, reject) => {
    Room.find({
      'id_user': new mongoose.Types.ObjectId(id_user)
    }, (err, data) => {
      if (err) return reject(new Error('Cannot get data!' + '\n' + err));
      return resolve(data);
    });
  });
}

Room.mInsert = (data) => {
  return new Promise((resolve, reject) => {
    let mRoom = new Room();
    mRoom.id_user = new mongoose.Types.ObjectId(data.id_user);
    mRoom.room_name = data.room_name;
    mRoom.img = data.img;
    mRoom.save((err) => {
      if (err) return reject(false);
      return resolve(true);
    });
  });
}

/**
@param mRoom: 1 thiết bị đầy đủ thuộc tính
*/
Room.mUpdate = (data) => {
  return new Promise((resolve, reject) => {
    Room.update({
      '_id': new mongoose.Types.ObjectId(data._id)
    }, {
      $set: data
    }, (err, data) => {
      if (err) return reject(false);
      return resolve(true);
    });
  });
};

/**
@param room_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 room
*/
Room.mDelete = (room_ID) => {
  return new Promise((resolve, reject) => {
    Room.remove({
      '_id': new mongoose.Types.ObjectId(room_ID)
    }, (err) => {
      if (err) return reject(false);
      return resolve(true);
    });
  });
};
/**
Lấy về tất cả các Room
*/

Room.getAllRoom = () => {
  return new Promise((resolve, reject) => {
    Room.find((err, data) => {
      if (err) return reject(new Error('Cannot get data'));
      return resolve(data);
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
Room.getByPage = (quantity, page) => {
  return new Promise((resolve, reject) => {
    Room.find()
      .skip((page - 1) * quantity)
      .limit(quantity)
      .sort({
        id_user: 1,
        room_name: 1
      })
      .exec((err, data) => {
        if (err) return reject(new Error('Cannot get data. Error: \n' + err));
        return resolve(data);
      });
  });
}

module.exports = exports = Room;
