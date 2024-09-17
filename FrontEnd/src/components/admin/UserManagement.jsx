import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../../services/api';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await makeGetRequest('/api/v1/admin/users', { page: currentPage, pageSize: 10 });
                console.log(result); // Check the result structure

                setUsers(result.data.users); // Access users array
                setTotalPages(result.data.totalPages); // Access totalPages
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, [currentPage]);

   
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-4 text-left">Name</th>
                            <th className="border-b p-4 text-left">Email</th>
                            <th className="border-b p-4 text-left">Role</th>
                            <th className="border-b p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="border-b p-4">{user.username}</td>
                                    <td className="border-b p-4">{user.email}</td>
                                    <td className="border-b p-4">{user.role.role_name}</td>
                                    <td className="border-b p-4">
                                        <Link to={`/admin/users/${user.id}`} className="text-blue-500 hover:underline">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="border-b p-4 text-center text-gray-600">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
