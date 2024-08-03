import  { useState, useEffect } from 'react';
import PaymentPage from './PaymentPage';

const OrderPage = () => {
    const [clientSecret, setClientSecret] = useState('');
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const createOrder = async () => {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1,
                    items: [
                        { product_id: 1, quantity: 2, price: 5000 },
                        { product_id: 2, quantity: 1, price: 3000 },
                    ],
                    payment: { method: 'card' },
                    shipping_address: {
                        address: '123 Main St',
                        city: 'San Francisco',
                        state: 'CA',
                        postal_code: '94111',
                        country: 'US',
                    },
                }),
            });
            const data = await response.json();
            setClientSecret(data.paymentIntent.client_secret);
            setOrderId(data.order.id);
        };

        createOrder();
    }, []);

    return (
        <div>
            <h1>Complete Your Order</h1>
            {clientSecret && orderId && (
                <PaymentPage clientSecret={clientSecret} orderId={orderId} />
            )}
        </div>
    );
};

export default OrderPage;
