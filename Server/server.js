'use strict'
var express = require('express'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser'),
	config = require('./util/config'),
	path = require('path'),
	jwt = require('jsonwebtoken'),
	flash = require('connect-flash'),
	port = process.env.PORT || 3000,
	mUser = require('./control/user'),
	timeout = 500;
	
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: config.secret_key, resave: true, saveUninitialized: true, cookie: {'token' : 'abc'}}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', [	path.join(__dirname + '/views')]);

var userRouter = require('./routers/user'),
	deviceinroomRouter = require('./routers/deviceinroom'),
	roomRouter = require('./routers/room'),
	modeRouter = require('./routers/mode'),
	indexRouter = require('./routers/index');

app.use('/', userRouter);
app.use('/', indexRouter);
app.use('/room', roomRouter);
app.use('/mode', modeRouter);
app.use('/device', deviceinroomRouter);

require('./msocket')(io);

server.listen(port, function() {
	console.log("Waiting statement...");
});