import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import axios from 'axios';
import Header from '../Header/Header';
import Search from '../Search/Search';
// const response = await axios.get('http://localhost:8000/api/v1/home/recommended');

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/home/recommended');
                console.log("respode",response);
                
                if (response.data && Array.isArray(response.data.data)) {
                    setProducts(response.data.data);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [products.length]);

    if (!Array.isArray(products) || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <div className="homepage">
            <Header/>

            <div className="slider">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        <Card product={product} />
                    </div>
                ))}
            </div>
            <div className="slider-controls">
                <button onClick={() => setCurrentIndex((currentIndex - 1 + products.length) % products.length)}>Prev</button>
                <button onClick={() => setCurrentIndex((currentIndex + 1) % products.length)}>Next</button>
            </div>
        </div>
    );
};

export default HomePage;