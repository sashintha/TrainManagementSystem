// var express = require('express');
// var router = express.Router();
// const newConnection = require('../DBConnection'); //receive connection function


// router.get('/displaySchedule.ejs', function(req, res, next) {
//     let conn = newConnection();

//    conn.query('SELECT * FROM schedule', function(err, data, fields) {
//       if (err){
//         throw err;
//       }
//       else{
//         res.render('displaySchedule.ejs', {title: 'Schedule Table',scheduleData: data});
//       }
      
//    });

//    conn.end();
// });
// module.exports = router;