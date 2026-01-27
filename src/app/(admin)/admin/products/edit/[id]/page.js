"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch product");
                }

                const data = await res.json();
                setFormData(data);
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

    if (error) {
        return <p style={{ padding: 20 }}>{error}</p>;
    }
    if (!formData) {
        return <p style={{ padding: 20 }}>Loading...</p>;
    }

    const tagsString = Array.isArray(formData.tags)
        ? formData.tags.join(", ")
        : formData.tags || "";

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
                                placeholder="e.g., Electronics, Clothing"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tags (comma-separated)</label>
                        <input
                            name="tags"
                            value={tagsString}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="e.g., premium, bestseller, new"
                        />
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
