var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var serialgps = require('serialgps');
var mongo = require('mongodb');
var db = require('monk')('localhost/madikwe');
var serialport;
var C = xbee_api.constants;
var xbeeAPI = new xbee_api.XBeeAPI({api_mode: 1});
var run;
var frame_obj;
var io;

var nodes = [];
var GPS_DATA = {};

function sendObj(data)
{
    io.emit('mesh', data);
}

function sendLoc(data)
{
    io.emit('loc', data);
}

function sendGPS(data)
{
    io.emit('gps', data);
}


function getRemote(id,cmd)
{
  frame_obj = { // AT Request to be sent to
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: id,
    command: cmd,
    commandParameter: [],
  };
  var frame = xbeeAPI.buildFrame(frame_obj);
  serialport.write(frame);
  console.log(frame);
}

function broadcastRemote(cmd,value)
{
  var frame_obj = { // AT Request to be sent to
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    command: cmd,
    commandParameter: value,
  };

  serialport.write(xbeeAPI.buildFrame(frame_obj));
}

function getCoord()
{
  var data = {};
  data.x = (Math.random() * 1) + 26;
  data.y = (Math.random() * 1) - 25;

  if (typeof GPS_DATA.RMC === 'undefined')
  {
    data.y = 0;
    data.x = 0;
  }
  else
  {
    data.y = GPS_DATA.RMC.lat;
    data.x = GPS_DATA.RMC.lon;
  }
  return data;
}

var MESH = function(port,baud,ws)
{
  //create a new instance. arguments are serial port and baud rate
  var gps = new serialgps('COM11',9600);

  io = ws;
  io.on('connection', function (socket) {
    socket.on('action', function (data) {
      if (data.action == "start")
      {
        clearInterval(run);
        run = setInterval(function(){

          console.log("GETREMOTE CALLED");
          broadcastRemote("DB",[]);
          // getRemote(data.id,data.cmd);
        }, 2000);
      }
      else
      {
        if (data.action == "stop")
          clearInterval(run);
      }
    });
  });

  serialport = new SerialPort(port, {
    baudrate: baud,
    parser: xbeeAPI.rawParser()
  });

  serialport.on("open", function() {

    console.log("Serial Open");

    //monitor for data
    gps.on('data', function(data) {

      if (data.sentence == 'RMC' || data.sentence == 'GGA')
      {
        console.log(data);

        if (data.latPole == "S")
          data.lat = -1* parseInt(data.lat.substring(0, 2)) + parseFloat(data.lat.substring(2))/60;
        else
          data.lat = parseInt(data.lat.substring(0, 2)) + parseFloat(data.lat.substring(2))/60;

        if (data.latPole == "W")
          data.lon = -1*parseInt(data.lon.substring(0, 3)) + parseFloat(data.lon.substring(3))/60;
        else
          data.lon = parseInt(data.lon.substring(0, 3)) + parseFloat(data.lon.substring(3))/60;
      }
      GPS_DATA[data.sentence] = data;
      sendLoc(getCoord());
      console.log(getCoord());
    });


    setInterval(function(){
      broadcastRemote("NI",[]);
      // broadcastRemote("DB",[]);
    }, 5000);

    //startTests();
  });

}

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function(frame) {
    frame.commandData = frame.commandData.toJSON();

    if (frame.command == "NI")
    {
      frame.commandData.data = String.fromCharCode.apply(String, frame.commandData.data);
      console.log(">>", "NI");
    }

    if (frame.command == "DB")
    {
      var data = getCoord();
      data.w = frame.commandData.data;
      data.id = frame.remote64;
      console.log(">>", "DB", data);
      sendGPS(data);
    }

    frame.location = getCoord();
    frame.location.raw = GPS_DATA;
    console.log(">>", frame);

    sendObj(frame);
});

////////////////////////////////////////////////////tests

function startTests()
{
  setInterval(function(){

    var data = getCoord();
    data.w = Math.floor((Math.random() * 5) + 1);
    console.log(data);
    sendGPS(data);

  },10000);
}

module.exports = MESH;
