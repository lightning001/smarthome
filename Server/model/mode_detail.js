'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaModeDetail = new mongoose.Schema({
	mode : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Mode'},
	device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
	schedule : {
		ontime : {type: Number},
		offtime : {type: Number},
		scheduledetail : []
	}
});

var ModeDetail = conn.model('ModeDetail', schemaModeDetail, 'MODEDETAIL');

module.exports = exports = ModeDetail;
