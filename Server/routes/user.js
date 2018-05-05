var User = require('../model/user');
require('./model/Mode');
require('./model/Room');

User.login = (email, password) => {
  return new Promise((resolve, reject) => {
    //xu ly ma hoa o day
    User.findOne()
      .where('email').equals(email)
      // .where('password').equals(password)
      .where('status').equals(true)
      .populate('listMode')
      .populate('listRoom')
      .exec((err, data) => {
        if (err) return reject(new Error('Error! An error occurred. Please try again later'));
        if (!data || typeof data == undefined) return reject('The account does not exists');
        if (data) {
          if (data.password != password)
            return reject('Email or password is incorrected');
        }
        return resolve(data);
      });
  });
}

/**
Tìm kiếm dựa vào _id của user (kiểu ObjectId) truyền vào string
*/
User.findBy_ID = (userID) => {
  return new Promise((resolve, reject) => {
    User.findById(new mongoose.Types.ObjectId(userID), (error, data) => {
      if (error) {
        return reject(new Error('Cannot get data!' + '\n' + err));
      } else {
        return resolve(data);
      }
    });
  });
}

// User.findBy_ID('5ad95080734d1d2de1f48f1d').then(data =>console.log('My data: ' + JSON.stringify(data)), err =>console.log(err.toString()));

User.findByName = (name) => {
  return new Promise((resolve, reject) => {
    User.find({
      'name': {
        $regex: name
      }
    }, (err, data) => {
      if (err) {
        return reject(new Error('Cannot get data!' + '\n' + err));
      } else {
        return resolve(data);
      }
    });
  });
}

User.findByEmail = (mEmail) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      'email': mEmail
    }, (err, data) => {
      if (err) return reject(new Error('Error! An error occurred. Please try again later'));
      if (!data || data.length == 0) return reject('Can\'t find email: ' + mEmail);
      else return resolve(data);
    });
  });
}



User.mInsert = (data) => {
  return new Promise((resolve, reject) => {
    User.findByEmail(email).then(
      (data) => { // neu da co email nay thi tra ve loi da ton tai
        return reject(new Error('Email is already exists'));
      }, (error) => {
        let mUser = new User();
        mUser.email = data.email;
        mUser.password = data.password;
        mUser.name = data.name;
        mUser.save((err) => {
          if (err) {
            return reject(new Error('Error! An error occurred. Please try again later'));
          } else {
            return resolve(true);
          }
        });
      });
  });
}

User.mInsert = (data) => {
  return new Promise((resolve, reject) => {
    User.findByEmail(data.email).then(
      (data2) => { // neu da co email nay thi tra ve loi da ton tai
        return reject(new Error('Email is already exists'));
      },
      (error) => {
        let mUser = new User();
        mUser.email = data.email;
        mUser.password = data.password;
        mUser.name = data.name;
        mUser.street = data.street;
        mUser.distric = data.distric;
        mUser.city = data.city;
        mUser.postcode = data.postcode;
        mUser.phonenumber = data.phonenumber;
        mUser.homephone = data.homephone;
        mUser.dob = data.dob;
        mUser.type = data.type;
        mUser.status = data.status;
        mUser.startdateregister = data.startdateregister;
        mUser.img = data.img;
        mUser.save((err) => {
          if (err) return reject(false);
          return resolve(true);
        });
      });
  });
}

/**
@param mUser: 1 thiết bị đầy đủ thuộc tính
*/
User.mUpdate = (mUser) => {
  return new Promise((resolve, reject) => {
    User.update({
        '_id': new mongoose.Types.ObjectId(mUser._id)
      }, {
        $set: mUser
      },
      (err, data) => {
        if (err) {
          return reject(false);
        } else {
          return resolve(true);
        }
      });
  });
};

/**
@param user_ID: mã _id của thiết bị (kiểu ObjectId)
@objective : thực hiện xóa 1 user
*/
User.mDelete = (user_ID) => {
  return new Promise((resolve, reject) => {
    User.remove({
      '_id': new mongoose.Type.ObjectId(user_ID)
    }, (err) => {
      if (err) {
        return reject(false);
      } else {
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
    User.find((err, data) => {
      if (err) {
        return reject(new Error('Error! An error occurred. Please try again later'));
      } else {
        return resolve(data);
      }
    });
  });
}
/**
Lấy danh sách thiết bị theo số lượng và trang
(dùng cho phân trang)
*/
User.getByPage = (quantity, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .skip((page - 1) * quantity)
      .limit(quantity)
      .sort({
        name: 1,
        type: 1,
        price: -1
      })
      .exec((err, data) => {
        if (err) return reject(new Error('Error! An error occurred. Please try again later'));
        return resolve(data);
      });
  });
}

module.exports = exports = User;
