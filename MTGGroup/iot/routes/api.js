var express = require('express');
var router = express.Router();
var Validator = require('jsonschema').Validator;
var v = new Validator();
var schema = require("../helpers/schema.json");
var skel = require("../helpers/skeleton.json");
var lockbox = require('lockbox');

var key = lockbox.keyFactory.createPrivateKeyFromFileSync(
    'keys/private.pem',
    'eequuxah5226!!'
);

v.addSchema(schema.status);
v.addSchema(schema.location);
v.addSchema(schema.data);
v.addSchema(schema.module);
v.addSchema(schema.node);
v.addSchema(schema.bigdata);
v.addSchema(schema.user);

function decrypt(encrypted,callback)
{

  var data;
  try {
      data = lockbox.decrypt(key, encrypted);
  } catch (error) {
      // decryption failed
      callback(error,[]);
      return;
  }

  console.log(v.validate(data, schema.bigdata));
  callback([],data);

}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('api', global.settings);
});

/* GET home page. */
router.post('/', function(req, res, next) {

  var bigdata = req.db.get("bigdata");
  decrypt(req.body,function(data)
  {
    console.log(req.body);
    bigdata.findOne({serial: data.serial},function(err,docs)
    {
      if (docs)
      {
        console.log("gatewayFound",docs.nodes[0].modules);
        if (data.nodes)
        {
          data.nodes.forEach(function(node){
            docs.nodes.forEach(function(n){
              if (node.serial==n.serial)
              {
                node.modules.forEach(function(module){
                  var flag = false;
                  n.modules.forEach(function(m){
                    if (module.serial == m.serial)
                    {
                      module.data.forEach(function(dat){
                        m.data.push(dat);
                      });
                      flag = true;
                    }
                  });

                  if (!flag)
                  {
                    n.modules.push(module);
                  }

                });
                return;
              }
            });
          });
        }
        console.log("gatewayFound",docs.nodes[0].modules);
        bigdata.update({serial: docs.serial},{$set: docs});
      }
      else
      {
        console.log("gatewaynotFound",docs);
        bigdata.insert(req.body);
      }
    });
  });
  next();
  // return;
});

module.exports = router;
