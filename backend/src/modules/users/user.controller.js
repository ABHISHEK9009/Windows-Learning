import * as userService from './user.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import { emitDataUpdate } from '../../utils/socketEmitter.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return sendSuccess(res, users, 'Users retrieved successfully');
  } catch (error) { next(error); }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
    return sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) { next(error); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
    return sendSuccess(res, user, 'Profile retrieved successfully');
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.userId, { ...req.body, role: req.user.role });
    emitDataUpdate(req.app.get('io'), req.user.userId, 'user');
    return sendSuccess(res, updatedUser, 'Profile updated successfully');
  } catch (error) { next(error); }
};

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) { const e = new Error('Please upload a file'); e.statusCode = 400; throw e; }
    const updatedUser = await userService.updateUserProfile(req.user.userId, {
      profilePicture: `/uploads/${req.file.filename}`,
      role: req.user.role,
    });
    emitDataUpdate(req.app.get('io'), req.user.userId, 'user');
    return sendSuccess(res, updatedUser, 'Profile picture uploaded successfully');
  } catch (error) { next(error); }
};

// ─── Admin handlers ───────────────────────────────────────────────────────────

export const getUnverifiedMentors = async (req, res, next) => {
  try {
    const mentors = await userService.getUnverifiedMentors();
    return sendSuccess(res, mentors, 'Unverified mentors retrieved successfully');
  } catch (error) { next(error); }
};

export const getMentors = async (req, res, next) => {
  try {
    const { status } = req.query;
    const mentors = await userService.getAllMentors({ status });
    return sendSuccess(res, mentors, 'Mentors retrieved successfully');
  } catch (error) { next(error); }
};

export const verifyMentor = async (req, res, next) => {
  try {
    const mentor = await userService.verifyMentor(req.params.mentorProfileId);
    emitDataUpdate(req.app.get('io'), null, 'mentors');
    return sendSuccess(res, mentor, 'Mentor verified successfully');
  } catch (error) { next(error); }
};

export const rejectMentor = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      const e = new Error('Rejection reason is required'); e.statusCode = 400; throw e;
    }
    const mentor = await userService.rejectMentor(req.params.mentorProfileId, reason.trim());
    emitDataUpdate(req.app.get('io'), null, 'mentors');
    return sendSuccess(res, mentor, 'Mentor rejected successfully');
  } catch (error) { next(error); }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await userService.getAdminStats();
    return sendSuccess(res, stats, 'Admin stats retrieved successfully');
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return sendSuccess(res, null, 'User deleted successfully', 204);
  } catch (error) { next(error); }
};
