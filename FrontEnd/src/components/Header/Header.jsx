import React from 'react';
import Search from '../Search/Search';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">My E-Commerce</div>
            <Search />
        </header>
    );
};

export default Header;
