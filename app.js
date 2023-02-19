const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/request-limiter');
const NotFoundErr = require('./errors/not-found-err');
const BadRequestErr = require('./errors/bad-request-err');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { errorHandler } = require('./middlewares/error-handler');
const { ValidationMessage, PageNotFoundMessage } = require('./utils/constants');

const { MONGO_URL, PORT } = process.env;

const app = express();

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
  next(new NotFoundErr(PageNotFoundMessage));
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (isCelebrateError(err) || '_message' in err) {
    next(new BadRequestErr(ValidationMessage));
  } else {
    next(err);
  }
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT || 3000);
