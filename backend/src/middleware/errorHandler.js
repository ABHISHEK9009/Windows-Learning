import { sendError } from '../utils/responseHandler.js';

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Determine environment
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Log error with request details
  console.error(`[Error] ${req.method} ${req.url}:`, {
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Handle Prisma specific errors
  if (err.code && err.code.startsWith('P')) {
    return sendError(res, isDevelopment ? `Prisma Error (${err.code}): ${err.message}` : 'Database operation failed', 400);
  }

  // Handle Validation errors (Zod, etc)
  if (err.name === 'ZodError') {
    return sendError(res, 'Validation failed', 400, err.errors);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

export default errorHandler;
