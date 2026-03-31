import express from 'express';
import * as chatController from './chat.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Keep this before `/:userId` so it doesn't get captured as a userId param.
router.get('/conversations', protect, chatController.getConversations);

router.get('/:userId', protect, chatController.getChatHistory);

// Allows REST-based sending (frontend) while socket events keep things real-time.
router.post('/', protect, chatController.sendMessage);

export default router;