var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

/* GET forms object. */
router.get('/getForms', function(req, res, next) {

  var db = req.db;
    var collection = db.get('forms');
    collection.find({},{},function(e,forms){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(forms));
      });
  });

router.get('/:*', function(req, res, next) {
  var db = req.db;
  var collection = db.get('forms');
  var id = req.path.split(":")[1];

  console.log("find by: "+ id);

  collection.findOne({"_id": new ObjectId(id)}, function(err, forms) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(forms));
  });

});

router.post('/submitForm', function(req, res, next) {
  var db = req.db;
  var collection = db.get('submissions');
  var body = req.body;
  var id = "";
  collection.insert(body, function(err, forms) {
    if (err)
    {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({"success":false, "err": err}));
    }
    else
    {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({"success":true, "submission": forms}));
    }
  });

});

module.exports = router;
