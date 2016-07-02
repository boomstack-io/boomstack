var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Boomstack', message: '' });
});

router.get('/hello', stormpath.loginRequired, function(req, res, next) {
  res.render('index', { title: 'Boomstack Stack', message: "Welcome !"});
});


module.exports = router;
