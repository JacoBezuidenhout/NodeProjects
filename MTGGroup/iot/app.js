var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var settings = require('./settings.json');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk(settings.database.server + ":" + settings.database.port + "/" + settings.database.name);
var CONTROLLER = require('./controller');
var controller = new CONTROLLER(db);

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var login = require('./routes/login');
var logout = require('./routes/logout');
var gateways = require('./routes/gateways');

var options = { dir:'./sessions' };
var debug = require('debug')('iot:server');
var http = require('http');
var app = express();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(settings.server.port || '3000');
app.set('port', port);

var server = http.createServer(app);
var io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('a user connected',socket.client.id);
  });
  io.on('disconnect', function(socket){
    console.log('a user disconnected');
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new FileStore(options),
    secret: 'qwertyuiop',
    cookie: { maxAge: 20000000000 }
}));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  req.output = settings;

  if (typeof req.session.user === "undefined" && req.path != "/login")
  {
    req.output.login = 0;
    res.redirect("/login");
    console.log({login:false});
    return;
  }

  if (req.path == "/login")
  {
    next();
    return;
  }

  console.log({login:true});
  db.get("users").findOne({email: req.session.user.email},function(err,docs)
  {
    req.session.user = docs;
    req.output.user = req.session.user || {};
    controller.get(req.output,function(data){
      req.output = data;
      next();
    });
  });

});

app.use('/', routes);
app.use('/api', api);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);
app.use('/gateways', gateways);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var output = settings;
    output.message = err.message;
    output.error = err;
    res.render('error', output);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var output = settings;
  output.message = err.message;
  output.error = {};
  res.render('error', output);
});


module.exports = app;


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
