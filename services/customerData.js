var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	getCustomers : function (order_by, cb) {
		connectionPool(function (conn) {
			
			order_by = order_by?order_by:'created_date';

			conn.query("select * from tbl_customer " +
						"where active = 1 " +
						"order by created_date desc"
						, order_by, function (err, results) {
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
			conn.query("select * from tbl_customer where id = ? " +
						"and active = 1", customer_id, function (err, results) {
						conn.release();
						if (err) throw err;
						cb(results);
			});
		});
	},
	getAddressCustomerId : function (customer_id, cb) {
		connectionPool(function (conn) {
			conn.query("select * from tbl_location where customer_id = ? " +
						"and active = 1", customer_id, function (err, results) {
						conn.release();
						if (err) throw err;
						cb(results);
			});
		});
	},
	insertCustomer : function(customer, cb){

		connectionPool(function(conn){

			conn.query("insert into tbl_customer (company, contact, phone, email) values(?,?,?,?) " +
						"on duplicate key update active = 1",
						[customer.company, customer.contact, customer.phone, customer.email],
						function(err, results){
							if(err) throw err;

							cb(results);

						});

		});

	},
	deactivateCustomer : function(customer_id, cb){
		connectionPool(function(conn){

			conn.query("update tbl_customer set active = 0 " +
						"where id = ?",
						customer_id,
						function(err, results){
							if(err) throw err;

							cb(results);

						});

		});
	},
	activateCustomer : function(customer_id, cb){
		connectionPool(function(conn){

			conn.query("update tbl_customer set active = 1 " +
						"where id = ?",
						customer_id,
						function(err, results){
							if(err) throw err;

							cb(results);

						});

		});
	},
	updateCustomer : function(customer, cb){

		connectionPool(function(conn){

			var cust = {
				company : customer.company,
				contact : customer.contact,
				phone : customer.phone,
				email : email,
				id : customer_id
			}

			conn.query("update tbl_customer " +
						"set ? " +
						"where id = ?",
						[cust, cust.id],
						function(err, results){
							if(err) throw err;

							cb(results);

						});

		});

	}
}
