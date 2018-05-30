'use strict'
var mongoose = require('mongoose');
const 
	uri = 'mongodb://localhost:27017/SmartHome',
	uri2 = 'mongodb://smarthome2018:123456@ds040877.mlab.com:40877/smarthome',
	uri_version = 'mongodb://localhost:27017/VersionSmartHome',
//	host = 'http://192.168.1.134:3000/',
	host = 'https://smarthome2018.herokuapp.com/',
//	host = 'http://192.168.15.135:3000/',
//	 host = 'http://192.168.1.115:3000/',
//  host = 'http://192.168.43.154:3000/',
	port = 3000,
	options = {
		reconnectTries: 30, // trying to reconnect
		reconnectInterval: 500, // Reconnect every 500ms
		// poolSize: 10 // Maintain up to 10 socket connections
		// If not connected, return errors immediately rather than waiting for reconnect
	};
var database = mongoose.createConnection(uri2, options),
	database_version = mongoose.createConnection(uri_version, options);


// mongoose.connect(uri, options);
module.exports = exports = {
	uri: uri,
	uri_version: uri_version,
	database: database,
	database_version: database_version,
	secret_key: 'smarthome_itnls',
	upload_path: 'image/',
	upload_media: 'media/',
	host: host,
	options: options,
	confirm_register_path: 'confirmregister',
	emailFrom: 'smarthomeproject2018@gmail.com',
	emailPassword: '100100.m'
};
