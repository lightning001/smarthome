var Mode = require('../model/mode');
var DeviceInRoom = require('../model/device_in_room');
const msg = require('../msg').en;
const config = require('../util/config');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
/**
 * Tìm kiếm dựa vào _id (truyền vào kiểu String) của mode (kiểu ObjectId)
 */
Mode.findBy_ID = (id_user, _id) =>{
	return new Promise((resolve, reject)=>{
		Mode.findOne({'_id' :new mongoose.Types.ObjectId(_id), 'id_user' : id_user}).
		populate('modedetail').
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}

Mode.getFullDetail = (id_user, _id)=>{
	return new Promise((resolve, reject)=>{
		Mode.findOne({'_id' : new mongoose.Types.ObjectId(_id), 'id_user' : id_user}).
		populate({path: 'modedetail', populate: {path: 'device', populate : {path: 'device'}}}).
		exec((error2, data2) => {
			if(error2){
			  return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
			  return resolve({'success': true,  'result' : data2});
			}
  		});
	});
}

let dateOp = require('../util/dateOperation');
require('../model/mode_detail');
require('../model/device');
Mode.getScheduleMode = (id_user, id)=>{
	return new Promise((resolve, reject)=>{
		console.log('User : '+ id_user + ' mode: '+ id);
		Mode.findOne({'id_user' : new mongoose.Types.ObjectId(id_user), '_id' : new mongoose.Types.ObjectId(id)}).
		populate({path: 'modedetail', populate: {path: 'device', populate : {path: 'device', select: 'img'}}}).
		exec((error2, mode) => {
			if(error2){
				console.log(error2);
			  return reject({'success': false, 'message': msg.error.occur});
			} else if (mode) {
				let mMode = mode;
				let currentDay = new Date().getDay();
				let starttime = mode.starttime;
				let stoptime = mode.stoptime;
				for(let j = 0; j < mode.modedetail.length; j++){
					let listSchedule = [];
					let modedetail = mode.modedetail[j];
					if(modedetail.schedule.offtime==0){
						if(modedetail.schedule.ontime>0)
						listSchedule.push({ontime : mode.stoptime - mode.starttime, offtime : 0});
						else
						listSchedule.push({ontime : 0, offtime : 0});
					}else{
						let stop = starttime;
						while(stop<stoptime){
							let item = {};
							item.ontime = stop + modedetail.schedule.ontime;
							stop += modedetail.schedule.ontime
							item.offtime = stop + modedetail.schedule.offtime;
							stop += modedetail.schedule.offtime;
							listSchedule.push(item);
						}
						mMode.modedetail[j].schedule.scheduledetail = listSchedule;
					}
				}
				return resolve({'success' : true, result : {'mode' : mMode}});
			}else{
				resolve({'success' : true, result : {}});
			}
  		});
	});
}


Mode.createSchedule = (date)=>{
	return new Promise((resolve, reject)=>{
		Mode.find({}).
		or([{type : 0, circle : {$in : date.getDay()}}, 
			{type : 1, $and : [
				{day : {startdate : {$lte : date}}}, 
				{day : {stopdate : {$gte : date}}}
			]}
		   ]).
		sort({type : 1, starttime : 1, stoptime : 1, day : 1}).
		populate('modedetail').
		exec((err, data)=>{
			if(err){
				console.log(err);
				reject({success: false, message : err.toString()});
			}else if(data){
				let schedule = [];
				data.forEach(mode=>{
					let SchedulerOn = [];
					let SchedulerOff = [];
					let starttime = mode.starttime;
					let stoptime = mode.stoptime;
					for(let j = 0; j < mode.modedetail.length; j++){
						let modedetail = mode.modedetail[j];
						if(modedetail.schedule.offtime==0){
							if(modedetail.schedule.ontime>0){
								SchedulerOn.push({time : mode.starttime, device : modedetail.device});
								SchedulerOff.push({time : mode.stoptime, device : modedetail.device});
							}
						}else{
							let stop = starttime;
							while(stop<stoptime){
								SchedulerOn.push({time : stop, device : modedetail.device, delay : modedetail.schedule.ontime});
								stop += modedetail.schedule.ontime
								if(stop<stoptime){
									SchedulerOff.push({time : stop, device : modedetail.device, delay : modedetail.schedule.offtime});
									stop += modedetail.schedule.offtime;
								}

							}
							SchedulerOff.push({time : stoptime, device : modedetail.device});
						}
					}
					schedule.push({mode : mode._id, user : mode.id_user, scheduleOn : SchedulerOn, scheduleOff : SchedulerOff});
				});
				resolve(schedule);
			}else{
				resolve([]);
			}
		});
	});
}

Mode.findByUser = (id_user) =>{
  	return new Promise((resolve, reject)=>{
		Mode.find({'id_user' : new mongoose.Types.ObjectId(id_user)}).
		populate({path: 'modedetail', populate: {path: 'device', populate : {path: 'device'}}}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}

Mode.findByName = (data) =>{
	return new Promise((resolve, reject)=>{
		Mode.find({'name': {$regex: data.name}, 'id_user' : new mongoose.Types.ObjectId(data.id_user)})
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({success : true, 'result' : data2});
			}
		});
	});
}



Mode.mInsert = (user, data) =>{
	return new Promise((resolve, reject)=>{
		let mMode = new Mode();
		mMode.mode_name = data.mode_name,
		mMode.id_user   = new mongoose.Types.ObjectId(user);
		mMode.circle    = data.circle;
		mMode.starttime = data.starttime;
		mMode.stoptime  = data.stoptime;
		mMode.save(async (error2, result) =>{
			if (error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else{
				if(data.modedetail!=null){
					console.log('data.modedetail != null');
					let mModeDetail = require('./modedetail');
					mModeDetail.insertArray(user, data.modedetail, result);
				}
				return resolve({'success': true, 'result' : result});
			}
		});
	});
};

Mode.mUpdate = (user, data) => {
	return new Promise((resolve, reject)=>{
		Mode.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
		exec((error2, result) => {
			if (error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else{
				return resolve({'success': true, 'id' : user, 'result' : result});
			}
		});
	});
};

Mode.mDelete = (user, mode_ID) =>{
	return new Promise((resolve, reject)=>{
		Mode.remove({'_id' : new mongoose.Types.ObjectId(mode_ID)}).
		exec((error2) => {
			if (error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else{
				let ModeDetail = require('../model/mode_detail');
				ModeDetail.deleteMany({'mode' :  new mongoose.Types.ObjectId(mode_ID)});
				return resolve({'success': true, 'result' : mode_ID});
			}
		});
	});
};
/**
 * Lấy về tất cả các Mode
 */

Mode.getAllMode = () => {
	return new Promise((resolve, reject)=>{
		Mode.find().
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
Mode.getByPage = (token, data) =>{
	return new Promise((resolve, reject)=>{
		Mode.find().
		skip((data.page-1)*data.quantity).
		limit(data.quantity).
		sort({name : 1, type : 1, price : -1}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}
module.exports = exports = Mode;
