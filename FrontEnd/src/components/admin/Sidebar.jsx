import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-gray-900 text-white p-6 shadow-lg">
            <div className="flex flex-col space-y-4">
                <Link
                    to="/admin/dashboard"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    Dashboard
                </Link>
                <Link
                    to="/admin/users"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    User Management
                </Link>
                <Link
                    to="/admin/categories"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    Category Management
                </Link>
                <Link
                    to="/admin/sales-report"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    Sales Report
                </Link>
                <Link
                    to="/admin/user-activity-log"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    User Activity Log
                </Link>
                <Link
                    to="/admin/system-settings"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    System Settings
                </Link>
                <Link
                    to="/admin/error-logs"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    Error Logs
                </Link>
                <Link
                    to="/admin/pending-orders"
                    className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    Pending Orders
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
