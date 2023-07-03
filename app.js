const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_STATUS } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64a2ee75308a714ec081a2a2',
  };
  next();
});
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res
    .status(NOT_FOUND_STATUS)
    .send({ message: 'Неверный URL запроса' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log('Сервер запущен, хвала богам!');
});
