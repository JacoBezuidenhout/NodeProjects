var mongo = require('mongodb');
var monk = require('monk');
var schema = require('./schema.json');
var db = monk("localhost/stresstest");
var stress = db.get("stress");

for (var x = 0; x < 1000; x++)
{
stress.insert(schema);
console.log(x);
}
