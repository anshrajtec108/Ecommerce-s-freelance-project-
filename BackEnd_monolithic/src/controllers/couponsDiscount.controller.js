import { Coupon, Discount, Product } from '../models/model_index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, discount_percentage, expiry_date, max_uses } = req.body;

    if (!code || !discount_percentage || !expiry_date || !max_uses) {
        return next(new ApiError(400, 'Invalid data. Code, Discount Percentage, Expiry Date, and Max Uses are required.'));
    }

    const newCoupon = await Coupon.create({
        code,
        discount_percentage,
        expiry_date,
        max_uses,
        created_at: new Date(),
        updated_at: new Date(),
    });

    res.status(201).json(new ApiResponse(201, newCoupon, 'Coupon created successfully.'));
});

// Validate and apply a coupon
export const applyCoupon = asyncHandler(async (req, res, next) => {
    const { code, user_id } = req.body;

    if (!code || !user_id) {
        return next(new ApiError(400, 'Coupon code and user ID are required.'));
    }

    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) {
        return next(new ApiError(404, 'Coupon not found.'));
    }

    if (new Date() > new Date(coupon.expiry_date)) {
        return next(new ApiError(400, 'Coupon has expired.'));
    }

    if (coupon.uses >= coupon.max_uses) {
        return next(new ApiError(400, 'Coupon usage limit reached.'));
    }

    coupon.uses += 1;
    await coupon.save();

    res.status(200).json(new ApiResponse(200, coupon, 'Coupon applied successfully.'));
});

// Create a new discount for a product
export const createDiscount = asyncHandler(async (req, res, next) => {
    const { product_id, discount_percentage, start_date, end_date } = req.body;

    if (!product_id || !discount_percentage || !start_date || !end_date) {
        return next(new ApiError(400, 'Invalid data. Product ID, Discount Percentage, Start Date, and End Date are required.'));
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
        return next(new ApiError(404, 'Product not found.'));
    }

    const newDiscount = await Discount.create({
        product_id,
        discount_percentage,
        start_date,
        end_date,
        created_at: new Date(),
        updated_at: new Date(),
    });

    res.status(201).json(new ApiResponse(201, newDiscount, 'Discount created successfully.'));
});

// Get all active discounts
export const getActiveDiscounts = asyncHandler(async (req, res, next) => {
    const discounts = await Discount.findAll({
        where: {
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() }
        },
        include: Product
    });

    res.status(200).json(new ApiResponse(200, discounts, 'Active discounts retrieved successfully.'));
});
