var express = require('express');
var router = express.Router();
var passport = require('passport');
var response = require('./_response');

// load the user model
var User = require('../models/user');



/**
 * Login to a user account
 */
router.post('/login', function (req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (user) response.ok(res, true);
    else if (err) response.error(res, err);
    else response.error(res, info, response.HTTPStatus.UNAUTHORIZED);
  })(req, res, next);
});

/**
 * Register a new user
 */
router.post('/register', function (req, res, next) {
  passport.authenticate('local-register', function (err, user, info) {
    if (user) response.ok(res, true, response.HTTPStatus.CREATED);
    else if (err) response.error(res, err);
    else response.error(res, info, response.HTTPStatus.BAD_REQUEST); // email is already registered
  })(req, res, next);
});

/**
 * User request to recover password
 */
router.post('/password/recover', function (req, res, next) {
  passport.authenticate('local-password-recover', function (err, user, info) {
    if (user) response.ok(res, true, response.HTTPStatus.ACCEPTED);
    else if (err) response.error(res, err);
    else response.error(res, info, response.HTTPStatus.BAD_REQUEST); // email is already registered
  })(req, res, next);
});

/**
 * User request to reset password
 */
router.post('/password/reset/:token', function (req, res, next) {
  passport.authenticate('local-password-reset', function (err, user, info) {
    if (user) response.ok(res, true);
    else if (err) response.error(res, err);
    else response.error(res, info, response.HTTPStatus.BAD_REQUEST);
  })(req, res, next);
});

/**
 * Facebook login
 */
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

/**
 * Facebook authentication callback
 */
router.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook', {
    failureRedirectY: (process.env.FRONTEND_URL || 'http://localhost:4200') + '/auth/login'
  }, function (err, user, info) {
    if (!user) res.redirect((process.env.FRONTEND_URL || 'http://localhost:4200') + '/auth/login');
    else {
      req.logIn(user, err => {
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:4200');
      });
    }
  })(req, res, next);
});

/**
 * Log the current user out
 */
router.get('/logout', function (req, res, next) {
  req.logout();
  response.ok(res, null);
});

/**
 * Get user basic infomation
 */
router.get('/getuser', function (req, res, next) {
  if (req.isAuthenticated()) {
    response.ok(res, {
      id: req.user._id,
      name: req.user.generalInfo.fullName
    });
  } else {
    response.error(res, {
      message: 'Not logged in'
    }, response.HTTPStatus.UNAUTHORIZED);
  }
});

/**
 * Redirect to a user's profile picture, either a Facebook profile image or a generic user icon
 */
router.get('/profile/:id', function (req, res, next) {
  var id = req.params['id'];
  const defaultUserIcon = 'https://www.juptr.io/images/default-user.png';

  User.findById(id)
    .then(user => {
      if (!user || !user.facebook || !user.facebook.id) {
        return res.redirect(defaultUserIcon);
      }
      return res.redirect('http://graph.facebook.com/' + user.facebook.id + '/picture?type=normal');
    })
    .catch(error => {
      return res.redirect(defaultUserIcon);
    })
});

module.exports = router;
