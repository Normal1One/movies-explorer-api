const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/request-limiter');
const BadRequestErr = require('./errors/bad-request-err');
const router = require('./routes/index');
const { errorHandler } = require('./middlewares/error-handler');
const { ValidationMessage } = require('./utils/constants');
require('dotenv').config();

const { MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb', PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.use('/', router);

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

app.listen(PORT);
