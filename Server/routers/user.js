var mUser = require('../control/user'),
	config = require('../util/config'),
	msg = require('../msg').en,
	express = require('express'),
	md5 = require('md5'),
	base64url = require('base64url'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	formidable = require('formidable'),
	randomstring = require("randomstring"),
	jwt = require('jsonwebtoken');
userRouter = express.Router();

/**
============  USER  ====================================================
*/


userRouter.get('/profile', (req, res, next) => {
	if (req.session.authentication == null | false || req.session.user == null) {
		res.redirect('/');
	}else{
		res.render('user_views/profile', {
			'req': req,
			'res': res
		});
	}
});

userRouter.get('/login', (req, res) => {
	res.redirect('/');
});

userRouter.get('/logout', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	req.session.user = null;
	req.session.authentication = false;
	res.redirect('/');
});

userRouter.get('/register', (req, res, next) => {
	res.render('form/register', {
		'req': req,
		'res': res,
		message : req.flash('failureRegister')
	});
});

userRouter.get('/active', (req, res)=>{
	if ((req.session.authentication != null && req.session.authentication != false) ||(req.session.user_name == null ||req.session.user_name == undefined)) {
		res.redirect('/');
	}else{
		res.render('user_views/activatedaccount', {
			'req': req,
			'res': res,
			'name' : req.session.user_name,
			checkemail : req.flash('checkemail'),
			alertmessage : req.flash('alertmessage')
		});
	}
});

userRouter.get('/thankyou', (req, res) => {
	if (req.session.authentication != null | false) {
		res.redirect('/');
	}else{
		res.render('user_views/thankyou', {
			'req': req,
			'res': res
		});
	}
});

userRouter.get('/' + config.confirm_register_path + '/:encode', (req, res) => {
	let encode = req.params.encode;
	if(req.session.user_name!=null)
		req.session.user_name = null;
	if(req.session.user_email!=null)
		req.session.user_email = null;
	mUser.responseConfirm(encode, req, res);
	
});

userRouter.post('/register', function (req, res) {
	let form = new formidable.IncomingForm();
	form.uploadDir = './public/image';
	form.encoding = 'utf-8';
	form.maxFieldSize = 10 * 1024 * 1024; //10MB
	form.keepExtensions = true;
	
	let files = {},
		img ='',
		fields = {};
	form.on('field', (field, value)=>{
		console.log('got field ', field, value);
        fields[field] = value;
	}).on ('fileBegin', function(name, file){
		img = randomstring.generate(10) + new Date().getTime() + '_' + file.name;
        file.path = form.uploadDir +'/'+ img;
    }).on('file', function(field, file) {
        console.log('got file ', file);
        files[field] = file;
    }).on('progress', function (bytesReceived, bytesExpected) {
        console.log('progress ', bytesReceived, bytesExpected);
        if (bytesReceived > form.maxFieldsSize) {
            console.log('Max size reached');
            req.connection.destroy();
        }   
    }).on('error', function(err) {
        console.log('error', err);
    }).parse(req, function(err, fields, files) {
        console.log('in parse ', fields, files);	
	}).on('end', function() {
        console.log('upload ended', fields, files);
		
		fields.img = img;
		fields.password = md5(fields.password);
       	mUser.mInsert(fields).then((insert) => {
			console.log('Insert: ' + JSON.stringify(insert));
			res.redirect('/');
		}, (e) => {
			console.log("catch : " + JSON.stringify(e));
			req.flash('failureRegister', e.message);
			res.redirect('/error');
		});
    });
});

userRouter.post('/login', async function(req, res){
	console.log('Request login: ' + JSON.stringify(req.body));
	let pass = req.body.password + "";
	await mUser.login(req.body.email, md5(pass)).then(
	async (user)=>{
		console.log('Token: '+user.token);
		await mUser.byToken(user.token).then(
		(data) =>{
			if(data.result.status =='Active'){
				req.session.authentication = true;
				req.session.usertoken = user.token;
				if (req.body.remember == 'on') {
					console.log('remember me');
					req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
				}
				req.session.user = data.result;
				console.log('login successfully');
				res.redirect('/');
			}else if(data.result.status =='Block'){
				req.flash('alertmessage', 'Your account is blocked');
				res.redirect('/');
			}else if(data.result.status == 'Pending'){
				req.session.user_name = data.result.name;
				req.session.user_email = data.result.email;
				res.redirect('/active');
			}
			
		}, (e) =>{
			console.log('Verify: '+JSON.stringify(e));
			req.flash('failureLogin', e.message);
			res.redirect('/');
		});
	}).catch((e)=>{
		console.log(e);
		req.flash('failureLogin', e.message);
		res.redirect('/');
	});
});


/**Forget Password:
Search Email 		-> Xác nhận email 		-> 	Nhập number code 	-> Nhập pass mới
	- Server kiểm tra	- Server gửi email + numbercode		- Server kiểm tra 		- Chuyển trang đăng nhập
*/
userRouter.get('/recover/password', function(req, res){
	console.log('Request forget password');
	if (req.session.authentication != null && req.session.authentication ==true) {
		res.redirect('/');
	}else{
		res.render('form/searchforgetpassword', {req : req, res : res, message : req.flash('findEmail'), 
											 message_title : req.flash('findEmailTitle')});
	}
});

