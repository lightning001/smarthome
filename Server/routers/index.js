var express = require('express'),
	jwt = require('jsonwebtoken'),
	url = require('url'),
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
	console.log('Session index: '+ JSON.stringify(req.session));
	res.render('user_views/home', {
		'req': req,
		'res': res
	});
});
/**
 * error
 */
router.get('/error', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	let error = req.query;
	res.render('user_views/error', {
		error: error.error,
		status: error.status,
		content: error.content | error.message,
		res: res,
		req: req
	});
});

router.get('/profile', (req, res, next) => {
	if (req.session.authentication == null | false || req.session.user == null) {
		res.redirect('/');
	}
	res.render('user_views/profile', {
		'req': req,
		'res': res
	});
});

router.get('/login', (req, res) => {
	res.render('user_views/home', {
		'req': req,
		'res': res
	});
});

router.get('/logout', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	req.session.user = null;
	req.session.authentication = false;
	res.redirect('/');
//	req.session.destroy(function (err) {
//		console.log('Just Logout');
//		res.redirect('/');
//	})
});

router.get('/register', (req, res, next) => {
	res.render('user_views/register', {
		'req': req,
		'res': res
	});
});

router.get('/thankyou', (req, res) => {
	if (req.session.authentication != null | false) {
		res.redirect('/');
	}
	res.render('user_views/thankyou', {
		'req': req,
		'res': res
	});
});

router.get('/mode', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	res.render('user_views/mode', {
		'req': req,
		'res': res
	});
});

router.get('/device', (req, res) => {
	if (req.session.authentication == null | false) {
		res.redirect('/');
	}
	res.render('user_views/device', {
		'req': req,
		'res': res
	});
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


router.get('/' + config.confirm_register_path + '/:encode', (req, res) => {
	let encode = req.params.data;
	mUser.responseConfirm(encode, req, res);
});

module.exports = exports = router;
