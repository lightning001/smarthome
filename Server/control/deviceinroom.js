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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.findById(new mongoose.Types.ObjectId(_id)).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
					console.log(data2);
					return resolve({
						'success': true,
						'result': data2
					});
				}
			});
		});
	});
};

DeviceInRoom.getDeviceInRoom = (token, room) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.find({
				'room': new mongoose.Types.ObjectId(room)
			}).
			populate('device').
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
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

DeviceInRoom.unused = (token, user) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.find({
				'user': new mongoose.Types.ObjectId(user)
			}).
			or([{
				'room': null
			}, {
				'room': {
					$exists: false
				}
			}]).
			populate('device').
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
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
_id : objectid: _id cua deviceinroom
*/
DeviceInRoom.onoff = (token, _id)=>{
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				console.log('Error: '+error);
				return reject({'success': false,'message': msg.error.verify});
			}
			DeviceInRoom.findById(new mongoose.Types.ObjectId(_id)).
			exec((error2, findresult)=>{
				if (error2) {
					console.log('Error2: '+error2);
					return reject({'success': false,'message': msg.error.occur});
				}
				else{
					console.log('On/Off data find '+_id+': '+ findresult);
					DeviceInRoom.update({'_id': mongoose.Types.ObjectId(_id)}, {$set: {status: !findresult.status}}).
					exec((error3) => {
						if (error3) {
							console.log('Error3: '+error3);
							return reject({
								'success': false,
								'message': msg.error.occur
							});
						} else {
							console.log(true);
							return resolve({'success': true, status: !findresult.status});
						}
					});
					
				}
			});
		});
	});
}

DeviceInRoom.search = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.find({
				'device_name': {
					$regex: data.device_name
				},
				'room': new mongoose.Types.ObjectId(data.room),
				'user': new mongoose.Types.ObjectId(data.user)
			}).populate('device').
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
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

DeviceInRoom.findByUser = (token, user) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.find({
				'user': new mongoose.Types.ObjectId(user)
			}).populate('device').
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
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

DeviceInRoom.mInsert = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			let mDeviceInRoom = new DeviceInRoom();
			mDeviceInRoom.device = new mongoose.Types.ObjectId(data.device);
			if (data.room != null)
				mDeviceInRoom.room = new mongoose.Types.ObjectId(data.room);
			mDeviceInRoom.user = new mongoose.Types.ObjectId(data.user);
			mDeviceInRoom.device_name = data.device_name;
			if (data.status != null)
				mDeviceInRoom.status = data.status;
			mDeviceInRoom.save((err) => {
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.update({
				'_id': data._id
			}, {
				$set: data
			}, {
				multi: true
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
		});
	});
};

DeviceInRoom.setRoom = (token, arrdata, roomId) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			arrdata.forEach((device) => {
				DeviceInRoom.update({
					'_id': new mongoose.Types.ObjectId(device)
				}, {
					$set: {
						'room': roomId
					}
				}).
				exec((err) => {
					if (err) {
						console.log(err);
					}
				});
			});
			return resolve({
				'success': true
			});
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.remove({
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
					return resolve({
						'success': true
					});
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
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.find().
			populate('device').
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
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
DeviceInRoom.getByPage = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			DeviceInRoom.find().
			populate('device').
			skip((data.page - 1) * data.quantity).
			limit(data.quantity).
			sort({
				name: 1,
				type: 1,
				price: -1
			}).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && data2) {
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

module.exports = exports = DeviceInRoom;
