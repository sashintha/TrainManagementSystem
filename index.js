const express = require('express');
const app = express();

app.use(express.static('static'));

app.use('/',(req,res) =>{
    
    res.sendFile(__dirname + '/static/login.html');
})


app.listen(2222);