const { celebrate, Joi } = require('celebrate');
const { regexAvatar, regexLink } = require('../utils/constants');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexAvatar),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserId = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regexAvatar),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexLink),
  }),
});

module.exports.validateCardId = celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
});
