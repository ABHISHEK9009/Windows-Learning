import * as categoryService from './category.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCategoryDetail = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return sendSuccess(res, category, 'Category detail retrieved successfully');
  } catch (error) {
    next(error);
  }
};
