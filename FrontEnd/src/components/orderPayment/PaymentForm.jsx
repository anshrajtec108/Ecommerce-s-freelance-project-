import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with your public key
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPaymentProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setPaymentProcessing(false);
            } else {
                // Handle successful payment here
                console.log('Payment succeeded:', paymentIntent);
                setPaymentProcessing(false);
            }
        } catch (error) {
            setError(error.message);
            setPaymentProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={!stripe || paymentProcessing}>
                {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export const Checkout = ({ clientSecret }) => (
    <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} />
    </Elements>
);
