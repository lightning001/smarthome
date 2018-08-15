var DeviceInRoom = require('../model/device_in_room'),
	msg = require('../msg').en,
	config = require('../util/config'),
	jwt = require('jsonwebtoken'),
	mongoose = require('mongoose');
require('../model/device');
require('../model/room');
/**
 * Tìm kiếm dựa vào _id của deviceInRoom (kiểu ObjectId)
 */
DeviceInRoom.findBy_ID = (_id) => {
	return new Promise((resolve, reject) => {
		DeviceInRoom.findById(new mongoose.Types.ObjectId(_id)).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,'result': data2});
			}
		});
	});
};

DeviceInRoom.getDeviceInRoom = (room) => {
	return new Promise((resolve, reject) => {
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
}

DeviceInRoom.unused = (user) => {
	return new Promise((resolve, reject) => {
		DeviceInRoom.find({'user': new mongoose.Types.ObjectId(user)}).
		or([{'room': null}, {'room': {$exists: false}}]).
		populate('device').
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				if(!data2){
					data2 = [];
				}
				return resolve({'success': true,'result': data2});
			}
		});
	});
}
/**
_id : objectid: _id cua deviceinroom
*/
DeviceInRoom.onoff = (_id)=>{
	return new Promise((resolve, reject) => {
		DeviceInRoom.findById(new mongoose.Types.ObjectId(_id)).
		exec((error2, findresult)=>{
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			}else{
				DeviceInRoom.update({'_id': mongoose.Types.ObjectId(_id)}, {$set: {'status': !findresult.status}}).
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
}

DeviceInRoom.findByUser = (user) => {
	return new Promise((resolve, reject) => {
		DeviceInRoom.find({'user': new mongoose.Types.ObjectId(user)}).
		populate({path: 'room', select : {room_name : 1, id : -1}}).
		populate({path : 'device', match : {'type' :1}}).sort({'room' : 1, 'device' : 1}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,'result': data2});
			}else if(!error2 && !data2){
				return resolve({'success': true,'result': []});
			}
		});
	});
}

DeviceInRoom.mInsert = (user, data) => {
	return new Promise((resolve, reject) => {
		let mDeviceInRoom = new DeviceInRoom();
		mDeviceInRoom.device = new mongoose.Types.ObjectId(data.device);
		if (data.room != null)mDeviceInRoom.room = new mongoose.Types.ObjectId(data.room);
		mDeviceInRoom.user = new mongoose.Types.ObjectId(user);
		mDeviceInRoom.device_name = data.device_name;
		if (data.status != null) mDeviceInRoom.status = data.status;
		mDeviceInRoom.save((err, result) => {
			if (err) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true, 'id' : user, 'result' : result});
			}
		});
	});
};

/**
 * @param mDeviceInRoom:
 */
DeviceInRoom.mUpdate = (user, data) => {
	return new Promise((resolve, reject) => {
		DeviceInRoom.update({'_id': new mongoose.Types.ObjectId(data._id)}, {$set: data}).
		exec((error2, result) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				if(data.device){
					DeviceInRoom.findOne({'_id' : new mongoose.Types.ObjectId(data._id)}).
					populate('device').
					exec((e, find)=>{
						if(e) throw e;
						else{
							data.device.img = find.device.img;
							return resolve({'success': true, 'id' : user, 'result' : data});
						}
					});
				}else{
					return resolve({'success': true, 'id' : user, 'result' : data});
				}
			}
		});
	});
};

DeviceInRoom.setRoom = (arrdata, roomId) => {
	arrdata.forEach((device) => {
		DeviceInRoom.update({'_id': new mongoose.Types.ObjectId(device)}, {$set: {'room': new mongoose.Types.ObjectId(roomId)}}).exec();
	});
}


DeviceInRoom.unsetRoom = async (roomId) => {
	await DeviceInRoom.update({'room': new mongoose.Types.ObjectId(roomId)}, {$unset: {'room': 1}}, {multi : true}).exec();
}

DeviceInRoom.unsetRoomDevice = (_id) => {
	return new Promise((resolve, reject)=>{
		DeviceInRoom.update({'_id' : new mongoose.Types.ObjectId(_id)}, {$unset: {'room': 1}}).
		exec((error)=>{
			if(error){
				return reject({'success': false,'message': msg.error.occur});
			}else{
				return resolve({'success': true, 'result' : {'_id' : _id}});
			}
		});

	})
}

/**
 * @param deviceInRoom_ID:
 *            mã _id của thiết bị
 * @objective : thực hiện xóa 1 DeviceInRoom
 */
DeviceInRoom.mDelete = (_id) => {
	return new Promise((resolve, reject) => {
		DeviceInRoom.remove({'_id': new mongoose.Types.ObjectId(_id)}).
		exec((error2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				let ModeDetail = require('../model/mode_detail');
				ModeDetail.deleteMany({'device' :  new mongoose.Types.ObjectId(_id)});
				return resolve({'success': true, 'result' : _id});
			}
		});
	});
}

DeviceInRoom.mDeleteByRoom = (user, room_id) => {
	return new Promise((resolve, reject) => {
		DeviceInRoom.deleteMany({'room': new mongoose.Types.ObjectId(room_id)}).
		exec((error2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				let ModeDetail = require('../model/mode_detail');
				ModeDetail.deleteMany({'device' :  new mongoose.Types.ObjectId(_id)});
				return resolve({'success': true, 'id' : user, 'result' : room_id});
			}
		});
	});
}


/**
 * Lấy về tất cả các DeviceInRoom
 */

DeviceInRoom.getAllDeviceInRoom = () => {
	return new Promise((resolve, reject) => {
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
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
DeviceInRoom.getByPage = (data) => {
	return new Promise((resolve, reject) => {
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
}

module.exports = exports = DeviceInRoom;
