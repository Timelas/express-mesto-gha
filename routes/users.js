const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isValidUrl } = require('../utils/validation');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUser);
usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().min(24)
      .max(24),
  }),
}), getUserById);
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(isValidUrl),
  }),
}), updateAvatar);

module.exports = usersRouter;
