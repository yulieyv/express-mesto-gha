const Card = require('../models/card');
const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(OK_STATUS).send(cards);
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Список карточек не получен' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({
          message: 'Невалидные данные',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: 'Ошибка при создании карточки' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Карточка не найдена' });
      }
      return res
        .status(OK_STATUS)
        .send({ message: 'Карточка с указанным ID удалена' });
    })
    .catch(() => {
      if (!req.params.cardId.isValid) {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Некорректный ID карточки' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: 'Ошибка при удалении карточки' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Карточка с указанным ID не найдена' });
      }
      return res.status(OK_STATUS).send({ message: 'Лайк добавлен' });
    })
    .catch(() => {
      if (!req.params.cardId.isValid) {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректный ID' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: 'Ошибка при постановке лайка карточке' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Карточка с указанным ID не найдена' });
      }
      return res.status(OK_STATUS).send({ message: 'Лайк удалён' });
    })
    .catch((err) => {
      if (!req.params.cardId.isValid) {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректный ID' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: err.message });
      }
    });
};
