function STATUS(db)
{
  this.db = db;
  console.log("STATUS Created");
}

STATUS.prototype.get = function(session)
{
  return {value: "OK", message: "All is good..."};
}

module.exports = STATUS;
