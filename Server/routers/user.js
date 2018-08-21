var mUser = require('../control/user'),
	config = require('../util/config'),
	msg = require('../msg').en,
	express = require('express'),
	md5 = require('md5'),
	{authenticated} = require('./authenticated'),
	localStorage = require('localStorage'),
	deauthenticated = require('./authenticated').deauthenticated,
	base64url = require('base64url'),
	formidable = require('formidable'),
	randomstring = require("randomstring"),
	jwt = require('jsonwebtoken'),
	cookie = require('cookie'),
	StorageManagement = require('../util/storage'),
	userRouter = express.Router();

userRouter.get('/profile', authenticated, (req, res) => {
	console.log('User: '+ JSON.stringify(req.session.user));
	res.render('user_views/profile', {'req': req,'res': res});
});

userRouter.get('/logout', authenticated, (req, res) => {
	req.session.user = undefined;
	req.session.authentication = undefined;
	req.session.usertoken = undefined;
	req.session.remember = undefined;
	res.redirect('/login');
});

userRouter.get('/login', deauthenticated, (req, res, next) => {
	res.render('user_views/home', {req : req, res : res, messages: req.flash('failureLogin'), alertmessage : req.flash('alertmessage')});
});

userRouter.get('/register', deauthenticated, (req, res, next) => {
	res.render('form/register', {'req': req,'res': res,message : req.flash('failureRegister')});
});

userRouter.get('/active', (req, res)=>{
	res.render('user_views/activatedaccount', {'req': req, 'res': res, 'name' : req.session.user_name, checkemail : req.flash('checkemail'), alertmessage : req.flash('alertmessage')});
});

userRouter.get('/thankyou', (req, res) => {
	res.render('user_views/thankyou', {'req': req,'res': res});
});

userRouter.post('/register', deauthenticated, function (req, res) {
	let form = new formidable.IncomingForm();
	form.uploadDir = './public/image/profile/';
	form.encoding = 'utf-8';
	form.maxFieldSize = 10 * 1024 * 1024; //10MB
	form.keepExtensions = true;

	let files = {},
		img ='',
		fields = {};
	form.on('field', (field, value)=>{
		fields[field] = value;
	}).on ('fileBegin', function(name, file){
		img = randomstring.generate(10) + new Date().getTime() + '_' + file.name;
		file.path = form.uploadDir +img;
	}).on('file', function(field, file) {
		files[field] = file;
		if(file.size==0)img='';
	}).on('progress', function (bytesReceived, bytesExpected) {
		if (bytesReceived > form.maxFieldsSize) {
			req.connection.destroy();
		}
	}).on('error', function(err) {
	}).on('end', function() {
		fields.img = img;
		fields.password = md5(fields.password);
		mUser.mInsert(fields).then((insert) => {
			res.redirect('/');
		}, (e) => {
			req.flash('failureRegister', e.message);
			res.redirect('/error');
		});
	});
});

userRouter.post('/login', deauthenticated, async function(req, res){
	if(req.session.loginRequestCount >=3){
		req.flash('failureLogin', msg.error.login_3);
		return res.redirect('/login');
	}
	let pass = req.body.password + "";
	mUser.login(req.body.email, md5(pass)).then((user)=>{
		if(req.body.remember=='on'){
			req.session.remember = true;
		}
		console.log(JSON.stringify(user.token));

		mUser.byToken(user.token).then(decode=>{
			if(decode.result.status == config.user_status.Pending){
				req.session.active_email = decode.result.email;
				req.session.active_name = decode.result.name;
				return res.redirect('/active');
			}else if(decode.result.status == config.user_status.Block){
				req.flash('failureLogin', 'Your account is Blocking, You cannot use this account');
				return res.redirect('/');
			}
			req.session.authentication = true;
			req.session.usertoken = user.token;
			res.redirect('/');
		}).catch(e=>{
			req.flash('error', msg.error.occur); 
			req.redirect('/error');
		});
	}).catch((e)=>{
		console.log('Login error: '+e);
		console.log(e)
		if(req.session.loginRequestCount ==null){
			req.session.loginRequestCount = 0;
		}
		req.session.loginRequestCount +=1;
		req.flash('failureLogin', e.message);
		res.redirect('/login');
	});
});

userRouter.post('/autologin', deauthenticated, (req, res)=>{
	console.log('auto login');
	let token = req.body.data;
	if(token && token!='' ){
		mUser.byToken(token).then(decode=>{
			req.session.authentication = true;
			req.session.usertoken = token;
			req.session.user = decode.result
			localStorage.setItem('token', token);
			res.status(200).json({'success': true, 'token' : token});
		}).catch(e=>{
			res.status(404).json({'success' : false});
		});
	}else{
		res.redirect('/login');
	}
});
	/**Forget Password:
	Search Email 																-> 	Nhập number code 	-> Nhập pass mới
		- Server kiểm tra	- Server gửi email + numbercode		- Server kiểm tra 		- Chuyển trang đăng nhập
	*/
