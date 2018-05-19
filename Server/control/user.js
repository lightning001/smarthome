var User = require('../model/user');
const config = require('../util/config');
var fs = require('fs');
const msg = require('../msg').en;
var jwt = require('jsonwebtoken');
let base64url = require('base64url');
let randomstring = require('randomstring');
var mongoose = require('mongoose');
let verify = require('./verify');
/**
 * @param {String}
 *            email
 * @param {String}
 *            password emit client_send_login server_send_login
 */

User.login = (email, password) => {
	return new Promise((resolve, reject) => {
		User.findOne({
			'email': email
		}).
		// .where('password').equals(password)
		// where('status').equals(true).
		populate('listMode').
		populate('listRoom').
		exec((error, data) => {
			if (error) {
				console.log(error);
				return reject({
					'token': 'error'
				});
			}
			if (!data || typeof data === undefined) {
				console.log(msg.not_exist.account);
				return reject({
					'token': 'error'
				});
			}
			if (data && data.length !== 0) {
				if (data.password !== password) {
					console.log('Sai mat khau: ' + data.password);
					return reject({
						'token': 'error'
					});
				} else {
					data.password = '';
					var token = jwt.sign(JSON.stringify(data), config.secret_key, {
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

User.changePassword = (token, _id, oldPassword, newPassword) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secret_key, (error, data) => {
			if (error) {
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
			if (error) {
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
				User.find({'email': email}, {password: 0}, (error2, data2) => {
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
					console.log('User' + JSON.stringify(mUser));
					if (error2) {
						console.log('Error: ' + error2)
						return reject({
							'success': false,
							'message': msg.error.occur
						});
					} else {
						console.log('insert true');
						return resolve({
							'success': true
						});
					}
				});
			} else {
				console.log('Email exist');
				return reject({
					'success': false,
					'message': msg.error.exist_email
				});
			}
		})
	});
}

User.confirmRegister = (data) => {
	try {
		// socket.emit('server_send_confirm_register', {'success': false,
		// 'message':
		// msg.error.confirm_register});
		let EmailManager = require('../util/Email');
		// ma hoa TOKEN cho an toan
		let token = jwt.sign({
			'data': data
		}, config.secret_key, {
			algorithm: 'HS256'
		});
		let encode = base64url.encode(token.toString(), 'binary');
		EmailManager.confirmEmail(data.email, encode);
		return {
			'success': true,
			'message': msg.success.confirm_register
		};

	} catch (e) {
		console.log(e);
		return {
			'success': false,
			'message': msg.error.occur
		};

	}
}

User.responseConfirm = (encode, request, response) => {
	let token = base64url.decode(encode, 'binary');
	jwt.verify(token, config.secret_key, (error, data) => {
		if (error) {

			var html = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="utf-8" />',
        '<title>Error Occurred</title>',
        '</head>',
        '<body style="margin : auto; padding : 70px;">',
        '<h1>Ôi không!<hr/></h1> <h3>Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút<h3>',
        // response.write('<link rel="stylesheet"
		// href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
        // response.write('<script
		// src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
        // response.write('<script
		// src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
        '</body>',
        '</html>',
      ].join('');
			response.write(html, 'utf8');
			response.end();
		} else if (data) {
			let mData = data.data;
			let email = mData.email;
			User.find({
				'email': email
			}).
			exec((error2, data2) => {
				if (error2) {
					console.log(error2);
					let html = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="utf-8" />',
            '<title>Error Occurred</title>',
            '</head>',
            '<body style="margin : auto; padding : 70px;">',
            '<h1>Ôi không!<hr/></h1> <h3>Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút<h3>',
            // response.write('<link rel="stylesheet"
			// href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
            // response.write('<script
			// src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
            // response.write('<script
			// src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
            '</body>',
            '</html>',
          ].join('');
					response.write(html, 'utf8');
					response.end();
				} else if (!error && data2) {
					User.update({
						'email': data2.email
					}, {
						$set: {
							'status': true
						}
					}).
					exec((err) => {
						if (err) {
							console.log(error2);
							let html = [
              '<!DOCTYPE html>',
              '<html>',
              '<head>',
              '<meta charset="utf-8" />',
              '<title>Error Occurred</title>',
              '</head>',
              '<body style="margin : auto; padding : 70px;">',
              '<h1>Ôi không!<hr/></h1> <h3>Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút<h3>',
              // response.write('<link rel="stylesheet"
				// href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
              // response.write('<script
				// src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
              // response.write('<script
				// src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
              '</body>',
              '</html>',
            ].join('');
							response.write(html, 'utf8');
							response.end();
						} else {
							let EmailManager = require('../util/Email');
							EmailManager.thankConfirmRegister(mData.email);
							response.render('user_views/registersuccess');
						}
					});
				}
			});

		}
	});
}

User.mUpdate = (token, data) => {
	return new Promise((resolve, reject) => {

		jwt.verify(token, config.secret_key, (error, decode) => {
			if (error) {
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
			if (error) {
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
