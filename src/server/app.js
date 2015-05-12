'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'dev';
var logLevel = process.env.NODE_LOG_LEVEL;

// configure dev logger
if (logLevel === 'none') {
  require('./common/myLog.js').config({
    logFlag: false,
    logTypesAllowed: []
  });
} else {
  require('./common/myLog.js').config({
    logFlag: true,
    logTypesAllowed: ['Success', 'Error', 'Info']
  });
}

var dbName = 'login';
if (env === 'test') {
  // use test db
  dbName = 'login_test';
}

mongoose.connect('mongodb://localhost/' + dbName);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/../client/content/img/favicon.ico'));
app.use(logger('dev'));

// We are going to protect /api routes with JWT (not sure if this needs to be first or is better after logger)
var publicKey = 'mySecretKeyForNow';
// var publicKey = fs.readFileSync('/pat/to/public.pub');
app.set('jwtTokenSecret', publicKey); // so we can use this in other places
app.use('/api', expressJwt({
  secret: publicKey
    //requestProperty: 'auth'
    // ,
    // getToken:function(req){
    //   if(req.headers.authorization &&  req.headers.authorization.split(' ')[0] === 'Bearer'){
    //     return req.headers.authorization.split(' ')[1];
    //   }
    // }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// routes setup
require('./routes/index.js')(app);

// in dev environment we serve the page from /src/client
// and resources from /bower_components
app.use('/', express.static('./src/client'));
app.use('/', express.static('./'));

// error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    msg: err
  });
});

console.log('About to crank up node');
console.log('PORT: ' + port);
console.log('NODE_ENV: ' + env);
console.log('DB: ' + dbName);
console.log('NODE_LOG_LEVEL: ' + logLevel);

module.exports = app;
