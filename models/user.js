const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlenghth: 2,
    maxlength: 30,
    require: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlenghth: 2,
    maxlength: 30,
    require: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('user', userSchema);
