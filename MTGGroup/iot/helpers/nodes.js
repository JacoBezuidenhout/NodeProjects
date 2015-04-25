function NODES(db)
{
  this.db = db;
  console.log("NODES Created");
}

NODES.prototype.get = function(session)
{
  return [];
}

module.exports = NODES;
