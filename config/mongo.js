const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
  connectToServer: function(callback) {
    var mongoDB =
      'mongodb://reactnodejsauthuser:cQf94m5WE7ps5tu@ds125526.mlab.com:25526/react-nodejs-auth';
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
