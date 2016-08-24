var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	
	getEvents : function(start, end, cb){

		connectionPool(function(conn){

			conn.query("select id, transaction_id, start, end, title, period " + 
						"from tbl_service_manager " +
						"where date(start) between date(?) and date(?)", [start, end], 
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