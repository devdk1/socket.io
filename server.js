'use strict';

var http = require('http');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var app = express();
var router = express.Router();

var session = require('./session')

//get port from env and store
var port = process.env.PORT || 9876;
app.set('port', port)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session);

app.use(logger('dev'));

app.use(router);

var routes = require('./routes');
var socket = require('./socket');
app.use('/', routes);

var server = http.createServer(app);

server.listen(port, listenHandler);
server.on('error', errorHandler);
socket(server);

function errorHandler(error) {
  switch(error.code) {
    case 'EACCES':
      console.error('requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(port + ' is already in use');
      process.exit(1);
      break
    default:
      throw error;
  }
}

function listenHandler() {
  console.log('JustCall: server running on port: ' +  port);
  console.log('To open in browser click => http://localhost:' + port);
}
module.exports = app;
