var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	
	getEvents : function(start, end, cb){

		connectionPool(function(conn){

			conn.query("select tbl_service_manager.id, transaction_id, start, end, tbl_service_manager.title, period " + 
						"from tbl_service_manager " +
						"join tbl_transaction " +
						"on tbl_transaction.id = transaction_id " +
						"join tbl_customer " +
						"on tbl_customer.id = customer_id " +
						"where date(start) between date(?) and date(?) " +
						"and active = 1", [start, end], 
						function(err, results){
						
							if(err) throw err;

							return cb(results);

						});

		});

	},
	insertEvent : function(transaction, cb){
		connectionPool(function(conn){

			conn.query("insert into tbl_service_manager (transaction_id, start, end, title, period) " +
						"values(?,?,?,?,?) ",
						[transaction.insertId, transaction.start, transaction.end, transaction.title, transaction.period],
						function (err, result) {
							
							if (err) throw err;

							cb(result);

						});

		});
	}
}