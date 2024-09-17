import { Op } from 'sequelize'; // For query operators
import { Product, ProductImage, ProductVideo, Category } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Log } from '../models/log.model.js'; // Import the Log model for logging
import rateLimit from 'express-rate-limit'; // For rate limiting

// Rate limiter for search and pagination endpoints
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Display recommended products with pagination
const getRecommendedProducts = asyncHandler(async (req, res, next) => {
    try {
        const { page = 1, pageSize = 5 } = req.query; // Default page 1 and pageSize 5
        const limit = parseInt(pageSize, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        // Fetch products with only the first image and other related data
        const products = await Product.findAll({
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    limit: 1, // Get only the first image per product
                },
                { model: Category, as: 'category' }
            ],
            order: [['price', 'DESC']], // Example: Sort by price descending
            limit,
            offset
        });

        // Modify the products data to only include the first image
        const modifiedProducts = products.map(product => {
            const singleImage = product.images && product.images.length > 0 ? product.images[0] : null;
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image: singleImage, // Return only the first image
                stock_quantity: product.stock_quantity,
                created_at: product.created_at,
                updated_at: product.updated_at,
            };
        });

        // Log successful product retrieval
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Recommended products retrieved successfully',
            ipAddress: req.ip,
            action: 'getRecommendedProducts',
            status: 'SUCCESS',
            additionalData: { page, pageSize, count: modifiedProducts.length }
        });

        // Return modified products with only a single image
        res.status(200).json(new ApiResponse(200, modifiedProducts, 'Recommended products retrieved successfully'));
    } catch (error) {
        console.error('Error in getRecommendedProducts:', error); // Log the error
        await Log.create({
            level: 'ERROR',
            source: 'PRODUCT',
            message: `Error retrieving recommended products: ${error.message}`,
            ipAddress: req.ip,
            action: 'getRecommendedProducts',
            status: 'FAILED',
            additionalData: { stack: error.stack }
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

// Search and sort products with pagination
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

        // Log search query details
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Searching products',
            ipAddress: req.ip,
            action: 'searchProducts',
            status: 'SUCCESS',
            additionalData: { query, sort, order, category, page, pageSize }
        });

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

        // Send the response with the retrieved products
        res.status(200).json(new ApiResponse(200, products, 'Products retrieved successfully'));
    } catch (error) {
        console.error('Error in searchProducts:', error); // Log the error
        await Log.create({
            level: 'ERROR',
            source: 'PRODUCT',
            message: `Error searching products: ${error.message}`,
            ipAddress: req.ip,
            action: 'searchProducts',
            status: 'FAILED',
            additionalData: { stack: error.stack }
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
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

        // Log successful product retrieval
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Latest products retrieved successfully',
            ipAddress: req.ip,
            action: 'getLatestProducts',
            status: 'SUCCESS',
            additionalData: { page, pageSize, count: products.length }
        });

        res.status(200).json(new ApiResponse(200, products, 'Latest products retrieved successfully'));
    } catch (error) {
        console.error('Error in getLatestProducts:', error); // Log the error
        await Log.create({
            level: 'ERROR',
            source: 'PRODUCT',
            message: `Error retrieving latest products: ${error.message}`,
            ipAddress: req.ip,
            action: 'getLatestProducts',
            status: 'FAILED',
            additionalData: { stack: error.stack }
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

export {
    getRecommendedProducts,
    searchProducts,
    getLatestProducts,
};
