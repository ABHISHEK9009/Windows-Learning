import express from 'express';
const router = express.Router();
import {
  submitReview,
  getMentorReviews,
  getMentorRatingStats,
  respondToReview,
  markReviewHelpful,
  updateReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

// Submit review for completed session
router.post('/', protect, submitReview);

// Get all reviews for a mentor
router.get('/mentor/:mentorId', getMentorReviews);

// Get rating distribution for a mentor
router.get('/mentor/:mentorId/stats', getMentorRatingStats);

// Mentor responds to review
router.put('/:reviewId/response', protect, respondToReview);

// Mark review as helpful
router.post('/:reviewId/helpful', protect, markReviewHelpful);

// Update review (within 7 days)
router.put('/:reviewId', protect, updateReview);

export default router;
