import { User, Category, Order } from '../models/model_index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Log } from '../models/log.model.js';
import { Op } from 'sequelize';

// Get detailed user information by ID
export const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id, { include: ['roles'] });
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        res.status(200).json(new ApiResponse(200, user, 'User details retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Fetch a list of all users with optional pagination and filtering
export const getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const limit = parseInt(pageSize, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const { count, rows: users } = await User.findAndCountAll({
            limit,
            offset,
            include: ['role']
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json(new ApiResponse(200, { users, totalPages }, 'Users retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


// Add a new product category
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return next(new ApiError(400, 'Category already exists'));
        }
        const newCategory = await Category.create({ name, description });
        res.status(201).json(new ApiResponse(201, newCategory, 'Category created successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Update an existing product category
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return next(new ApiError(404, 'Category not found'));
        }
        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();
        res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Delete a product category
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return next(new ApiError(404, 'Category not found'));
        }
        await category.destroy();
        res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Retrieve detailed information about a specific category by ID
export const getCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return next(new ApiError(404, 'Category not found'));
        }
        res.status(200).json(new ApiResponse(200, category, 'Category details retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Fetch a list of all categories with optional pagination and filtering
export const getAllCategories = asyncHandler(async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const limit = parseInt(pageSize, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const categories = await Category.findAll({ limit, offset });
        res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Generate a sales report for a specified time period
export const generateSalesReport = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    // Set default date range if not provided
    const defaultStartDate = new Date();
    defaultStartDate.setDate(1); // Start of the current month
    defaultStartDate.setHours(0, 0, 0, 0); // Set to 00:00:00 for start of the day

    const defaultEndDate = new Date();
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 1); // End of the current month
    defaultEndDate.setDate(0); // Last day of the month
    defaultEndDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999 for end of the day

    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : defaultEndDate;

    console.log(start, end);

    try {
        const orders = await Order.findAll({
            where: {
                created_at: { [Op.between]: [start, end] }
            }
        });

        const report = orders.reduce((acc, order) => {
            acc.totalSales += order.total_price;
            acc.totalOrders += 90;
            return acc;
        }, { totalSales: 0, totalOrders: 0 });

        res.status(200).json(new ApiResponse(200, report, 'Sales report generated successfully'));
    } catch (error) {
        console.log(error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Retrieve a log of activities performed by a specific user
export const getUserActivityLog = asyncHandler(async (req, res, next) => {
    // const { userId } = req.params;
    try {
        const logs = await Log.find();
        res.status(200).json(new ApiResponse(200, logs, 'User activity log retrieved successfully'));
    } catch (error) {
        console.log(error);
        
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

export const totalUser = asyncHandler(async (req, res, next) => {
    try {
        const totalUserCount = await User.count();
        res.status(200).json(new ApiResponse(200, totalUserCount, 'Total users retrieved successfully'));
    } catch (error) {
        console.log(error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


// Manage system-wide settings and configurations
export const handleSystemSettings = asyncHandler(async (req, res, next) => {
    const { settings } = req.body;
    try {
        // Logic to update system settings
        res.status(200).json(new ApiResponse(200, settings, 'System settings updated successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Fetch and display error logs from the system
export const viewErrorLogs = asyncHandler(async (req, res, next) => {
    try {
        const logs = await Log.find({ level: 'ERROR' });
        res.status(200).json(new ApiResponse(200, logs, 'Error logs retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Review and manage orders that are pending or require admin attention
export const reviewPendingOrders = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.findAll({ where: { status: 'pending' } });
        res.status(200).json(new ApiResponse(200, orders, 'Pending orders retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


// Search and filter logs with optional parameters
export const searchLogs = asyncHandler(async (req, res, next) => {
    const { level, source, userId, startDate, endDate } = req.query;

    try {
        // Construct the filter query
        const filter = {};
        if (level) filter.level = level;
        if (source) filter.source = source;
        if (userId) filter.userId = userId;
        if (startDate && endDate) {
            filter.timestamp = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const logs = await Log.find(filter);
        res.status(200).json(new ApiResponse(200, logs, 'Logs retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


// Get statistics for log types
export const getLogStatistics = asyncHandler(async (req, res, next) => {
    try {
        const logStats = await Log.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);
        res.status(200).json(new ApiResponse(200, logStats, 'Log statistics retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Get statistics for error types
export const getErrorStatistics = asyncHandler(async (req, res, next) => {
    try {
        const errorStats = await Log.aggregate([
            { $match: { level: { $in: [ 'ERROR', 'SECURITY'] } } },
            { $group: { _id: "$level", count: { $sum: 1 } } }
        ]);
        res.status(200).json(new ApiResponse(200, errorStats, 'Error statistics retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});
