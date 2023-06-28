const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: "Список карточек не получен" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      }
      return res.status(500).send({ message: "Ошибка при создании карточки" });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res
        .status(200)
        .send({ message: "Карточка с указанным ID удалена" });
    })
    .catch(() => {
      if (!req.params.cardId.isValid) {
        res.status(400).send({ message: "Некорректный ID карточки" });
      } else {
        res.status(500).send({ message: "Ошибка при удалении карточки" });
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
          .status(404)
          .send({ message: "Карточка с указанным ID не найдена" });
      }
      return res.status(200).send({ message: "Лайк добавлен" });
    })
    .catch(() => {
      if (!req.params.cardId.isValid) {
        res.status(400).send({ message: "Некорректный ID" });
      } else {
        res
          .status(500)
          .send({ message: "Ошибка при постановке лайка карточке" });
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
          .status(400)
          .send({ message: "Карточка с указанным ID не найдена" });
      }
      return res.status(200).send({ message: "Лайк удалён" });
    })
    .catch((err) => {
      if (!req.params.cardId.isValid) {
        res.status(400).send({ message: "Некорректный ID" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
