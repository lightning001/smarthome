var Key = require('../model/key_control_device'),
	mongoose = require('mongoose'),
	msg = require('../msg').en,
	DeviceInRoom = require('../model/device_in_room');

Key.recognition = function(key, user){
	return new Promise((resolve, reject)=>{
		if(key!= undefined){
			Key.findOne({}).populate({path: 'device', match : {'user' : new mongoose.Types.ObjectId(user)}}).or([{'turnon' : key}, {'turnoff' : key}]).
			exec(async (err, data)=>{
				if(err){
					return reject({'success': false, 'message' : msg.error.occur});
				}else if(data){
					if(key == data.turnon){
						if(data.device.status == false){
							await DeviceInRoom.update({_id : new mongoose.Types.ObjectId(data.device._id)}, {$set : {status : true}}).exec();
							return resolve({success : true, result : {'action' : 'on', 'device' : data.device}});
						}else{
							return resolve({success : true, result : {'action' : 'no_action'}});
						}
						
					}else if(key==data.turnoff){
						if(data.device.status == true){
							await DeviceInRoom.update({_id : new mongoose.Types.ObjectId(data.device._id)}, {$set : {status : false}}).exec();
							return resolve({success : true, result : {'action' : 'off', 'device' : data.device}});
						}else{
							return resolve({success : true, result : {'action' : 'no_action'}});
						}
					}
				}else{
					return reject({'success': false, 'message' : msg.empty.not_found});
				}
			})

		}
		
	})
}

Key.mInsert = (data, user)=>{
	return new Promise((resolve, reject)=>{
		let query = []
		if(data.device!=undefined)
			query.push({device : data.device});
		if(data.turnon !=undefined)
			query.push({turnon : data.turnon});
		if(data.turnoff != undefined)
			query.push({turnoff : data.turnoff});
		Key.findOne({}).or(query).populate({path : 'device', match : {'user' : user}}).exec((err, result)=>{
			if(err){
				console.log(err);
				return reject({'success': false, 'message' : msg.error.occur});
			}
			console.log(JSON.stringify(result));
			if(!err && (result == null || result == undefined)){
				let mKey = new Key();
				mKey.device = new mongoose.Types.ObjectId(data.device);
				mKey.turnon = data.turnon;
				mKey.turnoff = data.turnoff;
				mKey.save((err2, result)=>{
					if(err2){
						console.log(err2);
						return reject({'success': false, 'message' : msg.error.occur});
					}else{
						console.log(JSON.stringify(result))
						return resolve({'success' : true, 'result' : result});
					}
				});
			}else{
				return reject({'success': false, 'message' : 'This device is exists key'});
			}
		})
	})
}

Key.mUpdate = (data, user)=>{
	return new Promise((resolve, reject)=>{
		let query = [];
		if(data.device!=undefined)
			query.push({device : data.device});
		if(data.turnon !=undefined){
			query.push({turnon : data.turnon});
			query.push({turnoff : data.turnon});
		}
		if(data.turnoff != undefined){
			query.push({turnoff : data.turnoff});
			query.push({turnon : data.turnoff});
		}
		Key.findOne({}).or(query).populate({path : 'device', match : {'user' : user}}).exec((err, result)=>{
			if(err){
				console.log(err);
				return reject({'success': false, 'message' : msg.error.occur});
			}else if(!err && result){
				if(result.device._id==data.device){
					if(result.turnon!=data.turnon && result.turnoff!=data.turnoff && result.turnon!=data.turnoff&& result.turnoff!=data.turnon){
						Key.update({device : new mongoose.Types.ObjectId(data.device)}, {$set : data}).exec((err2, result)=>{
							if(err2){
								console.log(err2);
								return reject({'success': false, 'message' : msg.error.occur});
							}else if(result){
								return resolve({'success' : true, 'result' : data});
							}
						});
					}
				}else{
					return reject({'success': false, 'message' : 'This key was exists'});
				}
			}else if(!result){
				return Key.mInsert(data, user);
			}else{
				console.log('result: '+JSON.stringify(result));
				return reject({'success': false, 'message' : msg.error.occur});
			}

		})
	});
}

Key.mDelete = (id)=>{
	return new Promise((resolve, reject)=>{
		Key.remove({_id : new mongoose.Types.ObjectId(id)}).exec((err)=>{
			if(err){
				return reject({'success': false, 'message' : msg.error.occur});
			}else{
				return resolve({'success' : true, 'result' : id});
			}
		})
	});
}

module.exports = exports = Key;