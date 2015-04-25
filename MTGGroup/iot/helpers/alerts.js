function ALERTS(db)
{
  this.db = db;
  console.log("ALERTS Created");
}

ALERTS.prototype.get = function(session)
{
  return {};
}

module.exports = ALERTS;
