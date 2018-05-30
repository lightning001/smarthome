require('./model/Mode');
require('./model/Device');
require('./model/Room');
require('./model/mode_detail')
require('./model/device_in_room')
var mMode = require('./control/Mode');
var User = require('./control/user'),
	jwt = require('jsonwebtoken'),
	config = require('./util/config'),
	mongoose = require('mongoose');

//
//jwt.verify("eyJhbGciOiJIUzI1NiJ9.NWFiMzMzMzAzOGI5MDQzZTQwOTVmZjg0.EnVjo5H02UHuVQqeJvrEfCxyA1CZnaaloJlEVc8T0kE", config.secret_key, (error, data) => {
//	if (error) {
//		console.log(error);
//	} else {
//		console.log('token: '+data);
//		User.findById(new mongoose.Types.ObjectId(data), {
//			password: 0
//		}).
//		populate('listMode').
//		populate('listRoom').
//		exec((error2, data2) => {
//			if (error2) {
//				console.log(error2);
//			} else if (!error2 && data2) {
//				console.log(data2);
//			}
//		});
//
//	}
//});

//var d1 = new Date('2018-05-29 10:10:00.000+07:00');
//var d2 = new Date('2018-05-29 00:10:00.000+07:00');
//let a = 
//console.log(d1.getTime() - d2.getTime());
//console.log('-----------------------------');
//User.verifyResetPassword('linhdanit1512@gmail.com', '210027').then(
//(data)=> console.log(JSON.stringify(data)), (e)=>console.log(JSON.stringify(e))
//);
//
//console.log('type date: '+ new Date() instanceof Date);

mMode.getFullDetail('eyJhbGciOiJIUzI1NiJ9.NWFiMzMzMzAzOGI5MDQzZTQwOTVmZjg0.EnVjo5H02UHuVQqeJvrEfCxyA1CZnaaloJlEVc8T0kE','5ab47f0d52b9ed7bf00ed1c6').then(
data =>console.log(JSON.stringify(data)), e=>console.log(JSON.stringify(e)));