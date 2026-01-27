"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");

                const data = await res.json();

                setFormData({
                    ...data,
                    tags: Array.isArray(data.tags) ? data.tags : [],
                });
            } catch (err) {
                console.error(err);
                setError("Product not found");
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            const value = tagInput.trim();
            if (!value) return;

            if (!formData.tags.includes(value)) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, value],
                });
            }

            setTagInput("");
        }
    };

    const removeTag = (index) => {
        const updatedTags = formData.tags.filter((_, i) => i !== index);
        setFormData({ ...formData, tags: updatedTags });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                price: Number(formData.price),
            }),
        });

        if (res.ok) {
            alert("Product updated");
            router.push("/admin/products");
        } else {
            alert("Update failed");
        }
    };

    if (error) return <p style={{ padding: 20 }}>{error}</p>;
    if (!formData) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div className="add-product-container">
            <div className="admin-card">
                <h2>Edit Product</h2>

                <form onSubmit={handleUpdate} className="product-form">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="admin-input"
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
                                value={formData.price}
                                onChange={handleChange}
                                className="admin-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <input
                                name="category"
                                value={formData.category || ""}
                                onChange={handleChange}
                                className="admin-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tags</label>

                        <div className="tags-input-container">
                            {formData.tags.map((tag, index) => (
                                <span key={index} className="tag-chip">
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
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="tags-input"
                                placeholder="Type and press Enter"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description || ""}
                            onChange={handleChange}
                            className="admin-input"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/products")}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn-primary">
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
