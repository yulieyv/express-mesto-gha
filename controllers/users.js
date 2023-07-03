const mongoose = require('mongoose');
const User = require('../models/user');
const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED_STATUS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({
          message: 'Невалидные данные',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Ошибка при создании пользователя' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_STATUS).send(users);
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Не удалось получить список пользователей' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Id пользователя не найден' });
        return;
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректный ID' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: 'Ошибка получения данных пользователя' });
      }
    });
};

const updateUserData = (req, res, config = {}) => {
  User.findByIdAndUpdate(req.user._id, req.body, config)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Информация о пользователе не найдена' });
        return;
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({
          message: 'Невалидные данные',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Ошибка обновления профиля' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  updateUserData(req, res, {
    new: true,
    runValidators: true,
  });
};

module.exports.updateAvatar = (req, res) => {
  updateUserData(req, res, {
    new: true,
    runValidators: true,
  });
};
