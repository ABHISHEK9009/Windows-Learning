import * as mentorService from './mentor.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const getMentors = async (req, res, next) => {
  try {
    const mentors = await mentorService.getAllMentors(req.query);
    return sendSuccess(res, mentors, 'Mentors retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMentor = async (req, res, next) => {
  try {
    const mentor = await mentorService.getMentorById(req.params.id);
    if (!mentor) {
      const error = new Error('Mentor not found');
      error.statusCode = 404;
      throw error;
    }
    return sendSuccess(res, mentor, 'Mentor retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const availability = await mentorService.updateMentorAvailability(req.user.userId, req.body);
    return sendSuccess(res, availability, 'Availability updated successfully');
  } catch (error) {
    next(error);
  }
};

export const saveMentor = async (req, res, next) => {
  try {
    const saved = await mentorService.saveMentor(req.user.userId, req.params.id);
    return sendSuccess(res, saved, 'Mentor saved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSavedMentors = async (req, res, next) => {
  try {
    const saved = await mentorService.getSavedMentors(req.user.userId);
    return sendSuccess(res, saved, 'Saved mentors retrieved successfully');
  } catch (error) {
    next(error);
  }
};
