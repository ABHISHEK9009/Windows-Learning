import express from 'express';
import * as sessionController from './session.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('LEARNER'), sessionController.bookSession);
router.get('/learner', protect, authorize('LEARNER'), sessionController.getLearnerSessions);
router.get('/mentor', protect, authorize('MENTOR'), sessionController.getMentorSessions);
router.delete('/:id', protect, sessionController.cancelSession);

export default router;
