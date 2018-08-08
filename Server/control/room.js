var Room = require('../model/room');
const DeviceInRoom = require('../control/deviceinroom'),
	fs = require('fs'),
	ImageResize = require('../resize'),
	path = require('path'),
	msg = require('../msg').en,
	jwt = require('jsonwebtoken'),
	mongoose = require('mongoose'),
	config = require('../util/config'),
	randomstring = require('randomstring');
require('../model/device');
require('../model/device_in_room');

/**
 * server_send_all_device_user
 */
Room.getAllDeviceUser = function(id_user){
	return new Promise((resolve, reject) => {
		Room.find({'id_user': new mongoose.Types.ObjectId(id_user)}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				console.log(JSON.stringify(data2));
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

Room.getFullDetail = function(user, _id){
	return new Promise((resolve, reject) => {
		Room.findOne({'_id': new mongoose.Types.ObjectId(_id), 'id_user' : new mongoose.Types.ObjectId(user)}).
		populate({path: 'listDevice', populate:{path: 'device'}}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

Room.getFullDetailUser = function(user){
	return new Promise((resolve, reject) => {
		Room.find({'id_user' : new mongoose.Types.ObjectId(user)}).
		populate({path: 'listDevice', populate :{path : 'device'}}).
		exec((error2, data2)=> {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

Room.findByUser = (user)=>{
	return new Promise((resolve, reject) => {
		Room.find({'id_user' : new mongoose.Types.ObjectId(user)}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

Room.findBy_ID = (user, _id) => {
	return new Promise((resolve, reject) => {
		Room.findOne({'_id' : new mongoose.Types.ObjectId(_id), 'id_user' : user}).
		populate({path: 'listDevice', populate :{path : 'device'}}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

Room.findByName = (user, name) => {
	return new Promise((resolve, reject) => {
		Room.find({'room_name': {$regex: name},'id_user': new mongoose.Types.ObjectId(user)}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

getImageName = (id) => {
	let date = new Date();
	let s = date.toISOString();
	let tmp = s.replace(/-/g, '').replace(/T/g, '_').replace(/:/g, '').replace(/Z/g, '').replace(/./g, '');
	return tmp+'_' + id + '.png';
}

Room.mInsert = (user, data) => {
	return new Promise((resolve, reject) => {
		let mRoom = new Room();
		mRoom.id_user = new mongoose.Types.ObjectId(user);
		mRoom.room_name = data.room_name;
		if(data.img){
			if (typeof data.img == 'string' && data.img != ''){
				if(data.img.indexOf('data:image')>=0){
					console.log(data.img);
					let fileName = getImageName(randomstring.generate(15));
					let base64Data = data.img.replace(/^data:image\/png;base64,/, '').replace(/^data:image\/jpeg;base64,/, "");
					fs.writeFile('public/'+config.upload_path +'room/'+fileName, base64Data, 'base64');
					mRoom.img = config.host +config.upload_path+ 'room/'+ fileName;
				}else{
					mRoom.img = config.host +config.upload_path+'room/' + data.img;
				}
			}else if(data.img instanceof Buffer){
				let fileName = getImageName(randomstring.generate(15));
				fs.writeFile('public/'+config.upload_path +'room/' + fileName, data.img);
				mRoom.img = config.host +config.upload_path+ 'room/'+ fileName;
			}else if(data.img!=null && data.img==''){
				delete data.img;
			}
		}
		mRoom.save((error2, docs) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				if (data.device != null) {DeviceInRoom.setRoom(data.device, docs._id);}
				if(data.img !=null){
					let mpath = 'room/'+ path.posix.basename(docs.img);
					ImageResize.resize(mpath, 400, 400, mpath);
				}
				return resolve({'success': true, 'id' : user, 'result': docs});
			}
		});
	});
}

/**
 * @param mRoom:
 *            1 thiết bị đầy đủ thuộc tính
 */
Room.mUpdate = (user, data) => {
	return new Promise((resolve, reject) => {
		if (data.img != null && typeof data.img == 'string' && data.img != '') data.img = config.host +config.upload_path+'room/' + data.img;
		else if(data.img!=null && data.img instanceof Buffer){
			let fileName = getImageName(randomstring.generate(20));
			fs.writeFile('public/'+config.upload_path + 'room/' +fileName, data.img);
			data.img = config.host +config.upload_path+ 'room/' +fileName;
		}else if(data.img!=null && data.img ==''){delete data[img];}
		Room.update({'_id': new mongoose.Types.ObjectId(data._id)}, {$set: data}).
		exec((error2, result) => {
			if (error2) {
				return reject({'success': false, 'message': msg.error.occur});
			} else {
				if (data.device != null) {DeviceInRoom.setRoom(data.device, data._id);}
				if(data.img !=null){
					let mpath = 'room/'+ path.posix.basename(result.img);
					ImageResize.resize(mpath, 400, 400, mpath);
				}
				return resolve({'success': true, 'id' : user, 'result' : data});
			}
		});
	});
};

/**
 * @param room_ID:
 *            mã _id của thiết bị (kiểu ObjectId)
 * @objective : thực hiện xóa 1 room
 */
Room.mDelete = (user, _id, isRemoveDevice) => {
	console.log('User: '+user + '_id: '+_id);
	return new Promise((resolve, reject) => {
		Room.remove({'_id': new mongoose.Types.ObjectId(_id)}).exec((error2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				if(isRemoveDevice ==0){
					DeviceInRoom.unsetRoom(_id);
					resolve({'success': true, 'id' : user, 'result' : _id});
				}else if(isRemoveDevice == 1){
					DeviceInRoom.mDeleteByRoom(user, new mongoose.Types.ObjectId(_id));
					resolve({'success': true, 'id' : user, 'result' : _id});
				}
			}
		});
	});
};

Room.mDeleteByUser = (user)=>{
	Room.find({'id_user': new mongoose.Types.ObjectId(user)}).exec((error2, data) => {
		if (error2) {
			console.log(error2);
		} else if(data){
			Room.deleteMany({'id_user': new mongoose.Types.ObjectId(user)});
			data.forEach(room=>{
				DeviceInRoom.deleteMany({_id : new mongoose.Types.ObjectId(data._id)});
			});
		}
	});
}
/**
 * Lấy về tất cả các Room
 */

Room.getAllRoom = () => {
	return new Promise((resolve, reject) => {
		Room.find().
		populate({path: 'listDevice'}).
		exec((error2, data2) => {
			if (error2) {
				return reject({'success': false,'message': msg.error.occur});
			} else {
				return resolve({'success': true,'result': data2});
			}
		});
	});
}
/**
 * Lấy danh sách thiết bị theo số lượng và trang (dùng cho phân trang)
 */
Room.getByPage = (data) => {
	return new Promise((resolve, reject) => {
		Room.find({}).
		skip((data.page - 1) * data.quantity).
		limit(data.quantity).
		sort({id_user: 1,room_name: 1}).
		exec((error2, data2) => {
			if (error2) {
				console.log(error2);
				return reject({'success': false,'message': msg.error.occur});
			} else {
				console.log(data2);
				return resolve({'success': true,'result': data2});
			}
		});
	});
}

module.exports = exports = Room;
