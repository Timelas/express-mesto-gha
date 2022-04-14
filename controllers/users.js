const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const NotAuth = require('../errors/not-auth');
const Conflict = require('../errors/conflict');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Такого пользователя не существует');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные!'));
      } else if (err.name === 'TypeError') {
        next(new NotFound('Пользователь с таким id не найден!'));
      } else {
        next(err);
      }
    });
};

const createUsers = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.ststus(200).send({ user }))
    .catch((err) => {
      if (err.code === 11000 && err.name === 'MongoServerError') {
        next(new Conflict('Пользователь с таким email уже существует!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные!'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.ststus(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные!'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => {
      throw new NotAuth(err.message);
    })
    .cath(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(200).send({ user });
      }
      return next(new NotFound('Такой пользователь не существует'));
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUsers,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
