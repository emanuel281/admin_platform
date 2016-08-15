var db = require('mysql');
var conf = require('../db_config.json');

var pool = db.createPool(conf);
console.log('Created Pool connection');
console.log('Getting database Conneciton...');

exports.handle_database = function (cb) {
	pool.getConnection(function (err, connection) {
		if (err) throw err;

		cb(connection);

		connection.on('error', function (err) {
			throw err;
		})
	})
}