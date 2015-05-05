var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.output.title = "Welcome | IOTGroup";
  res.render('index', req.output);
});

module.exports = router;
