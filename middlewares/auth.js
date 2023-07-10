const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  let token = '';
  if (req.headers.cookie || req.headers.cookie.startsWith('jwt')) {
    token = req.headers.cookie.replace('jwt=', '');
  } else if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Токен отсутствует'));
  } else token = req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (error) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
