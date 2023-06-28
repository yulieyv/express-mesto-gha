const express = require("express");
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "64958ff9e04eb02d03e2150c",
  };
  next();
});


app.use("users", userRouter);
app.use("cards", cardRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен!`);
});
