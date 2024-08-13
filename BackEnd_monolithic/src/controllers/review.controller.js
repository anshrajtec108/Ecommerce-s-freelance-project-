import { Review, Product, User } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { validationResult } from 'express-validator';

// Middleware for validating review input
const validateReviewInput = [
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    check('comment').isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters'),
];

// Create a new review
export const createReview = asyncHandler(async (req, res, next) => {
    const { product_id, user_id, rating, comment } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    try {
        // Check if the product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return next(new ApiError(404, 'Product not found'));
        }

        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({
            where: { product_id, user_id }
        });

        if (existingReview) {
            return next(new ApiError(400, 'User has already reviewed this product'));
        }

        // Create and save the review
        const review = await Review.create({
            product_id,
            user_id,
            rating,
            comment,
            created_at: new Date(),
            updated_at: new Date()
        });

        res.status(201).json(new ApiResponse(201, review, 'Review created successfully'));
    } catch (error) {
        console.log('createReview ERROR', error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Get all reviews for a product
export const getReviewsForProduct = asyncHandler(async (req, res, next) => {
    const { product_id } = req.params;

    try {
        const reviews = await Review.findAll({
            where: { product_id },
            include: [{ model: User, attributes: ['id', 'username'] }]
        });

        if (reviews.length === 0) {
            return next(new ApiError(404, 'No reviews found for this product'));
        }

        res.status(200).json(new ApiResponse(200, reviews, 'Reviews retrieved successfully'));
    } catch (error) {
        console.log('getReviewsForProduct ERROR', error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Update a review
export const updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return next(new ApiError(404, 'Review not found'));
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.updated_at = new Date();

        await review.save();

        res.status(200).json(new ApiResponse(200, review, 'Review updated successfully'));
    } catch (error) {
        console.log('updateReview ERROR', error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Delete a review
export const deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return next(new ApiError(404, 'Review not found'));
        }

        await review.destroy();

        res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
    } catch (error) {
        console.log('deleteReview ERROR', error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});
