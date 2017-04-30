var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (req.baseUrl.startsWith('/auth') || req.isAuthenticated())
    res.render('index');
  else
    res.redirect('/auth/login');
});

module.exports = router;