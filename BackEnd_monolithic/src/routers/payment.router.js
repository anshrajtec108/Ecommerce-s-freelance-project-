import express from 'express';
import { updatePaymentStatus } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/payment-status', updatePaymentStatus);

export default router;