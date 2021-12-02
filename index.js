const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const newConnection = require('./DBConnection'); //receive connection function

app.use(express.static(__dirname + '/public')); //load styling sheets
app.use(bodyParser.urlencoded({ extended: false }));
//app.set("view engine","ejs");

//##GET##//
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.get('/dashboard', (req, res) => {
  let conn = newConnection();

  conn.query('SELECT * FROM schedule', function (err, rows, fields) {
    if (err) 
      throw err
    else{
      //res.render('displaySchedule.ejs');
      // stuff = rows
      // for(r of stuff){
      //   //console.log(r);
      // }
    }
  })
  
  res.sendFile(__dirname + '/static/dashboard.html');
  conn.end();
});

app.get('/employees', (req, res) => {
  res.sendFile(__dirname + '/static/employees.html');
});

app.get('/schedule', (req, res) => {
  res.sendFile(__dirname + '/static/schedule.html');
});

app.get('/maintenanceTable', (req, res) => {
  res.sendFile(__dirname + '/static/maintenanceTable.html');
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

app.post('/employees', (req, res) => {
  //SQL QUERY GET EMPLOYEE NAME BY EMAIL using req.body.email
  res.redirect('/employees');
});

app.post('/schedule', (req, res) => {
  //SQL QUERY TO INSERT NEW SCHEDULE BASE ON values(req.body.trainNo, req.body.stationName, req.body.departureTime, req.body.arrivalTime)
  res.redirect('/schedule');
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