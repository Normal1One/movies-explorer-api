const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundErr = require('./errors/not-found-err');
const BadRequestErr = require('./errors/bad-request-err');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { MONGO_URL, PORT } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb');

app.use('/', userRouter);
app.use('/', movieRouter);

app.use((req, res, next) => {
  next(new NotFoundErr('Page not found'));
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (!isCelebrateError(err)) {
    next(err);
  } else {
    next(new BadRequestErr('Validation failed'));
  }
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Internal server error'
      : message,
  });
  next();
});

app.listen(PORT || 3000);
