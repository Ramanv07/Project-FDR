import { logger } from '../config/logger.js';

export function errorHandler(err, _req, res, _next) {
  logger.error(err.message, err.stack);

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal server error on ledger API',
  });
}
