'use strict'
var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaMode = new mongoose.Schema({
	mode_name : {type : String},
	id_user : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
	status : {type : Boolean, default : true},
	
//	type: {type : Number},//0: normal: thuc hien cac ngay trong tuan hoac hang ngay; 1: special: thực hiện trong 1 khoảng thời gian
	
	circle : {type : []},
	starttime : {type : Number},
	stoptime : {type : Number}
	
//	day : {startdate : {type : Date}, stopdate : {type : Date}}
}, { toJSON : {virtuals: true}});

schemaMode.virtual('modedetail', {ref : 'ModeDetail', localField : '_id', foreignField : 'mode', justOne : false});

var Mode = conn.model('Mode', schemaMode, 'MODE');

module.exports = exports = Mode;
