import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Adjust the path as needed

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
