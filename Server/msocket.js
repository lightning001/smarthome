var mDevice = require('./control/Device'),
	mUser = require('./control/User'),
	mMode = require('./control/Mode'),
	mRoom = require('./control/Room'),
	mModeDetail = require('./control/ModeDetail'),
	mDeviceInRoom = require('./control/DeviceInRoom'),
	config = require('./util/config');

module.exports = exports = function (io) {
	io.sockets.on('connection', (socket) => {
		socket.on('disconnect', () => {
			console.log(socket.id + ' disconnect');
		});
		console.log('connected: ' + socket.id);
		/** ================= USER ============================================ */
		socket.on('client_send_login', (data) => {
			mUser.login(data.email, data.password).then((data) => {
				console.log(data);
				socket.emit('server_send_login', data);
			}, (err) => {
				console.log(JSON.stringify(err));
				socket.emit('server_send_login', err);
			});
		});

		socket.on('client_send_data_user', (token) => {
			console.log(token);
			mUser.byToken(token).then((data) => {
				socket.emit('server_send_data_user', data);
			}, (e) => {
				socket.emit('server_send_data_user', e);
			});
		});

		socket.on('active_account', (data) => {
			console.log('confirm email');
			mUser.confirmRegister(data).then((data) => {
				socket.emit('server_send_active_account', data);
			}, (e) => {
				socket.emit('server_send_active_account', e);
			});
		});

		socket.on('client_send_register', (data) => {
			mUser.mInsert(data).then((result) => {
				socket.emit('server_send_register', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_register', e);
			})
		});

		socket.on('client_send_update_user', (data) => {
			mUser.mUpdate(data.token, data.data).then((result) => {
				socket.emit('server_send_update_user', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_update_user', e);
			});
		});

		socket.on('client_send_delete_user', (data) => {
			mUser.mDelete(data.token, data._id).then((result) => {
				socket.emit('server_send_delete_user', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_update_user', e);
			})
		});

		/** ================= MODE ================================================ */

		socket.on('client_send_device_in_mode', (data) => {
			console.log('require data: ' + data);
			mModeDetail.getDetailMode(data.token, data.mode).then((result) => {
				socket.emit('server_send_device_in_mode', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_device_in_mode', e);
			})
		});

		socket.on('client_send_create_mode', (data) => {
			mMode.mInsert(data.token, data.data).then((result) => {
				socket.emit('server_send_create_mode', result);

			}, (e) => {
				socket.emit('server_send_create_mode', e);
			})
		});

		socket.on('client_send_update_mode', (data) => {
			mMode.mUpdate(data.token, data.data).then((result) => {
				socket.emit('server_send_update_mode', result);

			}, (e) => {
				socket.emit('server_send_update_mode', e);
			})
		});

		socket.on('client_send_delete_mode', (data) => {
			mMode.mDelete(data.token, data._id).then((result) => {
				socket.emit('server_send_delete_mode', result);
			}, (e) => {
				socket.emit('server_send_delete_mode', e);
			})
		});



		/** ================= ROOM ================================================ */

		socket.on('client_send_create_room', (data) => {
			console.log('client_send_create_room: '+JSON.stringify(data));
			mRoom.mInsert(data.token, data.data).then((result) => {
				console.log('create room: '+result)
				socket.emit('server_send_create_room', result);
			}, (e) => {
				console.log('create room faile: '+e)
				socket.emit('server_send_create_room', e);
			})
		});

		socket.on('client_send_update_room', (data) => {
			console.log('client_send_update_room: '+JSON.stringify(data));
			mRoom.mUpdate(data.token, data.data).then((result) => {
				socket.emit('server_send_update_room', result);
			}, (e) => {
				socket.emit('server_send_update_room', e);
			})

		});

		socket.on('client_send_delete_room', (data) => {
			mRoom.mDelete(data.token, data._id).then((result) => {
				socket.emit('server_send_delete_room', result);
			}, (e) => {
				socket.emit('server_send_delete_room', e);
			});
		});


		/**
		 * ================= DEVICE IN ROOM
		 * ================================================
		 */
		socket.on('client_send_device_in_room', (data) => {
			console.log('client_send_device_in_room: '+JSON.stringify(data));
			mDeviceInRoom.getDeviceInRoom(data.token, data.id_room).then((result) => {
				socket.emit('server_send_device_in_room', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_device_in_room', e);
			});
		});

		socket.on('client_send_device_no_room', (data) => {
			console.log('client request device no room. Data: ' + data)
			mDeviceInRoom.unused(data.token, data.user).then((result) => {
				console.log(result);
				socket.emit('server_send_device_no_room', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_device_no_room', e);
			})
		});

		socket.on('client_send_create_device_in_room', (data) => {
			console.log(socket.id + ' request create device in room. Data: '+JSON.stringify(data));
			mDeviceInRoom.mInsert(data.token, data.data).then((result) => {
				console.log('create device in room result: '+result);
				socket.emit('server_send_create_device_in_room', result);
			}, (e) => {
				console.log('create device in room err: '+e)
				socket.emit('server_send_create_device_in_room', e);
			})
		});

		socket.on('client_send_update_device_in_room', (data) => {
			mDeviceInRoom.mUpdate(data.token, data.data).then((result) => {
				socket.emit('server_send_update_device_in_room', result);
			}, (e) => {
				socket.emit('server_send_update_device_in_room', e);
			})
		});

		socket.on('client_send_delete_device', (data) => {
			mDeviceInRoom.mDelete(data.token, data._id).then((result) => {
				socket.emit('server_send_delete_device_in_room', result);
			}, (e) => {
				socket.emit('server_send_delete_device_in_room', e);
			})
		});

		/**---------------  DEVICE  --------------------------------------------------------------*/

		socket.on('client_send_list_device', (token) => {
			console.log(socket.id+' require list device');
			mDevice.getAllDevice(token).then((result) => {
				console.log(result);
				socket.emit('server_send_list_device', result);
			}, (e) => {
				socket.emit('server_send_list_device', e);
			});
		});
	});

}
