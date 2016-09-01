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

			Date.prototype.toYMD = Date_toYMD;
			    function Date_toYMD() {
			        var year, month, day;
			        year = String(this.getFullYear());
			        month = String(this.getMonth() + 1);
			        if (month.length == 1) {
			            month = "0" + month;
			        }
			        day = String(this.getDate());
			        if (day.length == 1) {
			            day = "0" + day;
			        }
			        return year + "-" + month + "-" + day;
			    }

			    event.start = new Date(event.start);
			    event.start.toYMD();
			    console.log(event.start)
			    
			    event.end = new Date(event.end);
			    event.end.toYMD();
			    console.log(event.end)


			conn.query("insert into tbl_service_manager (transaction_id, start, end, title, period) " +
						"values(?,date(?),date(?),?,?) ",
						[event.insertId, event.start, event.end, event.title, event.period],
						function (err, result) {
							
							if (err) throw err;

							cb(result);

						});

		});
	}
}