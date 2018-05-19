var Key = require('../model/key_control_device'),
 msg = require('../msg').en,
 config = require('../util/config'),
 jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

Key.mInsert = (token, data)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
			let k = new Key();
			k.device = data.device;
			k.on = data.on;
			k.off = data.off;
			k.save((err)=>{
				if(err){
					return reject({'success' : false, 'message' : msg.error.occur});
				}else{
					return resolve({'success' : true});
				}
			})
		});
	});
}

Key.mUpdate = (token, data)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
			Key.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : {data}}).
			exec((err)=>{
				if(err){
					return reject({'success' : false, 'message' : msg.error.occur});
				}else{
					return resolve({'success' : true});
				}
			});
		});
	});
}

Key.mDelete = (token, _id)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
			Key.remove({'_id': new mongoose.Types.ObjectId(_id)}).
		      exec((error2) => {
		        if(error2){
		          console.log(error2);
		          return reject({'success': false, 'message': msg.error.occur});
		        } else {
		          console.log(true);
		          return resolve({'success': true});
		        }
		      });
		});
	});
}

Key.getByDevice = (token, device)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
			Key.find({'device' : new mongoose.Types.ObjectId(device)}).
			exec((err, data)=>{
				if(err){
					return reject({'success': false, 'message': msg.error.occur});
				}else{
					return resolve({'success': true, 'result' : data});
				}
			});
		});
	});
}

module.exports = exports = Key;