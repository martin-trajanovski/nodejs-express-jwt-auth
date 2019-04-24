const express = require('express');
const router = express.Router();
const auth = require('./auth');
const errors = require('./error');
const tokenList = {}; // TODO: Use redis (in memory storage) which is better for production.

router.post('/signup', (req, res) => {
  auth
    .registerUser(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password
    )
    .then(user => {
      auth.logUserActivity(user, 'signup');
    })
    .then(() => {
      res.send({
        success: true
      });
    })
    .catch(err => {
      return errors.errorHandler(res, err);
    });
});

router.post('/login', (req, res) => {
  auth
    .loginUser(req.body.email, req.body.password)
    .then(user => {
      let authToken = auth.createToken(user);
      let refreshToken = auth.createRefreshToken(user);
      let userActivityLog = auth.logUserActivity(user, 'login');
      return Promise.all([authToken, refreshToken, userActivityLog]).then(
        tokens => {
          return {
            authToken: tokens[0],
            refreshToken: tokens[1]
          };
        }
      );
    })
    .then(success => {
      const response = {
        success: true,
        authToken: success.authToken,
        refreshToken: success.refreshToken
      };
      tokenList[response.refreshToken] = response;

      res.send(response);
    })
    .catch(err => {
      return errors.errorHandler(res, err);
    });
});

router.post('/logout', (req, res) => {
  if (req.body.refreshToken != '' && req.body.refreshToken in tokenList) {
    delete tokenList[req.body.refreshToken];

    const response = {
      success: true
    };

    res.status(200).send(response);
  } else {
    return errors.errorHandler(res, 'Invalid request', 404);
  }
});

router.post('/refreshToken', (req, res) => {
  if (req.body.refreshToken && req.body.refreshToken in tokenList) {
    auth
      .validateRefreshToken(req.body.refreshToken)
      .then(tokenResponse => {
        return auth.createToken(tokenResponse);
      })
      .then(authToken => {
        tokenList[req.body.refreshToken].authToken = authToken;

        res.status(200).send({
          success: true,
          authToken: authToken
        });
      })
      .catch(err => {
        if (err.code) {
          return errors.errorHandler(res, err.message, err.code);
        } else {
          return errors.errorHandler(res, err.message);
        }
      });
  } else {
    return errors.errorHandler(res, 'Invalid request', 404);
  }
});

module.exports = router;
