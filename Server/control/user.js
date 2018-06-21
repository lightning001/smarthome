
var User = require('../model/user'),
	config = require('../util/config'),
	Mode = require('../model/mode'),
	Room = require('../model/room'),
	mDate = require('../util/dateOperation'),
	EmailManage = require('../util/Email'),
	randomstring = require('randomstring'),
	base64url = require('base64url'),
	mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	msg = require('../msg').en,
	path = require('path'),
	fs = require('fs');
/**
 * @param {String}
 *            email
 * @param {String}
 *            password emit client_send_login server_send_login
 */

User.login = (email, password) => {
	return new Promise((resolve, reject) => {
		User.findOne({'email': email}).
		exec((error, data) => {
			if (error) {
				return reject({'token': 'error', message : msg.error.occur});
			}
			if (!data || typeof data === undefined) {
				return reject({'token': 'error', message : msg.error.login_incorrect});
			}
			if (data && data.length !== 0) {
				if (data.password !== password) {
					return reject({'token': 'error', message : msg.error.login_incorrect});
				} else {
					var token = jwt.sign(JSON.stringify({'_id' : data._id.toString(), 'email' : data.email, status: data.status}), config.secret_key, {algorithm: 'HS256'});
					return resolve({'token': token, 'id' : data._id});
				}
			}
		});
	});
}

User.byToken = (token)=>{
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (err, data)=>{
			if(err){
				return reject({'success': false,'message': msg.error.verify_token});
			}else{
				User.findOne({_id : new mongoose.Types.ObjectId(data._id), email : data.email}, {password: 0}).
				populate('listMode').populate('listRoom').
				exec((error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else if (!error2 && data2) {
						return resolve({'success': true,'result': data2});
					}else{
						return reject({'success': false,'message': msg.empty.cant_find});
					}
				});
			}
		});
	});
}

User.changePassword = (_id, oldPassword, newPassword) => {
	return new Promise((resolve, reject) => {
		User.findOne({'_id': new mongoose.Types.ObjectId(_id),'password': oldPassword}, {password: 0},(error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.incorrect_password});
			} else if (!error2 && data2) {
				User.update({'_id': new mongoose.Types.ObjectId(_id)}, {$set: {'password': newPassword}}).
				exec((err)=> {
					if (err) {
						return reject({'success': false,'message': msg.error.incorrect_password});
					} else {
						return resolve({'success': true, 'id' : _id});
					}
				});
			}else{
				return reject({'success': false,'message': msg.error.incorrect_password});
			}
		});
	});
}

/**
 * @param {String}
 *            _id
 */
