import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product";

export async function GET(req, context) {
    try {
        await connectToDB();

        const { id } = await context.params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("GET product error:", error);
        return NextResponse.json(
            { message: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PUT(req, context) {
    try {
        await connectToDB();

        const { id } = await context.params;
        const body = await req.json();

        console.log("📝 Updating product:", id, "with data:", { tags: body.tags, tagsType: typeof body.tags });

        if (body.tags !== undefined) {
            if (typeof body.tags === "string" && body.tags.trim() !== "") {
                body.tags = body.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
            } else if (typeof body.tags === "string" && body.tags.trim() === "") {
                body.tags = [];
            } else if (!Array.isArray(body.tags)) {
                body.tags = [];
            }
        }

        console.log("🏷️ Processed tags for update:", body.tags);

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        console.log("✅ Product updated:", { id: updatedProduct._id, tags: updatedProduct.tags });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("UPDATE product error:", error);
        return NextResponse.json(
            { message: "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, context) {
    try {
        await connectToDB();

        const { id } = await context.params;

        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE product error:", error);
        return NextResponse.json(
            { message: "Failed to delete product" },
            { status: 500 }
        );
    }
}
