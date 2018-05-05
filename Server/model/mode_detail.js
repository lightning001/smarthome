'use strict'

var mongoose = require('mongoose');
require('./Mode');
require('./Device_In_Room');


var ObjectId = mongoose.Types.ObjectId;

var schemaModeDetail = new mongoose.Schema({
  mode : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Mode'},
  device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
});

var ModeDetail = mongoose.model('ModeDetail', schemaModeDetail, 'MODEDETAIL');

module.exports = exports = ModeDetail;
