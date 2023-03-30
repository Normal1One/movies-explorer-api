const cors = require('cors');

const allowedCors = [
  'https://diploma.nikitalavrov.nomoredomains.work',
  'http://diploma.nikitalavrov.nomoredomains.work',
  'http://localhost:3000',
];

module.exports.cors = (req, res, next) => {
  const requestHeaders = req.headers['access-control-request-headers'];
  cors({
    origin: allowedCors,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: requestHeaders,
    credentials: true,
  })(req, res, next);
};
