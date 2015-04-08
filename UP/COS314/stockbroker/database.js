var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/stockbroker');

var dats = [];
var traders = [];

var DB = function (defaults)
{
  traders = defaults.traders;
  dats = defaults.dats;

  console.log("Object Created", defaults);

};

////////////////////////////////////////////////////Trader functions

DB.prototype.getTraders = function ()
{
  console.log(traders);
  return traders;
};

DB.prototype.addTrader = function (trader)
{
  traders.push(trader);
  console.log(traders);
  return traders;
};

////////////////////////////////////////////////////.dat files functions

DB.prototype.getDats = function ()
{
  console.log(dats);
  return dats;
};


DB.prototype.addDat = function (dat)
{
  dats.push(dat);
  console.log(dats);
  return dats;
};


module.exports = DB;
