var connectionPool = require('./handle_database.js').handle_database;

var customerData = require('./customerData.js');
var productData = require('./productData.js');

module.exports = {
	getTransactionByCustomerId : function(customer_id, cb){

		connectionPool(function(conn){

			conn.query("select tbl_transaction.id,customer_id, product_id,product_name, invoice_link, comments, invoice_file " +
						"from tbl_transaction " + 
						"join tbl_customer " +
						"on tbl_customer.id = customer_id " +
						"join tbl_product " +
						"on tbl_product.id = product_id " +
						"where customer_id = ? " +
						"and active = 1",
						customer_id,
						function(err, results){
							if (err) throw err;
							
							cb(results);

						});

		});

	},
	insertTransaction : function(transaction, cb){

		connectionPool(function(conn){

			conn.query("insert into tbl_transaction (customer_id, product_id, invoice_link, comments, invoice_file) " +
						"values(?,?,?,?,?)",
						[transaction.customer_id, transaction.product_id, transaction.invoice_link, transaction.comments, transaction.invoice_file],
						function(err, results){
							if(err) throw err;

							cb(results);
						});

		});

	},
	updateTransaction : function(customer, cb){

		connectionPool(function(conn){

			productData.insertProduct(customer.product_name, function(product_results){


				customerData.updateCustomer(customer, function(customer_results){

		
					conn.query("update tbl_transaction " +
								"set invoice_link = ?, " +
								"comments = ? " +
								((customer.invoice_file !== null || customer.invoice_file !== "")?",invoice_file = ? " : " ") +
								"where id = ?", 
								[customer.invoice_link, customer.comments, customer.invoice_file, customer.transaction_id],								
								function(err, results){
									if (err) throw err;
									
									cb(results);

								});

				});

			})

		});

	},
	getTransactions : function(cb){

		connectionPool(function(conn){


			conn.query("select tbl_transaction.id,customer_id, product_id, company, contact,phone,email,product_name, invoice_link, comments, tbl_transaction.invoice_file " +
						"from tbl_transaction " + 
						"join tbl_customer " +
						"on tbl_customer.id = customer_id " +
						"join tbl_product " +
						"on tbl_product.id = product_id " + 
						"where active = 1",								
						function(err, results){
							if (err) throw err;
							
							cb(results);

						});

		});

	}

}