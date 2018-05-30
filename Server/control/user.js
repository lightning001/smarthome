require('../model/Mode');
require('../model/Room');
var User = require('../model/user'),
	config = require('../util/config'),
	mDate = require('../util/dateOperation'),				   
	randomstring = require('randomstring'),
	base64url = require('base64url'),
	mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	msg = require('../msg').en,
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
		// .where('password').equals(password)
		// where('status').equals(true).
		exec((error, data) => {
			if (error) {
				return reject({'token': 'error', message : msg.error.occur});
			}
			if (!data || typeof data === undefined) {
				console.log(msg.not_exist.account);
				return reject({'token': 'error', message : msg.error.login_incorrect});
			}
			if (data && data.length !== 0) {
				if (data.password !== password) {
					console.log('Sai mat khau: ' + data.password);
					return reject({'token': 'error', message : msg.error.login_incorrect});
				} else {
					var token = jwt.sign(JSON.stringify({'_id' : data._id.toString(), 'email' : data.email, status: data.status}), config.secret_key, {
						algorithm: 'HS256'
					});
					return resolve({
						'token': token
					});
				}
			}
		});
	})
}

var checkId = (_id, token_id)=>{
	if(_id == token_id){
		return true;
	}
	return false;
}

User.changePassword = (token, _id, oldPassword, newPassword) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error || !checkId(_id, data._id)) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				User.findOne({'_id': new mongoose.Types.ObjectId(_id),'password': oldPassword}, {password: 0}, (error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.incorrect_password});
					} else if (!error2 && data2) {
						User.update({'_id': new mongoose.Types.ObjectId(data2._id)}, {$set: {'password': newPassword}}).
						exec((err)=> {
							if (err) {
								return reject({'success': false,'message': msg.error.incorrect_password});
							} else {
								return resolve({'success': true});
							}
						});
					}
				});
			}
		});
	});
}

/**
 * @param {String}
 *            _id
 */
