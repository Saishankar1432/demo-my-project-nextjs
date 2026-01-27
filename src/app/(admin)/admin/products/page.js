"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Products() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/products");

            let data = [];
            try {
                data = await res.json();
            } catch { }

            if (res.ok) {
                setProducts(data);
            } else {
                setError("Failed to fetch products");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Product deleted");
                fetchProducts(); // refresh admin list
            } else {
                alert("Delete failed");
            }
        } catch (err) {
            console.error(err);
        }
    };



    if (loading) {
        return (
            <div className="admin-content">
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-content">
                <div className="admin-card" style={{ textAlign: "center" }}>
                    <p style={{ color: "#ef4444" }}>{error}</p>
                    <button onClick={fetchProducts} className="btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>
                    Products ({products.length})
                </h2>
                <button
                    onClick={() => router.push("/admin/products/add")}
                    className="btn-primary"
                >
                    + Add New Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="admin-card" style={{ textAlign: "center", padding: "60px 20px" }}>
                    <h3 style={{ color: "#64748b", marginBottom: "16px" }}>No Products Yet</h3>
                    <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
                        Get started by adding your first product
                    </p>
                    <button
                        onClick={() => router.push("/admin/products/add")}
                        className="btn-primary"
                    >
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Tags</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                border: "2px solid #e2e8f0",
                                            }}
                                        />
                                    </td>
                                    <td style={{ fontWeight: "600", color: "#1e293b" }}>
                                        {product.name}
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "4px 12px",
                                                background: "rgba(102, 126, 234, 0.1)",
                                                color: "#667eea",
                                                borderRadius: "12px",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {product.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "4px 12px",
                                                background: "rgba(102, 126, 234, 0.1)",
                                                color: "#667eea",
                                                borderRadius: "12px",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {Array.isArray(product.tags) && product.tags.length > 0
                                                ? product.tags.join(", ")
                                                : "No tags"}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: "600", color: "#059669" }}>
                                        ₹{product.price.toFixed(2)}
                                    </td>
                                    <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {product.description || "No description"}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                                                style={{
                                                    padding: "8px 16px",
                                                    background: "#667eea",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    transition: "all 0.2s ease",
                                                }}
                                                onMouseOver={(e) => e.target.style.background = "#5568d3"}
                                                onMouseOut={(e) => e.target.style.background = "#667eea"}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}