import express from 'express';
import * as proposalController from './proposal.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('MENTOR'), proposalController.submitProposal);
router.get('/mentor', protect, authorize('MENTOR'), proposalController.getMentorProposals);
router.put('/:id/accept', protect, authorize('LEARNER'), proposalController.acceptProposal);
router.put('/:id/reject', protect, authorize('LEARNER'), proposalController.rejectProposal);

export default router;
