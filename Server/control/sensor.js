var Sensor = require('../model/sensor'),
	msg = require('../msg').en;

/*
	type:
	LightSensor : 1, (anh sang)
	Temperature sensor : 2, (nhiet do)
	Humidity sensor : 3, (do am)
	Sound sensor : 4, (am thanh)
	Infrared sensor : 5, (hong ngoai)
	Rain sensor : 6, (mua)
	Flame sensor : 7, (lua),
	Motion sensor : 8, (chuyen dong)

	*/

Sensor.Types = {
	LIGHT : 1,
	TEMPERATURE : 2,
	HUMIDITY : 3,
	SOUND : 4,
	INFRARED : 5,
	RAIN : 6,
	FLAME : 7,
	MOTION : 8
}

Sensor.getMeasure = (user, device)=>{
	return new Promise((resolve, reject)=>{
		Sensor.findOne({device : new mongoose.Types.ObjectId(device)}).
		populate({path : 'device', match : {'user' : user}}).
		exec((err, result)=>{
			if(err){
				reject({'success' : false, 'message' : msg.error.occur});
			}else if(!err && !result){
				resolve({'success': true, 'result' : []});
			}else{
				resolve({'success': true, 'result' : result});

			}
		})
	});
}

Sensor.insert = (data)=>{
	return new Promise((resolve, reject)=>{
		let ssor = new Sensor();
		ssor.device = new mongoose.Types.ObjectId(data.device)
		ssor.measure = data.measure;
		ssor.action = data.action;
		ssor.type = data.type;
		ssor.save((err)=>{
			if(err){
				reject({success : false, message : msg.error.occur});
			}else{
				resolve({success: true});
			}
		});
	})
}

Sensor.GET = (type)=>{
	return new Promise((resolve, reject)=>{
		Sensor.find({'type' : type}).
		exec((err, result)=>{
			if(err){
				reject({'success' : false, 'message' : msg.error.occur});
			}else if(!err && !result){
				resolve({'success': true, 'result' : []});
			}else{
				resolve({'success': true, 'result' : result});

			}
		})
	})
}

module.exports = exports = Sensor;
