var mRoom = require('../control/room'),
	mDeviceInRoom = require('../control/deviceinroom'),
	config = require('../util/config'),
	msg = require('../msg').en,
	{authenticated} = require('./authenticated'),
	express = require('express'),
	formidable = require('formidable'),
	randomstring = require("randomstring");

var router = express.Router();

router.get('/', authenticated, function(req, res) {
	if (req.session.authentication == null || req.session.authentication==false) {
		res.redirect('/');
	}else{
	mRoom.getFullDetailUser(req.session.usertoken, req.session.user._id).then(
		(data) => {
			let listRoom = [];
			if (data.result != undefined && data.result.length > 0) {
				listRoom = data.result;
			}
			res.render('user_views/room', {
				'req': req,
				'res': res,
				'listRoom': listRoom
			});
		}, (e) => {
			req.flash('error', e.message);
			res.redirect('/error');
		});
	}
});

router.get('/:id', authenticated, function(req, res) {
	console.log('require room detail ');
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}else{
		let id = req.params.id;
		if(id=='add'){
			mDeviceInRoom.unused(req.session.usertoken, req.session.user._id).then(
			(data)=>{
				if(data.length == 0 || data == undefined)
					data = [];
				res.render('form/add/room', {'req': req,'res': res,	'listDeviceRoom': data, message : req.flash('errorAddRoom')});
			}).catch((e)=>{
				req.flash('error', e.message);
				res.redirect('/error');
			});
		}else{
			mRoom.getFullDetail(req.session.usertoken, id).then(function(data){
			console.log('Request update page: '+JSON.stringify(data));
			let room = data.result;
			let listDeviceRoom = data.result.listDevice;
			mDeviceInRoom.unused(req.session.usertoken, req.session.user._id).
			then(function(data){
				if(data.length == 0 || data == undefined)
					data = [];
				res.render('user_views/roomdetail', {'req': req,'res': res, 'room' : room, 'listDeviceRoom': listDeviceRoom, 'listDeviceNoRoom': data, 'alertMessage' : req.flash('alertMessage')});
			}).catch(function(e){
				req.flash('error', e.message);
				res.redirect('/error');
			});
		}).catch(function(e){
			req.flash('error', e.message);
			res.redirect('/error');
		});
		}
	}
});

router.post('/add', authenticated, function(req, res){
	if (req.session.authentication == null | false || req.session.user == null) {
		res.redirect('/');
	}else{
		console.log('add room')
		let form = new formidable.IncomingForm();
		form.uploadDir = './public/image';
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
			mRoom.mInsert(req.session.usertoken, fields).then((insert) => {
				console.log('Insert: ' + JSON.stringify(insert));
				res.redirect('/room');
			}, (e) => {
				console.log("catch : " + JSON.stringify(e));
				req.flash('errorAddRoom', e.message);
				res.redirect('/room/add');
			});
		});
	}
});

router.post('/update', authenticated, function(req, res){
	console.log('require update room');
	if (req.session.authentication == null | false || req.session.user == null) {
		res.redirect('/');
	}else{
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
			if(file.size==0)
				img='';
		}).on('progress', function (bytesReceived, bytesExpected) {
			console.log('progress ', bytesReceived, bytesExpected);
			if (bytesReceived > form.maxFieldsSize) {
				console.log('Max size reached');
				req.connection.destroy();
			}   
		}).on('error', function(err) {
		}).parse(req, function(err, fields, files) {
		}).on('end', function() {
			console.log('upload ended: '+ fields +' file: '+JSON.stringify(files));
			fields.img = img;
			fields._id = fields.id;
			mRoom.mUpdate(req.session.usertoken, fields).then((insert) => {
				console.log('Update: ' + JSON.stringify(insert));
				req.flash('alertMessage', 'Update room is successful');
				res.redirect('/room/'+fields.id);
			}, (e) => {
				console.log("catch : " + JSON.stringify(e));
				req.flash('alertMessage', e.message);
				res.redirect('/room/'+fields.id);
			});
		});
	}
});

router.delete('/delete/:id/:del', authenticated, function(req, res){
	console.log('require delete room');
	if (req.session.authentication == null | false || req.session.user == null) {
		res.redirect('/');
	}else{
		let id = req.params.id;
		let del = req.params.del;
		console.log('idroom: '+id + ' del: '+del);
		mRoom.mDelete(req.session.usertoken, id, del).then(
		(data)=>{
			console.log('Success remove room');
			res.status(200).json({success: true});
			res.end();
		}, (e)=>{
			console.log('delete room failure, ' + JSON.stringify(e));
			res.status(403).json({success: false, message: e.message});
			res.end();
		});
	}
});

module.exports = exports = router;