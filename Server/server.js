'use strict'
var express = require('express'),
	session = require('express-session'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser'),
	config = require('./util/config'),
	path = require('path'),
	flash = require('connect-flash'),
	port = process.env.PORT || 3000,
	timeout = 500;
	
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret : config.secret_key, cookie : {}}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', [	path.join(__dirname + '/views'), 
					path.join(__dirname + '/views/user_views'), 
				  	path.join(__dirname + '/views/user_views/form'), 
					path.join(__dirname + '/views/management'),
					path.join(__dirname + '/views/partials')]);
app.use(function(req, res, next) {
	if(req.headers && req.headers.authorization &&	req.headers.authorization.split(' ')[0] === 'JWT') {
 		jsonwebtoken.verify(req.headers.authorization.split(' ')[1],
 		config.secret_key, function(err, decode) {
 			if (err) req.user = undefined;
 			req.user = decode;
 			next();
 		});
 	} else {
 		req.user = undefined;
 		next();
 	}
});


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