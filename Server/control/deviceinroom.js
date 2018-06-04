var DeviceInRoom = require('../model/device_in_room'),
	msg = require('../msg').en,
	config = require('../util/config'),
	jwt = require('jsonwebtoken'),
	mongoose = require('mongoose');
/**
 * Tìm kiếm dựa vào _id của deviceInRoom (kiểu ObjectId)
 */
DeviceInRoom.findBy_ID = (token, _id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.findById(new mongoose.Types.ObjectId(_id)).
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else if (!error2 && data2) {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
};

DeviceInRoom.getDeviceInRoom = (token, room) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.find({'room': new mongoose.Types.ObjectId(room)}).
			populate('device').
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else if (!error2 && data2) {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}

DeviceInRoom.unused = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.find({'user': new mongoose.Types.ObjectId(decode._id)}).
			or([{'room': null}, {'room': {$exists: false}}]).
			populate('device').
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else if (!error2 && data2) {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}
/**
_id : objectid: _id cua deviceinroom
*/
DeviceInRoom.onoff = (token, _id)=>{
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.findById(new mongoose.Types.ObjectId(_id)).
			exec((error2, findresult)=>{
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				}else{
					DeviceInRoom.update({'_id': mongoose.Types.ObjectId(_id)}, {$set: {status: !findresult.status}}).
					exec((error3) => {
						if (error3) {
							return reject({'success': false,'message': msg.error.occur});
						} else {
							return resolve({'success': true, status: !findresult.status});
						}
					});
					
				}
			});
		});
	});
}

DeviceInRoom.findByUser = (token, user) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.find({'user': new mongoose.Types.ObjectId(user)}).
			populate('device').sort('room').
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else if (!error2 && data2) {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}

DeviceInRoom.mInsert = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			let mDeviceInRoom = new DeviceInRoom();
			mDeviceInRoom.device = new mongoose.Types.ObjectId(data.device);
			if (data.room != null)mDeviceInRoom.room = new mongoose.Types.ObjectId(data.room);
			mDeviceInRoom.user = new mongoose.Types.ObjectId(data.user);
			mDeviceInRoom.device_name = data.device_name;
			if (data.status != null) mDeviceInRoom.status = data.status;
			mDeviceInRoom.save((err, result) => {
				if (err) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true, 'id' : decode._id, 'result' : result});
				}
			});

		});
	});
};

/**
 * @param mDeviceInRoom:
 */
DeviceInRoom.mUpdate = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.update({'_id': new mongoose.Types.ObjectId(data._id)}, {$set: data}, {multi: true}).
			exec((error2, result) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true, 'id' : decode._id, 'result' : result});
				}
			});
		});
	});
};

DeviceInRoom.setRoom = (token, arrdata, roomId) => {
	jwt.verify(token, config.secret_key, (error, decode) => {
		if (error) {
			return;
		}
		arrdata.forEach((device) => {
			DeviceInRoom.update({'_id': new mongoose.Types.ObjectId(device)}, {$set: {'room': roomId}}).exec();
		});
	});
}

/**
 * @param deviceInRoom_ID:
 *            mã _id của thiết bị
 * @objective : thực hiện xóa 1 DeviceInRoom
 */
DeviceInRoom.mDelete = (token, _id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.remove({'_id': new mongoose.Types.ObjectId(_id)}).
			exec((error2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true, 'id' : decode._id, 'result' : _id});
				}
			});
		});
	});
}

DeviceInRoom.mDeleteByRoom = (token, room_id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.deleteMany({'room': new mongoose.Types.ObjectId(room_id)}).
			exec((error2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true});
				}
			});
		});
	});
}


/**
 * Lấy về tất cả các DeviceInRoom
 */

DeviceInRoom.getAllDeviceInRoom = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.find().
			populate('device').
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else if (!error2 && data2) {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
DeviceInRoom.getByPage = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.find().
			populate('device').
			skip((data.page - 1) * data.quantity).
			limit(data.quantity).
			sort({name: 1,type: 1,price: -1}).
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else if (!error2 && data2) {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}

module.exports = exports = DeviceInRoom;
