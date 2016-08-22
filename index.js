var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();


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
	productData = require('./services/productData.js');


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

	dataServices.insertTransaction(req.body, function(){

		res.redirect('/customers');

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

	transactionData.updateTransaction(req.body, function(){

		res.redirect('/customers');

	});
});

app.post(['/', '/home'], function (req, res) {
	console.log(req.body);
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

		res.redirect('/customers');

	});

});

app.get('/invoices', function(req, res){
	
	transactionData.getTransactions(function(results){

		res.render('invoices', {invoiceList : results});

	});

});

app.get('/*' , function (req, res) {
	res.redirect('/home');
});

app.post('/*' , function (req, res) {
	console.log('Not cool!');
	res.redirect('/customers');
});

var port = 5433;

app.listen(port, function(){
	console.log('Time: ', new Date());
	console.log('Server running on port:', port);
});
