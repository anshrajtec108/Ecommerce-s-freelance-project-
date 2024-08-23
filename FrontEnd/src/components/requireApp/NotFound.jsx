import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-4">
            <div className="max-w-lg bg-white shadow-md rounded-lg p-6">
                <h1 className="text-6xl text-black font-bold mb-4">404</h1>
                <p className="text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full">
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
