'use strict';
var sql = require('sql');
var util = require('util');
var mysql = require('mysql');
var debug = require('debug')('model:base');

sql.setDialect('mysql');

function Model(schema, dbConfig) {
	dbConfig.connectionLimit = 10;

	this.table = sql.define(schema);
	this.conn = mysql.createPool(dbConfig);
}

Model.prototype = {
	listing: function(options, cb) {
		var self = this;
		var selectFields = [];
		
		selectFields = this.table.star();
		var query = this.table.select(selectFields).from(this.table);
		var filters = options.filters || {};
    var preparedFilters = [];
		for(var f in filters) {  
			if(typeof filters[f] == 'string' || typeof filters[f] == 'number') {
				preparedFilters.push(this.table[f].equals(filters[f]));
			} else if (util.isArray(filters[f])) {
        preparedFilters.push(this.table[f].in(filters[f]));
      }
    }
    
    var or = options.or || {}
    var orKeys = Object.keys(or)
    if (orKeys.length) {
      var orFilters = this.table[orKeys[0]].equals(or[orKeys[0]])
      for (var i = 1; i < orKeys.length; i++) {
        orFilters = orFilters.or(this.table[orKeys[i]].equals(or[orKeys[i]]));            
      }

      preparedFilters.push(orFilters)
    }

		if(preparedFilters && preparedFilters.length) {
			query = query.where(preparedFilters);
		}
		if (options.orderBy && (typeof(options.orderBy) === 'object')) {
			var fields = [];
			for (var f in options.orderBy) {
				if (self.table[f])
					fields.push(self.table[f][options.orderBy[f]]);
			}
			if(fields.length)
				query =  query.order(fields);
		}
		query = query.toQuery();
		debug('[Model:list] ', query);
		this.conn.query(query.text, query.values, cb);
	},
	
	insert: function(options, cb) {
		var query = this.table.insert(options).toQuery();
		debug('[Model:insert] ', query);
		this.conn.query(query.text, query.values, cb);
	},
	
	update: function(options, cb) {
		if(options.id) {
			var id = options.id;
			delete options.id;
		}
		var query = this.table.update(options);
		if(util.isArray(id)) {
			query = query.where(this.table.id.in(id)).toQuery();
		} else {
			query = query.where(this.table.id.equals(id)).toQuery();
		}
		debug('[Model:update] ', query);
		this.conn.query(query.text, query.values, function(err, result){
			if(err) { return cb(err); }
			options.id = id;
			cb(null, options);
		});
	}
}

module.exports = Model;