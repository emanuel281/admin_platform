var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	getCustomers : function (order_by, cb) {
		connectionPool(function (conn) {
			
			order_by = order_by?order_by:'created_date';

			conn.query("select * from tbl_customer order by " + order_by + " desc", function (err, results) {
				conn.release();
				if (err) throw err;
				cb(results);
			});
		});
	},
	searchCustomers : function (req_params, cb) {
		cb({});
	},
	getCustomerById : function (customer_id, cb) {
		connectionPool(function (conn) {
			conn.query("select * from tbl_customer where id = " + customer_id, function (err, results) {
				conn.release();
				if (err) throw err;
				cb(results);
			});
		});
	},
	getAddressCustomerId : function (customer_id, cb) {
		connectionPool(function (conn) {
			conn.query("select * from tbl_location where customer_id = " + customer_id, function (err, results) {
				conn.release();
				if (err) throw err;
				cb(results);
			});
		});
	}
}