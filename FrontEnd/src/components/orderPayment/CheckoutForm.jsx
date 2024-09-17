import React, { useEffect, useState } from 'react';
import { Checkout } from './PaymentForm';
import axios from 'axios';

const PaymentPage = ({ orderId }) => {
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        // Fetch the payment intent client secret from your backend
        const fetchPaymentIntent = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/v1/payment/update-payment-status', { order_id: orderId });
                setClientSecret(response.data.client_secret);
            } catch (error) {
                console.error('Error creating payment intent:', error);
            }
        };

        fetchPaymentIntent();
    }, [orderId]);

    return (
        <div>
            <h1>Complete Your Payment</h1>
            {clientSecret && <Checkout clientSecret={clientSecret} />}
        </div>
    );
};

export default PaymentPage;
