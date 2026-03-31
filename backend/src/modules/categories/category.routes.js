import express from 'express';
import * as categoryController from './category.controller.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryDetail);

export default router;
