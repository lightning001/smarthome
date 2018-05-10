'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database_version;

var schemaVersionRoom = new mongoose.Schema({
  room_id : {type : mongoose.Schema.Types.ObjectId},
  id_user: {type: mongoose.Schema.Types.ObjectId, ref: 'VersionUser'},
  room_name: {type: String},
  img: {type: String},
  version : {type : Number}
});

var VersionRoom = conn.model('VersionRoom', schemaVersionRoom, 'VERSIONROOM');

module.exports = exports = VersionRoom;
