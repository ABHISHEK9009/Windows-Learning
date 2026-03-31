import { sendError } from '../utils/responseHandler.js';

/**
 * Validation middleware using Zod
 * @param {ZodSchema} schema 
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const errorMessage = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return sendError(res, errorMessage, 400);
  }
};

export default validate;
