const errorRouter = require('express').Router();

errorRouter.patch('/*', (req, res) => {
  res.status(404).send({ message: 'Ошибка по умолчанию' });
});

module.exports = errorRouter;
