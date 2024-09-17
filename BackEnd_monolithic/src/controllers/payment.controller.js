import { Order, Payment } from '../models/model_index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Log } from '../models/log.model.js'; // Import the Log model
import stripe from 'stripe';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Controller to create a Stripe Checkout session
export const createCheckoutSession = async (req, res, next) => {
    const { items, user_id } = req.body;

    try {
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.Product.name,
                },
                unit_amount: item.Product.price, // Amount in cents
            },
            quantity: item.quantity,
        }));

        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        // Log successful checkout session creation
        await Log.create({
            level: 'INFO',
            source: 'PAYMENT',
            message: 'Stripe checkout session created',
            userId: user_id,
            ipAddress: req.ip,
            additionalData: { sessionId: session.id },
            action: 'createCheckoutSession',
            status: 'SUCCESS'
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('createCheckoutSession ERROR', error);

        // Log error during session creation
        await Log.create({
            level: 'ERROR',
            source: 'PAYMENT',
            message: `Error creating Stripe checkout session: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'createCheckoutSession',
            status: 'FAILED'
        });

        next(new ApiError(500, 'Server error occurred while creating checkout session', [], error.stack));
    }
};

// Controller to update payment status after Stripe payment confirmation
export const updatePaymentStatus = async (req, res, next) => {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
        return next(new ApiError(400, 'Payment intent ID is required'));
    }

    try {
        const paymentIntent = await stripeClient.paymentIntents.retrieve(payment_intent_id);
        console.log("PaymentIntent Status:", paymentIntent.status);

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

                // Log successful payment update
                await Log.create({
                    level: 'INFO',
                    source: 'PAYMENT',
                    message: 'Payment updated successfully',
                    userId: req.user ? req.user.id : null, // Assuming user is logged in
                    ipAddress: req.ip,
                    additionalData: { paymentIntentId: payment_intent_id, orderId: order.id },
                    action: 'updatePaymentStatus',
                    status: 'SUCCESS'
                });

                return res.status(200).json(new ApiResponse(200, payment, 'Payment confirmed successfully'));
            } else {
                return next(new ApiError(400, `Payment not successful, status: ${paymentIntent.status}`));
            }
        }
    } catch (error) {
        console.error('updatePaymentStatus ERROR', error);

        // Log error during payment status update
        await Log.create({
            level: 'ERROR',
            source: 'PAYMENT',
            message: `Error updating payment status: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack, paymentIntentId: payment_intent_id },
            action: 'updatePaymentStatus',
            status: 'FAILED'
        });

        next(new ApiError(500, 'Server error occurred while updating payment status', [], error.stack));
    }
};

// Webhook route to handle events from Stripe
export const handleStripeWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeClient.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('handleStripeWebhook ERROR', error);

        // Log webhook error
        await Log.create({
            level: 'ERROR',
            source: 'PAYMENT',
            message: `Webhook error: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'handleStripeWebhook',
            status: 'FAILED'
        });

        return next(new ApiError(400, `Webhook Error: ${error.message}`));
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSucceeded(event.data.object);
            break;
        case 'payment_intent.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};

// Helper function to handle successful payments
const handlePaymentSucceeded = async (paymentIntent) => {
    try {
        // Implement your logic to update the order and payment status here

        // Log successful payment intent handling
        await Log.create({
            level: 'INFO',
            source: 'PAYMENT',
            message: 'Payment intent succeeded',
            additionalData: { paymentIntentId: paymentIntent.id },
            action: 'handlePaymentSucceeded',
            status: 'SUCCESS'
        });
    } catch (error) {
        console.error('handlePaymentSucceeded ERROR', error);

        // Log error during successful payment handling
        await Log.create({
            level: 'ERROR',
            source: 'PAYMENT',
            message: `Error handling successful payment: ${error.message}`,
            additionalData: { stack: error.stack, paymentIntentId: paymentIntent.id },
            action: 'handlePaymentSucceeded',
            status: 'FAILED'
        });
    }
};

// Helper function to handle failed payments
const handlePaymentFailed = async (paymentIntent) => {
    try {
        console.error('Payment failed for:', paymentIntent.id);

        // Log payment failure
        await Log.create({
            level: 'ERROR',
            source: 'PAYMENT',
            message: 'Payment intent failed',
            additionalData: { paymentIntentId: paymentIntent.id },
            action: 'handlePaymentFailed',
            status: 'FAILED'
        });
    } catch (error) {
        console.error('handlePaymentFailed ERROR', error);

        // Log error during failed payment handling
        await Log.create({
            level: 'ERROR',
            source: 'PAYMENT',
            message: `Error handling failed payment: ${error.message}`,
            additionalData: { stack: error.stack, paymentIntentId: paymentIntent.id },
            action: 'handlePaymentFailed',
            status: 'FAILED'
        });
    }
};
