import React from 'react';

const ServerError = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-4">
            <div className="max-w-lg bg-white shadow-md rounded-lg p-6">
                <h1 className="text-4xl text-black font-bold mb-4">Server Error</h1>
                <p className="text-gray-700 mb-6">Something went wrong on our end. Please try again later.</p>
                <button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full">
                    Reload Page
                </button>
            </div>
        </div>
    );
};

export default ServerError;
