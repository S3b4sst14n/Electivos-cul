const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

function errorHandler(err, req, res, _next) {
  const isApi = err instanceof ApiError;
  const statusCode = isApi ? err.statusCode : 500;
  const message = isApi ? err.message : 'Error interno del servidor';

  if (!isApi || statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, err);
  }

  const body = { error: message };
  if (isApi && err.details) body.details = err.details;
  if (!env.isProd && !isApi) body.stack = err.stack;

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
