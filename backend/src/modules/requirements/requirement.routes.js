import express from 'express';
import * as requirementController from './requirement.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('LEARNER'), requirementController.postRequirement);
router.get('/', requirementController.getRequirements);
router.get('/:id', requirementController.getRequirement);
router.delete('/:id', protect, authorize('LEARNER'), requirementController.deleteRequirement);

export default router;
