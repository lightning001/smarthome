'use strict'

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var schemaDevice = new mongoose.Schema({
  name : {type : String},
  img : {type : String},
  description : {type : String},
  price : {type : mongoose.Schema.Types.Double, default : 0},
  type : {type : Number}
});

var Device = mongoose.model('Device', schemaDevice, 'DEVICE');

module.exports = exports = Device;
