//var md5 = require('md5');
//
//console.log(md5('Lucia_vd3'));
//var s = 'e10adc3949ba59abbe56e057f20f883e';
//console.log(s.length);

//device = [{
//	"device": "5ad695bb8ccca527b0176399",
//	"device_name": "tiviphong khac",
//	"user": "5af00d1f8ce2293e143c9b8e"
//}];
//
//var device2 = require('./model/Device_In_Room');
//
//device2.update({'device_name' : 'tiviphong khac'}, {$set : {'__v' : 1}}, {multi : true}, function(err){
//	if(err) console.log(err);
//	else console.log('success');
//})

//var Room = require('./model/Room');
//require('./model/device_in_room');
//Room.find({'id_user': '5af00d1f8ce2293e143c9b8e'}).
//populate('listDeviceRoom').
//exec((error2, data2) => {
//	if (error2) {
//		console.log(error2);
//	} else {
//		console.log(data2);
//	}
//});
