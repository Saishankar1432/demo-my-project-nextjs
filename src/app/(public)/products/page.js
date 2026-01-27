"use client";

import "./products.css";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const fetchProducts = async (query = "") => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?q=${query}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            setProducts([]);
            return;
        }

        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchProducts(value);
    };

    return (
        <div className="products-page">
            <div className="products-hero">
                <h1 className="products-title">Our Products</h1>
                <p className="products-subtitle">
                    Discover our amazing collection of premium products
                </p>

          
                <input
                    type="text"
                    placeholder="Search Product..."
                    value={search}
                    onChange={handleSearch}
                    className="products-search"
                />
            </div>

            <div className="products-container">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Products Found</h2>
                        <p>Try searching with different keywords</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </div>

                                <div className="product-content">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-description">
                                        {product.description || "No description available"}
                                    </p>
                                    <span className="product-category">
                                        {product.category}
                                    </span> 

                                    <div className="product-footer">
                                        <span className="product-price">
                                            ₹{product.price.toFixed(2)}
                                        </span>
                                        <button className="product-btn">Buy now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
