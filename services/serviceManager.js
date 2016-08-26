var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	
	getEvents : function(start, end, cb){

		connectionPool(function(conn){

			conn.query("select tbl_service_manager.id, transaction_id, start, end, tbl_service_manager.title, period " + 
						"from tbl_service_manager " +
						"where date(start) between date(?) and date(?) " , [start, end], 
						function(err, results){
						
							if(err) throw err;

							return cb(results);

						});

		});

	},
	insertEvent : function(event, cb){
		connectionPool(function(conn){

			conn.query("insert into tbl_service_manager (transaction_id, start, end, title, period) " +
						"values(?,?,?,?,?) ",
						[event.insertId, event.start, event.end, event.title, event.period],
						function (err, result) {
							
							if (err) throw err;

							cb(result);

						});

		});
	}
}