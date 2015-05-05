var mraa = require("mraa"); //require mraa
var red = new mraa.Pwm(5);
var green = new mraa.Pwm(6);
var blue = new mraa.Pwm(9);

var io;
var data = {}
data.r = 0;
data.g = 0;
data.b = 0;

var EDISON = function(ws)
{
  io = ws;

  io.on('connection', function (socket) {
    console.log("connection made");

    socket.on('R', function (value) {
      console.log("RED",value);
      data.r = value;
      updateRGB();
    });

    socket.on('G', function (value) {
      console.log("GREEN",value);
      data.g = value;
      updateRGB();
    });

    socket.on('B', function (value) {
      console.log("BLUE",value);
      data.b = value;
      updateRGB();
    });

	red.enable(true);
	green.enable(true);
	blue.enable(true);

    var light = new mraa.Aio(0);
    var pot = new mraa.Aio(1);
    var smoke = new mraa.Aio(2);

    //set the period in microseconds.
    red.period_us(2000);
    green.period_us(2000);
    blue.period_us(2000);

    setInterval(function () {
        io.emit('light',  light.read()-100);
        io.emit('smoke',  smoke.read());
        io.emit('pot',    pot.read());
    }, 1000);

    //test();
  });
}

function test()
{

  run = setInterval(function(){
    temp = (Math.random() * 200);
    humid = (Math.random() * 200);
    light = (Math.random() * 200);

    // console.log(temp,humid,light);

    io.emit('temp', temp);
    io.emit('humid', humid);
    io.emit('light', light);

  }, 2000);

}

function updateRGB(){
    red.write(data.r/255);
    green.write(data.g/255);
    blue.write(data.b/255);
}


module.exports = EDISON;
