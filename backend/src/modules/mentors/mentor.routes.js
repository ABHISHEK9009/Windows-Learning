import express from 'express';
import { getMentors, getMentor, updateAvailability, saveMentor, getSavedMentors } from './mentor.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMentors);
router.get('/:id', getMentor);
router.patch('/availability', protect, authorize('MENTOR'), updateAvailability);
router.post('/:id/save', protect, authorize('LEARNER'), saveMentor);
router.get('/saved', protect, authorize('LEARNER'), getSavedMentors);

export default router;
