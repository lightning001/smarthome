'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaUser = new mongoose.Schema({
	email : {type : String, required: true, index: { unique: true }, text : true},
	password : {type : String, required: true},
	name : {type : String, text : true},
	street : {type : String},
	commune : {type : String, text : true},
	district : {type : String, text : true},
	city : {type : String, text : true},
	postcode : {type : Number, default : 0},
	phonenumber : {type : String, text : true},
	homephone : {type : String, text : true},
	dob : {type : Date},
	type : {type : String, default : 'Normal'},
	status : {type : String, default : 'Pending'},
	admin : {type : Boolean, default : false},
	role : {type : []},
	startdateregister : {type : Date, default : Date.now()},
	img : {type : String, default : 'https://image.ibb.co/d7xiTn/men.png'}
}, { toJSON : {virtuals: true}});

schemaUser.virtual(  'listMode', {ref : 'Mode', localField : '_id', foreignField : 'id_user', justOne : false});
schemaUser.virtual(  'listRoom', {ref : 'Room', localField : '_id', foreignField : 'id_user', justOne : false});
schemaUser.virtual('listDevice', {ref : 'DeviceInRoom', localField : '_id', foreignField : 'user', justOne : false});
var User = conn.model('User', schemaUser, 'USER');

module.exports = exports = User;
