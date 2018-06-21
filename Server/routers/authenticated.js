module.exports = {
	authenticated : function(req, res, next){
		let localStorage = require('localStorage'),
			config = require('../util/config');
		if(req.session.authentication == false | null | undefined){
			res.redirect('/login');
		}else if(req.session.usertoken == null|undefined){
			res.redirect('/login');
		}else{
			let msg = require('../msg').en;
			let User = require('../control/user');
			User.byToken(req.session.usertoken).then(u=>{
				if(u.result.status == config.user_status.Pending){
					req.session.active_email = u.result.email;
					req.session.active_name = u.result.email;
					return res.redirect('/active');
				}else if(u.result.status == config.user_status.Block){
					req.flash('alertmessage', 'You are Blocked');
					return res.redirect('/login');
				}else if(u.result.status == config.user_status.Active){
					req.session.user = u.result;
					next();
				}
			}).catch(e=>{
				console.log('cannot verify token');
				res.redirect('/login');
			});
		}
	},
	deauthenticated : function(req, res,next){
		if(req.session.user != null && req.session.user!=undefined){
			res.redirect('/room');
		}else{
			next();
		}
	}
}
