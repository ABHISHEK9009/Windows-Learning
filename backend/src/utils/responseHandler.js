/**
 * Centralized response handler to ensure consistent API responses
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, error, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    error: typeof error === 'string' ? error : error.message || 'Internal Server Error',
    statusCode,
    ...(errors && { errors }),
  });
};
