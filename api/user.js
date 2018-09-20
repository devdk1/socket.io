'use strict';

var hash = require('../lib').hash;
var model = require('../model').user;
var APIError = require('../lib').APIError;

var user = {};

user.get = function(input, cb) {
	var options = {
		filters: {}
	};
	['id'].forEach(function(e) {
		if(input[e] !== undefined && !isNaN(Number(input[e]))) { 
			options.filters[e] = Number(input[e]); 
		}
  });

	['username', 'email'].forEach(function(e) {
		if(input[e] !== undefined) { 
			options.filters[e] = input[e]; 
		}
	});

	if (input.u_email) {
		options.or = {
      username: input.u_email,
      email: input.u_email
		}
  }

	model.listing(options, function(err, result) {
		if(err) { return cb(err); }
		if(!result || !result.length) {
			return cb(new APIError(450, 'No user found', 'API_UG_4001'));
		}
		if(result[0].password) {
			result[0].password = hash.decrypt(result[0].password);
		}
		cb(null, result[0]);
	});
};

user.list = function(input, cb) {
	var options = {
		filters: input
	};

	model.listing(options, function(err, result) {
		if(err) { return cb(err); }
		if(!result || !result.length) {
			return cb(new APIError(450, 'No user found', 'API_UG_4001'));
    }
    
    var userMap = {};
    result.forEach(result => {
      delete result.password
      userMap[result.id] = result
    });
		cb(null, userMap);
	});
};

user.add = function(input, cb) {
	var mandatoryFields = ['full_name', 'username', 'email', 'password'];
	var options = {};
	var err;
	mandatoryFields.forEach(function(e) {
		if(input[e] !== undefined) { 
			options[e] = input[e]; 
		}
	});
	for(var i in mandatoryFields) {
		var mField = mandatoryFields[i];
		if(!options[mField]) {
			err = new APIError(409, mField + ' is mandatory field', 'API_UA_4001');
			return cb(err);
		}
	}
	if(options.password) {
		var originalPassword = options.password;
		options.password = hash.encrypt(options.password);
	}

  model.insert(options, function(err, result) {
		if(err) {return cb(err); }
		options.id = result && result.insertId;
		options.password = originalPassword;
		return cb(null, options);
	});
};

module.exports = user;

(function () {
  if (require.main === module) {
    user.list({id: [1000, 1001, 1002]}, console.log)
  }
}())