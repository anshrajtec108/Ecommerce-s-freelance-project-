import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex space-x-4">
                    <Link to="/admin/dashboard" className="text-white hover:text-gray-300 font-semibold">Dashboard</Link>
                    <Link to="/admin/users" className="text-white hover:text-gray-300 font-semibold">User Management</Link>
                    <Link to="/admin/categories" className="text-white hover:text-gray-300 font-semibold">Category Management</Link>
                    <Link to="/admin/sales-report" className="text-white hover:text-gray-300 font-semibold">Sales Report</Link>
                    <Link to="/admin/user-activity-log" className="text-white hover:text-gray-300 font-semibold">User Activity Log</Link>
                    <Link to="/admin/error-logs" className="text-white hover:text-gray-300 font-semibold">Error Logs</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
