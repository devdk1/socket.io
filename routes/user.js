"use strict";
var api = require('../api').user;
var debug = require('debug')('routes:user');
var APIError = require('../lib').APIError;

var user = {};

user.addnew = function (req, res, next) {
  if (!req || !req.body) {
    return next(new APIError(400, 'Invalid Request', 'RT_UA_4000'));
  }
  api.add(req.body, function (err, result) {
    if (err && err.message.indexOf('ER_DUP_ENTRY') !== -1) {
      return next(new APIError(400, 'User already exists, try with different userusername and email', 'RT_UA_4000'))
    }
    if (err) {
      debug(err);
      return next(err || new APIError(403, 'error in creating new user', 'RT_TA_4001'));
    }
    req.result = result;
    return next();
  });
};

user.get = function (req, res, next) {
  if (!req || !req.body) {
    return next(new APIError(400, 'Invalid Request', 'RT_UG_4000'));
  }
  var options = {
    u_email: req.body.u_email
  };
  if (!options.u_email) {
    return next(new APIError(403, 'please enter username/email address', 'RT_UG_4001'));
  }
  api.get(options, function (err, result) {
    if (err) {
      debug(err);
      return next(err || new APIError(403, 'error in fetching user. please try again later.', 'RT_UG_4002'));
    }
    req.result = result;
    return next();
  });
};

user.loginVerify = function (req, res, next) {
  if (req.body.password !== req.result.password) {
    return next(new APIError(401, 'Please Enter Correct Password.', 'RT_ULV_4000'));
  }
  return next();
};

user.buildSession = function (req, res, next) {
  req.session.user = {
    username: req.result.username,
    email: req.result.email,
    id: req.result.id
  };

  return next();
};

user.destroySession = function (req, res, next) {
  delete req.session.user;
  return next();
};

user.response = function (req, res, next) {
  var response = {};
  ['id', 'username', 'email'].forEach(function (e) {
    if (req.result && req.result[e] !== undefined) {
      response[e] = req.result[e];
    }
  });
  response.message = 'success';
  res.json(response);
};

user.render = function (req, res, next) {
  if (req.session && req.session.user && req.session.user.id)
    res.redirect('/chatboard');
  else
    res.render('login');
};

user.isAuthenticated = function (req, res, next) {
  if (req.session && req.session.user && req.session.user.id) {
    return next();
  } else {
    res.redirect('/');
  }
};

module.exports = user;