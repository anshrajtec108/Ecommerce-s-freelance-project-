import { Order, Payment } from '../models/model_index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import stripe from 'stripe';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Update payment status after Stripe payment confirmation
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
                throw new ApiError(404, 'Payment record not found');
            }
        } else {
            throw new ApiError(400, 'Payment not successful');
        }
    } catch (error) {
        console.log("updatePaymentStatus ERROR", error);
        next(new ApiError(500, 'Server error', [], error.stack));
    }
});
