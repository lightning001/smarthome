'use strict'

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 3000;
const timeout = 500;

const config = require('./DAO/config');
mongoose.connect(config.uri, config.options);
server.set('secret_key', config.secret);

server.use(bodyParser.urlencoded({
  extended: false
}));
server.use(bodyParser.json());
//
// var mDevice = require('./DAO/Device');
var mUser = require('./DAO/User');
// var mRoom = require('./DAO/Room');
// var mMode = require('./DAO/Mode');
// var mModeDetail = require('./DAO/Mode_Detail');
// var mDeviceInRoom = require('./DAO/Device_In_Room');
// require('./js/routes.js')(app);

server.listen(port, function() {
  console.log("Waiting statement...");
});

server.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

var apiRoutes = express.Router();

io.sockets.on('connection', (socket) => {
  console.log('connected: ');
  socket.auth = false;
  socket.on('login', (data)=>{
    mUser.login(data.user, data.password).then(
      (data) =>{
        var token = jwt.sign(data, server.get('secret_key'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        socket.
      }
    );
  });

});
