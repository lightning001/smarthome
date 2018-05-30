var express = require('express'),
	jwt = require('jsonwebtoken'),
	path = require('path'),
	url = require('url'),
	msg = require('../msg');
	mUser = require('../control/User'),
	mMode = require('../control/Mode'),
	mRoom = require('../control/Room'),
	mModeDetail = require('../control/ModeDetail'),
	mDeviceInRoom = require('../control/DeviceInRoom'),
	config = require('../util/config');


var router = express.Router();

/**
 * home
 */
router.get('/', (req, res) => {
	if (req.session != null) {
		if (req.session.authentication == null | false) {
			if (req.session.usertoken != null) {
				jwt.verify(req.session.usertoken, config.secret_key, (e, decode) => {
					if (!e && decode) {
						req.session.user = decode;
						req.session.authentication = true;
						console.log('Auto authentication');
					}
				});
			}
		}
	}
	if (req.session.user != null) {
		res.redirect('/room');
	} else {
		res.render('user_views/home', {req : req, res : res, messages: req.flash('failureLogin'), alertmessage : req.flash('alertmessage')});
	}
});

/**
 * error
 */
router.get('/error', (req, res) => {
	res.render('user_views/error', {req : req, res : res, errormessage : req.flash('error')});
});

router.get('/camera', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	res.render('user_views/camera', {
		'req': req,
		'res': res
	});
});

module.exports = exports = router;