User.findBy_ID = (token, _id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error || !checkId(_id, data._id)) {
				reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				User.findById(new mongoose.Types.ObjectId(_id), {
					password: 0
				}, (error2, data2) => {
					if (error2) {
						return reject({
							'success': false,
							'message': msg.empty.cant_find
						});
					} else if (!error2 && data2) {
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

User.byToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				User.findById(new mongoose.Types.ObjectId(data._id), {
					password: 0
				}).
				populate('listMode').
				populate('listRoom').
				exec((error2, data2) => {
					if (error2) {
						return reject({
							'success': false,
							'message': msg.empty.cant_find
						});
					} else if (!error2 && data2) {
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

User.findByName = (token, name) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				User.find({
					'name': {
						$regex: name
					}
				}, {
					password: 0
				}, (error2, data2) => {
					if (error2) {
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else if (!data2) {
						return reject({
							'success': false,
							'message': msg.empty.cant_find
						});
					} else if (!error2 && data2) {
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

User.findByEmail = (token, email) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			} else {
				User.findOne({'email': email}, {password: 0}, (error2, data2) => {
					if (error2) {
						return reject({'success': false,'message': msg.error.occur});
					} else if (!data2) {
						return reject({'success': false,'message': msg.empty.cant_find});
					} else if (!error2 && data2) {
						console.log(data2);
						return resolve({'success': true,'result': data2});
					}
				});
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
		User.count({
			'email': data.email
		}, (error, findresult) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.occur
				});
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
					if (typeof data.img == 'string')
						mUser.img = config.host + config.upload_path + data.img;
					else {
						let fileName = getImageName(randomstring.generate(20));
						fs.writeFile(config.upload_path + fileName, data.img);
						mUser.img = config.host + fileName;
					}
				}
				mUser.save((error2) => {
					if (error2) {
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else {
						return resolve({
							'success': true
						});
					}
				});
			} else {
				return reject({
					'success': false,
					'message': msg.error.exist_email
				});
			}
		})
	});
}

User.confirmRegister = (data) => {
	return new Promise((resolve, reject)=>{
		try {
			// socket.emit('server_send_confirm_register', {'success': false,
			// 'message':
			// msg.error.confirm_register});
			let EmailManager = require('../util/Email');
			// ma hoa TOKEN cho an toan
			let token = jwt.sign({'data': data}, config.secret_key, {algorithm: 'HS256'});
			let encode = base64url.encode(token.toString(), 'binary');
			EmailManager.confirmRegister(data.email, encode);
			User.update({'email' : data.email}, {$set:{activeTimeRequest : new Date()}}).exec();
			return resolve({
				'success': true,
				'message': msg.success.confirm_register
			});

		} catch (e) {
			console.log(e);
			return reject({
				'success': false,
				'message': msg.error.occur
			});

		}
	});
}

User.responseConfirm = (encode, req, response) => {
	let token = base64url.decode(encode, 'binary');
	jwt.verify(token, config.secret_key, (error, data) => {
		if (error) {
			req.flash('error', 'Oh no. We can not do your request now. Please try again later');
			response.redirect('/error');
		} else if (data) {
			let mData = data.data;
			let email = mData.email;
			User.findOne({'email': email}).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					req.flash('error', 'Oh no. We can not do your request now. Please try again later');
					response.redirect('/error');
				} else if (!error && data2) {
					if(mDate.subtract(new Date(), data2.activeTimeRequest) >=30*60*1000){
						req.flash('alertmessage', msg.error.timeout);
						res.redirect('/');
					}else{
						User.update({'email': data2.email}, {$set: {'status': 'Active'}, $unset:{activeTimeRequest : 1}}).
						exec((err) => {
							if (err) {
								req.flash('error', 'Oh no. We can not do your request now. Please try again later');
								response.redirect('/error');
							} else {
								let EmailManager = require('../util/Email');
								EmailManager.thankConfirmRegister(mData.email);
								response.redirect('/thankyou')
							}
						});
					}
				}
			});

		}
	});
}


User.searchResetPassword = (email)=>{
	return new Promise((resolve, reject)=>{
		User.findOne({'email': email}).
		exec((error, data)=>{
			 if(error)
				return reject({'success': false, 'message' : msg.error.occur});
			else if(!error && !data)
				return reject({'success': false, 'message' : msg.not_exist.account});
			else if(!error && data)
				return resolve({'success' :  true});
				
			
		});
	})
}

User.requestResetPassword = (email)=>{
	return new Promise((resolve, reject)=>{
		var number = randomstring.generate({ length : 6, charset : 'numeric'});
		console.log('number: '+number);
		User.update({'email' : email}, {$set : {'forgetcode' : number, 'forgetTimeRequest' : new Date() }}).
		exec((error)=>{
			if(error){
				return reject({'success': false, 'message' : msg.error.occur});
			}
			else{
				let EmailManager = require('../util/Email');
				let encode = base64url.encode(jwt.sign(JSON.stringify({'email': email}), config.secret_key, {algorithm : 'HS256'}));
				EmailManager.forgetPassword(email, encode, number);
				return resolve({'success' :  true, 'encode' : encode});
			}
		});
	});
}

					   
User.verifyResetPassword = (email, forgetcode)=>{
	return new Promise((resolve, reject)=>{
		
		User.findOne({$and : [{forgetcode : {$exists : true}}, {forgetcode : {$ne : null}}], 
					  $and : [{forgetTimeRequest : {$exists : true}}, {forgetTimeRequest : {$ne : null}}],
					  'email': email}, {password : 0}).
		exec((error, data)=>{
			 if(error)
				return reject({'success': false, type : 'server', 'message' : msg.error.occur});
			else if(data){
				if(forgetcode != data.forgetcode)
					return reject({'success': false, type : 'incorrected', 'message' : msg.error.forgetcode});
				let currentTime = new Date(),
					requestTime = data.forgetTimeRequest,
					deviationTime = mDate.subtract(currentTime, requestTime);
					console.log('deviationTime: '+deviationTime);
				if(deviationTime >= 30*60*1000){
					User.update({'email': email}, {$unset : {forgetcode : 1, forgetTimeRequest : 1}}).exec();
					return reject({success : false, type : 'timeout', message : msg.error.timeout});
				}
				else{
					return resolve({'success' :  true});
				}
			}
		});
	});
}

User.resetPassword = (email, password)=>{
	return new Promise((resolve, reject) => {
		User.findOneAndUpdate({$and : [{forgetcode : {$exists : true}}, {forgetcode : {$ne : null}}], 
					  $and : [{forgetTimeRequest : {$exists : true}}, {forgetTimeRequest : {$ne : null}}],
					  'email': email}, {$set : {'password' : password}, $unset : {forgetcode : 1, forgetTimeRequest : 1}}).
		exec((error)=>{
			if(error){
				return reject({'success' : false, 'message' : msg.error.occur});
			}else{
				return resolve({'success' : true});
			}
		})
	});
}

User.mUpdate = (token, data) => {
	return new Promise((resolve, reject) => {

		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error || !checkId(_id, data._id)) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			// kiem tra email da co hay chua
			User.findOne({
				'email': data.email
			}, (error2, findresult) => {
				if (error2) {
					return reject({
						'success': false,
						'message': msg.error.occur
					});
				} else if (!error2 && findresult) {
					// neu email nay da co thi kiem tra xem co trung _id ko
					// neu trung thi cho phep chinh sua, do email do la cua nguoi
					// dang
					// yeu cau
					console.log('user _id: '+data._id + ' '+typeof data._id + ' is equals to '+ findresult._id+ ' '+typeof findresult._id);
					if (data._id == findresult._id.toString()) {
						console.log('la email cua nguoi request');
					} else {
						// khong trung thi email da ton tai, user co data._id ko dc
						// phep
						// dung email nay
						console.log('Email da ton tai');
						return reject({
							'success': false,
							'message': msg.error.exist_email
						});
					}
				} else if (!error2 && (typeof findresult === undefined)) {
					// ko tim thay ket qua, tuc la email nay chua co trong database,
					// dc
					// phep su dung
				}
				if(data.img !=null){
					if(typeof data.img !== 'string'){
					let fileName = getImageName(randomstring.generate(20));
					fs.writeFile(fileName, data.img);
					data.img = config.host + fileName;
					}
				}
				User.update({
					'_id': new mongoose.Types.ObjectId(data._id)
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
						console.log('update' + true);
						return resolve({
							'success': true
						});
					}
				});
			});

		});
	});

}

/**
 * @param user_ID:
 *            mã _id của thiết bị (kiểu ObjectId)
 * @objective : thực hiện xóa 1 user
 */
User.mDelete = (token, _id) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error || !checkId(_id, data._id)) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			User.remove({
				'_id': new mongoose.Type.ObjectId(_id)
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
 * Lấy về tất cả các User
 */
User.getAllUser = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			User.find({}, {
				password: 0
			}, (error2, data2) => {
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
User.getByPage = (token, data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
				return reject({
					'success': false,
					'message': msg.error.verify
				});
			}
			User.find({}, {
				password: 0
			}).
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
module.exports = exports = User;
