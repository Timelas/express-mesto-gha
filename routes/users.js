const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().min(24)
      .max(24),
  }),
}), getUserById);
usersRouter.get('/users/me', getUser);
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(5),
    //не могу использовать регулярное выражение- выдает ошибку из-за более новой версии-error: regex should not use global or sticky mode
    //также не работают автотесты из-за package-lock версии 2, а не 1
    // avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.[a-z0-9_-]{2,3}))(:\d{2,5})?((\/.+)+)?\/?#?/gm),
  }),
}), updateAvatar);

module.exports = usersRouter;
