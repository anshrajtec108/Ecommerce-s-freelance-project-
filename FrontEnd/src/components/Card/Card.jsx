import React from 'react';

const Card = ({ product }) => {
    return (
        <div className="card">
            <img src={product.images[0].image_url} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <button className="buy-now-button">Buy Now</button>
        </div>
    );
};

export default Card;
