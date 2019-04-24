const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
  connectToServer: function(callback) {
    var mongoDB = 'mongodb://<yourMLabUser>:<MLabPass>@<mLabDBLink>';
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    mongoose.connection.on(
      'error',
      console.error.bind(
        console,
        '%s MongoDB connection error. Please make sure MongoDB is running.',
        chalk.red('✗')
      )
    );
    return callback();
  }
};
