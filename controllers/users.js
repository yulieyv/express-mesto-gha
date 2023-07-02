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
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
    .then((users) => res.status(OK_STATUS).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Не удалось получить список пользователей' })
    );
};

module.exports.getUser = (req, res) => {
  const { _id } = req.params.userId;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Id пользователя не найден' });
        return;
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректный ID' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: 'Ошибка получения данных пользователя' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Информация о пользователе не найдена' });
        return;
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({
          message: 'Невалидные данные',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Ошибка обновления данных пользователя' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      runValidators: true,
      new: true,
    }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Пользователь по указанному ID не найден' });
        return;
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({
          message: 'Невалидные данные',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Ошибка обновления аватара пользователя' });
    });
};
