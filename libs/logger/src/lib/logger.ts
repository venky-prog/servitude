import * as winston from 'winston';

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

const isProd = process.env.NODE_ENV === 'production';

// Pretty format for dev
const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// JSON format for production
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: isProd ? prodFormat : devFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'unknown-service',
  },
  transports: [
    new winston.transports.Console(),

  ],
});