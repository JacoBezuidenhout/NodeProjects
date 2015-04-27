var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/',function(req, res, next) {
  var users = req.db.get("users");
  req.session.user = {};
  users.findOne({email: req.body.username}, function(err,data)
  {
    if (err || !data)
      res.render('login', { title: 'Login', message: "Invalid Username/Password"});
    else
    {
      if (data.password == req.body.password)
      {
        req.session.user = data;
        req.output.login = 1;
        req.output.user = data;
        res.redirect("/");
      }
      else
        res.render('login', { title: 'Login', message: "Invalid Username/Password"});
    }
  });
});

module.exports = router;
