'use strict'
var express = require('express'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	jwt = require('jsonwebtoken'),
	path = require('path'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	port = process.env.PORT || 3000,
	config = require('./util/config'),
	{initStorage} = require('./util/storage'),
	timeout = 500;

app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: config.secret_key, resave: true, saveUninitialized: true, cookie: {maxAge : 1000*60*300}}));
app.use(cookieParser(config.cookie_secret_key));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', [	path.join(__dirname + '/views')]);
var userRouter = require('./routers/user'),
	deviceinroomRouter = require('./routers/deviceinroom'),
	roomRouter = require('./routers/room'),
	modeRouter = require('./routers/mode'),
	indexRouter = require('./routers/index'),
	adminRouter = require('./routers/admin');

app.use('/', userRouter);
app.use('/', indexRouter);
app.use('/room', roomRouter);
app.use('/mode', modeRouter);
app.use('/device', deviceinroomRouter);
app.use('/admin', adminRouter);
require('./msocket')(io);
let schedule = require('./control/schedule');

server.listen(port, function() {
	console.log("Waiting statement...");
});
