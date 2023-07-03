const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');

const { NOT_FOUND_STATUS } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'Неверный URL запроса' });
});

module.exports = router;
