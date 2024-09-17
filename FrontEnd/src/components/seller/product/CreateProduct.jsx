import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const CreateProduct = () => {
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage('');

        try {
            // Create a FormData object to handle image/video uploads
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('category_id', data.category_id);
            formData.append('owner_id', data.owner_id);
            formData.append('stock_quantity', data.stock_quantity);

            // Append files (images and videos)
            if (data.images.length) {
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
            }

            if (data.videos.length) {
                for (let i = 0; i < data.videos.length; i++) {
                    formData.append('videos', data.videos[i]);
                }
            }

            // Call the API to create the product
            const response = await axios.post('http://localhost:8000/api/v1/product/createProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Product created successfully');
            reset();
        } catch (error) {
            console.error('Error creating product:', error);
            setMessage('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Product</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Product Name</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="text"
                        {...register('name', { required: true })}
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        {...register('description', { required: true })}
                        placeholder="Enter product description"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="number"
                        step="0.01"
                        {...register('price', { required: true })}
                        placeholder="Enter product price"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Category ID</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="number"
                        {...register('category_id', { required: true })}
                        placeholder="Enter category ID"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Owner ID</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="number"
                        {...register('owner_id', { required: true })}
                        placeholder="Enter owner ID"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Stock Quantity</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="number"
                        {...register('stock_quantity', { required: true })}
                        placeholder="Enter stock quantity"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Product Images</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="file"
                        multiple
                        {...register('images')}
                        accept="image/*"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Product Videos</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="file"
                        multiple
                        {...register('videos')}
                        accept="video/*"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Creating Product...' : 'Create Product'}
                </button>

                {message && <p className="text-center mt-4">{message}</p>}
            </form>
        </div>
    );
};

export default CreateProduct;