userRouter.get('/recover/password', deauthenticated, function(req, res){
	console.log('Request forget password');
	res.render('form/searchforgetpassword', {req : req, res : res, message : req.flash('findEmail'), message_title : req.flash('findEmailTitle')});
});

userRouter.post('/recover/password', deauthenticated, function(req, res){
	console.log('Search Email' + req.body.email);
	let email = req.body.email;
	mUser.findByEmail(email).then(
	(data)=>{
		let emailx = email.substr(0,2)+ '***@******';
		let encode = base64url.encode(jwt.sign(JSON.stringify({'email': email}), config.secret_key, {algorithm : 'HS256'}));
		StorageManagement.requestRecoverPassword(email, data.name)
		req.flash('emailx', emailx);
		res.redirect('/recover/password/'+encode);
	}).catch((e)=>{
		console.log(JSON.stringify(e));
		req.flash('findEmailTitle', 'No search results');
		req.flash('findEmail', 'Your search did not return any results. Please try again with other information.');
		res.redirect('/recover/password');
	});
});

userRouter.get('/recover/password/:encode', function(req, res){
	console.log('enter verify code');
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
});

userRouter.post('/recover/passwordverify', function(req, res){
	console.log('check verify code');
	if (req.session.authentication == true || req.session.encodeResetPassword ==null) {
		res.redirect('/');
	}else{
		let code = req.body.verifycode;
		console.log('Code: '+code);
		let email = req.session.forgetPasswordEmail;
		console.log('Email: '+email);
		StorageManagement.checkRecoverPassword(email, code).then(data =>{
			res.redirect('/recover/newpassword');
		}).catch(e=>{
			req.flash('verifyerror', e.message);
			res.redirect('/recover/password/'+req.session.encodeResetPassword);
		});
	}
});

userRouter.get('/recover/newpassword', function(req, res){
	console.log('enter new password');
	if ((req.session.authentication==true) || !req.session.forgetPasswordEmail || !req.session.encodeResetPassword) {
		res.redirect('/');
	}else{
		res.render('form/newpassword', {req: req, res : res});
	}
});

userRouter.post('/recover/resetpassword', deauthenticated, function(req, res){
	console.log('complete reset password');
	if (req.session.authentication == null | false || req.session.encodeResetPassword ==null) {
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
	let email = req.session.active_email;
	if(email){
		StorageManagement.activeAccount(req.session.active_email, req.session.active_name).then(data=>{
			req.flash('checkemail', 'Please check your email to activated account');
			res.redirect('/active');
		}).catch(e=>{
			res.redirect('/');
		})
	}else{
		res.redirect('/');
	}
});

userRouter.get('/activeaccount/:encode', (req, res)=>{
	let encode = req.params.encode;
	StorageManagement.checkActiveAccount(encode).then(data=>{
		if(req.session.active_email!=null)
			req.session.active_email = null;
		if(req.session.active_name!=null)
			req.session.active_name = null;
		req.flash('alertmessage', 'The account is activated. You can login now');
		res.redirect('/');
	}).catch(e=>{
		res.redirect('/');
	});
});

userRouter.post('/changepassword', authenticated, function (req, res) {
	let currentPassword = md5(req.body.currentPassword);
	let newPassword = md5(req.body.newPassword);
	console.log('currentPass: ' + currentPassword + '; newPassword' + newPassword);
	mUser.changePassword(req.session.user._id, currentPassword, newPassword).then(
		(data) => {
			console.log('OK new password: ' + newPassword);
			return res.json({msg: "Changing password is successful"});
		}, (e) => {
			console.log(e);
			return res.json({msg : e.message});
		}
	);
});

var editSessionUser = function (req, res, data) {
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

userRouter.post('/profile', authenticated, (req, res) => {
	let form = new formidable.IncomingForm();
	form.uploadDir = './public/image';
	form.encoding = 'utf-8';
	form.maxFieldSize = 10 * 1024 * 1024; //10MB
	form.keepExtensions = true;

	let files = {},
		img ='',
		fields = {};
	form.on('field', (field, value)=>{
		fields[field] = value;
	}).on ('fileBegin', function(name, file){
		img = randomstring.generate(10) + new Date().getTime() + '_' + file.name;
		file.path = form.uploadDir +'/'+ img;
	}).on('file', function(field, file) {
		files[field] = file;
		if(file.size==0)img='';
	}).on('progress', function (bytesReceived, bytesExpected) {
		if (bytesReceived > form.maxFieldsSize) {
			req.connection.destroy();
		}
	}).on('error', function(err) {
	}).on('end', function() {
		fields.img = img;
		fields.password = md5(fields.password);
		console.log('Fields: '+JSON.stringify(fields));
		mUser.mUpdate(req.session.user._id, fields).
		then(async (success) => {
			await mUser.byToken(req.session.usertoken).then(data => req.session.user = data.result).catch(e =>console.log(e));
			res.redirect('/profile');
		}).catch((err) => {
			req.flash('error', msg.error.occur);
			res.redirect('/error');
		});
	});
});
module.exports = exports = userRouter;
//}
