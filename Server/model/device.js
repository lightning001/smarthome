'use strict'

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var config = require('../util/config');

var schemaDevice = new mongoose.Schema({
  name : {type : String, text : true},
  img : {type : String, default : config.host + 'image/device/no-images.png'},
  description : {type : String},
  price : {type : mongoose.Schema.Types.Double, default : 0},
  type : {type : Number}
}, { toJSON : {virtuals: true}});

var Device = config.database.model('Device', schemaDevice, 'DEVICE');

module.exports = exports = Device;
