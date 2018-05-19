'use strict'
var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaMode = new mongoose.Schema({
  mode_name : {type : String},
  id_user : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
  status : {type : Boolean},
  circle : {type : []},
  starttime : {type : Number},
  stoptime : {type : Number}

});

var Mode = conn.model('Mode', schemaMode, 'MODE');

module.exports = exports = Mode;
