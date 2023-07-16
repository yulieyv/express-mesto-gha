const mongoose = require('mongoose');
const Card = require('../models/card');
const { OK_STATUS, CREATED_STATUS } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        return next(new NotFoundError('Нет ни одной карточки'));
      }
      return res.status(OK_STATUS).send(cards);
    })
    .catch(next);
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
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка при создании карточки'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.toString() !== owner) {
        return next(new ForbiddenError('Вы не можете удалить эту карточку'));
      }
      return Card.deleteOne({ _id: req.params.cardId })
        .then((deletedCard) => {
          res.status(OK_STATUS).send(deletedCard);
        });
    })
    .catch(next);
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
      return res.status(OK_STATUS).send(card);
    })
    .catch(next);
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
      return res.status(OK_STATUS).send(card);
    })
    .catch(next);
};
