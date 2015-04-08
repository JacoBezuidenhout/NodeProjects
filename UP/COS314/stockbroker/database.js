var fs = require('fs')
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/stockbroker');
var tmp = [];

var dats = [];
var traders = [];

//convert Trader to Chromosome
function TraderToChromosome(entry)
{
  tmp = [];
  for (var i = 0; i < entry.trader.length; i++)
    tmp.push(entry.trader[i]);
  entry.trader = tmp;
}


//convert dat file to renko data
function DatToRenko(entry)
{
  console.log(entry.dat);
  var data = fs.readFileSync('public/data/' + entry.dat + '.dat', 'utf8');


    var last = 0, size = 0, max = 0, min = 999999999999999, dir = 0, valid = false;
    var chromo = [];
    var renko = [];

    data = data.split("\r\n");
    for ( i = 0; i < data.length; i++)
      if (data[i])
      {
        data[i] = data[i].split("\t");
        max = Math.max(data[i][1], max);
        min = Math.min(data[i][1], min);
      }

    size = Math.round((max-min)*0.01);

    for ( i = 0; i < data.length; i++)
    {
      if (data[i])
      {
        if (last+size < data[i][1]) dir = 0;

        if (last-size > data[i][1]) dir = 1;

        chromo.push(dir);
        renko.push({"data":data[i],"dir": dir, "chromo": chromo.join(""), "valid": (chromo.length == 5)});
        if (chromo.length == 5)
        {
          chromo.shift();
        }

        last = data[i][1];
      }
    }
  //  console.log(renko);
   entry.dat = JSON.stringify(renko);

}

////////////////////////////////////////////////////Database functions

var DB = function (defaults)
{
  traders = defaults.traders;
  traders.forEach(TraderToChromosome);

  dats = defaults.dats;
  dats.forEach(DatToRenko);


  this.getTraderDats(traders[0]);
};

////////////////////////////////////////////////////Trader functions

DB.prototype.getTraders = function ()
{
  return traders;
};

DB.prototype.addTrader = function (trader)
{
  traders.push(trader);
  return traders;
};

////////////////////////////////////////////////////.dat files functions

DB.prototype.getDats = function ()
{
  return dats;
};


DB.prototype.addDat = function (dat)
{
  dats.push(DatToRenko(dat));
  return dats;
};


////////////////////////////////////////////////////trader_dats pair

DB.prototype.getTraderDats = function (trader)
{
  dats.forEach(function(dat){
    for (i = 0; i < dat.dat.length; i++)
    {
      var item = JSON.parse(dat.dat);
      console.log(item);
      dat.dat[i].action = trader.trader[parseInt(dat.dat[i].chromo,2)];
    }

  });

  return dats;

};


module.exports = DB;
