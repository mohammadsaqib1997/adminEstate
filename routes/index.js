var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MineAim | Dashboard' });
});

router.get('/login', function(req, res, next) {
    res.render('pages/login', { title: 'MineAim | Login' });
});

router.get('/500', function(req, res, next) {
    res.render('pages/error_500', { title: 'MineAim | 500 Error' });
});

router.get('/404', function(req, res, next) {
    res.render('pages/error_404', { title: 'MineAim | 404 Page not found' });
});

module.exports = router;
