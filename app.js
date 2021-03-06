var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exp_validator = require('express-validator');
var session = require('express-session');
//var history = require('connect-history-api-fallback');

var firebase = require('firebase');
var fbConfig = require('./config/app_config.json').firebase_config;
firebase.initializeApp(fbConfig);

var firebase_admin = require('firebase-admin');
var service_account = require('./config/firebase_admin_cred.json');
firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(service_account),
    databaseURL: fbConfig.databaseURL
});

var api = require('./routes/api');
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(exp_validator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'), root = namespace.shift(), formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
app.use(cookieParser());
app.use(session({secret: "This is Realestate Secret!", resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(history({
 index: "/"
 }));*/
// api routes working here..
app.use('/api', api);

// web routes working here..
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.render('error');
    /*if(err.status == 404){
        res.render('pages/error_404');
    }else{
        res.render('pages/error_500');
    }*/
});

module.exports = app;
