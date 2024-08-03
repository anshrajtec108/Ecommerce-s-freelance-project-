import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here');

const PaymentPage = ({ clientSecret, orderId }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
    </Elements>
);

export default PaymentPage;
