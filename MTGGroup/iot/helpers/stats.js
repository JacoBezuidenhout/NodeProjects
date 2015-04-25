function STATS(db)
{
  this.db = db;
  console.log("STATS Created");
}

STATS.prototype.get = function(session)
{
  var stats = {};
  stats.api = {};
  stats.api.jan = {};
  stats.api.feb = {};
  stats.api.mar = {};
  stats.api.apr = {};
  stats.api.may = {};
  stats.api.jun = {};
  stats.api.jul = {};
  stats.api.aug = {};
  stats.api.sep = {};
  stats.api.oct = {};
  stats.api.nov = {};
  stats.api.dec = {};
  stats.api.jan.count = 8500;
  stats.api.feb.count = 8500;
  stats.api.mar.count = 8500;
  stats.api.apr.count = 8500;
  stats.api.may.count = 8500;
  stats.api.jun.count = 8500;
  stats.api.jul.count = 8500;
  stats.api.aug.count = 8500;
  stats.api.sep.count = 8500;
  stats.api.oct.count = 8500;
  stats.api.nov.count = 8500;
  stats.api.dec.count = 8500;
  stats.api.jan.percent = 85;
  stats.api.feb.percent = 85;
  stats.api.mar.percent = 85;
  stats.api.apr.percent = 85;
  stats.api.may.percent = 85;
  stats.api.jun.percent = 85;
  stats.api.jul.percent = 85;
  stats.api.aug.percent = 85;
  stats.api.sep.percent = 85;
  stats.api.oct.percent = 85;
  stats.api.nov.percent = 85;
  stats.api.dec.percent = 85;

  var total = 0;
  for (var month in stats.api) {
    total += stats.api[month].count;
  }

  stats.api.total = total;

  return stats;
}

module.exports = STATS;
