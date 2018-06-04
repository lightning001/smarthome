module.exports = {
	authenticated : function(req, res, next){
		if(req.session.authentication == false | null){
			res.redirect('/');
		}else{
			let jwt = require('jsonwebtoken');
			let config = require('../util/config');
			let msg = require('../msg').en;
			jwt.verify(req.session.usertoken, config.secret_key, function(err, data){
				if(err){
					req.flash('alertmessage', msg.error.verify_token);
					res.redirect('/');
				}else{
					next();
				}
			});
		}
	}
}