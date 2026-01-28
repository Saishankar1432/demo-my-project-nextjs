"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          console.error("GET failed:", res.status);
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();

        setFormData({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : [],
          variants: Array.isArray(data.variants) ? data.variants : [], // Init variants
        });
      } catch (err) {
        console.error("Fetch product error:", err);
        setError("Product not found or API error");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= VARIANTS LOGIC ================= */
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { name: "", price: "", stock: 0, images: [], newFiles: [], previews: [] }
      ]
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  // Handle new files for variant
  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    const newVariants = [...formData.variants];
    newVariants[index].newFiles = files; // Store files to upload
    newVariants[index].newPreviews = previews; // Temporary previews
    setFormData({ ...formData, variants: newVariants });
  };

  // Remove existing image from variant
  const removeVariantImage = (variantIndex, imgIndex) => {
    const newVariants = [...formData.variants];
    const v = newVariants[variantIndex];
    if (v.images) {
      v.images = v.images.filter((_, i) => i !== imgIndex);
    }
    setFormData({ ...formData, variants: newVariants });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim();
      if (!value) return;

      if (!formData.tags.includes(value)) {
        setFormData({ ...formData, tags: [...formData.tags, value] });
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("price", Number(formData.price));
    formPayload.append("category", formData.category);
    formPayload.append("description", formData.description || "");
    formPayload.append("tags", JSON.stringify(formData.tags));

    if (newImage) {
      formPayload.append("images", newImage); // note: API expects 'images' for global now if we follow add pattern, or 'image' if we kept it? 
      // In add page I used 'images' (plural) for global. In existing PUT it used 'image' or 'images'?
      // The PUT API I just wrote uses `imageFiles = formData.getAll("images")`. 
      // So I should use "images" here.
    } else {
      // If we don't send new images, we might want to preserve old ones. 
      // The logic in PUT: `if (imageFiles.length > 0)`. So if empty, it keeps old `images: updatedImages`.
      // So simply not appending 'images' is fine.
    }

    // Variants
    // We strip `newFiles` and `newPreviews` before sending JSON
    const variantsMetadata = formData.variants.map(({ newFiles, newPreviews, ...rest }) => rest);
    formPayload.append("variants", JSON.stringify(variantsMetadata));

    // Append files
    formData.variants.forEach((variant, index) => {
      if (variant.newFiles && variant.newFiles.length > 0) {
        variant.newFiles.forEach(file => {
          formPayload.append(`variant_${index}_images`, file);
        });
      }
    });

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: formPayload,
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
          {/* NAME */}
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

          {/* PRICE & CATEGORY */}
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

          {/* TAGS */}
          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)}>
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

          {/* DESCRIPTION */}
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

          {/* IMAGE */}
          <div className="form-group">
            <label>Product Image</label>

            {formData.image && (
              <img
                src={formData.image}
                alt="Product"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            )}

            {!showImageInput && (
              <button type="button" onClick={() => setShowImageInput(true)}>
                Change Image
              </button>
            )}

            {showImageInput && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            )}
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

            {formData.variants && formData.variants.map((variant, index) => (
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
                    <label>Variant Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                    />
                  </div>
                  {/* <div className="form-group">
                    <label>Extra Price</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                    />
                  </div> */}
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                    />
                  </div>
                </div>

                {/* Variant Images */}
                <div className="form-group">
                  <label>Variant Images</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                    {/* Existing Images */}
                    {variant.images && variant.images.map((img, imgIdx) => (
                      <div key={imgIdx} style={{ position: "relative", width: "60px", height: "60px" }}>
                        <img
                          src={typeof img === 'string' ? img : img.secure_url}
                          alt="variant"
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeVariantImage(index, imgIdx)}
                          style={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* New Previews */}
                    {variant.newPreviews && variant.newPreviews.map((src, i) => (
                      <img key={`new-${i}`} src={src} alt="new-preview" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "2px solid #2563eb" }} />
                    ))}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleVariantImageChange(index, e)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => router.push("/admin/products")}>
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
