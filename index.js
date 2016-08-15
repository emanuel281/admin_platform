var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

//var dataServices = require('./services/dataServices.js');
// var usefulFunctions = require('./services/usefulFunctions.js');
var customerData = require('./services/customerData.js');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get(['/', '/customers', '/home'], function (req, res) {
	customerData.getCustomers(null,function (customerList) {
		res.render('customers', {customerList : customerList});
	});
});

app.get('/add/customer', function (req, res) {
	res.render('new_customer');
});

app.post(['/', '/home'], function (req, res) {
	console.log(req.body);
    res.redirect('/customer');
});

app.get('/product', function (req, res) {
	dataServices.getProducts(function (response) {
		res.render('product', {product_list : response});
	});
});

app.post('/customers/all', function (req, res) {
	customerData.getCustomers(function (customerList) {
		res.send(customerList);
	});
});

app.get('/customers/:id', function (req, res) {
	customerData.getCustomerById(req.params.id, function (customerList) {
		customerData.getAddressCustomerId(req.params.id, function (addressList) {
			res.render('customers', {customerList : customerList,
									addressList : addressList
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
 
app.get('/*' , function (req, res) {
	res.redirect('/home');
});

app.post('/*' , function (req, res) {
	console.log('Not cool!');
});

var port = 5433;

app.listen(port, function(){
	console.log('Time: ', new Date());
	console.log('Server running on port:', port);
});