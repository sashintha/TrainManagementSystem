const mysql = require('mysql');

function newConnection()
{
    let conn = mysql.createConnection({
            host:'localhost',
            user: 'root',
            password:'Traindb123',
            database:'data_storage_societymk2.0'
        });
        return conn;
}
    
module.exports = newConnection;