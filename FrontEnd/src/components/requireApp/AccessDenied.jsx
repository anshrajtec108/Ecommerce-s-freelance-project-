import React from 'react';

const AccessDenied = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-4">
            <div className="max-w-lg bg-white shadow-md rounded-lg p-6">
                <h1 className="text-4xl text-black font-bold mb-4">Access Denied</h1>
                <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
                <button onClick={() => window.history.back()} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full">
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default AccessDenied;
