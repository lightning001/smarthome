var Room = require('../model/room');
var DeviceInRoom = require('../model/device_in_room');
const msg = require('../msg').en;
const config = require('../util/config');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
let randomstring = require('randomstring');
var fs = require('fs');

/**
 * server_send_all_device_user
 */
Room.getAllDeviceUser = function(token, id_user){
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify	});
			} else if (data) {
				Room.find({'id_user': id_user}).
				exec((error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else {
						return resolve({'success': true,'result': data2});
					}
				});
			}
		});
	});
}

Room.getFullDetail = function(token, _id){
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			} else {
				Room.findOne({'_id': new mongoose.Types.ObjectId(_id), 'id_user' : new mongoose.Types.ObjectId(decode._id)}).
				populate({path: 'listDevice', populate:{path: 'device', select: 'img'}}).
				exec((error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else {
						return resolve({'success': true,'result': data2});
					}
				});

			}
		});
	});
}

Room.getFullDetailUser = function(token){
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			} else {
				Room.find({'id_user' : new mongoose.Types.ObjectId(decode._id)}).
				populate({path: 'listDevice', populate:{path: 'device', select: 'img'}}).
				exec((error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else {
						return resolve({'success': true,'result': data2});
					}
				});

			}
		});
	});
}


Room.getUser = function (token, _id){
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			} else {
				Room.findOne({'_id': _id, 'id_user' : data._id}).
				populate('id_user').
				exec((error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else {
						return resolve({'success': true,'result': data2});
					}
				});

			}
		});
	});
}

Room.findBy_ID = (token, _id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			Room.findOne({'_id' : new mongoose.Types.ObjectId(_id), 'id_user' : decode._id}).
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}

Room.findByName = (token, name) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			} else {
				Room.find({'room_name': {$regex: name},'id_user': new mongoose.Types.ObjectId(data.id_user)}).
				exec((error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else {
						return resolve({'success': true,'result': data2});
					}
				});
			}
		});
	});
}

Room.findByUser = function(token, id_user){
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			Room.find({'id_user': new mongoose.Types.ObjectId(id_user)}).
			exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}

getImageName = (id) => {
	return id + new Date().getTime() + '.png';
}

Room.mInsert = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			let mRoom = new Room();
			mRoom.id_user = new mongoose.Types.ObjectId(decode._id);
			mRoom.room_name = data.room_name;
			if (typeof data.img == 'string' && data.img != '')	mRoom.img = config.host +config.upload_path + data.img;
			else if(data.img instanceof Buffer){
				let fileName = getImageName(randomstring.generate(20));
				fs.writeFile('public/'+config.upload_path + fileName, data.img);
				mRoom.img = config.host +config.upload_path+ fileName;
			}else if(data.img!=null && data.img==''){delete data[img];}
			mRoom.save((error2, docs) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					if (data.device != null) {DeviceInRoom.setRoom(token, data.device, docs._id);}
					return resolve({'success': true, 'id' : decode._id, 'result': docs});
				}
			});
		});
	});
}

/**
 * @param mRoom:
 *            1 thiết bị đầy đủ thuộc tính
 */
Room.mUpdate = (token, data) => {
	return new Promise((resolve, reject) => {
		console.log('data update: '+JSON.stringify(data));
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			} else {
				if (data.img != null && typeof data.img == 'string' && data.img != '') data.img = config.host +config.upload_path + data.img;
				else if(data.img!=null && data.img instanceof Buffer){
					let fileName = getImageName(randomstring.generate(20));
					fs.writeFile('public/'+config.upload_path + fileName, data.img);
					data.img = config.host +config.upload_path+ fileName;
				}else if(data.img!=null && data.img ==''){delete data[img];}
				Room.update({'_id': new mongoose.Types.ObjectId(data._id),'id_user' : new mongoose.Types.ObjectId(decode._id)}, {$set: data}).
				exec((error2, result) => {
					if (error2) {
						return reject({'success': false, 'message': msg.error.occur});
					} else {
						return resolve({'success': true, 'id' : decode._id, 'result' : result});
					}
				});
			}
		});
	});
};

/**
 * @param room_ID:
 *            mã _id của thiết bị (kiểu ObjectId)
 * @objective : thực hiện xóa 1 room
 */
Room.mDelete = (token, _id, isRemoveDevice) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			let query = {};
			if(decode.admin !=null && decode.admin != undefined){query = {'_id': new mongoose.Types.ObjectId(_id)};}
			else{query = {'_id': new mongoose.Types.ObjectId(_id), 'id_user' : new mongoose.Types.ObjectId(decode._id)};}
			Room.remove(query).exec((error2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					let mDeviceInRoom = require('../control/deviceinroom');
					if(isRemoveDevice ==0){
						mDeviceInRoom.update({'room': new mongoose.Types.ObjectId(_id)}, {$unset: {'room': 1}}, {multi: true}).exec();
						return resolve({'success': true});
					}else if(isRemoveDevice == 1){
						mDeviceInRoom.mDeleteByRoom(token, new mongoose.Types.ObjectId(_id));
						return resolve({'success': true, 'id' : decode._id, 'result' : _id});
					}
				}
			});
		});
	});
};
/**
 * Lấy về tất cả các Room
 */

Room.getAllRoom = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			Room.find().exec((error2, data2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
Room.getByPage = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({'success': false,'message': msg.error.verify});
			}
			Room.find({}).
			skip((data.page - 1) * data.quantity).
			limit(data.quantity).
			sort({id_user: 1,room_name: 1}).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({'success': false,'message': msg.error.occur});
				} else {
					console.log(data2);
					return resolve({'success': true,'result': data2});
				}
			});
		});
	});
}

module.exports = exports = Room;
