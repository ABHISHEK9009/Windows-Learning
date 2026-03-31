import express from 'express';
import * as walletController from './wallet.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, walletController.getWallet);
router.post('/deposit', protect, walletController.deposit);
router.post('/withdraw', protect, walletController.withdraw);

export default router;
