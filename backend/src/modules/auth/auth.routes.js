import express from 'express';
import * as authController from './auth.controller.js';
import validate from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', authController.googleLogin);

export default router;
