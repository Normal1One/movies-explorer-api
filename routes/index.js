const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundErr = require('../errors/not-found-err');
const { PageNotFoundMessage } = require('../utils/constants');

router.use('/', userRouter);
router.use('/', movieRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundErr(PageNotFoundMessage));
});

module.exports = router;
