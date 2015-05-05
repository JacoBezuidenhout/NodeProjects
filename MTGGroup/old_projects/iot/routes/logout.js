var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.output.login = 0;
  req.session.destroy(function(err) {
  // cannot access session here
  });
  res.redirect("/");
});

module.exports = router;
