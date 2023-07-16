const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(
      req.headers.cookie.replace('token=', ''),
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
