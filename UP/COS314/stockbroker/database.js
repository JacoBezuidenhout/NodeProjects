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

   entry.dat = renko;
}

function mutual_cost(trade_amount)
{
  var fees = 0;
  //Brokerage fee
  fees += Math.max(Math.round(0.5/100*trade_amount),7000);
  //Strate Tax
  fees += (1158);
  //IPL
  fees += Math.round(0.0002/100*trade_amount);

  return fees;
}

function buy(line)
{
  if (line.shares > 0)
  {
    var trade_amount = (line.shares*line.avg);
    var fees = 0;
    //STT
    fees += Math.round(0.25/100*trade_amount);
    //mutual
    fees += mutual_cost(trade_amount);
    //vat
    fees *= 1.14;

    var total = Math.round(trade_amount+fees);

    if (total < line.balance)
      {
        line.balance -= total;
        return line;
      }
    else
    {
      line.shares -= 1;
      line = buy(line);
        return line;
    }
  } else
        return line;

}

function sell(line)
{
  if (line.shares > 0)
  {
    var trade_amount = (line.shares*line.avg);
    var fees = 0;
    //STT
    fees += Math.round(0.25/100*trade_amount);
    //mutual
    fees += mutual_cost(trade_amount);
    //vat
    fees *= 1.14;

    var total = Math.round(trade_amount-fees);
    line.balance += total;
  }
  return line;
}

////////////////////////////////////////////////////Database functions

var DB = function (defaults)
{
  traders = defaults.traders;
  traders.forEach(TraderToChromosome);

  dats = defaults.dats;
  dats.forEach(DatToRenko);
  console.log(dats[0].dat[0]);
  // this.getSummary(traders[0]);
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
      dat.dat[i].action = trader.trader[parseInt(dat.dat[i].chromo,2)];
    }
  });

  return dats;

};

DB.prototype.getSummary = function (trader)
{
  var data = this.getTraderDats(trader);
  var last = 0;
  trader.summary = [];

  data.forEach(function(dat){
    var balance = trader.balance;
    var shares = 0;

    dat.dat.forEach(function(line){
      var avg = Math.round((parseInt(line.data[2])+parseInt(line.data[3]))/2);
      //console.log(avg);
      if (line.action == 'B')
      {

          var res = buy({"shares":Math.floor(balance/avg),"avg": avg, "balance":balance});
          balance = res.balance;
          shares += res.shares;
      }

      if (line.action == 'S')
      {

          var res = sell({"shares":shares,"avg": avg, "balance":balance});
          balance = res.balance;
          shares -= res.shares;
      }

          line.shares = shares;
          line.balance = balance;
          last = line;
    });
          var fitness = balance+shares*parseInt(last.data[1]);
          trader.summary.push({"share":dat.name,"shares":shares,"balance":balance,"fitness": fitness, "ROI": (fitness-trader.balance)});
  });

  return {"trader": trader, "data": data};
}

module.exports = DB;
