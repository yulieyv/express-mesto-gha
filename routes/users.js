const router = require('express').Router();
const {
  getUserInfo,
  getUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');
const {
  validateUpdateAvatar,
  validateUpdateUser,
  validateUserId,
} = require('../middlewares/celebrate');

router.get('/me', getUserInfo);
router.get('/', getUsers);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUpdateUser, updateUserInfo);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
