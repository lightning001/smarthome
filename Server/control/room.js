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
Room.getAllDeviceUser = (token, id_user) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else if (data) {
				Room.find({
					'id_user': id_user
				}).
				exec((error2, data2) => {
					if (error2) {
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else {
						return resolve({
							'success': true,
							'result': data2
						});
					}
				});
			}
		});
	});
}

Room.getUser = function (token, _id) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				Room.find({
					'_id': _id
				}).
				populate('id_user').
				exec((error2, data2) => {
					if (error2) {
						console.log(error2);
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else {
						return resolve({
							'success': true,
							'result': data2
						});
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			Room.findById(new mongoose.Types.ObjectId(_id)).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else {
					console.log(data2);
					return resolve({
						'success': true,
						'result': data2
					});
				}
			});
		});
	});
}

Room.findByName = (token, name, socket) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				Room.find({
					'room_name': {
						$regex: name
					},
					'id_user': new mongoose.Types.ObjectId(data.id_user)
				}).
				exec((error2, data2) => {
					if (error2) {
						console.log(error2);
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else {
						return resolve({
							'success': true,
							'result': data2
						});
					}
				});
			}
		});
	});
}

Room.findByUser = (token, id_user) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			Room.find({
				'id_user': new mongoose.Types.ObjectId(id_user)
			}).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else {
					console.log(data2);
					return resolve({
						'success': true,
						'result': data2
					});
				}
			});
		});
	});
}

getImageName = (id) => {
	return id + new Date().getTime() + '.png';
}

upfile = (img) => {
	if (img == null)
		return null;
	if (typeof img == 'string' && data.img != '')
		return img;
	else if (img == '') {
		return null;
	} else if (typeof img == Buffer | Byte) {
		let fileName = getImageName(randomstring.generate(20));
		fs.writeFile('public/' + config.upload_path + fileName, data.img);
		return config.host + config.upload_path + fileName;
	}
}

Room.mInsert = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			let mRoom = new Room();
			mRoom.id_user = new mongoose.Types.ObjectId(data.user);
			mRoom.room_name = data.room_name;
			//		if (typeof data.img == 'string' && data.img != '')
			//			mRoom.img = data.img;
			//		else if(data.img instanceof Buffer){
			//			let fileName = getImageName(randomstring.generate(20));
			//			fs.writeFile('public/'+config.upload_path + fileName, data.img);
			//			mRoom.img = config.host +config.upload_path+ fileName;
			//		}
			mRoom.img = upfile(data.img);
			mRoom.save((error2, docs) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else {
					if (data.device != null) {
						DeviceInRoom.setRoom(token, data.device, docs._id).then(
							(data) => console.log('update room for: ' + data.device),
							(err) => console.error('Error update room for device user'));
					}
					return resolve({
						'success': true
					});
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				data.img = upfile(img);
				console.log('Update: '+JSON.stringify(data));
				Room.update({
					'_id': new mongoose.Types.ObjectId(data._id),
					'id_user' : new mongoose.Types.ObjectId(decode._id)
				}, {
					$set: data
				}).
				exec((error2) => {
					if (error2) {
						console.log(error2);
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else {
						console.log(true);
						return resolve({
							'success': true
						});
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
Room.mDelete = (token, _id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			Room.remove({
				'_id': new mongoose.Types.ObjectId(_id)
			}).
			exec((error2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else {
					console.log(true);
					let mDeviceInRoom = require('../control/DeviceInRoom');
					mDeviceInRoom.update({
						'room': new mongoose.Types.ObjectId(_id)
					}, {
						$set: {
							'room': null
						}
					}, {
						multi: true
					}).
					exec((err) => {
						if (err) {
							console.log(err);
						}
					});
					return resolve({
						'success': true
					});
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			Room.find().exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else {
					console.log(data2);
					return resolve({
						'success': true,
						'result': data2
					});
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			Room.find({}).
			skip((data.page - 1) * data.quantity).
			limit(data.quantity).
			sort({
				id_user: 1,
				room_name: 1
			}).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else {
					console.log(data2);
					return resolve({
						'success': true,
						'result': data2
					});
				}
			});
		});
	});
}

module.exports = exports = Room;
