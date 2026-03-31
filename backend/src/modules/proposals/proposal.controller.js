import * as proposalService from './proposal.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const submitProposal = async (req, res, next) => {
  try {
    const proposal = await proposalService.createProposal(req.user.userId, req.body);
    return sendSuccess(res, proposal, 'Proposal submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMentorProposals = async (req, res, next) => {
  try {
    const proposals = await proposalService.getMentorProposals(req.user.userId);
    return sendSuccess(res, proposals, 'Mentor proposals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const acceptProposal = async (req, res, next) => {
  try {
    const result = await proposalService.acceptProposal(req.params.id);
    return sendSuccess(res, result, 'Proposal accepted and session created');
  } catch (error) {
    next(error);
  }
};

export const rejectProposal = async (req, res, next) => {
  try {
    const proposal = await proposalService.rejectProposal(req.params.id);
    return sendSuccess(res, proposal, 'Proposal rejected successfully');
  } catch (error) {
    next(error);
  }
};
