var fs = require('fs');

var escapeRegExp = function(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var getFiles = function (path, filetype, cb) {
	fs.readdir(path, function (err, files) {
		if (err) {
			throw Error(err);
		}

		var list_of_files = [];

		files.forEach(function (file, index) {
			if (file.substr(file.length - filetype.length) == filetype) {
				list_of_files.push(file);
			}
		});

		cb(list_of_files);
	});
}

var getInsertValues = function (str, sepa, connection) {
	
	var rows = str.split('-=-');
	var rows_cols = rows.map(function (element) {
		return element.split(sepa);
	});

	var headers = rows_cols[0];
	rows_cols = rows_cols.slice(1, rows_cols.length);
	var insert_string = '(';

	headers.forEach(function (header, index) {
		if (index < (headers.length-1)) {
			if(header == 'INTERVAL'){
				header = 'INTERVAL_C';
				headers[index] = 'INTERVAL_C';
				// rows_cols[0][index] = 'INTERVAL_C';
			}
			insert_string += header.replace(/'/, "\\'") + ','
		}
		else{
			insert_string += header + ') values';       
		}
	});

	insert_string += rows_cols.map(function(row, index){

						if (row[index] !== null && row[index] !== '') {
							
							row.map(function (element, index) {

								if (element.length > 0) {
									row[index] = "\"" + element.replace(/"/g, "\\\"") + "\"";
								}
								else{
									row[index] = "\"" + element + "\"";
								}
							});
							var stringed_row = row.toString();
							// stringed_row = stringed_row.replace(/\\/g, '\\\\');
							stringed_row = stringed_row.replace(/,,/g, ',null,');
							stringed_row = stringed_row.replace(/,,/g, ',null,');
							if(index !== 0 && stringed_row !== ""){
								return  ' (' + stringed_row + ') ';
							}
							else if(stringed_row !== ""){
								return  ' (' + stringed_row + ') ';
							}

						}
					});
	insert_string = insert_string.replace(/(,)+/g, ',');

	return [insert_string, headers];
}


var db = require('mysql');
var conf = require('../goldmine_config.json');

var conn = db.createConnection(conf);

var createTable = function (tbl_name, headers, cb) {
	
	var tblString = 'create table if not exists ' + tbl_name + ' (id int auto_increment primary key, ';
	tblString += headers.map(function (header, index) {

		if (index === (headers.length-1))
			return header + ' text)';

		return header + ' text';
	});

	conn.query(tblString,function (err, result) {
		if (err) throw err;

		cb(result);
	});

}

module.exports = {
	importFiles : function (path, filetype, cb) {
		getFiles(path, filetype, function (filelist) {

			filelist.forEach(function (file, index) {

				var file_path = path+file;

				fs.readFile(file_path, 'utf8', function (err, data) {
	
					var filename = file.substr(0,file.length - (filetype.length+1));
					

					conn.query("drop table if exists "+filename, function(err, result){
						createTable(filename, getInsertValues(data, '|', filename)[1], function (result) {
							
							var insertString = getInsertValues (data, '|', filename)[0];

							fs.writeFile(file_path+filename+"_insert.sql", "insert into " + filename + " " + insertString, function (err, result) {
								if(err) throw err;
								
							});
						});
					});
					
					if ( index === (filelist.length-1) ) {
						cb();
					}

				});
			});
		});
	}
}