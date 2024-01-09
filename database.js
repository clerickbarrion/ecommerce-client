// imports sql
const mysql = require('mysql2')

// initalize connection
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'LoginApp',
    user: 'root', 
    password: 'password',
});

// connects to db
connection.connect(function (err) {
    if (err) throw err;
    console.log('MySQL Database is Connected!!!!');
});

//exports it 
module.exports = connection;