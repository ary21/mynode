var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'root123',
    database: 'mynode'
});

connection.connect(function (err) {
    if (!!err) {
        console.log(err);
    } else {
        console.log('DB Connected.');
    }
});

module.exports = connection;