userRouter.post('/recover/password', function(req, res){
	console.log('Search Email' + req.body.email);
	if (req.session.authentication != null && req.session.authentication ==true) {
		res.redirect('/');
	}else{
		let email = req.body.email;
		mUser.searchResetPassword(email).then(
		(data)=>{
			console.log('Search: '+ JSON.stringify(data));
			req.session.forgetPasswordEmail = email;
			res.redirect('/recover/passwordsend');
		}, (e)=>{
			console.log(JSON.stringify(e));
			req.flash('findEmailTitle', 'No search results');
			req.flash('findEmail', 'Your search did not return any results. Please try again with other information.');
			res.redirect('/recover/password');
		});
	}
});

userRouter.get('/recover/passwordsend', function(req, res){
	console.log('Confirm find email')
	if (req.session.authentication != null && req.session.authentication ==true) {
		res.redirect('/');
	}else{
		let email = (req.session.forgetPasswordEmail).substr(0,2)+ '***@******';
		res.render('form/confirmforgetpassword', {req: req, res : res, emailx : email});
	}
});

userRouter.post('/recover/passwordsend', function(req, res){
	console.log('Send email to reset pass');
	if (req.session.authentication != null && req.session.authentication ==true) {
		res.redirect('/');
	}else{
		let email = req.session.forgetPasswordEmail;
		mUser.requestResetPassword(email).then(
		(data)=>{
			let emailx = (req.session.forgetPasswordEmail).substr(0,2)+ '***@******';
			req.flash('emailx', emailx);
			res.redirect('/recover/password/'+data.encode);
		}, (e)=>{
			console.log(JSON.stringify(e));
			req.flash('error', e.message);
			res.redirect('/error');
		});
	}
});


userRouter.get('/recover/password/:encode', function(req, res){
	console.log('enter verify code');
	if (req.session.authentication != null && req.session.authentication ==true) {
		res.redirect('/');
	}else{
		let encode = req.params.encode;
		let token = base64url.decode(encode, 'binary');
		jwt.verify(token, config.secret_key, (e, decode)=>{
			if(e){
				req.flash('error', msg.error.verify_token);
				res.redirect('/error');
			}else{
				let email = decode.email;
				req.session.forgetPasswordEmail = email;
				req.session.encodeResetPassword = encode;
				if(req.flash('emailx')==null||req.flash('emailx')==undefined){
					req.flash('emailx', email.substr(0,2)+ '***@******');
				}
				res.render('form/inputverifycode', {req: req, res : res, message : req.flash('verifyerror'), emailx : req.flash('emailx')});
			}
		});
	}
});

userRouter.post('/recover/passwordverify', function(req, res){
	console.log('check verify code');
	if ((req.session.authentication != null && req.session.authentication ==true) || req.session.encodeResetPassword ==null) {
		res.redirect('/');
	}else{
		let code = req.body.verifycode;
		console.log('Code: '+code);
		let email = req.session.forgetPasswordEmail;
		console.log('Email: '+email);
		mUser.verifyResetPassword(email, code).then(
		(data)=>{
			res.redirect('/recover/newpassword');
		}, (e)=>{
			if(e.type == 'server'||e.type=='timeout'){
				req.flash('error', e.message);
				res.redirect('/error');
			}else{
				req.flash('verifyerror', e.message);
				res.redirect('/recover/password/'+req.session.encodeResetPassword);
			}
		});
	}
});

userRouter.get('/recover/newpassword', function(req, res){
	console.log('enter new password');
	if ((req.session.authentication != null && req.session.authentication ==true) || req.session.forgetPasswordEmail == null || req.session.encodeResetPassword ==null) {
		res.redirect('/');
	}else{
		res.render('form/newpassword', {req: req, res : res});
	}
});

userRouter.post('/recover/resetpassword', function(req, res){
	console.log('complete reset password');
	if ((req.session.authentication != null && req.session.authentication ==true) || req.session.encodeResetPassword ==null) {
		res.redirect('/');
	}else{
		let email = req.session.forgetPasswordEmail,
			newpassword = md5(req.body.newpassword);
		mUser.resetPassword(email, newpassword).then(
		(data)=>{
			req.session.forgetPasswordEmail = null;
			req.session.encodeResetPassword = null;
			req.flash('alertmessage', 'Reset password succesfully');
			res.redirect('/');
		}, (e)=>{
			req.flash('error', e.toString());
			res.redirect('/error');
		});
	}
});

userRouter.post('/activeaccount', function(req, res){
	console.log('Activated account');
	
	let email = req.session.user_email;
	mUser.confirmRegister({email: email}).then(
	(data)=>{
		req.flash('checkemail', data.message);
		res.redirect('/active');
	}, (e)=>{
		req.flash('error', e.message);
		res.redirect('/error');
	});
	
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

userRouter.post('/profile', (req, res) => {
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
