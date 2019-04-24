const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const errors = require('./error');
const auth = require('./auth.midleware');

router.get('/users', auth.isAuthorized, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).send({
        success: true,
        users
      });
    })
    .catch(err => {
      return errors.errorHandler(res, err);
    });
});

module.exports = router;
