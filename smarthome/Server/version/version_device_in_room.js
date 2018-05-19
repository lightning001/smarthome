'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database_version;

var schemaVersionDeviceInRoom = new mongoose.Schema({
  device_in_room_id : {type: mongoose.Schema.Types.ObjectId},
  device: {type: mongoose.Schema.Types.ObjectId, ref: 'VersionDevice'},
  room: {type: mongoose.Schema.Types.ObjectId, ref: 'VersionRoom'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'VersionUser'},
  device_name: {type: String},
  status: {type: Boolean},
  version : {type : Number}
});

var VersionDeviceInRoom = conn.model('VersionDeviceInRoom', schemaVersionDeviceInRoom, 'VERSIONDEVICEINROOM');

module.exports = exports = VersionDeviceInRoom;
