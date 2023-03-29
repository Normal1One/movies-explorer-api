const Movie = require('../models/movie');
const NotFoundErr = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');
const { ForbiddenMessage, MovieNotFoundMessage, DeleteMessage } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId, owner: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr(MovieNotFoundMessage);
      }
      if (movie.owner.toHexString() === req.user._id) {
        return Movie.findOneAndRemove({ movieId: req.params.movieId, owner: req.user._id })
          .then(() => {
            res.send({ message: DeleteMessage });
          });
      }
      throw new ForbiddenErr(ForbiddenMessage);
    })
    .catch(next);
};
