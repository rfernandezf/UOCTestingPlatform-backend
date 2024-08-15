import winston from 'winston';
import 'winston-daily-rotate-file';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

var fileRotateTransport = new (winston.transports.DailyRotateFile)({
  filename: 'common/logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m'
});

const transports = [new winston.transports.Console(), fileRotateTransport];
const Logger = winston.createLogger({
  levels,
  format,
  transports,
});

export default Logger;
