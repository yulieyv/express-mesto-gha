const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const { OK_STATUS, CREATED_STATUS } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const InternalServerError = require('../errors/InternalServerError');
const ConflictError = require('../errors/ConflictError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.cookie(
        'jwt',
        token,
        {
          maxAge: 3600000,
          httpOnly: true,
        },
        { expiresIn: '7d' },
      );
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Неверные логин или пароль'));
      }
      if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(new UnauthorizedError('Ошибка авторизации'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED_STATUS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Невалидные данные'));
      }
      next(new InternalServerError('Ошибка при создании пользователя'));
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(OK_STATUS).send(users);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Id пользователя не найден');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID'));
      } else {
        next(new InternalServerError('Ошибка получения данных пользователя'));
      }
    });
};

const updateUserData = (req, res, next, config = {}) => {
  User.findByIdAndUpdate(req.user._id, req.body, config)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе не найдена');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Невалидные данные'));
      }
      next(new InternalServerError('Ошибка обновления профиля'));
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  updateUserData(req, res, next, {
    new: true,
    runValidators: true,
  });
};

module.exports.updateAvatar = (req, res, next) => {
  updateUserData(req, res, next, {
    new: true,
    runValidators: true,
  });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе не найдена');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch(next);
};
