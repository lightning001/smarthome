'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var config = require('./database/config');
var mUser = require('./model/user');

mongoose.connect(config.database, config.options);
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.listen(port, () => console.log('Waiting statement'));

var apiRoutes = express.Router();

apiRoutes.post('/login', function(req, res) {

  mUser.login(req.body.name, req.body.password).then(
    (data2) => {
      console.log('Login : ' + data2);
      var token = jwt.sign(data2, app.get('superSecret'), {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      // return the information including token as JSON
      res.json({
        success: true,
        token: token,
        // Result: data2
      });
    },
    (err) => {
      console.log(err);
      res.json({
        success: false,
        Result: err
      });
    }
  );
});
