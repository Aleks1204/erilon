var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression')

var raceApi = require('./routes/race-api');
var personageApi = require('./routes/personage-api');
var attributeApi = require('./routes/attribute-api');
var raceAttributeApi = require('./routes/race-attribute-api');
var personageAttributeApi = require('./routes/personage-attribute-api');
var meritApi = require('./routes/merit-api');
var raceMeritApi = require('./routes/race-merit-api');
var personageMeritApi = require('./routes/personage-merit-api');
var inherentApi = require('./routes/inherent-api');
var personageInherentApi = require('./routes/personage-inherent-api');
var raceInherentApi = require('./routes/race-inherent-api');
var flawApi = require('./routes/flaw-api');
var raceFlawApi = require('./routes/race-flaw-api');
var personageFlawApi = require('./routes/personage-flaw-api');
var attachedSkillApi = require('./routes/attached-skill-api');
var personageAttachedSkillApi = require('./routes/personage-attached-skill-api');
var triggerSkillApi = require('./routes/trigger-skill-api');
var skillLevelApi = require('./routes/skill-level-api');
var personageTriggerSkillApi = require('./routes/personage-trigger-skill-api');
var historyApi = require('./routes/history-api');
var meritAttributeApi = require('./routes/merit-attribute-api');
var meritAttachedSkillApi = require('./routes/merit-attached-skill-api');
var meritAttributeAttachedSkillApi = require('./routes/merit-attribute-attached-skill-api');
var meritTriggerSkillApi = require('./routes/merit-trigger-skill-api');
var meritInherentApi = require('./routes/merit-inherent-api');
var meritFlawApi = require('./routes/merit-flaw-api');
var meritMeritApi = require('./routes/merit-merit-api');
var spellApi = require('./routes/spell-api');
var personageSpellApi = require('./routes/personage-spell-api');
var playerApi = require('./routes/player-api');
var roleApi = require('./routes/role-api');
var rolePermissionApi = require('./routes/role-permission-api');
var permissionApi = require('./routes/permission-api');
var noticeApi = require('./routes/notice-api');

var isMobile = require('ismobilejs');

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
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', raceApi);
app.use('/', personageApi);
app.use('/', attributeApi);
app.use('/', raceAttributeApi);
app.use('/', personageAttributeApi);
app.use('/', meritApi);
app.use('/', raceMeritApi);
app.use('/', personageMeritApi);
app.use('/', inherentApi);
app.use('/', personageInherentApi);
app.use('/', raceInherentApi);
app.use('/', flawApi);
app.use('/', raceFlawApi);
app.use('/', personageFlawApi);
app.use('/', attachedSkillApi);
app.use('/', personageAttachedSkillApi);
app.use('/', triggerSkillApi);
app.use('/', skillLevelApi);
app.use('/', personageTriggerSkillApi);
app.use('', personageTriggerSkillApi);
app.use('', historyApi);
app.use('', meritAttributeApi);
app.use('', meritAttachedSkillApi);
app.use('', meritAttributeAttachedSkillApi);
app.use('', meritTriggerSkillApi);
app.use('', meritInherentApi);
app.use('', meritFlawApi);
app.use('', meritMeritApi);
app.use('', spellApi);
app.use('', personageSpellApi);
app.use('', playerApi);
app.use('', roleApi);
app.use('', rolePermissionApi);
app.use('', permissionApi);
app.use('', noticeApi);

app.use(express.static(__dirname + '../public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.get('/', function(req, res){
    res.render('login/login.html');
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
