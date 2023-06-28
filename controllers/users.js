const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Не удалось получить список пользователей" });
    });
};

module.exports.getUserById = (req, res) => {
  return User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Id пользователя не найден" });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (!req.params.userId.isValid) {
        res.status("400").send({ message: "Incorrect Id number" });
      } else {
        res
          .status(500)
          .send({ message: "Ошибка получения данных пользователя" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status("201").send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status("400").send({
          message: `${Object.values(err.errors)
            .map((item) => item.message)
            .join(", ")}`,
        });
      } else {
        res.status(500).send({ message: "Ошибка при создании пользователя" });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Информация о пользователе не найдена" });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(". ")}`,
        });
      }
      return res
        .status(500)
        .send({ message: "Ошибка обновления данных пользователя" });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    runValidators: true,
    new: true,
  })
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному ID не найден" });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status("400").send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(". ")}`,
        });
      }
      return res
        .status(500)
        .send({ message: "Ошибка обновления аватара пользователя" });
    });
};
