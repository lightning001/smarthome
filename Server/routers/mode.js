var express = require('express'),
	msg = require('../msg'),
	{authenticated} = require('./authenticated'),
	mMode = require('../control/mode'),
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
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}else{
		mMode.findByUser(req.session.usertoken, req.session.user._id).then(
		(data) => {
			let listMode = [];
			if (data.result != undefined && data.result.length > 0) {
				listMode = data.result;
			}
			for(var i = 0; i<listMode.length; i++){
				listMode[i].circle = changeCircle(listMode[i].circle);
			}
			res.render('user_views/mode', {
				'req': req,
				'res': res,
				'listMode': listMode
			});
		}, (e) => {
			req.flash('error', 'We can\'t get your Mode. Please try later');
			res.redirect('/error');
		});
	}
});

router.get('/:id', authenticated, (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}else{
		let id = req.params.id;
		mMode.findBy_ID(req.session.usertoken, id)
		mMode.getFullDetail(req.session.usertoken, id).then(
			(data) => {
				console.log('Mode detail: '+JSON.stringify(data));
				data.result.circle = changeCircle(data.result.circle);
				res.render('user_views/modedetail', {req: req, res: res, 'mode': data.result});
			}).catch((err) => {
				req.flash('error', 'We can\'t get this mode. Please try later');
				res.redirect('/error');
		});
	}
});

module.exports = exports = router;