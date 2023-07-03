const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64a2ee75308a714ec081a2a2',
  };
  next();
});
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
