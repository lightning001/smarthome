'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database_version;

var schemaVersionModeDetail = new mongoose.Schema({
  mode_device_id : {type : mongoose.Schema.Types.ObjectId},
  mode : {type : mongoose.Schema.Types.ObjectId, ref : 'VersionMode'},
  device : {type : mongoose.Schema.Types.ObjectId, ref : 'VersionDeviceInRoom'},
  version : {type : Number}
});

var VersionModeDetail = conn.model('VersionModeDetail', schemaVersionModeDetail, 'VERSIONMODEDETAIL');

module.exports = exports = VersionModeDetail;
