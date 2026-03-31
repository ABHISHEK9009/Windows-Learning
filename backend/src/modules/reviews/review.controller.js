import * as reviewService from './review.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const submitReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.userId, req.body);
    return sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMentorReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getMentorReviews(req.params.id);
    return sendSuccess(res, reviews, 'Mentor reviews retrieved successfully');
  } catch (error) {
    next(error);
  }
};
