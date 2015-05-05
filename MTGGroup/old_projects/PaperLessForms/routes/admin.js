var express = require('express');
var router = express.Router();


/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Admin' });
});

/* GET forms object. */
router.get('/getForms', function(req, res, next) {

  var db = req.db;
    var collection = db.get('forms');
    collection.find({},{},function(e,forms){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(forms));
      });
  });


module.exports = router;
