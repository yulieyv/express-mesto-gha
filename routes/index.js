const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validateLogin } = require('../middlewares/celebrate');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateLogin, createUser);
router.post('/signin', validateLogin, login);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Неверный URL запроса'));
});

module.exports = router;
