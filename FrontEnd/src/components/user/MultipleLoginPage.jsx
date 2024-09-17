import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const MultipleLoginPage = () => {
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [loginType, setLoginType] = useState('user'); // Default login type is "user"

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage('');

        const loginEndpoint = loginType === 'user'
            ? 'http://localhost:8000/api/v1/users/loginUser'
            : 'http://localhost:8000/api/v1/seller/login';

        try {
            const response = await axios.post(loginEndpoint, {
                email: data.email,
                password: data.password
            });
            
            if (response.status === 200) {
                console.log(response);
                
                localStorage.setItem("accessToken", response.data.data.token)
                setMessage(`${loginType === 'user' ? 'User' : 'Seller'} logged in successfully`);
                reset();
            }
        } catch (error) {   3
            console.error('Login error:', error);
            setMessage('Failed to login',error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            <div className="flex justify-center mb-6">
                <button
                    className={`mr-4 py-2 px-4 rounded-lg ${loginType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setLoginType('user')}
                >
                    User Login
                </button>
                <button
                    className={`py-2 px-4 rounded-lg ${loginType === 'seller' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setLoginType('seller')}
                >
                    Seller Login
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {message && <p className="text-center mt-4 text-red-500">{message}</p>}
            </form>
        </div>
    );
};

export default MultipleLoginPage;
