'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaKey = new mongoose.Schema({
	  device : {type :  mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
	  turnon : {type : String, default : ""},
	  turnoff : {type: String, default : ""}
});

var KeyOnOffDevice = conn.model('KeyOnOffDevice', schemaKey, 'KEYCONTROLDEVICE');

module.exports = exports = KeyOnOffDevice;