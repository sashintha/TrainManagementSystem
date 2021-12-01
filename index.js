const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

//##GET##//
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/static/dashboard.html');
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
})


app.listen(2000);