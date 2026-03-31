import * as requirementService from './requirement.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import { emitDataUpdate } from '../../utils/socketEmitter.js';

export const postRequirement = async (req, res, next) => {
  try {
    const requirement = await requirementService.createRequirement(req.user.userId, req.body);
    
    const io = req.app.get('io');
    // Notify all mentors about new requirement
    if (io) {
      io.to('role:MENTOR').emit('data_update', {
        type: 'requirements',
        timestamp: new Date()
      });
    }

    // Real-time sync for the poster (learner)
    emitDataUpdate(io, req.user.userId, 'requirements');
    
    return sendSuccess(res, requirement, 'Requirement posted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getRequirements = async (req, res, next) => {
  try {
    const requirements = await requirementService.getAllRequirements();
    return sendSuccess(res, requirements, 'Requirements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRequirement = async (req, res, next) => {
  try {
    const requirement = await requirementService.getRequirementById(req.params.id);
    if (!requirement) {
      const error = new Error('Requirement not found');
      error.statusCode = 404;
      throw error;
    }
    return sendSuccess(res, requirement, 'Requirement retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRequirement = async (req, res, next) => {
  try {
    await requirementService.deleteRequirement(req.params.id);

    // Real-time sync for the poster (learner) - ideally we'd know the userId here
    // For now, emit broad update if needed or just specific user if known
    emitDataUpdate(req.app.get('io'), req.user.userId, 'requirements');

    return sendSuccess(res, null, 'Requirement deleted successfully', 204);
  } catch (error) {
    next(error);
  }
};
