const mongoose = require('mongoose');

var Users = mongoose.model('Users', {
  userEmail: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = {Users};
