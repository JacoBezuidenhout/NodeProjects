var db;
var Validator = require('jsonschema').Validator;
var v = new Validator();
var schema = require("./helpers/schema.json");
var skel = require("./helpers/skeleton.json");

function CONTROLLER(database)
{
  db = database;
  v.addSchema(schema.status);
  v.addSchema(schema.location);
  v.addSchema(schema.data);
  v.addSchema(schema.module);
  v.addSchema(schema.node);
  v.addSchema(schema.bigdata);
  v.addSchema(schema.user);
  console.log(v.validate(skel.user, schema.user));
  console.log(v.validate(skel.gateways, schema.bigdata));
  console.log("Controller Started");
}

CONTROLLER.prototype.get = function(output,callback)
{
  var gateways = output.user.gateways;
  // console.log(gateways);
  gateways.forEach(function(gateway)
  {
    var bigdata = db.get("bigdata");
    bigdata.findOne({serial: gateway.serial},function(err,docs)
    {
      if (typeof docs !== "undefined")
      // docs.nodes.forEach(function(node){
      //   // console.log(node);
      // });
      gateway.bigdata = docs;
      // console.log(gateway);
    });
  });
  callback(output);
}

CONTROLLER.prototype.val = function(instance,callback)
{
  console.log(v.validate(instance, schema));
}

module.exports = CONTROLLER;
