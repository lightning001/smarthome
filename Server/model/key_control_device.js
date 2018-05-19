'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaKey = new mongoose.Schema({
	  device : {type :  mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
	  on : {type : String, require : true},
	  off : {type: String, require : true}
});

var KeyOnOffDevice = conn.model('KeyOnOffDevice', schemaKey, 'KEYCONTROLDEVICE');

module.exports = exports = KeyOnOffDevice;