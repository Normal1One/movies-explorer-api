require('dotenv').config();

module.exports = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb',
  PORT: process.env.PORT || 3000,
};
