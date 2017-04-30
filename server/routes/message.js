var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Message = require('../models/message');

var response = require('./_response');

/**
 * Check authentication on every method on this route
 */
router.use('/', function (req, res, next) {
    if (req.isAuthenticated()) next();
    else {
        response.error(res, {
            message: 'Not logged in'
        }, response.HTTPStatus.UNAUTHORIZED);
    }
});

/**
 * Get all messages (ordered by time posted from earliest to latest)
 * Returns only last 50 messages
 */
router.get('/', function (req, res, next) {
    Message.find()
        .sort('-time')
        .limit(50)
        .populate('user', 'generalInfo.fullName')
        .then(messages => response.ok(res, {
            myId: req.user._id,
            messages: messages.reverse()
        }))
        .catch(error => response.error(res, error));
});

/**
 * Post a new message
 */
router.post('/', function (req, res, next) {
    var message = new Message({
        content: req.body.content,
        user: req.user
    });
    message.save()
        .then(message => {
            // Inform all clients via socket.io
            res.io.emit('new_msg', {
                type: 'msg',
                message: {
                    _id: message._id,
                    content: message.content,
                    time: message.time,
                    user: {
                        _id: message.user._id,
                        generalInfo: message.user.generalInfo
                    }
                }
            });

            return response.ok(res, message);
        })
        .catch(error => response.error(res, error));
});

module.exports = router;