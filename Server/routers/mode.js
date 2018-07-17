var express = require('express'),
	msg = require('../msg'),
	{authenticated} = require('./authenticated'),
	mMode = require('../control/mode'),
	mRoom = require('../control/room'),
	mDeviceInRoom = require('../control/deviceinroom'),
	mModeDetail = require('../control/modedetail'),
	config = require('../util/config'),
	router = express.Router();

var changeCircle = (circle)=>{
	let newCircle = [];
	for(var i =0; i<circle.length; i++){
		switch(circle[i]){
			case 0:
				newCircle.push("Sunday");
				break;
			case 1:
				newCircle.push("Monday");
				break;
			case 2:
				newCircle.push("Tuesday");
				break;
			case 3:
				newCircle.push("Wednesday");
				break;
			case 4:
				newCircle.push("Thursday");
				break;
			case 5:
				newCircle.push("Friday");
				break;
			case 6:
				newCircle.push("Saturday");
		}
	}
	return newCircle;
}

var convertCircle = (circle)=>{
	let newCircle = [];
	for(var i =0; i<circle.length; i++){
		let day = '';
		switch(circle[i]){
			case "Sunday":
				newCircle.push(0);
				break;
			case "Monday":
				newCircle.push(1);
				break;
			case "Tuesday":
				newCircle.push(2);
				break;
			case "Wednesday":
				newCircle.push(3);
				break;
			case "Thursday":
				newCircle.push(4);
				break;
			case "Friday":
				newCircle.push(5);
				break;
			case "Saturday":
				newCircle.push(6);
		}
	}
	return newCircle;
}

router.get('/', authenticated, (req, res) => {
	mMode.findByUser(req.session.user._id).then(
	(data) => {
		let listMode = [];
		if (data.result != undefined && data.result.length > 0) {
			listMode = data.result;
		}
		res.render('user_views/mode', {'req': req,'res': res,'listMode': listMode});
	}, (e) => {
		req.flash('error', 'We can\'t get your Mode. Please try later');
		res.redirect('/error');
	});
});

router.get('/:id', authenticated, async (req, res) => {
	let id = req.params.id;
	if(id.indexOf('add')==0){
		let listDevice = [],
			listRoom = [];
		await mDeviceInRoom.findByUser(req.session.user._id).then((result) => {
			listDevice = result.result
		}).catch((e)=> {
			req.flash('error', 'We can\'t take your require. Please try later');
			res.redirect('/error');
		});
		await mRoom.getFullDetailUser(req.session.user._id).then((result) => {
			listRoom = result.result;
		}).catch((e)=> {
			req.flash('error', 'We can\'t take your require. Please try later');
			res.redirect('/error');
		});
		return res.render('form/add/mode', {req : req, res : res, listDevice : listDevice, listRoom : listRoom, failure : req.flash('error')});
	}else{
		mMode.getScheduleMode(req.session.user._id, id).then(
			(data) => {
				data.result.mode.circle = changeCircle(data.result.mode.circle);
				res.render('user_views/modedetail', {req: req, res: res, 'mode': data.result.mode});
			}).catch((err) => {
				req.flash('error', 'We can\'t get this mode. Please try later');
				res.redirect('/error');
		});
	}
});

module.exports = exports = router;