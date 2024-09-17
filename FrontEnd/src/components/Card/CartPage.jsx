import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Replace with your Stripe publishable key

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 5; // Replace with dynamic user ID if needed
    const [totalPrice, setTotalPrice] = useState(0);
    const stripe = useStripe();
    const elements = useElements();

    // Fetch cart items on mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/cart/${userId}`);
                setCartItems(response.data.data.CartItems);
                calculateTotalPrice(response.data.data.CartItems);
                setLoading(false);
            } catch (error) {
                setError('Error fetching cart items.');
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // Calculate total price
    const calculateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.Product.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Handle quantity update
    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/cart/update`, {
                cart_item_id: cartItemId,
                quantity
            });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? { ...item, quantity } : item
                )
            );
            calculateTotalPrice(cartItems);
        } catch (error) {
            setError('Error updating quantity.');
        }
    };

    // Handle item removal
    const removeItem = async (cartItemId) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/cart/remove/${cartItemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            calculateTotalPrice(cartItems);
        } catch (error) {
            setError('Error removing item.');
        }
    };

    // Handle Checkout
    const handleCheckout = async () => {
        if (!stripe || !elements) {
            return; // Stripe.js has not loaded yet
        }

        try {
            // Create the order on the server
            const orderResponse = await axios.post('http://localhost:8000/api/v1/order/create-order', {
                user_id: userId,
                items: cartItems.map(item => ({
                    product_id: item.Product.id,
                    quantity: item.quantity,
                    price: item.Product.price
                })),
                payment: {
                    method: 'card'
                },
                shipping_address: {
                    address_line1: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zip_code: '10001',
                    country: 'US'
                }
            });

            const { paymentIntent } = orderResponse.data.data;

            // Confirm payment using the CardElement data
            const cardElement = elements.getElement(CardElement);
            const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (result.error) {
                setError(`Payment failed: ${result.error.message}`);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Payment succeeded!');
                    setCartItems([]); // Clear the cart
                    setTotalPrice(0); // Reset total price
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setError('Error creating order or processing payment.');
        }
    };

    if (loading) {
        return <div>Loading cart...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">{item.Product.name}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                            className="border rounded w-16 text-center"
                                        />
                                    </td>
                                    <td className="px-4 py-2">${item.Product.price}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                        <CardElement className="mt-4 p-2 border rounded" />
                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// Wrap the CartPage in Elements to provide Stripe context
const StripeWrapper = () => (
    <Elements stripe={stripePromise}>
        <CartPage />
    </Elements>
);

export default StripeWrapper;