User.findBy_ID = (_id) => {
	return new Promise((resolve, reject) => {
		User.findById(new mongoose.Types.ObjectId(_id), {password: 0}, (error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.empty.cant_find});
			} else if (!error2 && data2) {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

User.getDataUser = (user) => {
	return new Promise((resolve, reject) => {
		User.findById(new mongoose.Types.ObjectId(user), {password: 0}).
		populate('listMode').populate('listRoom').
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.empty.cant_find});
			} else if (!error2 && data2) {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

User.findByName = (name) => {
	return new Promise((resolve, reject) => {
		User.find({'name': {$regex: name}}, {password: 0}, (error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else if (!data2) {
				return reject({'success': false,'message': msg.empty.cant_find});
			} else if (!error2 && data2) {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

User.findByEmail = (email) => {
	return new Promise((resolve, reject) => {
		User.findOne({'email': email}, {password: 0}, (error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else if (!data2) {
				return reject({'success': false,'message': msg.empty.cant_find});
			} else if (!error2 && data2) {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

getImageName = (id) => {
	return id + new Date().getTime() + '.png';
}


/**
 * server_send_register client_send_register
 */
User.mInsert = (data) => {
	return new Promise((resolve, reject) => {
		User.count({'email': data.email}, (error, findresult) => {
			if (error) {
				return reject({'success': false,'message': msg.error.occur});
			} else if (!error && findresult === 0) {
				let mUser = new User();
				mUser.email = data.email;
				mUser.password = data.password;
				mUser.name = data.name;
				mUser.street = data.street;
				mUser.district = data.district;
				mUser.city = data.city;

				if (typeof data.postcode === 'string' && data.postcode !== '') {
					mUser.postcode = parseInt(data.postcode);
				} else {
					mUser.postcode = data.postcode;
				}
				mUser.phonenumber = data.phonenumber;
				mUser.homephone = data.homephone;
				mUser.dob = data.dob;
				if (data.type !== null && data.type !== undefined)
					mUser.type = data.type;
				if (data.img !== null && data.img !== undefined) {
					if (typeof data.img == 'string' && data.img != '')
						mUser.img = config.host + config.upload_path +'profile/'+ data.img;
					else if(data.img instanceof Buffer){
						let fileName = getImageName(randomstring.generate(20));
						fs.writeFile('public/'+config.upload_path +'profile/' + fileName, data.img);
						mUser.img = config.host + config.upload_path +'profile/' + fileName;
					}else if(data.img==''){
						delete data[img];
					}
				}
				mUser.save((error2, result) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else {
						let tmp = result.img +"";
						let mpath = 'profile/'+ path.posix.basename(result.img);
						let ImageResize = require('../resize');
						ImageResize.resize(mpath, 400, 400, mpath);
						return resolve({'success': true});
					}
				});
			} else {
				return reject({'success': false,'message': msg.error.exist_email});
			}
		})
	});
}

User.activeAccount = (email) => {
	return new Promise((resolve, reject)=>{
		User.findOneAndupdate({'email': email}, {$set: {'status': 'Active'}, $unset:{activeTimeRequest : 1}}).
		exec((err, data) => {
			if (err) {
				reject({success: false, message : msg.error.occur});
			} else if(data){
				resolve({success: true, result: data});
			}
		});
	});
}

User.resetPassword = (email, password)=>{
	return new Promise((resolve, reject) => {
		User.findOneAndUpdate({'email': email}, {$set : {'password' : password}}).
		exec((error, data)=>{
			if(error){return reject({'success' : false, 'message' : msg.error.occur});}
			else{return resolve({'success' : true, 'id' : data._id});}
		});
	});
}

User.mUpdate = (user, data) => {
	return new Promise((resolve, reject) => {
		// kiem tra email da co hay chua
		User.findOne({'email': data.email, '_id' : user}, (error2, findresult) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else if (!error2 && findresult) {
				// neu email nay da co thi kiem tra xem co trung _id ko
				// neu trung thi cho phep chinh sua, do email do la cua nguoi
				// dang yeu cau
				if (data._id != findresult._id.toString()) {
					return reject({'success': false,'message': msg.error.exist_email});
				}
			}
			if(data.img !=null){
				if (typeof data.img == 'string' && data.img != '')data.img = config.host + config.upload_path+'profile/' + data.img;
				else if(typeof data.img !== 'string'){
					let fileName = getImageName(randomstring.generate(20));
					fs.writeFile('public/'+config.upload_path +'profile/' + fileName, data.img);
					data.img = config.host + config.upload_path +'profile/' +  fileName;
				}else if(data.img==''){delete data[img];}
			}
			User.update({'_id': new mongoose.Types.ObjectId(data._id)}, {$set: data}).
			exec((error2) => {
				if (error2) {
					return reject({'success': false,'message': msg.error.occur});
				} else {
					if(data.img!=null){
						let ImageResize = require('../resize');
						let mpath = 'profile/'+ path.posix.basename(data.img);
						ImageResize.resize(mpath, 400, 400, mpath);
					}
					return resolve({'success': true, 'id' : user});
				}
			});
		});
	});
}

/**
 * @param user_ID:
 *            mã _id của thiết bị (kiểu ObjectId)
 * @objective : thực hiện xóa 1 user
 */
User.mDelete = (_id) => {
	return new Promise((resolve, reject) => {
		User.remove({'_id': new mongoose.Type.ObjectId(_id)}).
		exec((error2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				let Mode = require('./mode');
				Mode.mDelete(new mongoose.Type.ObjectId(_id)).then().catch();
				let Room = require('./room');
				Room.mDeleteByUser(_id);
				let DeviceInRoom = require('../model/device_in_room');
				DeviceInRoom.deleteMany({'user' : new mongoose.Type.ObjectId(_id)});
				return resolve({'success': true, 'id' : _id, 'result' : _id});
			}
		});
	});
}

/**
 * Lấy về tất cả các User
 */
User.getAllUser = () => {
	return new Promise((resolve, reject) => {
		User.find({}, {password: 0}, (error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
User.getByPage = (data) => {
	return new Promise((resolve, reject) => {
		User.find({}, {password: 0}).
		skip((data.page - 1) * data.quantity).
		limit(data.quantity).
		sort({name: 1,type: 1,price: -1}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}
module.exports = exports = User;
