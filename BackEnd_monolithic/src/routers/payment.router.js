// routes/payment.routes.js
import express from 'express';
import { createCheckoutSession, updatePaymentStatus, handleStripeWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

// Route to create a Stripe Checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Route to update payment status after Stripe payment confirmation
router.post('/update-payment-status', updatePaymentStatus);

// Webhook route to handle events from Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
