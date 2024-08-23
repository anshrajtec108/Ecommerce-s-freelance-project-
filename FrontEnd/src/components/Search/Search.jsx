import React from 'react';

const Search = () => {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search for products..." className="search-input" />
            <button className="search-button">Search</button>
        </div>
    );
};

export default Search;
