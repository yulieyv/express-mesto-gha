require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimiter');
const { PORT, DB_URL } = require('./utils/constants');
const router = require('./routes/index');

const app = express();

mongoose.connect(DB_URL);

app.use(helmet());
app.use(express.json());
app.use(limiter);
app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
