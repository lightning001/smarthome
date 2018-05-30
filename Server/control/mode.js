var Mode = require('../model/mode');
var DeviceInRoom = require('../model/device_in_room');
const msg = require('../msg').en;
const config = require('../util/config');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
/**
 * Tìm kiếm dựa vào _id (truyền vào kiểu String) của mode (kiểu ObjectId)
 */
Mode.findBy_ID = (token, _id) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      Mode.findById(new mongoose.Types.ObjectId(_id)).
	  populate('listModeDetail').
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          return resolve({'success': true,  'result' : data2});
        }
      });
  });});
}

Mode.getFullDetail = (token, _id)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
			Mode.findById(new mongoose.Types.ObjectId(_id)).
			populate({
				path: 'listModeDetail',
				populate:{
					path: 'device',
					populate : {
						path: 'device',
						select: 'img'
					}
				}
			}).
			exec((error2, data2) => {
			if(error2){
			  console.log(error2);
			  return reject({'success': false, 'message': msg.error.occur});
			} else if (!error2 && data2) {
			  console.log(data2);
			  return resolve({'success': true,  'result' : data2});
			}
		});
  		});
	});
}

Mode.findByUser = (token, id_user) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      Mode.find({'id_user' : new mongoose.Types.ObjectId(id_user)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          return resolve({'success': true,  'result' : data2});
        }
      });});
  });
}

Mode.findByName = (token, data) =>{
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      Mode.find({'name': {$regex: data.name}, 'id_user' : new mongoose.Types.ObjectId(data.id_user)})
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
			return resolve({success : true, 'result' : data2});
        }
      });
	});});
}



Mode.mInsert = (token, data) =>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      let mMode = new Mode();
      mMode.mode_name = data.mode_name,
      mMode.id_user   = new mongoose.Types.ObjectId(data.id_user);
      mMode.status    = data.status;
      mMode.circle    = data.circle;
      mMode.starttime = data.starttime;
      mMode.stoptime  = data.stoptime;

      mMode.save((error2) =>{
        if (error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          return resolve({'success': true});
        }
      });});});
};

Mode.mUpdate = (token, data) => {
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      Mode.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
      exec((error2) => {
        if (error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          return resolve({'success': true});
        }
      });
	});});
};


/**
 * @param mode_ID:
 *            mã _id (truyền vào string) của thiết bị (co kiểu ObjectId)
 * 
 * @objective : thực hiện xóa 1 mode
 */
Mode.mDelete = (token, mode_ID) =>{
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      Mode.remove({'_id' : new mongoose.Types.ObjectId(mode_ID)}).
      exec((error2) => {
       if (error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else{
          console.log(true);
          return resolve({'success': true});
        }
      });});
	});
};
/**
 * Lấy về tất cả các Mode
 */

Mode.getAllMode = (token) => {
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      Mode.find().
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          return resolve({'success': true,  'result' : data2});
        }
      });});
  });
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
Mode.getByPage = (token, data) =>{
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      Mode.find().
      skip((data.page-1)*data.quantity).
      limit(data.quantity).
      sort({name : 1, type : 1, price : -1}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          return resolve({'success': true,  'result' : data2});
        }
      });})});
}
module.exports = exports = Mode;
