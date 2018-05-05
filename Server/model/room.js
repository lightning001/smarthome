'use strict'

var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;

var schemaRoom = new mongoose.Schema({
  id_user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  room_name: {type: String, required: true, default: 'Unknown Room'},
  img: {type: String, default: 'room.png'}
});

schemaRoom.virtual('listDevice', {
  ref: 'DeviceInRoom',
  localField: '_id',
  foreignField: 'room',
  justOne: false
});

var Room = mongoose.model('Room', schemaRoom, 'ROOM');

module.exports = exports = Room;
