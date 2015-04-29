var app = angular.module('Dashboard', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{/');
  $interpolateProvider.endSymbol('//');
});

app.factory('socket', function($rootScope) {
  var socket = io.socket;
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    get: function(eventName, callback) {
      socket.get(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    post: function(eventName, data, callback) {
      socket.post(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('GatewayController', function($scope, socket) {
  socket.get("/gateway", function(gateways, jwres) {
    $scope.gateways = gateways;
    $scope.gateways.forEach(function(gateway,i_g) {
      gateway.nodes.forEach(function(node,i_n) {
        socket.get("/node/" + node.serial, function(n, jwres) {
          $scope.gateways[i_g].nodes[i_n] = n;
            n.modules.forEach(function(module,i_m) {
              socket.get("/module/" + module.id, function(m, jwres) {
                $scope.gateways[i_g].nodes[i_n].modules[i_m] = m;
                // console.log(gateways);
              });
          });
        });
      });
    });

  });
  socket.on("gateway", function(event) {
    $scope.gateways.push(event.data);
  });

  $scope.master = {
    serial: "",
    type: "",
    description: ""
  };

  $scope.reset = function() {
    $scope.gw = angular.copy($scope.master);
  };

  $scope.add = function(gateway) {
    socket.post("/gateway", gateway, function(resData, jwres) {
      // $scope.gateways = resData;
      $scope.gateways.push(resData);
      $scope.message = {"class":"bg-success","text":"Insert successful"};
      // console.log(resData);
    });
  };

  $scope.load = function(serial) {
      console.log(serial);
    socket.get("/gateway/"+serial, function(resData, jwres) {
      $scope.gw = angular.copy(resData);
      $scope.gw.s = $scope.gw.serial;
      $scope.gw.t = $scope.gw.type;
      console.log(resData);
    });
  };

  $scope.edit = function(gateway) {
    delete gateway.s;
    delete gateway.t;
    
    socket.post("/gateway/update/"+gateway.serial, gateway, function(resData, jwres) {
      // $scope.gateways = resData;
      // $scope.gateways.push(resData);
      $scope.message = {"class":"bg-success","text":"Update successful"};
      // console.log(resData);
    });
  };

});

app.controller('UserController', function($scope, socket) {
  // socket.get("/user", function(resData, jwres) {
  //   $scope.users = resData;
  // });
  // socket.on("user", function(event) {
  //   $scope.users.push(event.data);
  // })
});
