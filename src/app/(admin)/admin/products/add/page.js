"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        tags: [],
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            const value = e.target.value.trim();
            if (!value) return;

            if (!formData.tags.includes(value)) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, value],
                });
            }

            e.target.value = "";
        }
    };
    const removeTag = (index) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };  

    const addProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                image: imagePreview || "/placeholder-product.jpg",
            };

            console.log("🚀 Sending product data:", productData);

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            let data = {};
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            console.log("📥 Response from server:", data);

            if (res.ok) {
                alert("Product added successfully!");
                router.push("/admin/products");
            } else {
                alert(data.message || "Failed to add product");
            }
        } catch (error) {
            console.error("Add product error:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <div className="admin-card">
                <h2>Add New Product</h2>

                <form onSubmit={addProduct} className="product-form">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input
                            name="name"
                            type="text"
                            className="admin-input"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price *</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                className="admin-input"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <input
                                name="category"
                                type="text"
                                className="admin-input"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Tags</label>

                        <div className="tags-input-container">
                            {formData.tags.map((tag, index) => (
                                <span className="tag-chip" key={index}>
                                    {tag}
                                    <button
                                        type="button"
                                        className="tag-remove"
                                        onClick={() => removeTag(index)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            <input
                                type="text"
                                className="tags-input"
                                placeholder="Type and press Enter"
                                onKeyDown={handleTagKeyDown}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            className="admin-input"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />

                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/products")}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
