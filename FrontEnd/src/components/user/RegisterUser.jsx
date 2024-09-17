import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const RegisterUser = () => {
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage('');

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('first_name', data.first_name);
            formData.append('last_name', data.last_name);
            formData.append('phone_number', data.phone_number);
            formData.append('address', data.address);
            formData.append('date_of_birth', data.date_of_birth);
            formData.append('role_id', data.role_id);

            if (data.profile_pic.length) {
                formData.append('profile_pic', data.profile_pic[0]);
            }

            // Call API to register user
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('User registered successfully');
            reset();
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Failed to register user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Username</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="text"
                        {...register('username', { required: true })}
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="email"
                        {...register('email', { required: true })}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="password"
                        {...register('password', { required: true })}
                        placeholder="Enter your password"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">First Name</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="text"
                        {...register('first_name', { required: true })}
                        placeholder="Enter your first name"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="text"
                        {...register('last_name', { required: true })}
                        placeholder="Enter your last name"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="text"
                        {...register('phone_number', { required: true })}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Address</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="text"
                        {...register('address', { required: true })}
                        placeholder="Enter your address"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Date of Birth</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="date"
                        {...register('date_of_birth', { required: true })}
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Role ID</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="number"
                        {...register('role_id', { required: true })}
                        placeholder="Enter role ID"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Profile Picture</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        type="file"
                        {...register('profile_pic')}
                        accept="image/*"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                {message && <p className="text-center mt-4">{message}</p>}
            </form>
        </div>
    );
};

export default RegisterUser;
