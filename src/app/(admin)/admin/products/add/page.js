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
    const [images, setImages] = useState([]);
    const [variants, setVariants] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
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

    /* ================= VARIANTS LOGIC ================= */
    const addVariant = () => {
        setVariants([
            ...variants,
            { name: "", price: "", stock: 0, imageFiles: [], previews: [] },
        ]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleVariantImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));

        const newVariants = [...variants];
        newVariants[index].imageFiles = files;
        newVariants[index].previews = previews;
        setVariants(newVariants);
    };

    const addProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formPayload = new FormData();

            formPayload.append("name", formData.name);
            formPayload.append("price", formData.price);
            formPayload.append("category", formData.category);
            formPayload.append("description", formData.description);
            formPayload.append("tags", JSON.stringify(formData.tags));

            // Global Images
            images.forEach((img) => {
                formPayload.append("images", img);
            });

            // Variants Content (Cleaning up files before stringify)
            const variantsMetadata = variants.map(({ imageFiles, previews, price, stock, ...rest }) => ({
                ...rest,
                price: Number(price),
                stock: Number(stock)
            }));
            formPayload.append("variants", JSON.stringify(variantsMetadata));

            // Variant Images
            variants.forEach((variant, index) => {
                variant.imageFiles.forEach((file) => {
                    formPayload.append(`variant_${index}_images`, file);
                });
            });

            const res = await fetch("/api/products", {
                method: "POST",
                body: formPayload,
            });

            if (res.ok) {
                alert("Product added successfully!");
                router.push("/admin/products");
            } else {
                alert("Failed to add product");
            }
        } catch (error) {
            console.error("Add product error:", error);
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
                        <label>Product Images (Global)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* VARIANTS SECTION */}
                    <div className="admin-card" style={{ marginTop: "24px", padding: "20px", background: "#f8fafc" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>Product Variants</h3>
                            <button
                                type="button"
                                onClick={addVariant}
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                + Add Variant
                            </button>
                        </div>

                        {variants.map((variant, index) => (
                            <div key={index} style={{
                                background: "white",
                                padding: "16px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                marginBottom: "16px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <h4 style={{ margin: 0, fontSize: "15px" }}>Variant {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer" }}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Variant Name (e.g. Red, XL)</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={variant.name}
                                            onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                                            placeholder="Red, Blue, Small..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Extra Price (₹)</label>
                                        <input
                                            type="number"
                                            className="admin-input"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock</label>
                                        <input
                                            type="number"
                                            className="admin-input"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                            placeholder="10"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Variant Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleVariantImageChange(index, e)}
                                    />
                                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                        {variant.previews.map((src, i) => (
                                            <img key={i} src={src} alt="preview" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
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
