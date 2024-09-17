import { Product, ProductImage, ProductVideo, Category } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { Log } from '../models/log.model.js'; // Log model for MongoDB

// Controller to create a new product
const createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, category_id, owner_id, stock_quantity } = req.body;

    try {
        const newProduct = await Product.create({
            name: name,
            description,
            price,
            category_id,
            stock_quantity,
            owner_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Handle image uploads
        if (req.files.images) {
            const imageUploads = req.files.images.map(file =>
                uploadOnCloudinary(file.path).then(uploadResult => ({
                    product_id: newProduct.id,
                    image_url: uploadResult.secure_url
                }))
            );
            const images = await Promise.all(imageUploads);
            await ProductImage.bulkCreate(images);
        }

        // Handle video uploads
        if (req.files.videos) {
            const videoUploads = req.files.videos.map(file =>
                uploadOnCloudinary(file.path).then(uploadResult => ({
                    product_id: newProduct.id,
                    video_url: uploadResult.secure_url
                }))
            );
            const videos = await Promise.all(videoUploads);
            await ProductVideo.bulkCreate(videos);
        }

        // Log successful product creation
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Product created successfully',
            userId: owner_id,
            ipAddress: req.ip,
            additionalData: { productId: newProduct.id, name },
            action: 'createProduct',
            status: 'SUCCESS'
        });

        return res.status(201).json(new ApiResponse(201, newProduct, 'Product created successfully with images and videos'));
    } catch (error) {
        // Log failure
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Error creating product: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'createProduct',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

// Controller to update an existing product
const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            // Log product not found
            await Log.create({
                level: 'ERROR',
                source: 'PRODUCT',
                message: 'Product not found',
                ipAddress: req.ip,
                additionalData: { productId: id },
                action: 'updateProduct',
                status: 'FAILED'
            });
            return res.status(404).json(new ApiError(404, 'Product not found'));
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category_id = category_id || product.category_id;
        product.updated_at = new Date();

        await product.save();

        // Log successful update
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Product updated successfully',
            userId: req.user ? req.user.id : null, // Assuming user ID is available in req.user
            ipAddress: req.ip,
            additionalData: { productId: id },
            action: 'updateProduct',
            status: 'SUCCESS'
        });

        res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
    } catch (error) {
        // Log failure
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Error updating product: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'updateProduct',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

// Controller to get all products
const getAllProducts = asyncHandler(async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVideo, as: 'videos' },
                { model: Category, as: 'category' }
            ]
        });

        // Log successful retrieval
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'All products retrieved successfully',
            ipAddress: req.ip,
            action: 'getAllProducts',
            status: 'SUCCESS'
        });

        res.status(200).json(new ApiResponse(200, products, 'Products retrieved successfully'));
    } catch (error) {
        // Log failure
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Error retrieving products: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'getAllProducts',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

// Controller to get a single product by ID
const getProductById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVideo, as: 'videos' },
                { model: Category, as: 'category' }
            ]
        });

        if (!product) {
            // Log product not found
            await Log.create({
                level: 'ERROR',
                source: 'PRODUCT',
                message: 'Product not found',
                ipAddress: req.ip,
                additionalData: { productId: id },
                action: 'getProductById',
                status: 'FAILED'
            });
            return res.status(404).json(new ApiError(404, 'Product not found'));
        }

        // Log successful retrieval
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Product retrieved successfully',
            ipAddress: req.ip,
            additionalData: { productId: id },
            action: 'getProductById',
            status: 'SUCCESS'
        });

        res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
    } catch (error) {
        // Log failure
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Error retrieving product: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'getProductById',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

// Controller to delete a product
const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            // Log product not found
            await Log.create({
                level: 'ERROR',
                source: 'PRODUCT',
                message: 'Product not found',
                ipAddress: req.ip,
                additionalData: { productId: id },
                action: 'deleteProduct',
                status: 'FAILED'
            });
            return res.status(404).json(new ApiError(404, 'Product not found'));
        }

        await product.destroy();

        // Log successful deletion
        await Log.create({
            level: 'INFO',
            source: 'PRODUCT',
            message: 'Product deleted successfully',
            ipAddress: req.ip,
            additionalData: { productId: id },
            action: 'deleteProduct',
            status: 'SUCCESS'
        });

        res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
    } catch (error) {
        // Log failure
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Error deleting product: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'deleteProduct',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

export {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    deleteProduct
};
