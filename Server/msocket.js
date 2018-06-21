var mDevice = require('./control/device'),
	mUser = require('./control/user'),
	mMode = require('./control/mode'),
	mRoom = require('./control/room'),
	mModeDetail = require('./control/modedetail'),
	mDeviceInRoom = require('./control/deviceinroom'),
	config = require('./util/config'),
	jwt = require('jsonwebtoken');


module.exports = exports = function (io) {

	var authenSocket = async (socket)=>{
		let token = socket.usertoken;
		console.log('Authen');
		if(token == undefined){
			if(socket.handshake!=null){
				if(socket.handshake.token){
					token = socket.handshake.token;
					console.log('Handshake token: '+token);
				}else if(socket.handshake.query){
					token = socket.handshake.query.token;
				}
			}else if(socket.request){
				if(socket.request.token){
					token = socket.request.token;
				}else if(socket.request.usertoken){
					token = socket.request.usertoken;
				}
			}
		}
		if(token!=undefined){
			mUser.byToken(token).then(async (decode)=>{
				socket.user = {_id : decode.result._id, email : decode.result.email, status: decode.result.status};
				socket.usertoken = token;
				await socket.join(decode._id);
				return true;
			}).catch(e=>{
				return false;
			});
		}else{
			return false;
		}
	}

	io.sockets.on('connection', (socket) => {
		console.log('connected: '+socket.id);
//		console.log(socket.client.conn);
		socket.on('disconnect', () => {
			console.log(socket.id + 'disconnect');
		});

		/** ================= USER ============================================ */
		socket.on('client_send_login', (data) => {
			console.log('client_send_login');
			mUser.login(data.email, data.password).then(async (result) => {
				await socket.join(result.id +'');
				socket.usertoken = result.token;
				socket.user = {'_id' : result.id};
				socket.authentication = true;
				await socket.emit('server_send_login', {'token' : result.token});
				await socket.to(socket.user._id).emit('server_send_other_login', 'Someone login at other device');
			}).catch((err) => {
				console.log(JSON.stringify(err));
				socket.emit('server_send_login', err);
			});
		});

		socket.on('join-room', function(token){
			if(authenSocket(socket))
			jwt.verify(token, config.secret_key, (err, data) => {
				if(!err && data){
					socket.join(data._id);
					console.log('join room'+data._id);
				}
			});
		});

		socket.on('client_send_data_user', (token) => {
			console.log('client_send_data_user');
			mUser.byToken(token).then((data) => {
				socket.join(data.result._id);
				socket.user = {'_id' : data.result._id};
				socket.usertoken = token;
				socket.authentication = true;
				socket.emit('server_send_data_user', data);
				socket.to(data._id).emit('server_send_other_login', 'Someone login at other device');
			}).catch((e) => {
				console.log(JSON.stringify(e));
				socket.emit('server_send_data_user', e);
			});
		});

		socket.on('client_send_active_user', (data) => {
			console.log('confirm email');
			mUser.confirmRegister(data.token, data.data).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_active_user', result);
			}).catch((e)=> {
				console.log(JSON.stringify(e));
				socket.emit('server_send_active_user', e);
			});
		});

		socket.on('client_send_register', (data) => {
			console.log('client send register');
			mUser.mInsert(data).then((result) => {
				console.log(JSON.stringify(result));
				socket.emit('server_send_register', result);
			}).catch((e)=> {
				console.log(e);
				socket.emit('server_send_register', e);
			})
		});

		socket.on('client_send_update_user', (data) => {
			console.log('client send update user');
			if(authenSocket(socket)){
				mUser.mUpdate(socket.user._id, data.data).then((result) => {
					console.log('result: '+JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_update_user', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_update_user', e);
				});
			}else{
				socket.emit('server_send_update_user',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_delete_user', (data) => {
			console.log('client send delete user');
			if(data.admin == true){
				mUser.mDelete(data._id).then((result) => {
					console.log(JSON.stringify(result));
					
					
					io.sockets.in(socket.user._id).emit('server_send_delete_user', result);
				}).catch((e)=> {
					console.log(e);
					socket.emit('server_send_delete_user', e);
				});
			}
		});

		/** ================= MODE ================================================ */


		socket.on('client_send_create_mode', (data) => {
			console.log('client send create mode');
			if(authenSocket(socket)){
			mMode.mInsert(socket.user._id, data.data).then((result) => {
				io.sockets.in(socket.user._id).emit('server_send_create_mode', result);
			}).catch((e)=> {
				console.log(JSON.stringify(e));
				socket.emit('server_send_create_mode', e);
			});
			}else{
				socket.emit('server_send_create_mode',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_update_mode', (data) => {
			if(authenSocket(socket)){
				console.log('client send update mode')
				mMode.mUpdate(socket.user._id, data.data).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_update_mode', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_update_mode', e);
				});
			}else{
				socket.emit('server_send_update_mode',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_delete_mode', (data) => {
			if(authenSocket(socket)){
				console.log('client send delete mode');
				mMode.mDelete(socket.user._id, data._id).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_delete_mode', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_delete_mode', e);
				});
			}else{
				socket.emit('server_send_delete_mode',  {'success': false, message : 'Must be login before'});
			}
		});



		/** ================= ROOM ================================================ */
		socket.on('client_send_room', (data)=>{
			if(authenSocket(socket)){
				console.log('client_send_room');
				console.log('Room: '+JSON.stringify(data));
				mRoom.getFullDetailUser(socket.user._id, data._id).then(result=>{
					console.log(JSON.stringify(result));
					socket.emit('server_send_room', result);
				}).catch(e=>{
					console.log(JSON.stringify(e));
					socket.emit('server_send_room', e);
				});
			}else{
				socket.emit('server_send_room',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_create_room', (data) => {
			if(authenSocket(socket)){
				console.log('client_send_create_room ');
				mRoom.mInsert(socket.user._id, data.data).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_create_room', result);
				}).catch((e)=> {
					console.log('Error create room: '+JSON.stringify(e));
					socket.emit('server_send_create_room', e);
				});
			}else{
				socket.emit('server_send_create_room',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_update_room', (data) => {
			if(authenSocket(socket)){
				console.log('client_send_update_room '+JSON.stringify(data));
				mRoom.mUpdate(socket.user._id, data.data).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_update_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_update_room', e);
				});
			}else{
				socket.emit('server_send_update_room',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_delete_room', (data) => {
			if(authenSocket(socket)){
				console.log('client_send_delete_room: '+JSON.stringify(data));
				mRoom.mDelete(socket.user._id, data.data._id, data.data.isDeleteDevice).then((result) => {
					io.sockets.in(socket.user._id).emit('server_send_delete_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_delete_room', e);
				});
			}else{
				socket.emit('server_send_delete_room',  {'success': false, message : 'Must be login before'});
			}
		});


		/**
		 * ================= DEVICE IN ROOM
		 * ================================================
		 */
		
		
		socket.on('client_send_all_device', (data) => {
			console.log('client request device');
			if(authenSocket(socket)){
				mDeviceInRoom.findByUser(socket.user._id).then((result) => {
					socket.emit('server_send_all_device', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_all_device', e);
				});
			}else{
				socket.emit('server_send_all_device',  {'success': false, message : 'Must be login before'});
			}
		});
		
		socket.on('client_send_device_in_room', (data) => {
			if(authenSocket(socket)){
				console.log('client_send_device_in_room');
				mDeviceInRoom.getDeviceInRoom(data.id_room).then((result) => {
					console.log(JSON.stringify(result));
					socket.emit('server_send_device_in_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_device_in_room', e);
				});
			}else{
				socket.emit('server_send_device_in_room',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_device_no_room', (data) => {
			if(authenSocket(socket)){
				console.log('client request device no room.')
				mDeviceInRoom.unused(socket.user._id).then((result) => {
					console.log(JSON.stringify(result));
					socket.emit('server_send_device_no_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_device_no_room', e);
				});
			}else{
				socket.emit('server_send_device_no_room',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_create_device_in_room', (data) => {
			if(authenSocket(socket)){
				console.log(socket.id + ' request create device in room.');
				console.log('User create device: '+ JSON.stringify(socket.user));
				mDeviceInRoom.mInsert(socket.user._id, data.data).then((result) => {
					console.log('create device in room result: '+result);
					io.sockets.in(socket.user._id).emit('server_send_create_device_in_room', result);
				}).catch((e)=> {
					console.log('create device in room err: '+e)
					socket.emit('server_send_create_device_in_room', e);
				});
			}else{
				socket.emit('server_send_create_device_in_room', {'success': false, message :  {'success': false, message : 'Must be login before'}});
			}
		});
		
		socket.on('control-device', (data)=>{
			if(authenSocket(socket)){
				console.log('client send control device');
				mDeviceInRoom.onoff(data._id).then(result=>{
					io.sockets.in(socket.user._id).emit('server_send_control_device', {'success' : true, result : {'device' : data._id, status : result.status}});
				}).catch(e=>{
					io.sockets.in(socket.user._id).emit('server_send_control_device', {'success' : false, message : e.message});
				});
			}
			else{
				socket.emit('error',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_update_device_in_room', (data) => {
			if(authenSocket(socket)){
				console.log('client send update device in room');
				mDeviceInRoom.mUpdate(socket.user._id, data.data).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_update_device_in_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_update_device_in_room', e);
				});
			}else{
				socket.emit('server_send_update_device_in_room',  {'success': false, message : 'Must be login before'});
			}
		});

		socket.on('client_send_delete_device_in_room', (data) => {
			if(authenSocket(socket)){
				console.log('client send delete device in room');
				mDeviceInRoom.mDelete(data._id).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_delete_device_in_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(result));
					socket.emit('server_send_delete_device_in_room', e);
				});
			}else{
				socket.emit('server_send_delete_device_in_room',  {'success': false, message : 'Must be login before'});
			}
		});
		
		socket.on('client_send_remove_device_from_room', (data) => {
			if(authenSocket(socket)){
				console.log('client send remove device in room');
				mDeviceInRoom.unsetRoomDevice(data._id).then((result) => {
					console.log(JSON.stringify(result));
					io.sockets.in(socket.user._id).emit('server_send_remove_device_from_room', result);
				}).catch((e)=> {
					console.log(JSON.stringify(result));
					socket.emit('server_send_remove_device_from_room', e);
				});
			}else{
				socket.emit('server_send_remove_device_from_room',  {'success': false, message : 'Must be login before'});
			}
		});

		/**---------------  DEVICE  --------------------------------------------------------------*/

		socket.on('client_send_list_device', () => {
			if(authenSocket(socket)){
				console.log(socket.id+' require list device');
				mDevice.getAllDevice().then((result) => {
					console.log(JSON.stringify(result));
					socket.emit('server_send_list_device', result);
				}).catch((e)=> {
					console.log(JSON.stringify(e));
					socket.emit('server_send_list_device', e);
				});
			}else{
				socket.emit('server_send_list_device',  {'success': false, message : 'Must be login before'});
			}
		});
	});

}
