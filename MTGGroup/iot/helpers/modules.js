function MODULES(db)
{
  this.db = db;
  console.log("MODULES Created");
}

MODULES.prototype.get = function(session)
{
  return [];
}

module.exports = MODULES;
