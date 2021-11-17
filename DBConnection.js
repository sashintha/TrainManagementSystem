const mysql = require('mysql');

function newConnection()
{
    let conn = mysql.createConnection({
            host:'localhost',
            user: 'root',
            password:'',
            database:''
        });
        return conn;
}
    
module.exports = newConnection;