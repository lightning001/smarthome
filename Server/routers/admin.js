var DeviceInRoom = require('../control/deviceinroom'),
	Room = require('../control/room'),
	Mode = require('../control/mode'),
	Device = require('../control/device'),
	User = require('../control/user'),
	config = require('../util/config'),
	authenticated = require('./authenticated').admin_authenticated,
	deauthenticated = require('./authenticated').admin_deauthenticated,
	msg = require('../msg').en,
	Admin = require('../control/admin'),
	md5 = require('md5'),
	express = require('express');

var router = express.Router();

/**==========  GET  ==================================================*/

router.get('/', (req, res)=>{
	res.redirect('/admin/dashboard');
});

router.get('/error', (req, res) => {
	res.render('management/error', {req : req, res : res, errormessage : req.flash('error')});
});

router.get('/login', deauthenticated, (req, res)=>{
	return res.render('management/login', {'req': req,'res': res, messages: req.flash('failureLogin')});
});

router.get('/dashboard', authenticated, (req, res)=>{
	Admin.statistic((err, data)=>{
		if(err){
			req.flash('error', err);
			return req.redirect('/admin/error');
		}else{
			return res.render('management/dashboard', {'req': req,'res': res, 'statistic' : data});
		}
	})
});

router.get('/room', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.ROOM)>=0){
		Room.getAllRoom().then(data=>{
			User.getAllUser().then(users=>{
				return res.render('management/room', {'req': req,'res': res, 'listRoom' : data.result, 'listUser' : users});
			}).catch(e=>{
				req.flash('error', e.mesage);
				return req.redirect('/admin/error');
			});
		}).catch(e=>{
			req.flash('error', e.mesage);
			return req.redirect('/admin/error');
		});
	}else{
		res.redirect('/admin/dashboard');
	}
});
router.get('/room/:iduser/:idroom', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.ROOM)>=0){
		let user = req.params.iduser, room = req.params.idroom;
		Room.findBy_ID(user, room).then(data=>{
			return res.render('management/roomdetail', {'req': req,'res': res, 'room' : data.result});
		}).catch(e=>{
			req.flash('error', e.mesage);
			return req.redirect('/admin/error');
		});
	}else{
		res.redirect('/admin/dashboard');
	}
});

router.get('/device', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.DEVICE)>=0){
		Device.getAllDevice().then(data=>{
			return res.render('management/device', {'req': req,'res': res, 'listDevice' : data.result});
		}).catch(e=>{
			req.flash('error', e.mesage);
			return req.redirect('/admin/error');
		})
	}else{
		res.redirect('/admin/dashboard');
	}
});

router.get('/mode', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.MODE)>=0){
		Mode.getAllMode().then(data=>{
			User.getAllUser().then(users=>{
				return res.render('management/room', {'req': req,'res': res, 'listMode' : data.result, 'listUser' : users});
			}).catch(e=>{
				req.flash('error', e.mesage);
				return req.redirect('/admin/error');
			});
		}).catch(e=>{
			req.flash('error', e.mesage);
			return req.redirect('/admin/error');
		})
	}else{
		res.redirect('/admin/dashboard');
	}
});

router.get('/mode/:user/:id', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.MODE)>=0){
		Mode.findBy_ID(req.params.user, req.params.id).then(data=>{
			return res.render('management/mode', {'req': req,'res': res, 'mode' : data.result});
		}).catch(e=>{
			req.flash('error', e.mesage);
			return req.redirect('/admin/error');
		})
	}else{
		res.redirect('/admin/dashboard');
	}
});

router.get('/user', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.USER)>=0){
		User.getAllUser().then(data=>{
			return res.render('management/user', {'req': req,'res': res, 'listUser' : data.result});
		}).catch(e=>{
			req.flash('error', e.mesage);
			return req.redirect('/admin/error');
		})
	}else{
		res.redirect('/admin/dashboard');
	}
});
router.get('/admin', authenticated, (req, res)=>{
	if(req.session.admin.role.indexOf(Admin.roles.view.ADMIN)>=0){
		Admin.getAllAdmin((err, data)=>{
			if(err){
				req.flash('error', err.mesage);
				return req.redirect('/admin/error');
			}else{
				return res.render('management/admin', {'req': req,'res': res, 'listAdmin' : data.result});
			}
		});
	}else{
		res.redirect('/admin/dashboard');
	}
});

/**=========  POST  ==========================================================*/

router.post('/loginadmin', deauthenticated, (req, res)=>{
	if(req.session.loginRequestCount >=3){
		req.flash('failureLogin', msg.error.login_3);
		return res.redirect('/admin/login');
	}else{
		let email = req.body.email;
		let password = md5(req.body.password);
		Admin.authen(email, password, (err, data)=>{
			if(err){
				console.log(err);
				req.flash('failureLogin', err);
				return res.redirect('/admin/login');
			}else{
				let token = data.token;
				req.session.admin_authenticated = true;
				req.session.admintoken = token;
				return res.redirect('/admin/dashboard');
			}
		})
	}
});

router.post('/room/add', authenticated, (req, res)=>{
	console.log('add room')
	let form = new formidable.IncomingForm();
	form.uploadDir = './public/image/room';
	form.encoding = 'utf-8';
	form.maxFieldSize = 10 * 1024 * 1024; //10MB
	form.keepExtensions = true;

	let files = {};
		img ='',
		fields = {};
	form.on('field', (field, value)=>{
		fields[field] = value;
	}).on ('fileBegin', function(name, file){
		img = randomstring.generate(10) + new Date().getTime() + '_' + file.name.split(' ').join('-');
		file.path = form.uploadDir +'/'+ img;
	}).on('file', function(field, file) {
		files[field] = file;
		if(file.size==0)img='';
	}).on('progress', function (bytesReceived, bytesExpected) {
		if (bytesReceived > form.maxFieldsSize) {
			req.connection.destroy();
		}
	}).parse(req, function(err, fields, files) {
	}).on('end', function() {
		fields.img = img;
		mRoom.mInsert(fields.user, fields).then((insert) => {
			res.json({'success' : true});
		}, (e) => {
		});
	});
})

module.exports = exports = router;
