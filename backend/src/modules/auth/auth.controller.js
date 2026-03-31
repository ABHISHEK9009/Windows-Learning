import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    const { password, ...userWithoutPassword } = user;
    return sendSuccess(res, { user: userWithoutPassword, token }, 'User registered successfully', 201);
  } catch (error) {
    if (error.code === 'P2002') {
      error.statusCode = 400;
      error.message = 'Email already exists';
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, { user: userWithoutPassword, token }, 'Login successful');
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { accessToken, role } = req.body;
    const { user, token } = await authService.googleLoginUser(accessToken, role);
    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, { user: userWithoutPassword, token }, 'Google login successful');
  } catch (error) {
    error.statusCode = 401;
    error.message = 'Google login failed';
    next(error);
  }
};
