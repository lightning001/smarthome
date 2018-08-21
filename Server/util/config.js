'use strict'
var mongoose = require('mongoose');
var
//	 uri = 'mongodb://masteradmin_linhdan:nlu123456@ds040877.mlab.com:40877/smarthome',
//	 uri_version = 'mongodb://versionsmarthome2018:nlu123456@ds241570.mlab.com:41570/versionsmarthome',
//	 host = 'https://smarthome2018.herokuapp.com/',
	uri = 'mongodb://localhost:27017/SmartHome',
	uri_version = 'mongodb://localhost:27017/VersionSmartHome',
//	 host = 'http://192.168.43.154:3000/',
//	host = 'http://192.168.15.135:3000/',
		host = 'http://192.168.0.103:3000/',
	//	host = 'http://192.168.1.115:3000/',
//		host = 'http://192.168.1.135:3000/',
	//  host = 'http://192.168.43.154:3000/',
	port = 3000,
	options = {
		poolSize: 20,
		reconnectTries: 30, // trying to reconnect
		reconnectInterval: 500 // Reconnect every 500ms
	};
var database = mongoose.createConnection(uri, options);
var database_version = mongoose.createConnection(uri_version, options);
let path = require('path'),
	tmp = path.join(__dirname, 'ac'),
	contextPath = tmp.substring(0, tmp.lastIndexOf('util'));

module.exports = exports = {
	uri: uri,
	dbName : 'SmartHome',
	dbVersionName : 'VersionSmartHome',
	uri_version: uri_version,
	database: database,
	database_version: database_version,
	secret_key: 'smarthome_itnlu',
	admin_secret_key : 'admin_smarthome_itnlu',
	cookie_secret_key: ['cookie_', 'smarthome_itnlu', 'luanvan_linhdan_vanphat'],
	upload_path: 'image/',
	upload_media: 'media/',
	resize_path: 'public/image/',
	contextPath: contextPath,
	host: host,
	mongoose : mongoose,
	options: options,
	confirm_register_path: 'confirmregister',
	emailFrom: 'smarthomeproject2018@gmail.com',
	emailPassword: '100100.m',
	user_status: {
		Pending: 'Pending',
		Active: 'Active',
		Block: 'Block'
	},
	collectionNames : ['USER', 'DEVICE', 'DEVICEINROOM', 'ROOM', 'MODE', 'MODEDETAIL', 'ADMIN']
};
