var mDevice = require('./control/device'),
	mUser = require('./control/user'),
	mMode = require('./control/mode'),
	mRoom = require('./control/room'),
	mModeDetail = require('./control/modedetail'),
	mDeviceInRoom = require('./control/deviceinroom'),
	config = require('./util/config'),
	jwt = require('jsonwebtoken');

module.exports = exports = function (io) {
	
	var authen = function(socket, next){
		let handshakeData = socket.request;
		var parsedCookie = cookie.parse(handshakeData.headers.cookie);
		var sid = connect.utils.parseSignedCookie(parsedCookie['connect.sid'], config.secret);

		if(socket.request.session.usertoken==null){
			socket.emit('error', 'Sorry, We cannot verify');
		}else{
			jwt.verify(socket.request.session.usertoken, config.secret_key, function(data){
				next(data);
			});
		}
	}
	
	
	io.sockets.on('connection', (socket) => {
		socket.on('disconnect', () => {
			console.log(socket.id + ' disconnect');
		});
		console.log('connected: ' + socket.id);
		/** ================= USER ============================================ */
		socket.on('client_send_login', (data) => {
			mUser.login(data.email, data.password).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				socket.join(id);
				socket.request.session.usertoken = result.token;
				socket.request.session.authentication = true;
				socket.emit('server_send_login', {'token' : data.token});
				socket.to(id).emit('server_send_other_login', 'Someone login at other device');
			}, (err) => {
				console.log(JSON.stringify(err));
				socket.emit('server_send_login', err);
			});
		});
		
		socket.on('join-room', function(token){
			mUser.byToken(token).then((data) => {
				socket.join(data);
			}, (e) => console.log(JSON.stringify(e)));
		});

		socket.on('client_send_data_user', (token) => {
			mUser.byToken(token).then((data) => {
				console.log(JSON.stringify(data));
				socket.emit('server_send_data_user', data);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_data_user', e);
			});
		});

		socket.on('client_send_active_user', (data) => {
			console.log('confirm email');
			mUser.confirmRegister(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_active_user', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_active_user', e);
			});
		});

		socket.on('client_send_register', (data) => {
			console.log('client send register')
			mUser.mInsert(data).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_register', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_register', e);
			})
		});

		socket.on('client_send_update_user', (data) => {
			console.log('client send update user')
			mUser.mUpdate(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_update_user', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_update_user', e);
			});
		});

		socket.on('client_send_delete_user', (data) => {
			console.log('client send delete user');
			mUser.mDelete(data.token, data._id).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_delete_user', result);
			}, (e) => {
				console.log(e);
				socket.emit('server_send_update_user', e);
			})
		});

		/** ================= MODE ================================================ */

		socket.on('client_send_device_in_mode', (data) => {
			console.log('client send device in mode');
			mModeDetail.getDetailMode(data.token, data.mode).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_device_in_mode', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_device_in_mode', e);
			})
		});

		socket.on('client_send_create_mode', (data) => {
			console.log('client send create mode');
			mMode.mInsert(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_create_mode', result);

			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_create_mode', e);
			})
		});

		socket.on('client_send_update_mode', (data) => {
			console.log('client send update mode')
			mMode.mUpdate(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_update_mode', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_update_mode', e);
			})
		});

		socket.on('client_send_delete_mode', (data) => {
			console.log('client send delete mode');
			mMode.mDelete(data.token, data._id).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.sockets.in(id).emit('server_send_delete_mode', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_delete_mode', e);
			})
		});



		/** ================= ROOM ================================================ */

		socket.on('client_send_create_room', (data) => {
			console.log('client_send_create_room '+JSON.stringify(data));
			mRoom.mInsert(data.token, data.data).then((result) => {
				console.log('create room: '+JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.sockets.in(id).emit('server_send_create_room', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_create_room', e);
			})
		});

		socket.on('client_send_update_room', (data) => {
			console.log('client_send_update_room '+JSON.stringify(data));
			mRoom.mUpdate(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_update_room', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_update_room', e);
			})

		});

		socket.on('client_send_delete_room', (data) => {
			console.log('client_send_delete_room: '+JSON.stringify(data));
			mRoom.mDelete(data.token, data.data._id, data.data.isDeleteDevice).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_delete_room', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_delete_room', e);
			});
		});


		/**
		 * ================= DEVICE IN ROOM
		 * ================================================
		 */
		socket.on('client_send_device_in_room', (data) => {
			console.log('client_send_device_in_room');
			mDeviceInRoom.getDeviceInRoom(data.token, data.id_room).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_device_in_room', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_device_in_room', e);
			});
		});

		socket.on('client_send_device_no_room', (data) => {
			console.log('client request device no room.')
			mDeviceInRoom.unused(data.token, data.user).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_device_no_room', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_device_no_room', e);
			})
		});

		socket.on('client_send_create_device_in_room', (data) => {
			console.log(socket.id + ' request create device in room.');
			mDeviceInRoom.mInsert(data.token, data.data).then((result) => {
				console.log('create device in room result: '+result);
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_create_device_in_room', result);
			}, (e) => {
				console.log('create device in room err: '+e)
				socket.emit('server_send_create_device_in_room', e);
			})
		});

		socket.on('client_send_update_device_in_room', (data) => {
			console.log('client send update device in room');
			mDeviceInRoom.mUpdate(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_update_device_in_room', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_update_device_in_room', e);
			})
		});

		socket.on('client_send_delete_device_in_room', (data) => {
			console.log('client send delete device in room');
			mDeviceInRoom.mDelete(data.token, data._id).then((result) => {
				console.log(JSON.stringify(result));
				let id = result.id;
				delete result.id;
				io.in(id).emit('server_send_delete_device_in_room', result);
			}, (e) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_delete_device_in_room', e);
			})
		});

		/**---------------  DEVICE  --------------------------------------------------------------*/

		socket.on('client_send_list_device', (token) => {
			console.log(socket.id+' require list device');
			mDevice.getAllDevice(token).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_list_device', result);
			}, (e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_list_device', e);
			});
		});
	});

}
