'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaModeDetail = new mongoose.Schema({
  mode : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'Mode'},
  device : {type : mongoose.Schema.Types.ObjectId, require : true, ref : 'DeviceInRoom'},
});

var ModeDetail = conn.model('ModeDetail', schemaModeDetail, 'MODEDETAIL');

module.exports = exports = ModeDetail;
