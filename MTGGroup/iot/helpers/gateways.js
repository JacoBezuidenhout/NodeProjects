function GATEWAYS(db)
{
  this.db = db;
  console.log("GATEWAYS Created");
}

GATEWAYS.prototype.get = function(session)
{
  return [];
}

module.exports = GATEWAYS;
