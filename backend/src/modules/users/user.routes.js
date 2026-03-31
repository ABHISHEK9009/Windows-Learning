import express from 'express';
import * as userController from './user.controller.js';
import validate from '../../middleware/validate.js';
import { userIdSchema } from './user.validation.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.patch('/profile', protect, userController.updateProfile);
router.post('/profile-picture', protect, upload.single('profilePicture'), userController.uploadProfilePicture);

// Admin routes
router.get('/unverified-mentors', protect, authorize('ADMIN'), userController.getUnverifiedMentors);
router.get('/mentors-list', protect, authorize('ADMIN'), userController.getMentors);
router.get('/stats', protect, authorize('ADMIN'), userController.getStats);
router.post('/verify-mentor/:mentorProfileId', protect, authorize('ADMIN'), userController.verifyMentor);
router.post('/reject-mentor/:mentorProfileId', protect, authorize('ADMIN'), userController.rejectMentor);
router.get('/', protect, authorize('ADMIN'), userController.getUsers);
router.get('/:id', protect, validate(userIdSchema), userController.getUser);
router.delete('/:id', protect, authorize('ADMIN'), validate(userIdSchema), userController.deleteUser);

export default router;
