
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UsersSchema = new mongoose.Schema({
    userEmail: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email address'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  });

  UsersSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    //user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
      return token;
    });
  };

  UsersSchema.statics.findByToken = function (token) {
    var Users = this;
    var decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject();
    }

    return Users.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  };

  UsersSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {

      bcrypt.genSalt(13, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });

    } else {
      next();
    }
  });

  UsersSchema.statics.findByCredentials = function(userEmail, password) {
    var Users = this;

    return Users.findOne({userEmail}).then((user) => {
      if (!user) {
        return Promise.reject();
      } else {

        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            } else {
              reject();
            }
          });
        });
      }
    });
  };

  UsersSchema.methods.removeToken = function (token) {

    var user = this;

    return user.update({
      $pull: {
        tokens: {token}
      }
    });
  };

  UsersSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'userEmail']);
  };

var Users = mongoose.model('Users', UsersSchema);

module.exports = {Users};
