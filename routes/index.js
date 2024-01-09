var express = require('express');
var router = express.Router();
const database = require('../database.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req,res,next)=>{
  console.log(req.body)
  const email = req.body.user_email_address
  const password = req.body.user_password
  if (email && password){
    // write query
    const query = `SELECT * FROM Person WHERE email = '${email}'`
    // run query
    database.query(query, (err,data)=>{
      if (data.length){
        if (data[0].password === password){
          console.log('welcome to the place')
          response.redirect('/')
        } else {
          console.log('Wrong Password')
          res.send('Incorrect Password')
        }
      } else{
        console.log('email does not exit')
      }
    })
  }
})

module.exports = router;
