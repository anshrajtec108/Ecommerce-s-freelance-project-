import { Order, OrderItem, Payment, ShippingAddress, Product, User } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Create a new order // peading less the product stock after crearing product  
export const createOrder = asyncHandler(async (req, res, next) => {
    const { user_id, items, payment, shipping_address } = req.body;

    try {
        const newOrder = await Order.create({
            user_id,
            status: 'Pending',
            created_at: new Date(),
            updated_at: new Date()
        });

        const orderItems = items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems);

        if (payment) {
            await Payment.create({
                order_id: newOrder.id,
                payment_method: payment.method,
                payment_status: payment.status,
                payment_date: new Date()
            });
        }

        if (shipping_address) {
            await ShippingAddress.create({
                order_id: newOrder.id,
                user_id,
                address: shipping_address.address,
                city: shipping_address.city,
                state: shipping_address.state,
                postal_code: shipping_address.postal_code,
                country: shipping_address.country
            });
        }

        res.status(201).json(new ApiResponse(201, newOrder, 'Order created successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Get all orders
export const getAllOrders = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: OrderItem, include: [Product] },
                { model: Payment },
                { model: ShippingAddress }
            ]
        });

        res.status(200).json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Get order by ID
export const getOrderById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: OrderItem, include: [Product] },
                { model: Payment },
                { model: ShippingAddress }
            ]
        });

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        res.status(200).json(new ApiResponse(200, order, 'Order retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        order.status = status;
        order.updated_at = new Date();
        await order.save();

        res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Delete an order
export const deleteOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        await order.destroy();

        res.status(200).json(new ApiResponse(200, null, 'Order deleted successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});
