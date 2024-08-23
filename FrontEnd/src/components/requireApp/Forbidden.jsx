import React from 'react';

const ForbiddenError = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-100 text-black">
            <h1 className="text-6xl font-bold mb-4">403</h1>
            <p className="text-xl">Forbidden</p>
            <p className="text-gray-600">You don’t have permission to access this resource.</p>
        </div>
    );
};

export default ForbiddenError;
