var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

/* GET forms page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('forms');
  collection.find({},{},function(e,forms){
    res.render('forms', { title: 'Welcome | Home', project_name: "Paperless Forms", data: forms });
  });
});

/* GET form page. */
router.get('/:', function(req, res, next) {
  var db = req.db;
  var collection = db.get('forms');

  console.log("find by: "+ id);
  get_collection(function(collection) {
    collection.findOne({"_id": new ObjectId(id)}, function(err, forms) {
      res.render('forms', { title: 'Welcome | Home', project_name: "Paperless Forms", data: forms });
    });
  });
});

/* POST new form. */
router.post('/addForm', function(req, res, next) {

  var body = req.body;
    body.fields = body.fields.split(",")

  var db = req.db;
    var collection = db.get('forms');
    collection.insert(body,function(e,form){
        res.location("/forms");
        res.redirect("/forms");
      });

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
