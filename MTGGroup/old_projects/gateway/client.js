var socket = require('socket.io-client')('http://10.0.0.109');
var sys = require("sys");


socket.on('connect', function(){
        console.log('connected')
});

socket.on('event', function(data){console.log(data)});

socket.on('disconnect', function(){});

socket.on('login', function(data){
        if (data.login="true"){
                console.log("true");
        }else
                console.log("false")
});

var stdin = process.openStdin();


stdin.addListener("data", function(d) {
        var nodes=['1','2','3'];
        var modules=['a','b','c'];
        var verb=['changed','heartbead'];

        var value = d.toString().substring(0, d.length-2);

        if(value == 'test'){
                socket.emit('datapoint',{
                        'node':{
                                "serial":nodes[Math.floor(Math.random()*nodes.length)],
                                "type":"xbee"
                        },
                        'module':{
                                "serial":modules[Math.floor(Math.random()*modules.length)],
                                "type":"sensor_temp"
                        },
                        'datapoint':{
                                "value":Math.floor(Math.random()*100),
                                "verb":verb[Math.floor(Math.random()*verb.length)]
                        }
                });
        }       else{

        socket.emit('login',{'serial':value,'type':'edison001'});
    }
  });
