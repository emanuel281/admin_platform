var db = require('mysql');
var conf = require('../db_config.json');

var conn = db.createConnection(conf);

module.exports = {
	getCustomers : function(cb) {
	    conn.query("select * from tbl_customer", function (err, response) {
	    	if (err) {
	    		throw err;
	    	}
	    	cb(response);
	    });
	},
	getProducts : function (cb) {
		conn.query("select * from tbl_product", function (err, response) {
	    	if (err) {
	    		throw err;
	    	}
	    	cb(response);
	    });
	}
};