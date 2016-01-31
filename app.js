var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var raceApi = require('./routes/race-api');
var personageApi = require('./routes/personage-api');
var attributeApi = require('./routes/attribute-api');
var raceAttributeApi = require('./routes/race-attribute-api');
var personageAttributeApi = require('./routes/personage-attribute-api');
var meritApi = require('./routes/merit-api');
var raceMeritApi = require('./routes/race-merit-api');
var personageMeritApi = require('./routes/personage-merit-api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', raceApi);
app.use('/', personageApi);
app.use('/', attributeApi);
app.use('/', raceAttributeApi);
app.use('/', personageAttributeApi);
app.use('/', meritApi);
app.use('/', raceMeritApi);
app.use('/', personageMeritApi);

app.use(express.static(__dirname + '../public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.get('/', function(req, res){
    res.render('index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
