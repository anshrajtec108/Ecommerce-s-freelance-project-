import { Order, Payment } from '../models/model_index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import stripe from 'stripe';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Controller to update payment status after Stripe payment confirmation
export const updatePaymentStatus = asyncHandler(async (req, res, next) => {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
        return next(new ApiError(400, 'Payment intent ID is required'));
    }

    try {
        const paymentIntent = await stripeClient.paymentIntents.retrieve(payment_intent_id);
        console.log("paymentIntent", paymentIntent);

        if (paymentIntent.status === 'succeeded') {
            const payment = await Payment.findOne({
                where: { stripe_payment_intent_id: payment_intent_id }
            });

            if (payment) {
                payment.payment_status = 'Succeeded';
                payment.stripe_receipt_url = paymentIntent.charges.data[0].receipt_url;
                await payment.save();

                const order = await Order.findByPk(payment.order_id);
                order.status = 'Completed';
                await order.save();

                res.status(200).json(new ApiResponse(200, payment, 'Payment confirmed successfully'));
            } else {
                return next(new ApiError(404, 'Payment record not found'));
            }
        } else {
            return next(new ApiError(400, 'Payment not successful'));
        }
    } catch (error) {
        console.log("updatePaymentStatus ERROR", error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});

// Controller to create a new payment record before initiating a Stripe payment
export const createPaymentRecord = asyncHandler(async (req, res, next) => {
    const { order_id, amount, currency } = req.body;

    if (!order_id || !amount || !currency) {
        return next(new ApiError(400, 'Order ID, amount, and currency are required'));
    }

    try {
        const order = await Order.findByPk(order_id);

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert amount to the smallest currency unit
            currency,
            metadata: { order_id: order.id }
        });

        const payment = await Payment.create({
            order_id: order.id,
            stripe_payment_intent_id: paymentIntent.id,
            payment_status: 'Pending',
            amount,
            currency
        });

        res.status(201).json(new ApiResponse(201, { payment, client_secret: paymentIntent.client_secret }, 'Payment record created successfully'));
    } catch (error) {
        console.log("createPaymentRecord ERROR", error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});


// Controller to handle webhook events from Stripe
export const handleStripeWebhook = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeClient.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return next(new ApiError(400, `Webhook Error: ${error.message}`));
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const payment = await Payment.findOne({
                where: { stripe_payment_intent_id: paymentIntent.id }
            });

            if (payment) {
                payment.payment_status = 'Succeeded';
                payment.stripe_receipt_url = paymentIntent.charges.data[0].receipt_url;
                await payment.save();

                const order = await Order.findByPk(payment.order_id);
                order.status = 'Completed';
                await order.save();
            }
            break;

        // Handle other event types...

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});
