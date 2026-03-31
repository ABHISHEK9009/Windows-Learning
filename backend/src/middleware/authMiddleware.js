import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { sendError } from '../utils/responseHandler.js';

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return sendError(res, 'Not authorized', 401);
  }

  const token = bearer.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden', 403);
    }
    next();
  };
};
