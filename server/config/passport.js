var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// load strategies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load the user model
var User = require('../models/user');

// get .env parameters
//require('dotenv').config();

// REMEMBER ME
// =========================================================================
// adjust the session cookie according to the 'remember me' check
function rememberMe(req) {
    if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
    }
}

// expose this function to our app using module.exports
module.exports = function (passport) {

    // SESSION SERIALIZATION
    // =========================================================================

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (_id, done) {
        User.findById(_id)
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });

    // LOCAL REGISTER
    // =========================================================================
    passport.use('local-register', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                    'local.email': email
                })
                .then(user => {
                    if (user) {
                        return done(null, null, {
                            message: 'Email is already registered.'
                        });
                    }

                    var newUser = new User();
                    newUser.generalInfo.fullName = req.body.fullName;
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password); // hash the password before saving                    

                    newUser.save()
                        .then(result => {
                            rememberMe(req);

                            // On successful registration log in the new user 
                            req.logIn(newUser, err => {
                                return done(err, newUser)
                            });
                        })
                        .catch(error => {
                            return done(error)
                        });
                })
                .catch(error => {
                    return done(error)
                });

        }
    ));

    // LOCAL LOGIN
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                    'local.email': email
                })
                .then(user => {
                    if (!user || !user.validPassword(password)) {
                        return done(null, false, {
                            message: 'Invalid login credentials'
                        });
                    }

                    rememberMe(req);

                    // perform the log-in (necessary since we're not using the default passport name)
                    req.logIn(user, err => {
                        return done(err, user)
                    });
                })
                .catch(error => {
                    return done(error);
                });

        }));

    // LOCAL PASSWORD RECOVERY
    // =========================================================================
    passport.use('local-password-recover', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            async.waterfall([

                    // Create a token
                    function (cb) {
                        crypto.randomBytes(20, function (err, buf) {
                            var token = buf.toString('hex');
                            cb(err, token);
                        });
                    },

                    // find the user requesting password recovery
                    function (token, cb) {
                        User.findOneAndUpdate({
                                'local.email': email
                            }, {
                                'local.resetPassword': {
                                    'token': token,
                                    'expire': Date.now() + 3600000 // 1 hour
                                }
                            }, {
                                new: true
                            })
                            .exec()
                            .then(user => {
                                if (!user) {
                                    return done(null, false, {
                                        message: 'Email not found'
                                    });
                                }

                                cb(null, token, user);
                            })
                            .catch(error => {
                                return done(error);
                            });
                    },

                    // send and email with a link to reset password
                    function (token, user, cb) {

                        var transport = {
                            host: process.env.EMAIL_HOST || '[YOUR EMAIL HOST]',
                            port: parseInt(process.env.EMAIL_PORT || '[YOUR EMAIL PORT]'),
                            secure: process.env.EMAIL_SECURE ? true : false,
                            auth: {
                                user: process.env.EMAIL_USERNAME || '[YOUR EMAIL USERNAME]',
                                pass: process.env.EMAIL_PASSWORD || '[YOUR EMAIL PASSWORD]'
                            }
                        };

                        var smtpTransport = nodemailer.createTransport(transport);

                        var link = req.protocol + '://' + req.headers.host + '/auth/resetpassword/' + token;
                        var mailOptions = {
                            to: user.local.email,
                            from: 'passwordreset@demo.com',
                            subject: 'MEAN-NG Password Reset',
                            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                            Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                                link +
                                `\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
                        };

                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) return done(err);
                            return done(null, user)
                        });
                    }
                ],
                function (err) {
                    if (err) return done(err);
                });

        }));

    // LOCAL PASSWORD RESET
    // =========================================================================
    passport.use('local-password-reset', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            var token = req.params['token'];
            User.findOne({
                    'local.resetPassword.token': token,
                    'local.resetPassword.expire': {
                        $gt: Date.now()
                    }
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'Password reset token expired or not found.'
                        });
                    }
                    user.update({
                            'local.password': user.generateHash(password),
                            'local.resetPassword': null
                        })
                        .exec()
                        .then(user => {
                            return done(null, user)
                        })
                        .catch(error => {
                            return done(error)
                        });
                })
                .catch(error => {
                    return done(error);
                })
        }));

    // FACEBOOK LOGIN
    // =========================================================================
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID || '[YOUR FACEBOOK APP ID]',
            clientSecret: process.env.FACEBOOK_APP_SECRET || '[YOUR FACEBOOK APP SECRET]',
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/user/facebook/callback',
            profileFields: ['id', 'name', 'emails']
        },
        function (token, refreshToken, profile, done) {
            User.findOne({
                    'facebook.id': profile.id
                })
                .then(user => {
                    if (user) {
                        return done(null, user)
                    } else {
                        var newUser = new User();

                        newUser.facebook.id = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.generalInfo.fullName = newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

                        // save our user to the database
                        newUser.save()
                            .then(user => {
                                // On successful registration log in the new user 
                                return done(null, user)
                            })
                            .catch(error => {
                                return done(error)
                            });
                    }
                })
                .catch(error => {
                    return done(error);
                });

        }));
}