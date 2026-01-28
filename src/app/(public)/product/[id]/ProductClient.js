"use client";

import { useState, useEffect } from "react";
import ReactImageMagnify from "react-image-magnify";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./product.css";

export default function ProductClient({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImage, setActiveImage] = useState("");
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // Initialize defaults when product loads
    useEffect(() => {
        if (product) {
            console.log("Product Data:", product);
            // Find default variant or first one
            const defaultVar = product.variants?.find(v => v.isDefault) || product.variants?.[0];

            if (defaultVar) {
                setSelectedVariant(defaultVar);
                // Set initial image from variant or product
                const initialImg = defaultVar.images?.[0]?.secure_url || product.images?.[0];
                setActiveImage(initialImg || "/no-image.png");
            } else {
                // No variants, use global product images
                setActiveImage(product.images?.[0] || "/no-image.png");
            }
        }
    }, [product]);

    // Handle variant change
    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        const newImg = variant.images?.[0]?.secure_url;
        if (newImg) setActiveImage(newImg);
    };

    if (!product) return null;

    // Resolve current price and stock
    const currentPrice = selectedVariant ? (product.price + selectedVariant.price) : product.price;

    // Resolve images to show
    const displayImages = selectedVariant?.images?.length > 0
        ? selectedVariant.images.map(img => img.secure_url)
        : product.images;

    const finalImages = displayImages && displayImages.length > 0 ? displayImages : ["/no-image.png"];

    return (
        <div className="pdp-container">
            {/* 1. THUMBNAILS (Far Left) */}
            <div className="pdp-thumbs">
                {finalImages.map((src, i) => (
                    <div
                        key={i}
                        className={`pdp-thumb ${activeImage === src ? 'active' : ''}`}
                        onMouseEnter={() => setActiveImage(src)}
                        onClick={() => setActiveImage(src)}
                    >
                        <img
                            src={src}
                            alt={`View ${i + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* 2. MAIN IMAGE (Center) - With Zoom */}
            <div className="pdp-main-image">
                <ReactImageMagnify
                    {...{
                        smallImage: {
                            alt: product.name,
                            isFluidWidth: true,
                            src: activeImage,
                        },
                        largeImage: {
                            src: activeImage,
                            width: 1400,
                            height: 1400,
                        },
                        enlargedImageContainerDimensions: {
                            width: '100%',
                            height: '100%',
                        },
                        enlargedImagePosition: 'over', // ⭐ KEY CHANGE
                        isHintEnabled: true,
                        shouldHideHintAfterFirstActivation: false,
                    }}
                />
            </div>


            {/* 3. DETAILS (Right) */}
            <div className="pdp-details">
                <span className="pdp-brand">Details</span>
                <span className="pdp-category">{product.category}</span>
                <h1 className="pdp-title">{product.name}</h1>
                {/* 
                <div className="pdp-rating">
                    ★★★★☆ <span>(1,234 Reviews)</span>
                </div> */}

                <div className="pdp-price-wrapper">
                    <span className="pdp-price">₹{currentPrice.toFixed(2)}</span>
                    {/* <span className="pdp-mrp">₹{(currentPrice * 1.4).toFixed(2)}</span>
                    <span className="pdp-discount">40% OFF</span> */}
                </div>

                {selectedVariant && selectedVariant.price > 0 && (
                    <p className="pdp-variant-note">Includes variant charge: +₹{selectedVariant.price}</p>
                )}

                {/* <div className="pdp-offers">
                    <strong>Available Offers</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                        <li>Bank Offer 5% Unlimited Cashback on Axis Bank Credit Card</li>
                        <li>Special Price Get extra 20% off (price inclusive of discount)</li>
                    </ul>
                </div> */}

                {/* Variants Selector */}
                {/* {product.variants && product.variants.length > 0 && (
                    <div className="pdp-variants">
                        <h3 className="pdp-variant-label">Select Option</h3>
                        <div className="pdp-variant-options">
                            {product.variants.map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleVariantChange(v)}
                                    className={`pdp-variant-btn ${selectedVariant === v ? "active" : ""}`}
                                >
                                    {v.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )} */}

                <p className="pdp-description">{product.description}</p>

                <div className="pdp-actions">
                    <button className="pdp-buy">
                        Buy Now
                    </button>
                    {/* <button className="pdp-cart">
                        Add to Cart
                    </button> */}
                </div>
            </div>
        </div>
    );
}
