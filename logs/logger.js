const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, printf, splat } = format;

class Logger {
  init() {
    // Instantiate winston logger
    const myFormat = printf(info => {
      return `${info.timestamp} ${info.label} ${info.level}: ${info.message}`;
    });

    this.logger = createLogger({
      transports: [
        new transports.Console(),
        new transports.File({
          filename: './logs/logs.log',
          level: 'error'
        })
      ],
      format: combine(
        colorize(),
        label({ label: '[app-server]' }),
        timestamp(),
        splat(),
        myFormat
      )
    });
  }

  getLogger() {
    return this.logger;
  }
}

module.exports = new Logger();
