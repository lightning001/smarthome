'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaDeviceInRoom = new mongoose.Schema({
  device: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Device'},
  room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
  user: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User'},
  device_name: {type: String, text : true},
  status: {type: Boolean, default : false}
}, { toJSON : {virtuals: true}});

schemaDeviceInRoom.virtual('keyOnOff', {ref : 'KeyOnOffDevice', localField : '_id', foreignField : 'device', justOne : true});
var DeviceInRoom = conn.model('DeviceInRoom', schemaDeviceInRoom, 'DEVICEINROOM');
module.exports = exports = DeviceInRoom;
