'use strict';

var express = require('express');
var router = express.Router();
var error = require('./error');
var user = require('./user');
var chatboard = require('./chatboard');

router.get('/', user.render);

router.get('/chatboard', user.isAuthenticated, chatboard.render, error)

router
.post('/user/login', user.get, user.loginVerify, user.buildSession, user.response, error)
.post('/user/signup', user.addnew, user.buildSession, user.response, error)
.post('/user/logout', user.destroySession, user.response, error);

module.exports = router;