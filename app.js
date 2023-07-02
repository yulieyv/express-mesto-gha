const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен, хвала богам!`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '64a184d5d371e3751c5b2b29',
  };
  next();
});
