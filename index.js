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
  SELECT * FROM employee;
  SELECT * FROM maintenanceLog WHERE  ${app.get('currentType')} = '${app.get('currentLogin')}';
  `
  ;
  conn.query(sql, function (err, rows, fields) {
    if (err) 
      throw err
    else{
      res.render('dashboard', {scheduleData: rows[0], t_employees: rows[1], employeeTable: rows[2], main_log: rows[3]});
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

app.get('/maintenance', (req, res) => {
  let conn = newConnection();
  var sql =
  `
  SELECT * FROM maintenanceLog WHERE ${app.get('currentType')} = '${app.get('currentLogin')}';
  SELECT cartNo, COUNT(*) FROM maintenanceLog GROUP BY cartNo
  `
  conn.query(sql, function (err, rows, fields) {
    if (err) 
      throw err
    else{
      res.render('maintenance', { main_log: rows[0], cartCount: rows[1]});
      }
  })
  conn.end();
});


//##POST##//
app.post('/', (req, res) => {
  app.set('currentLogin', req.body.email);
  app.set('currentType', 'supervisedBy');

  let conn = newConnection();
  var sql =
  `
  SELECT maintainPerformBy
  FROM maintenanceLog
  WHERE EXISTS (SELECT maintainPerformBy FROM maintenanceLog WHERE maintainPerformBy = '${app.get('currentLogin')}');
  SELECT supervisedBy
  FROM maintenanceLog
  WHERE EXISTS (SELECT supervisedBy FROM maintenanceLog WHERE supervisedBy = '${app.get('currentLogin')}');
  `
  conn.query(sql, function (err, rows, fields) {
    for (row in rows[0]) {
      if (row > 10) {
        app.set('currentType', 'maintainPerformBy');
        break;
      }
    }
    for (row in rows[1]) {
      if (row > 10) {
        console.log("YES");
        app.set('currentType', 'supervisedBy');
        break;
      }
    }
  })

  if (req.body.password == 'admin') {
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
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