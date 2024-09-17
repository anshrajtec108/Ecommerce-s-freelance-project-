import React, { useEffect, useState } from 'react';
import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '../../services/api.js';
import Sidebar from './Sidebar.jsx';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const fetchCategories = async () => {
        try {
            const result = await makeGetRequest('/api/v1/admin/categories');
            console.log(...result.data);
            
            setCategories(result.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };
    useEffect(() => {
       
         fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await makePostRequest('/api/v1/admin/categories', {}, newCategory);
            setNewCategory({ name: '', description: '' });
            await fetchCategories();
        } catch (error) {
            console.error("Failed to create category:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (editCategory) {
            try {
                await makePutRequest(`/api/v1/admin/categories/${editCategory.id}`, {}, editCategory);
                setEditCategory(null);
                setIsEditing(false);
                await fetchCategories();
            } catch (error) {
                console.error("Failed to update category:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await makeDeleteRequest(`/api/v1/admin/categories/${id}`);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <>
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Category Management</h1>
            </header>

            {/* Create Category Form */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="p-2 border border-gray-300 rounded-md w-full"
                        rows="4"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Add Category
                    </button>
                </form>
            </section>

            {/* Edit Category Form */}
            {isEditing && (
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <input
                            type="text"
                            value={editCategory.name}
                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                            className="p-2 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <textarea
                            value={editCategory.description}
                            onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                            className="p-2 border border-gray-300 rounded-md w-full"
                            rows="4"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Update Category
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsEditing(false); setEditCategory(null); }}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </form>
                </section>
            )}

            {/* Categories List */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Categories List</h2>
                <ul className="space-y-4">
                    {categories.map(category => (
                        <li key={category.id} className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium">{category.name}</h3>
                                <p className="text-gray-600">{category.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => { setEditCategory(category); setIsEditing(true); }}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
        </>
    );
};

export default CategoryManagement;
