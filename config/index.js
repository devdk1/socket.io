'use strict';

var Config = {};

Config.db = {
  host: '127.0.0.1',
  user: 'app',
  password: 'dev@93',
  database: 'justcall'
};

Config.redis = {
  host: '127.0.0.1',
  port: '6379'
};

module.exports = Config;