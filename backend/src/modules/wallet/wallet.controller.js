import * as walletService from './wallet.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import { emitDataUpdate } from '../../utils/socketEmitter.js';

export const getWallet = async (req, res, next) => {
  try {
    const wallet = await walletService.getWalletByUserId(req.user.userId);
    return sendSuccess(res, wallet, 'Wallet retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deposit = async (req, res, next) => {
  try {
    const { amount, description, referenceId } = req.body;
    const wallet = await walletService.depositFunds(req.user.userId, amount, description, referenceId);
    
    // Real-time sync
    emitDataUpdate(req.app.get('io'), req.user.userId, 'wallet');
    
    return sendSuccess(res, wallet, 'Deposit successful');
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (req, res, next) => {
  try {
    const { amount, description, referenceId } = req.body;
    const wallet = await walletService.withdrawFunds(req.user.userId, amount, description, referenceId);
    
    // Real-time sync
    emitDataUpdate(req.app.get('io'), req.user.userId, 'wallet');
    
    return sendSuccess(res, wallet, 'Withdrawal successful');
  } catch (error) {
    next(error);
  }
};
