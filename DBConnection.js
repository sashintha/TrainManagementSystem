const mysql = require('mysql');

function newConnection()
{
    let conn = mysql.createConnection({
            host:'localhost',
            user: 'root',
            password:'jmutton2sqlroot',
            database:'data_storage_societymk2.0',
            multipleStatements: true
        });
        return conn;
}

module.exports = newConnection;