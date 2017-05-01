var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (req.baseUrl.startsWith('/auth') || req.isAuthenticated())
    res.redirect(req.protocol + '://' + req.headers.host);
  else
    res.redirect(req.protocol + '://' + req.headers.host + '/auth/login');
});

module.exports = router;
