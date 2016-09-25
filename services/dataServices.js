var connectionPool = require('./handle_database.js').handle_database;

var transactionData = require('./transactionData.js');
var productData = require('./productData.js');
var customerData = require('./customerData.js');

module.exports = {
	insertTransaction :function(customer, cb){

		connectionPool(function(conn){

		//Still need to change input name in the front end to match database names
			customerData.insertCustomer(customer, function(customer_results){

				productData.insertProduct(customer, function(product_results){
					
					var transaction = { 
						customer_id : customer_results.insertId,  product_id : product_results.insertId, 
						invoice_link : customer.invoice_link,  comments : customer.comments,
						invoice_file : customer.invoice_file
					}

					transactionData.insertTransaction(transaction, function(transaction_results){

						cb(transaction_results);

					});

				});

			});

		});
		
	}
};
