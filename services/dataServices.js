var connectionPool = require('./handle_database.js').handle_database;

var transactionData = require('./transactionData.js');
var productData = require('./productData.js');
var customerData = require('./customerData.js');

module.exports = {
	insertTransaction :function(customer, cb){

		connectionPool(function(conn){

		//Still need to change input name in the front end to match database names
			customerData.insertCustomer(customer, function(customer_results){

				productData.insertProduct(customer.product_name, function(product_results){
					console.log(customer)
					
					var transaction = { 
						customer_id : customer_results.insertId,  product_id : product_results.insertId, 
						invoice_link : customer.invoice_link,  comments : customer.comments
					}
					console.log(customer_results, product_results, transaction);

					transactionData.insertTransaction(transaction, function(transaction_results){

						cb(transaction_results);

					});

				});

			});

		});
		
	}
};
