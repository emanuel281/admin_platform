var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

var fs = require('fs-extra');
var formidable = require('formidable');

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var dataServices = require('./services/dataServices.js');
// var usefulFunctions = require('./services/usefulFunctions.js');
var customerData = require('./services/customerData.js'),
	transactionData = require('./services/transactionData.js')
	productData = require('./services/productData.js'),
	serviceManager = require('./services/serviceManager.js');


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get(['/', '/home'], function(req, res){

	res.render('home');

});

app.get('/customers', function (req, res) {
	
	customerData.getCustomers(null,function (customerList) {
		res.render('customers', {customerList : customerList});
	});
});

app.get('/add/customer', function (req, res) {
	res.render('new_customer');
});

app.post('/add/customer', function (req, res) {

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, file) {

		fields.invoice_file = file.invoice_file.name;

		dataServices.insertTransaction(fields, function(results){

			var cust = fields;
			cust.insertId = results.insertId;
			cust.title = 'Service Due: ' + fields.product_name 

			serviceManager.insertEvent(cust, function(response){

				res.redirect('/invoices');

			});

		});
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location =  __dirname  + '/invoices/';
 
        fs.copy(temp_path, new_location + file_name, function(error) {  
            if (error) throw error;
        });
    });

    form.on('error', function(err) {
        console.error(err);
    });

});

app.get('/edit/customer/:id', function (req, res) {

	customerData.getCustomerById(req.params.id, function (customerList) {
		transactionData.getTransactionByCustomerId(req.params.id, function (productList) {

			res.render('edit_customer', {customerList : customerList,
									productList : productList
									});
		});
	});

});

app.post('/edit/customer/:id', function (req, res) {

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, file) {

		fields.invoice_link = file.invoice_file.name;

		transactionData.updateTransaction(fields, function(results){

	    	res.redirect('/invoices');

		});

    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location =  __dirname  + '/invoices/';
 
        fs.copy(temp_path, new_location + file_name, function(error) {  
            if (error) throw error;


        });
    });

    form.on('error', function(err) {
            console.error(err);
        });

});

app.post(['/', '/home'], function (req, res) {

    res.redirect('/customer');
});

app.get('/products', function (req, res) {
	productData.getProducts(function (response) {
		res.render('products', {productList : response});
	});
});

app.post('/customers/all', function (req, res) {
	customerData.getCustomers(function (customerList) {
		res.send(customerList);
	});
});

app.get('/customers/:id', function (req, res) {
	customerData.getCustomerById(req.params.id, function (customerList) {
		transactionData.getTransactionByCustomerId(req.params.id, function (productList) {

			res.render('customers', {customerList : customerList,
									productList : productList
									});
		});
	});
});

//Expecting /customers/search/?field=value
app.get('/customers/search/', function (req, res) {
	var req_params = req.body;
	customerData.searchCustomers(req_params, function (customerList) {
		res.send(customerList);
	});
});

app.get('/deactivate/customer/:id', function(req, res){

	customerData.deactivateCustomer(req.params.id, function(){

		res.redirect('/invoices');

	});

});

app.get(['/invoices', '/customer/transactions'], function(req, res){
	
	transactionData.getTransactions(function(results){

		res.render('invoices', {invoiceList : results});

	});

});

app.get('/calendar/events', function(req, res){

	// console.log(req.body, req.params, req.query)
	req.query.start_date = new Date(req.query.start_date);
	req.query.end_date = new Date(req.query.end_date);

	serviceManager.getEvents(req.query.start_date, req.query.end_date, function(events){
		res.json(events);
	});

});

app.post('/add/event', function(req, res){

	// console.log(req.query, req.params, req.body)
	serviceManager.insertEvent(req.body, function(events){
		res.json(events);
	});

});

app.get('/invoices/:filename', function(req, res){

	res.sendFile(__dirname + '/invoices/'+req.params.filename);

});

app.get('/*' , function (req, res) {
	res.redirect('/invoices');
});

app.post('/*' , function (req, res) {
	
	res.redirect('/invoices');
});

var port = 5433;

app.listen(port, function(){
	console.log('Time: ', new Date());
	console.log('Server running on port:', port);
});
