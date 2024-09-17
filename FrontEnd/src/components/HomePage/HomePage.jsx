import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../Card/ProductCard';
import Header from '../Header/Header';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/home/recommended');
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching recommended products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <Header />
            <div className="container mx-auto mt-6">
                <h2 className="text-2xl font-bold text-center">Recommended Products</h2>
                <div className="flex flex-wrap justify-center">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
