'use strict'

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var conn = require('../util/config').database_version;

var schemaVersionDevice = new mongoose.Schema({
  device_id : {type : mongoose.Schema.Types.ObjectId},
  name : {type : String},
  img : {type : String},
  description : {type : String},
  price : {type : mongoose.Schema.Types.Double, default : 0},
  type : {type : Number},
  version : {type : Number}
});

var VersionDevice = conn.model('VersionDevice', schemaVersionDevice, 'VERSIONDEVICE');

module.exports = exports = VersionDevice;
