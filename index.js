const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const newConnection = require('./DBConnection'); //receive connection function

app.use(express.static(__dirname + '/public')); //load styling sheets
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs"); //Set view engine to EJS

//##GET##//
app.get('/', (req, res) => {
  //Redirect to login page
  res.sendFile(__dirname + '/static/login.html');
});

//Main page
app.get('/dashboard', (req, res) => {
  //Set connection
  let conn = newConnection();
  //Run 4 queries 
  var sql = 
  `
  SELECT * FROM schedule; 
  SELECT dpt, COUNT(*) FROM employee GROUP BY dpt;
  SELECT * FROM employee;
  SELECT * FROM maintenanceLog WHERE  ${app.get('currentType')} = '${app.get('currentLogin')}';
  `
  
  //Send the query 
  conn.query(sql, function (err, rows, fields) {
    if (err) 
      throw err
    else{
      //Render each query
      res.render('dashboard', {scheduleData: rows[0], t_employees: rows[1], employeeTable: rows[2], main_log: rows[3]});
      }
  })
  //End the connection
  conn.end();
});

//Scehdule talble
app.get('/schedule', (req, res) => {
  //Create a new connection
  let conn = newConnection();
    //Send the FIRST COMPLEX FUNCTION QUERY
    conn.query(`
    SELECT train.trainNo as TrainNo, train.stationName as StationName, arrivalTime, departureTime, routeStatus
    FROM train
    INNER JOIN schedule
    ON train.trainNo = schedule.trainNo
    WHERE rdyForUtil = 'Yes';`
  , function (err, rows, fields) {
    if (err) 
      throw err
    else{
      //Render the response
      res.render('schedule', { logs: rows });
      }
  })
  //End the connection
  conn.end();
});

//Employee table
app.get('/employees', (req, res) => {
  //Create a new connection
  let conn = newConnection();
  //Get all employees
  conn.query(`SELECT * FROM employee`
  , function (err, rows, fields) {
    if (err) 
      throw err
    else{
      //Render the response
      res.render('employees', { e_list: rows });
      }
  })
  //End the connection
  conn.end();
});

//Maintenance Table
app.get('/maintenance', (req, res) => {
  //Start the connection
  let conn = newConnection();

  //Create the SECOND COMPLEX FUNCTION QUERY
  //Get all the logs correspondig to the logged in user
  //Create the THIRD COMPLEX FUNCTION QUERY
  //Get all carts and their maintenances in descending order
  var sql =
  `
  SELECT * FROM maintenanceLog WHERE ${app.get('currentType')} = '${app.get('currentLogin')}';
  SELECT cartNo, COUNT(*) FROM maintenanceLog GROUP BY cartNo
  `
  //Sen the query
  conn.query(sql, function (err, rows, fields) {
    if (err) 
      throw err
    else{
      //Render the response
      res.render('maintenance', { main_log: rows[0], cartCount: rows[1]});
      }
  })
  //End the connection
  conn.end();
});


//##POST##//
app.post('/', (req, res) => {

  //Set default global variables
  app.set('currentLogin', req.body.email);
  app.set('currentType', 'supervisedBy');

  //Global variable to ensure user exists
  app.set('actuallyExists', false);

  //Create connection and sql statement
  let conn = newConnection();
  
  //Return each table if the email exists in the list specified
  var sql =
  `
  SELECT maintainPerformBy
  FROM maintenanceLog
  WHERE EXISTS (SELECT maintainPerformBy FROM maintenanceLog WHERE maintainPerformBy = '${app.get('currentLogin')}');
  SELECT supervisedBy
  FROM maintenanceLog
  WHERE EXISTS (SELECT supervisedBy FROM maintenanceLog WHERE supervisedBy = '${app.get('currentLogin')}');
  `
  //Run the query
  conn.query(sql, function (err, rows, fields) {
    //Loop through the first query
    for (row in rows[0]) {
      //If the number of tuples is greater than 10
      if (row > 10) {
        //Set that the employee exists and the type of employee who is logging in
        app.set('actuallyExists', true);
        app.set('currentType', 'maintainPerformBy');
        break;
      }
    }

    //Loop through the second query
    for (row in rows[1]) {
      //If the number of tuples is greater than 10
      if (row > 10) {
        //Set that the employee exists and the type of employee who is logging in
        app.set('actuallyExists', true);
        app.set('currentType', 'supervisedBy');
        break;
      }
    }

    //If the employee doesnt exist redirect to login
    if (app.get('actuallyExists') == false) {
      res.redirect('/');
    //If teh user exists and types admin as the password, login
    } else if (req.body.password == 'admin') {
      res.redirect('/dashboard');
    //Otherwise redirect to login
    } else {
      res.redirect('/');
    }
  })

  //End the connection
  conn.end();
});

app.post('/maintenanceEntry', (req, res) => {
  //SQL QUERY TO INSERT NEW SCHEDULE BASE ON values(req.body.email, req.body.maintainType, req.body.date, req.body.fName, req.body.lName)
  res.redirect('/maintenanceTable');
});

app.post('/maintenanceCartCount', (req, res) => {
  //SQL QUERY TO SEARCH THROUGH AND COUNT ALL THE CARTS THAT HAVE BEEN MAINTAINED AND SORT BY THE MOST MAINTAINED TO LEAST MAINTAINED
  res.redirect('/maintenanceTable');
});

app.listen(2000);