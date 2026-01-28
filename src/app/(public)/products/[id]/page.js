"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) return;

            const data = await res.json();
            setProduct(data);
            setActiveImage(data.images?.[0] || "/no-image.png");
        };

        fetchProduct();
    }, [id]);

    if (!product) return <p style={{ padding: "40px" }}>Loading...</p>;

    const images =
        product.images && product.images.length > 0
            ? product.images.slice(0, 4) // ✅ MAX 4 thumbnails
            : ["/no-image.png"];

    return (
        <div className="product-details-page">
            {/* LEFT: IMAGE GALLERY */}
            <div className="product-gallery">
                {/* Thumbnails */}
                <div className="product-thumbnails">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            className={activeImage === img ? "active" : ""}
                            onMouseEnter={() => setActiveImage(img)}
                            alt="thumbnail"
                        />
                    ))}
                </div>

                {/* Main Image (ONLY ONE) */}
                <img
                    src={activeImage}
                    className="product-main-image"
                    alt={product.name}
                />
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="product-info">
                <h1>{product.name}</h1>
                <div className="category">{product.category}</div>
                <div className="price">₹{product.price}</div>

                <p className="description">{product.description}</p>

                <button className="buy-btn">Buy Now</button>
            </div>
        </div>
    );
}
