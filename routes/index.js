var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var csrf = require("csurf");
router.use(csrf());

//routes here
router.get('/login', notLoggedIn, function(req, res, next) {
    res.render('pages/login', { title: 'MineAim | Login' , csrf: req.csrfToken()});
});
router.post('/login', notLoggedIn, function(req, res, next) {
    req.assert('email', 'Email is invalid!').notEmpty().withMessage("Email is required!").isEmail();
    req.assert('password', 'Password is required!').notEmpty();
    var resErr = req.validationErrors();
    var setErr = {};
    if(resErr){
        resErr.forEach(function(val){
            if(!setErr.hasOwnProperty(val.param)){
                setErr[val.param] = { msg: val.msg, value: val.value };
            }
        });
        res.render('pages/login', { title: 'MineAim | Login', csrf: req.csrfToken(), errors : setErr });
    }else{
        var email = req.body.email;
        var pass = req.body.password;
        firebase.auth().signInWithEmailAndPassword(email, pass).then(function () {
            res.redirect('/');
        }).catch(function (err) {
            setErr['cred'] = { msg: err.message, value: "" };
            res.render('pages/login', { title: 'MineAim | Login', csrf: req.csrfToken(), errors : setErr });
        });

    }
});

router.get('/500', function(req, res, next) {
    res.render('pages/error_500', { title: 'MineAim | 500 Error' });
});

router.get('/404', function(req, res, next) {
    res.render('pages/error_404', { title: 'MineAim | 404 Page not found' });
});

router.use('/', isLoggedIn, function (req, res, next) {
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'MineAim | Dashboard' });
});

router.get('/logout', function(req, res, next) {
    firebase.auth().signOut().then(function(){
        res.redirect('/login');
    }).catch(function (err) {
        console.log(err);
        res.redirect('/');
    });
});

module.exports = router;

function isLoggedIn(req, res, next){
    if(firebase.auth().currentUser){
        return next();
    }
    res.redirect("/login");
}
function notLoggedIn(req, res, next){
    if(!firebase.auth().currentUser){
        return next();
    }
    res.redirect("/");
}
