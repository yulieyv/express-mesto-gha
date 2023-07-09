const mongoose = require('mongoose');
const Card = require('../models/card');
const { OK_STATUS, CREATED_STATUS } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(OK_STATUS).send(cards);
    })
    .catch(next(new InternalServerError('Список карточек не получен')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Невалидные данные'));
      }
      next(new InternalServerError('Ошибка при создании карточки'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res
        .status(OK_STATUS)
        .send({ message: 'Карточка с указанным ID удалена' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID карточки'));
      } else {
        next(new InternalServerError('Ошибка при удалении карточки'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным ID не найдена');
      }
      return res.status(OK_STATUS).send({ message: 'Лайк добавлен' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID карточки'));
      } else {
        next(new InternalServerError('Ошибка при постановке лайка карточке'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным ID не найдена');
      }
      return res.status(OK_STATUS).send({ message: 'Лайк удалён' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID карточки'));
      } else {
        next(new InternalServerError('Ошибка при удалении лайка'));
      }
    });
};
