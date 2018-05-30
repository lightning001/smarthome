var mRoom = require('../control/room'),
	config = require('../util/config'),
	msg = require('../msg').en,
	express = require('express'),
	formidable = require('formidable'),
	randomstring = require("randomstring");

var router = express.Router();

router.get('/', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}else{
	mRoom.findByUser(req.session.usertoken, req.session.user._id).then(
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

router.get('/:id', (req, res) => {
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
		}else if(id== 'update'){
			mDeviceInRoom.unused(req.session.usertoken, req.session.user._id).then(
			(data)=>{
				if(data.length == 0 || data == undefined)
					data = [];
				res.render('form/update/room', {'req': req,'res': res,	'listDeviceRoom': data});
			}).catch((e)=>{
				req.flash('error', e.message);
				res.redirect('/error');
			});
		}else{
			mRoom.findBy_ID(req.session.usertoken, id).
			then((data) => {
				if (data.result != undefined) {
					let room = data.result;
					console.log('Room : ' + room);
					mDeviceInRoom.getDeviceInRoom(req.session.usertoken, id).then((data) => {
						let listDeviceRoom = [];
						if (data.result != undefined && data.result.length > 0)
							listDeviceRoom = data.result;
						res.render('user_views/roomdetail', {'req': req,'res': res,	'room': room,'listDeviceRoom': listDeviceRoom});
					}).catch((err) => {
						console.log(err.toString());
						req.flash('error', err.message);
						res.redirect('/error');
					});
				}
			}).catch((e) => {
				console.log(e.toString());
				req.flash('error', e.message);
				res.redirect('/error');
			});
		}
	}
});

router.post('/add', (req, res)=>{
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
			console.log(img)
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
		}).parse(req, function(err, fields, files) {
			console.log('in parse ', fields, files);	
		}).on('end', function() {
			fields.img = img;
			fields.user = req.session.user._id;
			console.log(JSON.stringify(fields));
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

router.put('/update', (req, res)=>{
	
});
router.delete('/', (req, res)=>{
	if (req.session.authentication == null | false || req.session.user == null) {
		res.redirect('/');
	}else{
		let id = req.body.id;
		mRoom.delete(req.session.usertoken, id).then(
		data =>{
			
		}, e=>{
			
		});
	}
});

module.exports = exports = router;