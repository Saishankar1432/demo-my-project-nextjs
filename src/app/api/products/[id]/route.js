import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { uploadToCloudinary } from "@/lib/cloudinary";

/* ===================== GET PRODUCT ===================== */
export async function GET(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET product error:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

/* ===================== UPDATE PRODUCT ===================== */
export async function PUT(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const formData = await req.formData();

    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const description = formData.get("description");
    const tags = JSON.parse(formData.get("tags") || "[]");
    const imageFiles = formData.getAll("images");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    let updatedImages = product.images;

    // Handle Global Images
    if (imageFiles.length > 0 && imageFiles[0]?.size > 0) {
      updatedImages = [];
      for (const imageFile of imageFiles) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const url = await uploadToCloudinary(buffer, "products");
        updatedImages.push(url);
      }
    }

    // Handle Variants
    const variantsData = JSON.parse(formData.get("variants") || "[]");
    const processedVariants = [];

    // We need to merge existing variant images if no new ones are provided,
    // or handle new uploads.
    // For simplicity: If new images provided for a variant index, replace/add them.
    // If not, keep existing images from the passed variant data (which should contain secure_url).

    for (let i = 0; i < variantsData.length; i++) {
      const variant = variantsData[i];
      let variantImages = variant.images || [];

      // Check for new files
      const variantFiles = formData.getAll(`variant_${i}_images`);

      if (variantFiles.length > 0 && variantFiles[0]?.size > 0) {
        // New images uploaded for this variant
        // For now, let's append or replace? 
        // The requirement says "Allow uploading multiple images... Allow image reordering".
        // Since this is a simple implementation, if files are sent, we might treat it as "adding" or "replacing". 
        // Let's assume replacement for simplicity or add to existing if we want to be fancy.
        // Given the add logic, let's treat uploaded files as "these are the new images to add". 
        // If the user wants to keep old ones, they should be in the `variant.images` array passed back 
        // (but we can't upload URL strings as files).
        // So: We'll upload new files and use the resulting URLs.
        // If the user deleted images in UI, the `variant.images` would be filtered.
        // We'll combine `variant.images` (existing URLs) + new uploaded URLs.

        const newUploadedImages = [];
        for (const file of variantFiles) {
          if (file?.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const url = await uploadToCloudinary(buffer, "products/variants");
            newUploadedImages.push({
              secure_url: url,
              public_id: "",
              order: 0,
              isDefault: false
            });
          }
        }
        variantImages = [...variantImages, ...newUploadedImages];
      }

      processedVariants.push({
        ...variant,
        images: variantImages
      });
    }

    await Product.findByIdAndUpdate(id, {
      name,
      price,
      category,
      description,
      tags,
      images: updatedImages,
      variants: processedVariants,
    });

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("UPDATE product error:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

/* ===================== DELETE PRODUCT ===================== */
export async function DELETE(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
