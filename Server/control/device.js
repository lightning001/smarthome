var Device = require('../model/device');
const msg = require('../msg').en;
const config = require('../util/config');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
/**
 * Tìm kiếm dựa vào _id của device (kiểu ObjectId)
 */
Device.findBy_ID = (_id) =>{
	return new Promise((resolve, reject)=>{
		Device.findById(new mongoose.Types.ObjectId(_id)).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true, 'result' : data2});
			}
		});
	});
}

Device.findByName = (name) =>{
	return new Promise((resolve, reject)=>{
		Device.find({'name': {$regex: name}}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true, 'result' : data2});
			}
		});
	});
}

Device.mInsert = (user, data) =>{
	return new Promise((resolve, reject)=>{
		let mDevice = new Device();
		mDevice.name = data.name;
		mDevice.img = data.img;
		mDevice.description = data.description;
		mDevice.price = data.price;
		mDevice.type = data.type;
		mDevice.save((error2, result)=>{
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else {
				return resolve({'success': true, 'id' : user, 'result' : result});
			}
		});
	});
};

/**
 * @param mDevice:
 *            1 thiết bị đầy đủ thuộc tính
 */
Device.mUpdate = (data) => {
	return new Promise((resolve, reject)=>{
		Device.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
		exec((error2, result) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else {
				return resolve({'success': true, 'result' : result});
			}
		});
	});
};


/**
 * @param device_ID:
 *            mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)
 * 
 * @objective : thực hiện xóa 1 device
 */
Device.mDelete = (_id) =>{
	return new Promise((resolve, reject)=>{
		Device.remove({'_id' : new mongoose.Types.ObjectId(_id)}).
		exec((error2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else{
				return resolve({'success': true, 'result' : _id});
			}
		});
	});
};
/**
 * Lấy về tất cả các Device cach dung: Device.getAllDevice().then(func1(data),
 * func2(err)).catch(func(err)); func1(data) là giá trị khi thực hiện thành
 * công, trả về data func2(err) là xảy ra lỗi khi thực hiện
 */

Device.getAllDevice = () => {
	return new Promise((resolve, reject)=>{
		Device.find({}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true, 'result' : data2});
			}
		});
  	});
};
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
Device.getByPage = (data) =>{
	return new Promise((resolve, reject)=>{
		Device.find().
		skip((data.page-1)*data.quantity).
		limit(data.quantity).
		sort({name : 1, type : 1, price : -1}).
		exec((error2, data2) => {
			if(error2){
				return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
				return resolve({'success': true, 'result' : data2});
			}
		});
	});
};

module.exports = exports = Device;
