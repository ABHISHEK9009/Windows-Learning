import express from 'express';
import * as analyticsController from './analytics.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/learner', protect, authorize('LEARNER'), analyticsController.getLearnerAnalytics);
router.get('/mentor', protect, authorize('MENTOR'), analyticsController.getMentorAnalytics);

export default router;
