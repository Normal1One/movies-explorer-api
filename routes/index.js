const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  getUser, changeUser, createUser, login, logout,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  createMovieValidate, deleteMovieValidate, changeUserValidate, signinValidate, signupValidate,
} = require('../utils/validation');

router.get('/movies', auth, getMovies);

router.post('/movies', auth, createMovieValidate, createMovie);

router.delete('/movies/:movieId', auth, deleteMovieValidate, deleteMovie);

router.get('/users/me', auth, getUser);

router.patch('/users/me', auth, changeUserValidate, changeUser);

router.get('/signout', auth, logout);

router.post('/signin', signinValidate, login);

router.post('/signup', signupValidate, createUser);

module.exports = router;
