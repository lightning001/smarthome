var express = require('express'),
	jwt = require('jsonwebtoken'),
	msg = require('../msg'),
	{authenticated} = require('./authenticated'),
	mUser = require('../control/user'),
	config = require('../util/config');

var router = express.Router();

/**
 * home
 */
router.get('/', (req, res) => {
	if(req.session.user ==null){
		console.log('user = null');
		if (req.session.usertoken != null) {
			console.log('verify token');
			mUser.byToken(req.session.usertoken).then(
			(decode)=>{
				req.session.user = decode.result;
				console.log('Session user: '+ JSON.stringify(req.session.user._id));
				req.session.authentication = true;
				res.redirect('/room');
			}, 	(e)=>{
				console.log(JSON.stringify(e));
			});
		}else{
			res.render('user_views/home', {req : req, res : res, messages: req.flash('failureLogin'), alertmessage : req.flash('alertmessage')});
		}
	}
	else if(req.session.user !=null) {
		res.redirect('/room');
	}
});

/**
 * error
 */
router.get('/error', (req, res) => {
	res.render('user_views/error', {req : req, res : res, errormessage : req.flash('error')});
});

router.get('/camera', authenticated, (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	res.render('user_views/camera', {
		'req': req,
		'res': res
	});
});

module.exports = exports = router;
