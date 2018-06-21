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
router.get('/', authenticated, (req, res) => {
	if(req.session.user == null){
		res.render('user_views/home', {req : req, res : res, messages: req.flash('failureLogin'), alertmessage : req.flash('alertmessage')});
	} else if(req.session.user !=null) {
		res.redirect('/room');
	}
});

router.get('/test',authenticated, (req, res) => {
	let mRoom = require('../control/room');
	mRoom.getFullDetailUser(req.session.user._id).then(
	(data) => {
		res.render('user_views/test', {'req': req, 'res': res, 'listRoom': data.result});
	}, (e) => {
		req.flash('error', e.message);
		res.redirect('/error');
	});
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
	res.render('user_views/camera', {'req': req,'res': res});
});

module.exports = exports = router;
