const cardsRouter = require('express').Router();
const {
  getCards,
  deleteCardById,
  createCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', deleteCardById);
cardsRouter.post('/cards', createCards);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
