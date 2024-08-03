import { Product, ProductImage, ProductVideo, Category } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

// Controller to create a new product
const createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, category_id, owner_id, stock_quantity } = req.body;
    console.log("name, description, price, category_id", name, description, price, category_id, owner_id, stock_quantity);

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
    console.log(req.files.images, "req.files.images");
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

    return res.status(201).json(new ApiResponse(201, newProduct, 'Product created successfully with images and videos'));

});


// Controller to update an existing product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).json(new ApiError(404, 'Product not found'));
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category_id = category_id || product.category_id;
    product.updated_at = new Date();

    await product.save();

    res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

// Controller to get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.findAll({
        include: [
            { model: ProductImage, as: 'images' },
            { model: ProductVideo, as: 'videos' },
            { model: Category, as: 'category' }
        ]
    });

    res.status(200).json(new ApiResponse(200, products, 'Products retrieved successfully'));
});

// Controller to get a single product by ID
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
        include: [
            { model: ProductImage, as: 'images' },
            { model: ProductVideo, as: 'videos' },
            { model: Category, as: 'category' }
        ]
    });

    if (!product) {
        return res.status(404).json(new ApiError(404, 'Product not found'));
    }

    res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
});

// Controller to delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).json(new ApiError(404, 'Product not found'));
    }

    await product.destroy();

    res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

export {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    deleteProduct
};
