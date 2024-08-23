import express from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { updatePaymentStatus } from '../controllers/payment.controller.js';
// import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

// Route to create a new order and initiate payment
router.post(
    '/create-order',
    // isAuthenticated, // Middleware to check if the user is authenticated
    createOrder
);

// Route to update payment status after Stripe payment confirmation
router.post(
    '/update-payment-status',
    // isAuthenticated, // Ensure the user is authenticated
    // isAuthorized('update-payment'), // Check if the user has permission to update the payment status
    updatePaymentStatus
);

export default router;
