const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const newConnection = require('./DBConnection'); //receive connection function

app.use(express.static(__dirname + '/public')); //load styling sheets
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");

//##GET##//
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});


app.get('/dashboard', (req, res) => {
  let conn = newConnection();

  var sql = 
  `
  SELECT * FROM schedule; 
  SELECT dpt, COUNT(*) FROM employee GROUP BY dpt;
  SELECT * FROM employee
  `
  ;

  conn.query(sql, function (err, rows, fields) {
    if (err) 
      throw err
    else{
      res.render('dashboard', {scheduleData: rows[0], t_employees: rows[1], employeeTable: rows[2]});
      }
  })
  conn.end();
});

app.get('/schedule', (req, res) => {
  let conn = newConnection();
    conn.query(`
    SELECT train.trainNo as TrainNo, train.stationName as StationName, arrivalTime, departureTime, routeStatus
    FROM train
    INNER JOIN schedule
    ON train.trainNo = schedule.trainNo
    WHERE rdyForUtil = 'No';`
  , function (err, rows, fields) {
    if (err) 
      throw err
    else{
      res.render('schedule', { logs: rows });
      }
  })
  conn.end();
});

app.get('/employees', (req, res) => {
  let conn = newConnection();
    conn.query(`SELECT * FROM employee`
  , function (err, rows, fields) {
    if (err) 
      throw err
    else{
      res.render('employees', { e_list: rows });
      }
  })
  conn.end();
});


//##POST##//
app.post('/', (req, res) => {
  //Create a database query to get all maintenance emails 
  //Check if the req.body.email exists in that query
  //If it is, and pass is admin, login, otherwise redirect(/)
  if (req.body.email == 'admin' && req.body.password == 'admin') {
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
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