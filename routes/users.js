const router = require('express').Router();
const {
  getUser, changeUser, createUser, login, logout,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  changeUserValidate, signinValidate, signupValidate,
} = require('../utils/validation');

router.get('/users/me', auth, getUser);

router.patch('/users/me', auth, changeUserValidate, changeUser);

router.get('/signout', auth, logout);

router.post('/signin', signinValidate, login);

router.post('/signup', signupValidate, createUser);

module.exports = router;
