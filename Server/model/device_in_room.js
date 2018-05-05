'use strict'

var mongoose = require('mongoose');

var schemaDeviceInRoom = new mongoose.Schema({
  device: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Device'},
  room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
  user: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User'},
  device_name: {type: String},
  status: {type: Boolean, require: true}
});

var DeviceInRoom = mongoose.model('DeviceInRoom', schemaDeviceInRoom, 'DEVICEINROOM');

module.exports = exports = DeviceInRoom;
