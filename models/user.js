const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
    minlenghth: 2,
    maxlength: 30,
  },
  about: {
    require: true,
    type: String,
    minlenghth: 2,
    maxlength: 30,
  },
  avatar: {
    require: true,
    type: String,
  },
});
module.exports = mongoose.model('user', userSchema);
