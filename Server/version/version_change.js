'use strict'

var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	msg = require('../msg'),
	conn = require('../util/config').database_version;

var schemaVersionChange = new mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId},
	content: {type: String},
	table: {type: String},
	ref_id: {type: mongoose.Schema.Types.ObjectId},
	time : {type : Date, default : new Date()}
});

var VersionChange = conn.model('Change', schemaVersionUser, 'CHANGE');

VersionChange.mInsert = (data) => {
	let change = new VersionChange();
	change.user_id = data.user_id;
	change.content = data.content;
	change.table = data.table;
	change.ref_id = data.ref_id;
	change.save().exec();
}

VersionChange.getByUser = (token)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (error, decode)=>{
			if(error){
				return reject({'success' : false, 'message' : msg.error.verify_token});
			}else if(!decode){
				return resolve({'success' : true, 'result' : []});
			}else{
				VersionChange.find({'user_id' : decode._id}).
				exec((e, data)=>{
					if(e){
						return reject({'success' : false, 'message' : msg.error.occur});
					}else{
						resolve({'success' : true, 'result' : data});
					}
				})
			}
		});
	});
}

module.exports = exports = VersionUser;
