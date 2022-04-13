const errorRouter = require('express').Router();

errorRouter.patch('/*', (req, res) => {
  res.send({ message: 'Ошибка по умолчанию' });
});

module.exports = errorRouter;
