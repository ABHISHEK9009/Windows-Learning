import * as analyticsService from './analytics.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const getLearnerAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getLearnerAnalytics(req.user.userId);
    return sendSuccess(res, analytics, 'Learner analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMentorAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getMentorAnalytics(req.user.userId);
    return sendSuccess(res, analytics, 'Mentor analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
