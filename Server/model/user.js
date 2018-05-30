'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaUser = new mongoose.Schema({
	email : {type : String, required: true, index: { unique: true }},
	password : {type : String, required: true},
	name : {type : String},
	street : {type : String},
	district : {type : String},
	city : {type : String},
	postcode : {type : Number, default : 0},
	phonenumber : {type : String},
	homephone : {type : String},
	dob : {type : Date},
	type : {type : String, default : 'Normal'},
	status : {type : String, default : 'Pending'},
	startdateregister : {type : Date, default : Date.now()},
	img : {type : String, default : 'https://image.ibb.co/d7xiTn/men.png'},
	forgetcode : {type: String},
	forgetTimeRequest : {type : Date},
	activeTimeRequest : {type : Date},
	socketUsers : {type : []}
}, { toJSON : {virtuals: true}});

schemaUser.virtual(  'listMode', {ref : 'Mode', localField : '_id', foreignField : 'id_user', justOne : false});
schemaUser.virtual(  'listRoom', {ref : 'Room', localField : '_id', foreignField : 'id_user', justOne : false});
schemaUser.virtual('listDevice', {ref : 'DeviceInRoom', localField : '_id', foreignField : 'user', justOne : false});

var User = conn.model('User', schemaUser, 'USER');

module.exports = exports = User;
