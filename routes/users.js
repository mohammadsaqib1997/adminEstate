var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/check', function(req, res, next) {
  res.send('this is check');
});

module.exports = router;
