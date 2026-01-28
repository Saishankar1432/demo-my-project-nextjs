import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,
    description: String,
    tags: [String],

    // ✅ MULTIPLE IMAGES (Global fallback)
    images: {
      type: [String],
      default: [],
    },

    // ✅ VARIANTS (New)
    variants: [
      {
        name: { type: String, required: true }, // e.g., "Red", "Small"
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
        images: [
          {
            secure_url: String,
            public_id: String,
            order: Number,
            isDefault: Boolean,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
