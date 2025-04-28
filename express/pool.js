var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit : 100,
    host: '192.168.2.102',
    user: 'root',
    password: '',
    database: 'eni2-old',
    port: 3306,
    debug: false,
    connectTimeout: 3000000,
    multipleStatements: true
});
module.exports = connection;