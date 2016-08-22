var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	
	getProducts : function(cb){

		connectionPool(function(conn){

			conn.query("select id, product_name from tbl_product", function(err, results){
				if(err) throw err;

					return cb(results);

				});

		});

	},
	insertProduct : function(product_name, cb){

		connectionPool(function(conn){

			conn.query("insert into tbl_product(product_name) values(?)", product_name,
						function(err, results){

							if (err &&err.errno == 1062) {
								return conn.query("select id from tbl_product where product_name = ?", product_name, function(err, results2){
									results2.insertId = results2[0].id;
									cb(results2);
								});;
							}
							else if(err) throw err;

							return cb(results);

						});

		});

	},
	updateProduct : function(product, cb){

		connectionPool(function(conn){

			conn.query("update tbl_product " +
						"set product_name = ? " +
						"where id = ?"
						, [product.product_name, product.product_id],
						function(err, results){
						if(err) throw err;

							return cb(results);

						});

		});

	}
}