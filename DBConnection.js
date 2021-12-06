const mysql = require('mysql');

function newConnection()
{
    let conn = mysql.createConnection({
            host:'localhost',
            user: 'root',
            password:'Traindb123',
            database:'traindb',
            multipleStatements: true
        });
        return conn;
}

module.exports = newConnection;