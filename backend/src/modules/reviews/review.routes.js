import express from 'express';
import * as reviewController from './review.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('LEARNER'), reviewController.submitReview);
router.get('/mentor/:id', reviewController.getMentorReviews);

export default router;
