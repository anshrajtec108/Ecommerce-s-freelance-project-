import React from 'react';

const BadRequestError = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-100 text-black">
            <h1 className="text-6xl font-bold mb-4">400</h1>
            <p className="text-xl">Bad Request</p>
            <p className="text-gray-600">The server could not understand the request.</p>
        </div>
    );
};

export default BadRequestError;
