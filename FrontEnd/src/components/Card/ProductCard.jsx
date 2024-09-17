import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Add to Cart function
    const addToCart = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/cart/add`, {
                user_id: 5, // Replace with actual user ID
                product_id: product.id,
                quantity: 1
            });
            alert(`Added ${product.name} to cart`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        }
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <Link to={`/product/${product.id}`}>
                <div
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        className={`w-full h-60 object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
                        src={product.image?.image_url || 'https://via.placeholder.com/150'}
                        alt={product.name}
                    />
                </div>
            </Link>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{product.name}</div>
                <p className="text-gray-700 text-base">{product.description}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    ${product.price}
                </span>
                <span className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Stock: {product.stock_quantity}
                </span>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={addToCart}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
