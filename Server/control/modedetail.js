var ModeDetail = require('../model/mode_detail');
const config = require('../util/config');
var mongoose = require('mongoose');
const msg = require('../msg').en;
var jwt = require('jsonwebtoken');

ModeDetail.getDetailMode = (mode) =>{
	return new Promise((resolve, reject)=>{
		ModeDetail.find({'mode' : new mongoose.Types.ObjectId(mode)}, {'group': 'mode'}).
		populate('mode').
		populate('device').
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.empty.cant_find});
			} else if (!error && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}

ModeDetail.findByMode = (mode) =>{
	return new Promise((resolve, reject)=>{
		ModeDetail.find({'mode' : new mongoose.Types.ObjectId(mode)}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}

ModeDetail.findByDevice = (device) =>{
	return new Promise((resolve, reject)=>{
		ModeDetail.find({'device' : new mongoose.Types.ObjectId(device)}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}

ModeDetail.findBy_id = (_id) =>{
	return new Promise((resolve, reject)=>{
		ModeDetail.findById(new mongoose.Types.ObjectId(_id)).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.empty.cant_find});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}



ModeDetail.mInsert = (user, data) =>{
	return new Promise((resolve, reject)=>{
		let mModeDetail = new ModeDetail();
		mModeDetail.mode = new mongoose.Types.ObjectId(data.mode);
		mModeDetail.device = new mongoose.Types.ObjectId(data.device);
		mModeDetail.schedule = data.schedule;
		mModeDetail.save((err, result) =>{
			if(err) {
				return reject({'success' : false, 'message' : msg.error.occur});
			}else{
				return resolve({'success': true, 'id' : user, 'result' : result});
			}
		});
	});
}

ModeDetail.insertArray = (user, data, mode)=>{
	return new Promise((resolve, reject)=>{
		try{
			let result_return = []; var count = 0;
			data.forEach(async function (modedetail){
				let mModeDetail = new ModeDetail();
				mModeDetail.mode = mode;
				mModeDetail.device = modedetail;
				if(modedetail.schedule!=null && modedetail.schedule!=undefined){
					if(mModeDetail.schedule.ontime==null | undefined){
						mModeDetail.schedule.ontime = 0
					}else{
						mModeDetail.schedule.ontime = modedetail.schedule.ontime;
					}
					if(mModeDetail.schedule.offtime ==null |undefined){
						mModeDetail.schedule.offtime = 0;
					}else{
						mModeDetail.schedule.offtime = modedetail.schedule.offtime;
					}
				}else{
					mModeDetail.schedule.ontime = 0;
					mModeDetail.schedule.offtime = 0;
				}
				await mModeDetail.save((error, result)=>{
					count+=1;
					if(error){
						console.log(error);
						reject({success : false, message : msg.error.occur});
					}else{
						result_return.push(result);
					}
					if(count==data.length){
						return resolve({'success' : true, result : result_return});
					}
				});
			});
		}catch(e){
			console.log(e);
			reject({success : false, message : msg.error.occur});
		}
	});
}

ModeDetail.mUpdate = (user, data) => {
	return new Promise((resolve, reject)=>{
		ModeDetail.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
		exec((error2, result) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else {
				return resolve({'success': true, 'id' : user, 'result' : result});
			}
		});
	});
}

ModeDetail.updateArray = (user, arrdata, mode)=>{
	return new Promise((resolve, reject)=>{
		arrdata.forEach(modedetail=>{
			modedetail.mode = mode;
			let mModeDetail = new ModeDetail();
			mModeDetail._id = new mongoose.Types.ObjectId(modedetail._id);
			mModeDetail.mode = new mongoose.Types.ObjectId(mode);
			mModeDetail.device = new mongoose.Types.ObjectId(modedetail.device);
			mModeDetail.save().exec((err)=>{
				if(err){
					return reject({'success': false, 'message': msg.error.occur});
				}
			});
			resolve({'success': true, 'id' : user, 'result' : arrdata});
		});
	});
}

ModeDetail.mDelete = (user, _id) =>{
	return new Promise((resolve, reject)=>{
		ModeDetail.remove({'_id' : new mongoose.Types.ObjectId(_id)}).
		exec((error2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else {
				return resolve({'success': true, 'result' : _id});
			}
		});
	});
};
/**
 * Lấy về tất cả các ModeDetail
 */

ModeDetail.getAllModeDetail = (token) => {
	return new Promise((resolve, reject)=>{
		ModeDetail.find().
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true, 'result' : data2});
			}
		});
	});
}

/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
ModeDetail.getByPage = (token, data) =>{
	return new Promise((resolve, reject)=>{
		ModeDetail.find().
		skip((data.page-1) * data.quantity).
		limit(data.quantity).
		sort({id : 1, name : 1, type : 1, price : -1}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true,  'result' : data2});
			}
		});
	});
}
module.exports = exports = ModeDetail;
