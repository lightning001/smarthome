var	config = require('../util/config'),
	mDate = require('../util/dateOperation'),
	msg = require('../msg').en,
//	db = config.database,
	Admin = require('../model/Admin'),
	mongoose = require('mongoose'),
	User = require('./user'),
	mUser = require('../model/user'),
	jwt = require('jsonwebtoken'),
	fs = require('fs');
Admin.roles = {
	view : {
		USER : 1,
		ADMIN : 2,
		DEVICE : 3,
		MODE : 4,
		ROOM : 5,
		DEVICEUSER : 6
	},
	insert : {
		USER : 7,
		ADMIN : 8,
		DEVICE : 9,
		MODE : 10,
		ROOM : 11,
		DEVICEUSER : 12
	},
	update : {
		USER : 13,
		ADMIN : 14,
		DEVICE : 15,
		MODE : 16,
		ROOM : 17,
		DEVICEUSER : 18
	},
	delete : {
        USER : 19,
		ADMIN : 20,
		DEVICE : 21,
		MODE : 22,
		ROOM : 23,
		DEVICEUSER : 24
    }
}
Admin.authen = (email, password, callback)=>{
	Admin.findOne().populate({path : 'user', match : {'email': email}}).
	exec((error, data) => {
		if (error) {
			console.log(error);
			return callback(error, null);
		}
		if (!data || typeof data === undefined) {
			return callback(msg.error.login_incorrect, null);
		}
		if (data && data.length !== 0) {
			if (data.user.password !== password) {
				return callback(msg.error.login_incorrect, null);
			} else {
				var token = jwt.sign(JSON.stringify({'_id' : data._id.toString(), 'email' : data.user.email, status: data.status, admin : data.user.admin, role : data.role}), config.admin_secret_key, {algorithm: 'HS256'});
				return callback(null, {'token': token, 'id' : data._id});
			}
		}
	});
}
getImageName = (id) => {
	return id + new Date().getTime() + '.jpg';
}
Admin.mInsert = (data, callback)=>{
	Admin.count({'email': data.email}, (error, findresult) => {
		if (error) {
			return callback({'success': false,'message': msg.error.occur}, null);
		} else if (!error && findresult === 0) {
			let newUser = new mUser(),
				newAdmin = new Admin();

			newUser.email = data.email;
			newUser.password = data.password;
			newUser.name = data.name;
			newUser.street = data.street;
			newUser.commune = data.commune;
			newUser.district = data.district;
			newUser.city = data.city;

			if (typeof data.postcode === 'string' && data.postcode !== '') {
				newUser.postcode = parseInt(data.postcode);
			} else {
				newUser.postcode = data.postcode;
			}
			newUser.phonenumber = data.phonenumber;
			newUser.homephone = data.homephone;
			newUser.dob = data.dob;
			newUser.admin = true,

			newAdmin.passport = data.passport;
			newAdmin.role = data.role;
			newAdmin.position = data.position;

			if (data.img !== null && data.img !== undefined) {
				if (typeof data.img == 'string' && data.img != '')
					newUser.img = config.host + config.upload_path +'profile/'+ data.img;
				else if(data.img instanceof Buffer){
					let fileName = getImageName(randomstring.generate(12));
					fs.writeFile('public/'+config.upload_path +'profile/' + fileName, data.img);
					newUser.img = config.host + config.upload_path +'profile/' + fileName;
				}else if(data.img==''){
					delete data[img];
				}
			}

			newUser.save((error2, result) => {
				if (error2) {
					return callback({'success': false,'message': msg.error.occur}, null);
				} else {
					let tmp = result.img +"";
					let mpath = 'profile/'+ path.posix.basename(result.img);
					let ImageResize = require('../resize');
					ImageResize.resize(mpath, 400, 400, mpath);
				}
			});
			newAdmin.save((error2, result) => {
				if (error2) {
					return callback({'success': false,'message': msg.error.occur}, null);
				} else {
					return callback(null, {'success' : true});
				}
			})
		} else {
			return callback({'success': false,'message': msg.error.exist_email});
		}
	})
}
Admin.mUpdate = async (data, callback)=>{
	await User.mUpdate(data.user._id, data.user).then().catch(e=>{});
	await Admin.update({_id : data._id},{$set: data}).exec((err, result)=>{
		if(err){
			return callback({success : false, message : msg.error.occur}, null);
		}else{
			return callback(null, {success : true});
		}
	});
}
Admin.mDelete = async (data, callback)=>{
	await User.mUpdate(data.user._id, {admin : false}).then().catch(e=>{});
	await Admin.remove({'_id': new mongoose.Type.ObjectId(data._id)}).exec((err, result)=>{
		if(err){
			return callback({success : false, message : msg.error.occur}, null);
		}else{
			return callback(null, {success : true});
		}
	})
}
Admin.byToken = (token, callback)=>{
	jwt.verify(token, config.admin_secret_key, (err, data)=>{
		if(err){
			callback({'success': false,'message': msg.error.verify_token}, null);
		}else{
			if(data.admin != true){
				return callback({'success': false,'message': msg.error.occur}, null);
			}
			if(data.role == null | undefined | []){
				return callback({'success': false,'message': msg.error.occur}, null);
			}
			Admin.findOne({_id : new mongoose.Types.ObjectId(data._id)}).populate({path : 'user', match : {email : data.email}, select : {password : 0}}).
			exec((error2, data2) => {
				if (error2) {
					return callback({'success': false,'message': msg.error.occur}, null);
				} else if (!error2 && data2) {
					return callback(null, {success : true, result : data2});
				}else{
					return callback({'success': false,'message': msg.error.occur}, null);
				}
			});
		}
	});
}
Admin.statistic = async function (callback){
	let Mode = require('../model/mode');
	let User = require('../model/user');
	let DeviceInRoom = require('../model/device_in_room');
	let Room = require('../model/room');
	let Device = require('../model/device');
	let data = {user : {}};
	let error = false;
	await Mode.count().populate({path : 'id_user', match : {status : config.user_status.Active}}).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.mode = count;
		}
	});
	await Room.count().populate({path : 'id_user', match : {status : config.user_status.Active}}).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.room = count;
		}
	});
	await Device.count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.device = count;
		}
	});
	await DeviceInRoom.count().populate({path : 'user', match : {status : config.user_status.Active}}).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.deviceinroom = count;
		}
	});
	await User.where({status : config.user_status.Active}).or([{admin : false}, {admin : null}, {admin : {$exists : false}}]).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.user.active = count;
		}
	});
	await User.where({status : config.user_status.Pending}).or([{admin : false}, {admin : null}, {admin : {$exists : false}}]).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.user.pending = count;
		}
	});
	await User.where({status : config.user_status.Block}).or([{admin : false}, {admin : null}, {admin : {$exists : false}}]).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.user.block = count;
		}
	});
	await User.where({admin : true}).count((err, count)=>{
		if(err){
			error = true;
			console.log(err);
		}else{
			data.admin = count;
		}
	});

	if(error == true){
		callback(msg.error.occur, data);
	}else{
		callback(null, data);
	}
}

Admin.getAllAdmin = (callback)=>{
	Admin.find({}).exec((err, data)=>{
		if (err) {
			return callback({'success': false,'message': msg.error.occur}, null);
		} else if (!err && data2) {
			return callback(null, {success : true, result : data2});
		}else{
			return callback(null, {success : true, result : []});
		}
	})
}
// Admin.statistic((err, data)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(JSON.stringify(data));
// 	}
// });

// Admin.authen('linhdanit1512@gmail.com', '1234567', (err, data)=>{
// 	if(err){
// 		console.log(err);
// 	}else if(data){
// 		console.log(JSON.stringify(data));
// 	}
// });

module.exports = exports = Admin;
