var mUser = require('../control/user'),
	config = require('../util/config'),
	msg = require('../msg').en,
	express = require('express'),
	md5 = require('md5'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	formidable = require('formidable'),
	randomstring = require("randomstring"),
	jwt = require('jsonwebtoken');
userRouter = express.Router();



userRouter.post('/register', function (req, res) {
	let form = new formidable.IncomingForm();
	form.uploadDir = './public/image';
	form.encoding = 'utf-8';
	form.maxFieldSize = 10 * 1024 * 1024; //10MB

	form.parse(req, (err, fields, files) => {
		if (err) {
			res.redirect(url.format({
				pathname: '/error',
				query: {
					error: true,
					status: err.status | 403,
					content: err.toString()
				}
			}));
		}
		let arrfile = [];
		if (files[''] instanceof Array) {
			console.log('array')
			arrfile = files[''];
		} else if (files[''] != null) {
			console.log('file')
			arrfile.push(files['']);
		}

		let img = '';
		console.log(JSON.stringify(arrfile));
		if (arrfile.length > 0) {
			let filenames = [];
			arrfile.forEach((file) => {
				console.log(JSON.stringify('My file' + file));
				let newname = randomstring.generate(15) + new Date().getTime() + '_' + file.filename;
				console.log('Name Img: ' + newname);
				filenames.push(newname);
			});
			img = filenames[0];
		}
		if (img !== '')
			fields.img = img;
		fields.password = md5(fields.password);
		console.log('Fields: ' + JSON.stringify(fields));
		mUser.mInsert(fields).then((insert) => {
			console.log('Insert: ' + JSON.stringify(insert));
			res.redirect(url.format({
				pathname: '/',
				query: {
					'req': req,
					'res': res,
					message: 'Successful register'
				}
			}));
		}, (e) => {
			console.log("catch : " + e);
			res.redirect(url.format({
				pathname: '/error',
				query: {
					error: true,
					status: e.status | 500,
					content: e.toString()
				}
			}));
		});
	});
});

userRouter.post('/login', async (req, res, next) => {
	try {
		console.log('Request login: ' + JSON.stringify(req.body));
		let pass = req.body.password + "";
		let user = await mUser.login(req.body.email, md5(pass));
		console.log(user);
		req.session.authentication = true;
		try {
			jwt.verify(user.token, config.secret_key, (error, data) => {
				if (error) {
					console.log(error);
					res.redirect(url.format({
						pathname: '/error',
						query: {
							error: true,
							status: error.status | 403,
							content: error.toString()
						}
					}));
					return;
				} else if (data) {
					req.session.user = data;
				}
			});
			if (req.body.remember == 'on' | true) {
				req.session.usertoken = user.token;
				req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
			}
			res.redirect('/profile');
		} catch (e) {
			console.log(e);
			res.redirect(url.format({
				pathname: '/error',
				query: {
					'error': true,
					'status': 500,
					'content': 'Cannot verify',
					'req': req,
					'res': res
				}
			}));
		}
	} catch (e) {
		console.log('catch else' + e);
		res.redirect(url.format({
			pathname: '/error',
			query: {
				'error': true,
				'status': 500,
				'content': e.message,
				'req': req,
				'res': res
			}
		}));
	}
});

userRouter.post('/changepassword', function (req, res) {
	if (!req.session.authentication || req.session.usertoken == null | undefined) {
		console.log('You cannot change, must be authen before!!!');
		res.redirect('/');
	} else {
		let currentPassword = md5(req.body.currentPassword);
		let newPassword = md5(req.body.newPassword);
		console.log('currentPass: ' + currentPassword + '; newPassword' + newPassword);
		mUser.changePassword(req.session.usertoken, req.session.user._id, currentPassword, newPassword).then(
			(data) => {
				console.log('OK new password: ' + newPassword);
				return res.json({msg: "Changing password is successful"});
			}, (e) => {
				console.log(e);
				return res.json({msg : e.message});
			}
		);
	}
});

var editSessionUser = function (req, res, data) {
	if (req.session != null && req.session.user != null && req.session.authentication == true) {
		if (data.name != null && data.name != '') {
			req.session.user.name = data.name;
		}
		if (data.district != null) {
			req.session.user.district = data.district;
		}
		if (data.city != null) {
			req.session.user.city = data.city;
		}
		if (data.street != null) {
			req.session.user.street = data.street;
		}
		if (data.phonenumber != null && data.phonenumber != '') {
			req.session.user.phonenumber = data.phonenumber;
		}
		if (data.homephone != null) {
			req.session.user.homephone = data.homephone;
		}
	}
}

userRouter.post('/editprofile', (req, res) => {
	if (!req.session.authentication || req.session.usertoken == null | undefined) {
		console.log('You cannot change, must be authen before!!!');
		res.redirect('/');
	} else {
		let data = new Object();
		data._id = req.session.user._id,
			data.email = req.session.user.email,
			data.name = req.body.name,
			data.city = req.body.city,
			data.district = req.body.district,
			data.street = req.body.street,
			data.dob = req.body.dob,
			data.phonenumber = req.body.phonenumber,
			data.homephone = req.body.homephone;
		mUser.mUpdate(req.session.usertoken, data).then(
			(success) => {
				console.log('Updating information is successful');
				editSessionUser(req, res, data);
				return 'Updating information is successful';
			}, (err) => {
				console.error('Updating false, ' + err);
				return err.message;
			}
		)
	}
});
module.exports = exports = userRouter;
