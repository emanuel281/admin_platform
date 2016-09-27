var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	
	insertLocation : function(customer, cb){

		connectionPool(function(conn){

			conn.query("insert into tbl_location (address, customer_id) values(?,?)", [customer.address, customer.customer_id], function(err, results){
				// console.log(results)
				if(err) throw err;

					return cb(results);

				});

		});

	}
}