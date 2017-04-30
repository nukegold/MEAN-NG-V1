var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
    generalInfo: {
        fullName: {
            type: String,
            trim: true
        }
    },

    local: {
        email: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },
        password: String,
        resetPassword: {
            token: {
                type: String,
                unique: true,
                sparse: true
            },
            expire: Date
        }
    },
    facebook: {
        id: {
            type: String,
            unique: true,
            sparse: true
        },
        token: String,
        email: String,
        name: String
    }

});

// hash password
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking password if is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// schema plugins
userSchema.plugin(uniqueValidator);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);