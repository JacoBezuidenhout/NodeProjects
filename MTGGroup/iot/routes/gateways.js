var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.output.title = "Gateways | Status";
  res.render('gateways', req.output);
});

/* GET gateway id page. */
router.get('/:*', function(req, res, next) {
  req.output.title = "Gateways | Status";
  console.log(req.path.split(":")[1]);
  res.render('gateways', req.output);
});

router.post('/add', function(req, res, next) {
  req.output.title = "Welcome | IOTGroup";
  var users = req.db.get("users");
  users.findOne({email: req.session.user.email},function(err,docs){
    if (typeof docs.gateways !== "undefined")
    {
      docs.gateways.push(req.body);
      users.update({email: req.session.user.email},{$set: docs});
      console.log(docs);
    }
  });
  res.redirect("/gateways");
});

router.post('/edit', function(req, res, next) {
  req.output.title = "Welcome | IOTGroup";
  var users = req.db.get("users");
  users.findOne({email: req.session.user.email},function(err,docs){
    if (typeof docs.gateways !== "undefined")
    {
      docs.gateways.forEach(function(gateway){
        if (gateway.serial == req.body.serial)
          {
            gateway.name = req.body.name;
          }
      });
      users.update({email: req.session.user.email},{$set: docs});
    }
  });
  res.redirect("/gateways");
});

router.post('/del', function(req, res, next) {
  req.output.title = "Welcome | IOTGroup";
  var users = req.db.get("users");
  users.findOne({email: req.session.user.email},function(err,docs){
    if (typeof docs.gateways !== "undefined")
    {
      console.log(docs.gateways);
      var gateways = [];
      docs.gateways.forEach(function(gateway,i){
        if (gateway.serial != req.body.serial)
          gateways.push(gateway);
      });
      docs.gateways = gateways;
      console.log(docs.gateways);
      users.update({email: req.session.user.email},{$set: docs});
    }
  });
  res.redirect("/gateways");
});

router.post('/nodes/edit', function(req, res, next) {
  req.output.title = "Welcome | IOTGroup";
  var users = req.db.get("users");
  users.findOne({email: req.session.user.email},function(err,docs){
    if (typeof docs.gateways !== "undefined")
    {
      docs.gateways.forEach(function(gateway){
        if (gateway.serial == req.body.gateway_serial)
          {
            console.log("Found Gateway in user")
            var bigdata = req.db.get("bigdata");
            bigdata.findOne({serial: req.body.gateway_serial},function(err,docs){
                console.log("Found Gateway in bigdata")
                docs.nodes.forEach(function(node){
                  if (node.serial == req.body.serial)
                  {
                    console.log("Found Node",req.body)
                    node.desc = req.body.desc;
                    node.location.lat = req.body.lat;
                    node.location.lon = req.body.lon;
                  }
                });
                bigdata.update({serial: req.body.gateway_serial},{$set: docs});
            });
          }
      });
    }
  });
  res.redirect("/gateways");
});

module.exports = router;
