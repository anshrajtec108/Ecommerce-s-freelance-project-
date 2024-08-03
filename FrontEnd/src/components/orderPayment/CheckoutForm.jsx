import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, orderId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPaymentProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Customer Name',
                },
            },
        });

        if (error) {
            setError(error.message);
            setPaymentProcessing(false);
        } else {
            setPaymentSucceeded(true);
            setPaymentProcessing(false);

            await fetch('/api/payment-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment_intent_id: paymentIntent.id, order_id: orderId }),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || paymentProcessing}>
                {paymentProcessing ? 'Processing...' : 'Pay'}
            </button>
            {error && <div>{error}</div>}
            {paymentSucceeded && <div>Payment succeeded!</div>}
        </form>
    );
};

export default CheckoutForm;
