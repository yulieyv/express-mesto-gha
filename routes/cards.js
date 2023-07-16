const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateCardId,
  validateCreateCard,
} = require('../middlewares/celebrate');

router.post('/', validateCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);
module.exports = router;
