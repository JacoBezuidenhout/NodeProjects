var gateway = {
  serial: "gateway_edison",
  type: "Edison001"
};
var nodes = [{
  serial: "node_a",
  type: "XBEE2"
}, {
  serial: "node_b",
  type: "XBEE"
}, {
  serial: "node_c",
  type: "XBEE"
}];
var modules = [{
  serial: "module_a",
  type: "TEMP"
}, {
  serial: "module_b",
  type: "HUMI"
}, {
  serial: "module_c",
  type: "BATT"
}];
var datapoints = [{
  verb: "change",
  value: "20"
}, {
  verb: "update",
  value: "26"
}, {
  verb: "change",
  value: "28"
}];

var counter = 6000;
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost';


setInterval(function(){
counter++;
console.log("COUNTER:",counter);
rec(counter);
},10);

function rec(k)
{
// counter++;

// if (counter > 10) return;

gateway.serial = "gateway_edison_" + k;

io.socket.post('/gateway/create', gateway, function serverResponded(body, JWR) {
  console.log(body.serial);
  nodes.forEach(function(node){

    io.socket.post('/gateway/'+gateway.serial+'/nodes/add', node, function serverResponded(body, JWR) {


      modules.forEach(function(module){

          io.socket.post('/module/create', module, function serverResponded(body, JWR) {
            // console.log('MODULE responded with: ', body);
            module = body;

            datapoints.forEach(function(datapoint){
                // console.log('/module/'+module.id+'/datapoints/add');

              io.socket.post('/module/'+module.id+'/datapoints/add', datapoint, function serverResponded(body, JWR) {
                // console.log('datapoint responded with: ', body);
              });

            });
            // rec(module.id);
          });

          io.socket.post('/node/'+node.serial+'/modules/'+module.id, function serverResponded(body, JWR) {
            // console.log('MODULE responded with: ', body);
          });

      });


    });

  });
});

}



    //io.socket.disconnect();
