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

var options = { dir:'./sessions' };

var app = express();
global.settings = settings;
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
  req.output.user = req.session.user || {};
  if (typeof req.session.user === "undefined" && req.path != "/login")
  {
    req.output.login = 0;
    res.redirect("/login");
    return;
  }
  else
  {
    var tmp = controller.get(req.session);
    for (var key in tmp) { req.output[key] = tmp[key]; }
    next();
  }
});

app.use('/', routes);
app.use('/api', api);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);

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
    var output = global.settings;
    output.message = err.message;
    output.error = err;
    res.render('error', output);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var output = global.settings;
  output.message = err.message;
  output.error = {};
  res.render('error', output);
});


module.exports = app;
