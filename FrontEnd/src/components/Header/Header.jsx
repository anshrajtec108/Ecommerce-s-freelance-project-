import React from 'react';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="bg-blue-600 p-4 flex justify-between items-center">
            {/* Logo */}
            <div className="text-white text-2xl font-bold">
                
                E-Commerce
            </div>

            {/* Search Bar */}
            <div className="flex items-center bg-white rounded overflow-hidden">
                <input
                    type="text"
                    className="px-4 py-2 w-full text-gray-700 focus:outline-none"
                    placeholder="Search products..."
                />
                <button
                 className=" hover:bg-blue-700 text-black px-5"
                 >
                    <FaSearch />
                </button>
            </div>

            {/* User and Cart */}
            <div className="flex items-center space-x-4 text-white">
                <button className="flex items-center">
                    <FaUser className="mr-2" />
                    Login
                </button>
                <button className="flex items-center">
                    <FaShoppingCart className="mr-2" />
                    Cart
                </button>
            </div>
        </header>
    );
};

export default Header;
