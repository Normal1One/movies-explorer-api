const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/not-found-err');
const ConflictErr = require('../errors/conflict-err');
const {
  LogoutMessage, LoginMessage, UserNotFoundMessage, ConflictMessage,
} = require('../utils/constants');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const formatUserResponse = (user) => ({
  email: user.email,
  name: user.name,
});

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(UserNotFoundMessage);
      } else {
        res.send(formatUserResponse(user));
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.send(formatUserResponse(user)))
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictErr(ConflictMessage));
      } else {
        next(e);
      }
    });
};

module.exports.changeUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(UserNotFoundMessage);
      } else {
        res.send(formatUserResponse(user));
      }
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictErr(ConflictMessage));
      } else {
        next(e);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 604800000, httpOnly: true, sameSite: true });
      res.status(200).send({ message: LoginMessage });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: true });
  res.status(200).send({ message: LogoutMessage });
};
