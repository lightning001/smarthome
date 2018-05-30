var mDeviceInRoom = require('../control/deviceinroom'),
	config = require('../util/config'),
	msg = require('../msg').en,
	express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	} else {
		mDeviceInRoom.findByUser(req.session.usertoken, req.session.user._id).then(
		(data) => {
			let listMode = [];
			if (data.result != undefined && data.result.length > 0) {
				listDevice = data.result;

			}
			res.render('user_views/device', {
				'req': req,
				'res': res,
				'listDevice': listDevice
			});
		}, (e) => {
			console.log('Error get device in room: ' + JSON.stringify(e));
			req.flash('error', 'We can\'t get your Device. Please try later');
			res.redirect('/error');
		});
	}
});

router.post('/turn-on', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	} else {
		let id = req.body.id;
		mDeviceInRoom.onoff(req.session.usertoken, id).then(
		(data) => {
			console.log('Success turn on/off');
			res.status(200).json({success: true, status: 200, onvalue: data.status});
			res.end();
		}, (e) => {
			console.log('on/off device ' + JSON.stringify(e));
			res.status(403).json({success: false, status: 403, message: e.message});
			res.end();
		});
	}
});

router.delete('/removeroom', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	} else {
		let id = req.body.id;
		let data = {'_id' : id, 'room' : null};
		mDeviceInRoom.mUpdate(req.session.usertoken, data).then(
		(data)=>{
			console.log('Success remove device from room');
			res.status(200).json({success: true});
			res.end();
		}, (e)=>{
			console.log('delete device failure, ' + JSON.stringify(e));
			res.status(403).json({success: false, message: e.message});
			res.end();
		});
	}
});

router.put('/update', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	} else {
		let id = req.body.id;
		let data = {_id : id, 'room': req.body.room, 'user': req.session.user._id, 'device': req.body.device, 'device_name': req.body.device_name};
		mDeviceInRoom.mUpdate(req.session.usertoken, data).then(
		(data)=>{
			console.log('Success remove device from room');
			res.status(200).json({success: true});
			res.end();
		}, (e)=>{
			console.log('delete device failure, ' + JSON.stringify(e));
			res.status(403).json({success: false, message: e.message});
			res.end();
		});
	}
});


router.post('/add', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	} else {
		let id = req.body.id;
		let data = {'room': req.body.room, 'user': req.session.user._id, 'device': req.body.device, 'device_name': req.body.device_name};
		mDeviceInRoom.mUpdate(req.session.usertoken, data).then(
		(data)=>{
			console.log('Success remove device from room');
			res.status(200).json({success: true});
			res.end();
		}, (e)=>{
			console.log('delete device failure, ' + JSON.stringify(e));
			res.status(403).json({success: false, message: e.message});
			res.end();
		});
	}
});


router.delete('/delete', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	} else {
		let id = req.body.id;
		mDeviceInRoom.mDelete(req.session.usertoken, id).then(
		(data)=>{
			console.log('Success delete device');
			res.status(200).json({success: true});
			res.end();
		}, (e)=>{
			console.log('delete device failure, ' + JSON.stringify(e));
			res.status(403).json({success: false, message: e.message});
			res.end();
		});
	}
});

module.exports = exports = router;
