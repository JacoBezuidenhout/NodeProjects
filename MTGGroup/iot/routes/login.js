var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/',function(req, res, next) {
  var users = req.db.get("users");
  var log = req.db.get("log");
  users.findOne({username: req.body.username}, function(err,data)
  {
    if (err || !data)
      res.render('login', { title: 'Login', message: "Invalid Username/Password"});
    else
    {
      if (data.password == req.body.password)
        res.render('login', { title: 'Login', message: "Success" });
      else
        res.render('login', { title: 'Login', message: "Invalid Username/Password"});
    }
  });
});

module.exports = router;
