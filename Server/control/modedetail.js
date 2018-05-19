var ModeDetail = require('../model/mode_detail');
const config = require('../util/config');
var mongoose = require('mongoose');
const msg = require('../msg').en;
var jwt = require('jsonwebtoken');

ModeDetail.getDetailMode = (token, mode) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.find({'mode' : new mongoose.Types.ObjectId(mode)}, {'group': 'mode'}).
      populate('mode').
      populate('device').
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.empty.cant_find});
        } else if (!error && data2) {
          console.log(data2);
          return resolve({'success': true,  'result' : data2});
        }
      });});
  });
}

ModeDetail.unused = (token, data) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.find().
      populate({
        path : 'mode',
        match : {
          '_id' : {$nin : [new mongoose.Types.ObjectId(data.mode)]},
          'id_user' : new mongoose.Types.ObjectId(data.id_user)
        }
      }).
      populate('device').
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

ModeDetail.findByMode = (token, mode) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.find({'mode' : new mongoose.Types.ObjectId(mode)}).
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

ModeDetail.findByDevice = (token, device) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.find({'device' : new mongoose.Types.ObjectId(device)}).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          return resolve({'success': true,  'result' : data2});
        }
      });
  });});
}

ModeDetail.findBy_id = (token, _id) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.findById(new mongoose.Types.ObjectId(_id)).
      exec((error2, data2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.empty.cant_find});
        } else if (!error2 && data2) {
          console.log(data2);
          let token2 = jwt.sign(JSON.stringify(data2), config.secret_key, {algorithm: 'HS256'});
          return resolve({'success': true,  'result' : data2});
        }
      });});
  });
}

ModeDetail.mInsert = (token, data) =>{
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      let mModeDetail = new ModeDetail();
      mModeDetail.mode = new mongoose.Types.ObjectId(data.mode);
      mModeDetail.device = new mongoose.Types.ObjectId(data.device);
      mModeDetail.save((err) =>{
        if(err) {
          console.log(err);
         return reject({'success' : false, 'message' : msg.error.occur});
        }else{
          console.log(true);
         return resolve({'success': true});
        }
      });});});
}

ModeDetail.mUpdate = (token, data) => {
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      ModeDetail.update({'_id' : new mongoose.Types.ObjectId(data._id)}, {$set : data}).
      exec((error2) => {
        if(error2){
          console.log(error2);
          return reject({'success': false, 'message': msg.error.occur});
        } else {
          console.log(true);
          return resolve({'success': true});
        }
      });});});
}

ModeDetail.mDelete = (token, _id) =>{
	return new Promise((resolve, reject)=>{
	jwt.verify(token, config.secret_key, (error, decode) => {
		if(error){
			return reject({'success': false, 'message': msg.error.verify});
		}
      ModeDetail.remove({'_id' : new ObjectId(_id)}).
      exec((error2) => {
        if(error2){
          console.log(error2);
         return reject({'success': false, 'message': msg.error.occur});
        } else {
          return resolve({'success': true});
        }
      });});});
};
/**
 * Lấy về tất cả các ModeDetail
 */

ModeDetail.getAllModeDetail = (token) => {
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.find().
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
// ModeDetail.getAllModeDetail().then(data =>console.log(JSON.stringify(data)),
// err =>console.log(err));
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
ModeDetail.getByPage = (token, data) =>{
  return new Promise((resolve, reject)=>{
	  jwt.verify(token, config.secret_key, (error, decode) => {
			if(error){
				return reject({'success': false, 'message': msg.error.verify});
			}
      ModeDetail.find().
      skip((data.page-1) * data.quantity).
      limit(data.quantity).
      sort({id : 1, name : 1, type : 1, price : -1}).
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
module.exports = exports = ModeDetail;
