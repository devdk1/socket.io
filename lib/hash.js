var crypto = require('crypto');

var hash = {};

hash.encrypt = function(text) {
  var cipher = crypto.createCipher('aes-256-cbc', 'justcall@123')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
hash.decrypt = function(text) {
  var decipher = crypto.createDecipher('aes-256-cbc', 'justcall@123')
  var decrypted = decipher.update(text,'hex','utf8')
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = hash;