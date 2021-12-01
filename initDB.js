// const mysql = require('mysql');

// let conn = mysql.createConnection({
//     host:'', //Type IP
//     user: 'root',
//     password:'', //Password
//     database:'lab3DB'
// });

// conn.connect();

// // conn.query(`Drop Table Product`,
// //                 (err,rows,fields) => {
// //                     if (err)
// //                         console.log(err);
// //                     else
// //                         console.log('Table Dropped');
// //                 }
// //             )
// conn.query(`CREATE TABLE doodles
//             (
//                 Name varchar(100),
//                 time0   Dec(6,3),
//             )
//             ` 
//             , (err,rows,fields) => {
//                 if (err)
//                     console.log(err);
//                 else
//                     console.log('Table Created');
//             })
// // {"desc":"Table","price":"200","imgPath":"/imgs/Table.jpg"}
// conn.query( `insert into Product values ("Table",200,"/imgs/Table.jpg")`
//             , (err,rows,fields) => {
//                 if (err)
//                     console.log(err);
//                 else
//                     console.log('One row inserted');
//             });

// conn.query( `select * from Product `
//             , (err,rows,fields) => {
//                 if (err)
//                     console.log(err);
//                 else
//                     console.log('One row inserted');
//                 for (r of rows)
//                     console.log(r);
//             });

// conn.end();
