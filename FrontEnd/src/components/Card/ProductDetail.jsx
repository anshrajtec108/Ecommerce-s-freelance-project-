import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams(); // Get product ID from the URL
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // State to handle the main image
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/product/products/${id}`);
                setProduct(response.data.data);
                setSelectedImage(response.data.data.images[0]?.image_url); // Set initial large image
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

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
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
            <div className="flex flex-wrap">
                {/* Image section */}
                <div className="w-full lg:w-1/2">
                    <div className="relative overflow-hidden">
                        <img
                            className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                            src={selectedImage || 'https://via.placeholder.com/150'}
                            alt={product.name}
                        />
                    </div>
                    <div className="flex mt-4">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                className="w-20 h-20 object-cover mr-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                                src={img.image_url}
                                alt={`Image ${idx + 1}`}
                                onClick={() => setSelectedImage(img.image_url)} // Set the clicked image as the main image
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="w-full lg:w-1/2 lg:pl-8">
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-xl font-bold mb-4">Price: ${product.price}</p>
                    <p className="text-lg font-semibold mb-4">Stock: {product.stock_quantity}</p>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
