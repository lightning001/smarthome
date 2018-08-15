'use strict'

var mongoose = require('mongoose');
var config = require('../util/config');

var schemaRoom = new mongoose.Schema({
  id_user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  room_name: {type: String, required: true, default: 'Unknown Room', text : true},
  img: {type: String, default: config.host+ 'image/room/room.png'}
},{ toJSON : {virtuals: true}});

schemaRoom.virtual('listDevice', {ref : 'DeviceInRoom', localField : '_id', foreignField : 'room', justOne : false});
var Room = config.database.model('Room', schemaRoom, 'ROOM');

module.exports = exports = Room;
