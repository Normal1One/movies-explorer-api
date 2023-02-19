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
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr(MovieNotFoundMessage);
      }
      if (movie.owner._id.toHexString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ message: DeleteMessage });
          });
      }
      throw new ForbiddenErr(ForbiddenMessage);
    })
    .catch(next);
};
