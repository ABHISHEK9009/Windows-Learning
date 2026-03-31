import { sendSuccess, sendError } from '../../utils/responseHandler.js';
import * as aiService from './ai.service.js';

export const getSearchIntent = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return sendError(res, 'Query is required', 400);
    }
    
    const filters = await aiService.processSearchIntent(query);
    
    return sendSuccess(res, filters, 'Search intent extracted successfully');
  } catch (error) {
    next(error);
  }
};
