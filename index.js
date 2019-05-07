// Get dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const compression = require('compression');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const expressStatusMonitor = require('express-status-monitor');
const bodyParser = require('body-parser');
const mongoUtil = require('./config/mongo');
const logger = require('./logs/logger');

// Load environment variables
require('dotenv').config();

// Route handlers
const authApi = require('./controllers/auth.api');
const api = require('./controllers/api');

// Initialize the winston logger
logger.init();

// Create server
const app = express();

// DB setup
// TODO: Use winstonjs logger to log messages like this not console.log.
mongoUtil.connectToServer(err => {
  if (err) return logger.getLogger().error(err);
});

// Express configuration
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3001);
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, '../app', 'build'), {
    maxAge: 31557600000
  })
);

// Error handler
app.use(errorHandler());

// API routes
app.use('/api/auth', authApi);
app.use('/api', api);

let server = app.listen(app.get('port'), () => {
  logger.getLogger().info(`${chalk.green(
    '✓'
  )} App is running at http://localhost:${app.get('port')} in ${app.get(
    'env'
  )} mode'
  `);

  logger.getLogger().info('Press CTRL-C to stop\n');
});

// Web sockets setup
let io = require('socket.io')(server);
io.on('connection', socket => {
  logger.getLogger().info('Connected...');
  socket.on('disconnect', () => {
    logger.getLogger().info('Disconnected.');
  });
});
app.set('socketio', io);

// Status monitor uses it's own socket.io instance by default, so we need to
// pass our instance as a parameter else it will throw errors on client side
app.use(expressStatusMonitor({ websocket: io, port: app.get('port') }));
