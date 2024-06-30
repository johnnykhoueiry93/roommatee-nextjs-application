const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Define the Winston logger configuration
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => {
      return `[${info.timestamp}] - [${info.level}] - ${info.message}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: './log/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '100m',
      maxFiles: '5',
      level: 'info',
    }),
    new DailyRotateFile({
      filename: './log/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '100m',
      maxFiles: '5',
      level: 'error',
    }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
