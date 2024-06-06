var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '"Messaging App" backend' });
});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Success' });
});

router.get('/failure', function(req, res, next) {
  res.render('failure', { title: 'Failure' });
});

module.exports = router;
