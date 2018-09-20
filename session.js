var Config = require('./config');

var session = require('express-session');

var RedisStore = require('connect-redis')(session)

module.exports = session({
  key: 'connect.sid',
  resave: false,
  saveUninitialized: true,
  secret: 'mychatapp',
  unset: 'destroy',
  store: new RedisStore({
    host: Config.redis.host,
    port: Config.redis.port,
    ttl: 2 * 60 * 60
  })    
});