const jwt = require('jsonwebtoken');
const NotAuth = require('../errors/not-auth');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuth('Ошибка авторизации'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new NotAuth('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
