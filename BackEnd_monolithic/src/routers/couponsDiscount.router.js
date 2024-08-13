import express from 'express';
import { createCoupon, applyCoupon, createDiscount, getActiveDiscounts } from '../controllers/coupons+Discount.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Assuming you have an authentication middleware
import { validateRequest } from '../middlewares/validateRequest.js'; // For validating incoming requests

const router = express.Router();

// Create a new coupon
router.post('/coupon/create', authMiddleware, validateRequest, createCoupon);

// Apply a coupon
router.post('/coupon/apply', authMiddleware, validateRequest, applyCoupon);

// Create a new discount for a product
router.post('/discount/create', authMiddleware, validateRequest, createDiscount);

// Get all active discounts
router.get('/discounts/active', authMiddleware, getActiveDiscounts);

export default router;
