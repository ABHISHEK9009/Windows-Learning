import * as sessionService from './session.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import { createNotification } from '../notifications/notification.service.js';
import { emitDataUpdate } from '../../utils/socketEmitter.js';

export const bookSession = async (req, res, next) => {
  try {
    const { mentorId, startTime, endTime, topic, meetingLink } = req.body;
    const session = await sessionService.createSession(
      req.user.userId,
      mentorId,
      startTime,
      endTime,
      topic,
      meetingLink
    );

    const io = req.app.get('io');
    
    // Emit notification
    const notification = await createNotification(mentorId, 'SESSION_REQUEST', `New session request from learner`);
    io.to(`user:${mentorId}`).emit('new_notification', notification);

    // Real-time sync for both parties
    emitDataUpdate(io, [req.user.userId, mentorId], 'sessions');
    // Also sync wallet for learner as funds might be locked/deducted
    emitDataUpdate(io, req.user.userId, 'wallet');

    return sendSuccess(res, session, 'Session booked successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getLearnerSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getLearnerSessions(req.user.userId);
    return sendSuccess(res, sessions, 'Learner sessions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMentorSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getMentorSessions(req.user.userId);
    return sendSuccess(res, sessions, 'Mentor sessions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const session = await sessionService.updateSessionStatus(req.params.id, 'CANCELLED');
    
    const io = req.app.get('io');
    // Notify both parties (need to get learner and mentor IDs from session)
    emitDataUpdate(io, [session.learnerId, session.mentorId], 'sessions');
    
    return sendSuccess(res, session, 'Session cancelled successfully');
  } catch (error) {
    next(error);
  }
};
