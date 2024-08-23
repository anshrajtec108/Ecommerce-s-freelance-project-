import { Op } from 'sequelize'; // For query operators
import { Product, ProductImage, ProductVideo, Category } from '../models/model_index.js';
// import WatchList from '../models/watchList.js'; // Assuming you have a WatchList model
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import rateLimit from 'express-rate-limit'; // For rate limiting

// Rate limiter for search and pagination endpoints
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Display recommended products with pagination
const getRecommendedProducts = asyncHandler(async (req, res, next) => {
    console.log("log",req);
    
    try {
        const { page = 1, pageSize = 10 } = req.query; // Default page 1 and pageSize 10
        const limit = parseInt(pageSize, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const products = await Product.findAll({
            limit,
            offset,
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVideo, as: 'videos' },
                { model: Category, as: 'category' }
            ],
            order: [['price', 'DESC']] // Example: Sort by price descending
        });

        res.status(200).json(new ApiResponse(200, products, 'Recommended products retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Search and sort products with pagination
//no category name {give category_id for seach}
const searchProducts = asyncHandler(async (req, res, next) => {
    try {
        const { query, sort = 'price', order = 'ASC', category, page = 1, pageSize = 10 } = req.query;

        // Validate and sanitize input parameters
        if (query && typeof query !== 'string') {
            return next(new ApiError(400, 'Invalid query parameter'));
        }
        if (sort && !['price', 'name', 'created_at'].includes(sort)) {
            return next(new ApiError(400, 'Invalid sort parameter'));
        }
        if (order && !['ASC', 'DESC'].includes(order)) {
            return next(new ApiError(400, 'Invalid order parameter'));
        }

        // Calculate limit and offset for pagination
        const limit = parseInt(pageSize, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        // Construct the where clause for the search query
        const whereClause = {};
        if (query) {
            whereClause.name = { [Op.like]: `%${query}%` };
        }
        if (category) {
            whereClause.category_id = category;
        }

        console.log("Where Clause:", whereClause);

        // Fetch products from the database
        const products = await Product.findAll({
            where: whereClause,
            limit,
            offset,
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVideo, as: 'videos' },
                { model: Category, as: 'category' }
            ],
            order: [[sort, order]]
        });

        console.log("Products:", products);

        // Send the response with the retrieved products
        res.status(200).json(new ApiResponse(200, products, 'Products retrieved successfully'));
    } catch (error) {
        console.error("Error in searchProducts:", error); // Log the error for debugging
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


// Display latest products with pagination
const getLatestProducts = asyncHandler(async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10 } = req.query; // Default page 1 and pageSize 10
        const limit = parseInt(pageSize, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const products = await Product.findAll({
            limit,
            offset,
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVideo, as: 'videos' },
                { model: Category, as: 'category' }
            ],
            order: [['created_at', 'DESC']] // Order by latest creation date
        });

        res.status(200).json(new ApiResponse(200, products, 'Latest products retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Add to watch list
// const addToWatchList = asyncHandler(async (req, res, next) => {
//     const { productId, userId } = req.body;

//     if (!productId || !userId) {
//         return next(new ApiError(400, 'Invalid data'));
//     }

//     try {
//         // Check if the product is already in the watch list
//         const existingWatchList = await WatchList.findOne({ where: { product_id: productId, user_id: userId } });
//         if (existingWatchList) {
//             return res.status(400).json(new ApiResponse(400, null, 'Product is already in the watch list'));
//         }

//         // Add to the watch list
//         const watchListEntry = await WatchList.create({ product_id: productId, user_id: userId });

//         res.status(201).json(new ApiResponse(201, watchListEntry, 'Product added to watch list successfully'));
//     } catch (error) {
//         next(new ApiError(500, 'Server error', [], error.stack));
//     }
// });

// // Get user's watch list
// const getWatchList = asyncHandler(async (req, res, next) => {
//     const { userId } = req.params;

//     if (!userId) {
//         return next(new ApiError(400, 'User ID is required'));
//     }

//     try {
//         const watchList = await WatchList.findAll({
//             where: { user_id: userId },
//             include: [
//                 { model: Product, as: 'product', include: [ProductImage, ProductVideo, Category] }
//             ]
//         });

//         res.status(200).json(new ApiResponse(200, watchList, 'Watch list retrieved successfully'));
//     } catch (error) {
//         next(new ApiError(500, 'Server error', [], error.stack));
//     }
// });

export {
    getRecommendedProducts,
    searchProducts,
    getLatestProducts,
    // addToWatchList,
    // getWatchList
};
