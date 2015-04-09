var express = require('express');
var router = express.Router();

/* GET default page. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ a: 1 }));
});

/* GET default page. */
router.get('/traders', function(req, res, next) {
  var traders = req.db.getTraders();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(traders));
});

router.get('/traders/summary', function(req, res, next) {
  var traders = req.db.getTraders();
  var result = []
  traders.forEach(function(trader){
    result.push(req.db.getSummary(trader).trader);
  });

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
});


/* GET default page. */
router.get('/dat/content', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ a: 1 }));
});

/* GET default page. */
router.get('/dat/list', function(req, res, next) {
  var dats = req.db.getDats();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dats));
});



module.exports = router;
