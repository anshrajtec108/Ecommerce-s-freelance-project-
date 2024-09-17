import { Order, OrderItem, Payment, ShippingAddress } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Log } from '../models/log.model.js'; // Import the Log model for logging
import stripe from 'stripe';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Create a new order and initiate Stripe payment
export const createOrder = asyncHandler(async (req, res, next) => {
    const { user_id, items, payment, shipping_address } = req.body;

    if (!user_id || !items || items.length === 0 || !payment || !shipping_address) {
        // Log invalid order data error
        await Log.create({
            level: 'ERROR',
            source: 'ORDER',
            message: 'Invalid order data',
            userId: user_id || null,
            ipAddress: req.ip,
            action: 'createOrder',
            status: 'FAILED'
        });
        return next(new ApiError(400, 'Invalid order data'));
    }

    try {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create new order
        const newOrder = await Order.create({
            user_id,
            total_price: totalAmount,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
        });

        const orderItems = items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems);

        // Log successful order creation
        await Log.create({
            level: 'INFO',
            source: 'ORDER',
            message: 'Order created successfully',
            userId: user_id,
            ipAddress: req.ip,
            additionalData: { orderId: newOrder.id },
            action: 'createOrder',
            status: 'SUCCESS'
        });

        // Create Stripe payment intent
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: totalAmount, // amount in cents
            currency: 'usd',
            metadata: { order_id: newOrder.id }
        });

        // Log successful payment intent creation
        await Log.create({
            level: 'INFO',
            source: 'PAYMENT',
            message: 'Stripe payment intent created',
            userId: user_id,
            ipAddress: req.ip,
            additionalData: { paymentIntentId: paymentIntent.id, orderId: newOrder.id },
            action: 'createOrder',
            status: 'SUCCESS'
        });

        // Create payment record
        await Payment.create({
            order_id: newOrder.id,
            amount: totalAmount,
            payment_method: payment.method,
            payment_status: 'pending',
            stripe_payment_intent_id: paymentIntent.id
        });

        // Create shipping address record
        await ShippingAddress.create({
            order_id: newOrder.id,
            user_id,
            address_line1: shipping_address.address_line1,
            address_line2: shipping_address.address_line2,
            city: shipping_address.city,
            state: shipping_address.state,
            zip_code: shipping_address.zip_code,
            country: shipping_address.country
        });

        // Log successful order creation with payment intent
        await Log.create({
            level: 'INFO',
            source: 'ORDER',
            message: 'Order and payment created successfully',
            userId: user_id,
            ipAddress: req.ip,
            additionalData: { orderId: newOrder.id, paymentIntentId: paymentIntent.id },
            action: 'createOrder',
            status: 'SUCCESS'
        });

        res.status(201).json(new ApiResponse(201, {
            order: newOrder,
            paymentIntent
        }, 'Order created successfully'));
    } catch (error) {
        console.error("createOrder ERROR:", error);

        // Log the error during order creation
        await Log.create({
            level: 'ERROR',
            source: 'ORDER',
            message: `Error creating order: ${error.message}`,
            userId: user_id,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'createOrder',
            status: 'FAILED'
        });

        next(new ApiError(500, 'Server error occurred while creating the order', [], error.stack));
    }
});
