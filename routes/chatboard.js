'use strict';

var chatboard = {};

chatboard.render = function (req, res, next) {
  res.render('chatboard', { username: req.session.user.username })
};

module.exports = chatboard
