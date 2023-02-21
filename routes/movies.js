const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const auth = require('../middlewares/auth');
const {
  createMovieValidate, deleteMovieValidate,
} = require('../utils/validation');

router.get('/movies', auth, getMovies);

router.post('/movies', auth, createMovieValidate, createMovie);

router.delete('/movies/:movieId', auth, deleteMovieValidate, deleteMovie);

module.exports = router;
