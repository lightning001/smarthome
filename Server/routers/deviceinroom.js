var mDeviceInRoom = require('../control/deviceinroom'),
	mRoom = require('../control/room'),
	config = require('../util/config'),
	{authenticated} = require('./authenticated'),
	msg = require('../msg').en,
	express = require('express');

var router = express.Router();

router.get('/', authenticated, async (req, res) => {
	try{
		let listRoom = await mRoom.getFullDetailUser(req.session.user._id);
		let listDeviceNoRoom = await mDeviceInRoom.unused(req.session.user._id);
		return res.render('user_views/device', {'req': req,'res': res,'listRoom': listRoom.result, 'listDevice' : listDeviceNoRoom.result});
	}catch(e){
		console.log('Error get device in room: ' + JSON.stringify(e));
		req.flash('error', 'We can\'t get your device. Please try later');
		res.redirect('/error');
	}
});

router.post('/turn-on', authenticated, (req, res) => {
	let id = req.body.id;
	let user = req.body.user;
	if(!user){
		user = req.session.user._id;
	}
	mDeviceInRoom.onoff(user, id).then(
	(data) => {
		console.log('Success turn on/off');
		res.status(200).json({success: true, status: 200, onvalue: data.status});
		res.end();
	}, (e) => {
		console.log('on/off device ' + JSON.stringify(e));
		res.status(403).json({success: false, status: 403, message: e.message});
		res.end();
	});
});

router.delete('/removeroom', authenticated, (req, res) => {
	let id = req.body.id;
	let data = {'_id' : id, 'room' : null};
	mDeviceInRoom.mUpdate(req.session.user._id, data).then(
	(data)=>{
		console.log('Success remove device from room');
		res.status(200).json({success: true});
		res.end();
	}, (e)=>{
		console.log('delete device failure, ' + JSON.stringify(e));
		res.status(403).json({success: false, message: e.message});
		res.end();
	});
});

router.put('/update', authenticated, (req, res) => {
	let id = req.body.id;
	let data = {_id : id, 'room': req.body.room, 'user': req.session.user._id, 'device': req.body.device, 'device_name': req.body.device_name};
	mDeviceInRoom.mUpdate(req.session.user._id, data).then(
	(data)=>{
		console.log('Success remove device from room');
		res.status(200).json({success: true});
		res.end();
	}, (e)=>{
		console.log('delete device failure, ' + JSON.stringify(e));
		res.status(403).json({success: false, message: e.message});
		res.end();
	});
});


router.post('/add', authenticated, (req, res) => {
	let id = req.body.id;
	let data = {'room': req.body.room, 'user': req.session.user._id, 'device': req.body.device, 'device_name': req.body.device_name};
	mDeviceInRoom.mUpdate(req.session.user._id, data).then(
	(data)=>{
		console.log('Success remove device from room');
		res.status(200).json({success: true});
		res.end();
	}, (e)=>{
		console.log('delete device failure, ' + JSON.stringify(e));
		res.status(403).json({success: false, message: e.message});
		res.end();
	});
});


router.delete('/delete', authenticated, (req, res) => {
	let id = req.body.id;
	mDeviceInRoom.mDelete(req.session.user._id, id).then(
	(data)=>{
		console.log('Success delete device');
		res.status(200).json({success: true});
		res.end();
	}, (e)=>{
		console.log('delete device failure, ' + JSON.stringify(e));
		res.status(403).json({success: false, message: e.message});
		res.end();
	});
});

module.exports = exports = router;
