const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, changeUser, createUser, login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getUser);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), changeUser);

router.get('/signout', auth, (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: true });
  res.status(200).send({ message: 'You have succesfully logged out' });
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = router;
