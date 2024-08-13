import { Inventory, Product } from '../models/model_index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Add inventory for a product
export const addInventory = asyncHandler(async (req, res, next) => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return next(new ApiError(400, 'Product ID and quantity are required.'));
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
        return next(new ApiError(404, 'Product not found.'));
    }

    const inventory = await Inventory.create({
        product_id,
        quantity,
        created_at: new Date(),
        updated_at: new Date(),
    });

    res.status(201).json(new ApiResponse(201, inventory, 'Inventory added successfully.'));
});

// Get inventory details for a product
export const getInventoryByProduct = asyncHandler(async (req, res, next) => {
    const { product_id } = req.params;

    const inventory = await Inventory.findOne({
        where: { product_id },
        include: Product
    });

    if (!inventory) {
        return next(new ApiError(404, 'Inventory not found for this product.'));
    }

    res.status(200).json(new ApiResponse(200, inventory, 'Inventory details retrieved successfully.'));
});

// Update inventory quantity for a product
export const updateInventory = asyncHandler(async (req, res, next) => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return next(new ApiError(400, 'Product ID and quantity are required.'));
    }

    const inventory = await Inventory.findOne({ where: { product_id } });
    if (!inventory) {
        return next(new ApiError(404, 'Inventory not found for this product.'));
    }

    inventory.quantity = quantity;
    await inventory.save();

    res.status(200).json(new ApiResponse(200, inventory, 'Inventory updated successfully.'));
});

// Delete inventory record for a product
export const deleteInventory = asyncHandler(async (req, res, next) => {
    const { product_id } = req.params;

    const inventory = await Inventory.findOne({ where: { product_id } });
    if (!inventory) {
        return next(new ApiError(404, 'Inventory not found for this product.'));
    }

    await inventory.destroy();

    res.status(200).json(new ApiResponse(200, null, 'Inventory record deleted successfully.'));
});
