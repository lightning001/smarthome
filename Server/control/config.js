'use strict'

var mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/SmartHome';
// const uri = 'mongodb://smarthome2018:123456@ds040877.mlab.com:40877/smarthome'

const options = {
  reconnectTries: 30, // trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  // poolSize: 10 // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

// mongoose.connect(uri, options);
module.exports = exports = {
  uri : uri,
  options : options,
  secret_key : 'smarthome_itnls'
};
