var fs = require('fs')
var mongo = require('mongodb');
var monk = require('monk');
var db;

DB = function()
{
  db = monk('localhost:27017');

    console.log(JSON.stringify(db));

}

DB.prototype.getIdeas = function()
{
  var collection = db.get('ideas');
  collection.find({},function(err,docs){
    console.log(err);
    return docs;
  });
}

DB.prototype.getPayments = function()
{
  var payments = db.get("payments").find();
  return payments;
}

DB.prototype.addPayment = function(input)
{
  var collection = db.get('payments');
  collection.insert(input, function(err) {
    throw err;
  });
}

DB.prototype.addIdea = function(input)
{
  var collection = db.get('ideas');
  collection.insert(input, function(err) {
    throw err;
  });
}

DB.prototype.upload = function(input)
{

}

module.exports = DB;
