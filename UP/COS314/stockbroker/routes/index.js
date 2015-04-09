var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  db.getTraders();
  res.render('index', { title: 'Stockbroker 2.0' });
});

router.get('/summary', function(req, res, next) {
  var db = req.db;
  var traders = db.getTraders();
  var result = [];

  traders.forEach(function(trader){

    result.push(db.getSummary(trader));

  });

  res.render('index', { title: 'Stockbroker 2.0' , data: result});
});

router.get('/renko/', function(req, res, next) {
  var db = req.db;
  var dats = db.getDats();

  res.render('renko', { title: 'Stockbroker 2.0' , data: dats});
});

module.exports = router;
