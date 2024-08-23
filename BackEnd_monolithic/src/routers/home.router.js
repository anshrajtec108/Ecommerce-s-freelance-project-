import express from 'express';
import {
    getRecommendedProducts,
    searchProducts,
    getLatestProducts,
    // addToWatchList,
    // getWatchList
} from '../controllers/home.controller.js';
// import { protect, authorize } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for search and pagination endpoints
const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});


router.get('/recommended', getRecommendedProducts);

router.get('/search', searchLimiter, searchProducts);

router.get('/latest', getLatestProducts);

// // Route for adding a product to the watch list
// // This route should be protected and authorized
// router.post('/watchlist', protect, authorize('user'), addToWatchList);

// // Route for getting the user's watch list
// // This route should be protected and authorized
// router.get('/watchlist/:userId', protect, authorize('user'), getWatchList);

export default router;
