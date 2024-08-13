import express from 'express';
import { createReview, getReviewsForProduct, updateReview, deleteReview} from '../controllers/review.controller.js';
import { validateReviewInput } from '../middlewares/validateReview.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,  // Middleware to check if the user is authenticated
    validateReviewInput, // Middleware to validate the review input
    createReview
);

// Route to get all reviews for a specific product
router.get(
    '/product/:product_id',
    isAuthenticated, // Ensure the user is authenticated before fetching reviews
    getReviewsForProduct
);

// Route to update an existing review
router.put(
    '/:id',
    isAuthenticated, // Ensure the user is authenticated
    // isAuthorized('update-review'), // Check if the user has permission to update the review
    validateReviewInput, // Validate the input before updating the review
    updateReview
);

// Route to delete a review
router.delete(
    '/:id',
    isAuthenticated, // Ensure the user is authenticated
    // isAuthorized('delete-review'), // Check if the user has permission to delete the review
    deleteReview
);

export default router;
