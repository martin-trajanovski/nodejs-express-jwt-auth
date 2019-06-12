const mongoose = require('mongoose');
const chalk = require('chalk');
const logger = require('../logs/logger');

module.exports = {
  connectToServer: function(callback) {
    var mongoDB =
      'mongodb://<mongouser>:<mongopass>@<mongourl>';
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    mongoose.connection.on('error', () => {
      return logger
        .getLogger()
        .error(
          `${chalk.red(
            '✗'
          )} MongoDB connection error. Please make sure MongoDB is running.`
        );
    });
    return callback();
  }
};
