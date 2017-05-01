var express = require('express');
var router = express.Router();

require('dotenv').config(); // Bring environment vars from '.env'
const production = JSON.stringify(process.env.PRODUCTION);

router.get('/', function (req, res, next) {
  if (req.baseUrl.startsWith('/auth') || req.isAuthenticated())
    production ? res.render('index') : res.redirect('http://localhost:4200/');
  else
    production ? res.redirect('/auth/login') : res.redirect('http://localhost:4200/auth/login');
});

module.exports = router;
