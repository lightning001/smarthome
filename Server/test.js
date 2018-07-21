//let mRoom = require('./control/room');
//mRoom.mInsert('5ab3333038b9043e4095ff84', {room_name : 'Living'}).then(result=>{
//	console.log(result);
//}).catch(e=>{
//	console.log(e);
//})
//
//let mDeviceInRoom = require('./control/deviceinroom');
//mDeviceInRoom.findByUser('5af00d1f8ce2293e143c9b8e').then(data=>{
//	console.log(data);
//}).catch(e=>{
//	console.log(JSON.stringify(e));
//});

var mMode = require('./control/mode');
mMode.getDeviceUnusedInMode("5ab3333038b9043e4095ff84", '5ab47f0d52b9ed7bf00ed1c6').then(data=>{
	console.log(JSON.stringify(data));
}).catch(e=>{
	console.log(JSON.stringify(e));
});
//mMode.getScheduleMode('5ab3333038b9043e4095ff84', '5ab47f0d52b9ed7bf00ed1c6').then(data=>{
//	console.log(JSON.stringify(data));
//}).catch(e=>{
//	console.log(JSON.stringify(e));
//})

//var date = new Date(3600000).toISOString().split('T')[1].split('.')[0];
//console.log(date);

//mMode.createSchedule(new Date()).then(
//	data=>console.log(JSON.stringify(data))).catch(
//	e=>console.log(JSON.stringify(e)));