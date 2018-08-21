var Key = require('../model/key_control_device'),
 msg = require('../msg').en,
 config = require('../util/config'),
 jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

Key.mInsert = (user, data)=>{
	return new Promise((resolve, reject)=>{
		let k = new Key();
		k.device = data.device;
		k.on = data.on;
		k.off = data.off;
		k.save((err, result)=>{
			if(err){
				return reject({'success' : false, 'message' : msg.error.occur});
			}else{
				return resolve({'success' : true, 'id' : user, 'result' : result});
			}
		})
	});
}

Key.mUpdate = (user, data)=>{
	return new Promise((resolve, reject)=>{
		Key.findOneAndUpdate({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : {data}}).
		exec((err, result)=>{
			console.log('AAA'+result);
			if(err){
				return reject({'success' : false, 'message' : msg.error.occur});
			}else if(result){
				return resolve({'success' : true, 'id' : user, 'result' : result});
			}else{
				Key.mInsert(user, data);
			}
		});
	});
}

Key.mDelete = (user, _id)=>{
	return new Promise((resolve, reject)=>{
		Key.remove({'_id': new mongoose.Types.ObjectId(_id)}).
		exec((error2) => {
			if(error2){
			  return reject({'success': false, 'message': msg.error.occur});
			} else {
			  return resolve({'success': true, 'id' : user, 'result' : _id});
			}
		});
	});
}

Key.getByDevice = (device)=>{
	return new Promise((resolve, reject)=>{
		Key.find({'device' : new mongoose.Types.ObjectId(device)}).
		exec((err, data)=>{
			if(err){
				return reject({'success': false, 'message': msg.error.occur});
			}else{
				return resolve({'success': true, 'result' : data});
			}
		});
	});
}

module.exports = exports = Key;