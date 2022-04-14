const Card = require('../models/card');

const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const NoAccess = require('../errors/no-access');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      } else if (card.owner.toString() !== req.user._id) {
        throw new NoAccess('Вы не можете удалить карточку другого пользователя');
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((cardById) => res.send({ name: cardById.name, link: cardById.link }))
          .catch(next);
      }
    })
    .catch((err) => { next(err); });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  deleteCardById,
  createCards,
  likeCard,
  dislikeCard,
};
