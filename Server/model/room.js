'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database;

var schemaRoom = new mongoose.Schema({
  id_user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  room_name: {type: String, required: true, default: 'Unknown Room'},
  img: {type: String, default: 'https://image.ibb.co/nJfnon/room.png'}
},{ toJSON : {virtuals: true}});

schemaRoom.virtual('listDevice', {ref : 'DeviceInRoom', localField : '_id', foreignField : 'room', justOne : false});

var Room = conn.model('Room', schemaRoom, 'ROOM');

module.exports = exports = Room;
