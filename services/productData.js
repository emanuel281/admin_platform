var connectionPool = require('./handle_database.js').handle_database;

module.exports = {
	
	getProducts : function(cb){

		connectionPool(function(conn){

			conn.query("select id, product_name, product_desc from tbl_product \
				where product_name is not null and product_desc is null", function(err, results){
				if(err) throw err;

					return cb(results);

				});

		});

	},
	insertProduct : function(customer, cb){

		connectionPool(function(conn){

			var insert_prod = "insert into tbl_product(product_name) values(?)";
			var insert_prod_desc = "insert into tbl_product(product_name, product_desc) values(?,?)";
			var insert_query = (undefined == customer.product_desc)?insert_prod:insert_prod_desc;

			conn.query(insert_query, [customer.product_name, customer.product_desc], 
						function(err, results){

							if (err &&err.errno == 1062) {
								return conn.query("select id from tbl_product where product_name = ?", customer.product_name, function(err, results2){
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