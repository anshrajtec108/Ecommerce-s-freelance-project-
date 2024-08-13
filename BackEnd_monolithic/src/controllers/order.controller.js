import { Order, OrderItem, Payment, ShippingAddress } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import stripe from 'stripe';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Create a new order and initiate Stripe payment
export const createOrder = asyncHandler(async (req, res, next) => {
    const { user_id, items, payment, shipping_address } = req.body;

    if (!user_id || !items || items.length === 0 || !payment || !shipping_address) {
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

        console.log("newOrder", newOrder);
        const orderItems = items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems);

        // const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: totalAmount * 100, // amount in cents
            currency: 'usd',
            metadata: { order_id: newOrder.id }
        });
        console.log("paymentIntent", paymentIntent);
        await Payment.create({
            order_id: newOrder.id,
            amount: totalAmount,
            payment_method: payment.method,
            payment_status: 'pending',
            stripe_payment_intent_id: paymentIntent.id
        });

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

        res.status(201).json(new ApiResponse(201, {
            order: newOrder,
            paymentIntent
        }, 'Order created successfully'));
    } catch (error) {
        console.log("create order",error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


