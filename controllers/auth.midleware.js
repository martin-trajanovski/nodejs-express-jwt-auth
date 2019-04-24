const jwt = require('jsonwebtoken');
const config = require('../config/auth.js');
const errors = require('./error');

module.exports.isAuthorized = (req, res, next) => {
  let token = req.headers['authorization'];
  token = token.replace('Bearer ', '');

  return jwt.verify(token, config.authTokenSecret, jwtErr => {
    if (jwtErr) {
      return errors.errorHandler(
        res,
        'Your access token is invalid.',
        'invalidToken'
      );
    } else {
      next();
    }
  });
};
