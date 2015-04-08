var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  db.getTraders();
  res.render('index', { title: 'Stockbroker 2.0' });
});

module.exports = router;
