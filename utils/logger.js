// logger.js
const winston = require('winston');

// Define the Winston logger configuration
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss', tz: 'America/New_York' }),
    winston.format.printf(info => {
      return `[${info.timestamp}] - [${info.level}] - ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: './log/app.log', level: 'info' }),
    new winston.transports.File({ filename: './log/error.log', level: 'error' }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
