//let mRoom = require('./control/room');
//mRoom.mInsert('5ab3333038b9043e4095ff84', {room_name : 'Living'}).then(result=>{
//	console.log(result);
//}).catch(e=>{
//	console.log(e);
//})
//
//let mDeviceInRoom = require('./control/deviceinroom');
//mDeviceInRoom.unused('5af00d1f8ce2293e143c9b8e').then(data=>{
//	console.log(data);
//}).catch(e=>{
//	console.log(JSON.stringify(e));
//});

// var mMode = require('./control/mode');
// mMode.getFullDetail("5ab3333038b9043e4095ff84", '5ab47f0d52b9ed7bf00ed1c6').then(data=>{
// 	console.log(JSON.stringify(data));
// }).catch(e=>{
// 	console.log(JSON.stringify(e));
// });
//mMode.getScheduleMode('5ab3333038b9043e4095ff84', '5b73dcdc7a268a11a4e69e9d').then(data=>{
//	console.log(JSON.stringify(data));
//}).catch(e=>{
//	console.log(JSON.stringify(e));
//})

//var date = new Date(3600000).toISOString().split('T')[1].split('.')[0];
//console.log(date);
//
//mMode.createSchedule(new Date()).then(
//	data=>console.log(JSON.stringify(data))).catch(
//	e=>console.log(JSON.stringify(e)));


//$search

//let search = require('./control/search');
//search.user_search('5ab3333038b9043e4095ff84' ,'phòng', function(err, data){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(JSON.stringify(data));
//    }
//});

//var Admin = require('./control/admin');
//Admin.authen('linhdanit1512@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', (err, data)=>{
//	if(err){
//		console.log(err);
//	}else if(data){
//		console.log(JSON.stringify(data));
//	}
//});
//
//Admin.byToken('eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1YjZkMmQyMDE5YzExYWNmZDE5NjUwNjEiLCJlbWFpbCI6ImxpbmhkYW5pdDE1MTJAZ21haWwuY29tIiwic3RhdHVzIjp0cnVlLCJhZG1pbiI6dHJ1ZSwicm9sZSI6WzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0XX0.9uYU7xWFyMLol7JwIGa_YCd8a7Q_0W-hYdQcb22wRNc', (err, data)=>{
//	if(err){
//		console.log(err);
//	}else if(data){
//		console.log(JSON.stringify(data));
//	}
//})
//var mModeDetail = require('./control/modedetail');
//mModeDetail.insertArray( "5ab3333038b9043e4095ff84", ["5ad69946c28bc8368823b6a7", "5ad69946c28bc8368823b6a2"] ,"5ad76f967b86c1a68133bb98").
//then(
//	data=>console.log(JSON.stringify(data))).catch(
//	e=>console.log(JSON.stringify(e)));


//let Key = require('./control/recognition');
//let data = {"turnon":"on","device":"5afe61cb3c70ce293c242e32"} ;
////Key.mInsert(data, " 5af00d1f8ce2293e143c9b8e").then(data=> console.log(JSON.stringify(data))).catch(e=> console.log(e));
//Key.recognition('tắt quạt', '5ab3333038b9043e4095ff84').then(data=> console.log(JSON.stringify(data))).catch(e=> console.log(e));
//

var nts=require('node-task-scheduler');
 
var scheduler = nts.init({
  tasksDir : './tasks'
});
 
global.scheduler = scheduler; //available to entire application
 
scheduler.addTask('hello', {hello: 'world'}, function(args, callback){
  console.log("Hello from hello! ", "ARGS: "+args.hello);
  callback();
}, "0/2 * * * * *", new Date(new Date().getTime()+4000));
 
 
//removing the task
scheduler.removeTask('hello', function(){
  console.log("Task 'hello' removed.");
});