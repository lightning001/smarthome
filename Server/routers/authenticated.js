module.exports = {
	authenticated : function(req, res, next){
		let config = require('../util/config');
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
	},
	admin_authenticated : function(req, res, next){
		let config = require('../util/config');
		if(req.session.admin_authenticated == false | null | undefined){
			res.redirect('/login');
		}else if(req.session.admintoken == null|undefined){
			res.redirect('/login');
		}else{
			let msg = require('../msg').en;
			let Admin = require('../control/admin');
			Admin.byToken(req.session.admintoken, (err, u)=>{
				if(err){
					res.redirect('/login');
				}else{
					if(u.result.admin!= true){
						req.session.admintoken = null;
						req.session.admin_authenticated = false;
						return res.redirect('/login');
					}
					if(u.result.role == null | undefined | []){
						req.session.admintoken = null;
						req.session.admin_authenticated = false;
						return res.redirect('/login');
					}
					req.session.admin = u.result;
					next();
				}
			});
		}
	},
	admin_deauthenticated : function(req, res, next){
		if(req.session.admin_authenticated==true || !(req.session.admin == null | undefined)){
		 return	res.redirect('/admin');
	 }else{
		 next();
	 }
	}
}
