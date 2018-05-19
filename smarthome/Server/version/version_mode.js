'use strict'
var mongoose = require('mongoose');
var conn = require('../util/config').database_version;

var schemaVersionMode = new mongoose.Schema({
  mode_id : {type : mongoose.Schema.Types.ObjectId},
  mode_name : {type : String},
  id_user : {type : mongoose.Schema.Types.ObjectId, ref : 'VersionUser'},
  status : {type : Boolean},
  circle : {type : []},
  starttime : {type : Number},
  stoptime : {type : Number},
  version : {type : Number}

});

var VersionMode = conn.model('VersionMode', schemaVersionMode, 'VERSIONMODE');

module.exports = exports = VersionMode;
