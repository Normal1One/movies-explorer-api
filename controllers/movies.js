const Movie = require('../models/movie');
const NotFoundErr = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');
const { ForbiddenMessage, MovieNotFoundMessage, DeleteMessage } = require('../utils/constants');

const formatMovieResponse = (movie) => ({
  country: movie.country,
  director: movie.director,
  duration: movie.duration,
  year: movie.year,
  description: movie.description,
  image: movie.image,
  trailer: movie.trailer,
  thumbnail: movie.thumbnail,
  owner: movie.owner,
  nameRU: movie.nameRU,
  nameEN: movie.nameEN,
  movieId: movie.movieId,
});

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(formatMovieResponse(movie));
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then(async (movie) => {
      if (!movie) {
        throw new NotFoundErr(MovieNotFoundMessage);
      }
      if (movie.owner._id.toHexString() === req.user._id) {
        await Movie.findByIdAndRemove(req.params.movieId);
        res.send({ message: DeleteMessage });
      }
      throw new ForbiddenErr(ForbiddenMessage);
    })
    .catch(next);
};
