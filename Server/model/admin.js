'use strict'

var mongoose = require('mongoose');
var config = require('../util/config');

var schemaAdmin = new mongoose.Schema({
	user : {type : mongoose.Schema.Types.ObjectId, ref : 'User', index : {unique : true}},
	passport : {type : String, index : {unique : true}},
	role : {type : []},
	position : {type : String},
	status : {type : Boolean, default : true}
}, { toJSON : {virtuals: true}});

var Admin = config.database.model('Admin', schemaAdmin, 'ADMIN');

module.exports = exports = Admin;
