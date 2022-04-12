const Card = require('../models/card');

const ERROR_CODE = 400;
const BAD_REQUEST = 404;
const SERVER_ERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные!' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send({ name: card.name, link: card.link }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE).send({ message: 'Некорректные данные!' });
    } else if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Карточка не найдена!' });
    } else {
      res.status(SERVER_ERROR).send({ message: err.message });
    }
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE).send({ message: 'Некорректные данные!' });
    } else if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Карточка не найдена!' });
    } else {
      res.status(SERVER_ERROR).send({ message: err.message });
    }
  });
};

module.exports = {
  getCards,
  deleteCardById,
  createCards,
  likeCard,
  dislikeCard,
};
