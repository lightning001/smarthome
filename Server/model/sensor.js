'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;
require('mongoose-double')(mongoose);

var sensorSchema = new mongoose.Schema({
	device : {type: mongoose.Schema.Types.ObjectId, ref : 'DeviceInRoom'},
	measure : {type: mongoose.Schema.Types.Double, default : 0},
	action : {type : String},
	type : {type : Number, default : 0}
	/*
	type:
	LightSensor : 1, (anh sang)
	Temperature sensor : 2, (nhiet do)
	Humidity sensor : 3, (do am)
	Sound sensor : 4, (am thanh)
	Infrared sensor : 5, (hong ngoai)
	Rain sensor : 6, (mua)
	Flame sensor : 7, (lua),
	Motion sensor : 8, (chuyen dong)

	*/
});

var Sensor = conn.model('Sensor', sensorSchema, 'SENSOR');

module.exports = exports = Sensor;
