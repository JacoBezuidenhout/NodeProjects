var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var output = global.settings;
  output.title = "Welcome | IOTGroup";
  res.render('index', output);
});

module.exports = router;