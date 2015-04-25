var ALERTS = require("./helpers/alerts");
var STATS = require("./helpers/stats");
var STATUS = require("./helpers/status");

var GATEWAYS = require("./helpers/gateways");
var NODES = require("./helpers/nodes");
var MODULES = require("./helpers/modules");


function CONTROLLER(db)
{
  this.db = db;
  this.alerts = new ALERTS(db.get("alerts"));
  this.stats = new STATS(db.get("stats"));
  this.status = new STATUS(db.get("status"));
  this.gateways = new GATEWAYS(db.get("gateways"));
  this.nodes = new NODES(db.get("gateways"));
  this.modules = new MODULES(db.get("gateways"));
}

CONTROLLER.prototype.get = function(db,session)
{
  var output = {};
  output.alerts = this.alerts.get(session);
  output.stats = this.stats.get(session);
  output.status = this.status.get(session);
  output.gateways = this.gateways.get(session);
  output.nodes = this.nodes.get(session);
  output.modules = this.modules.get(session);

  return output;
}

module.exports = CONTROLLER;
