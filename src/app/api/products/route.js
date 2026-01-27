import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product";

export async function GET(request) {
    try {
        await connectToDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        let filter = {};

        if (query) {
            const regex = new RegExp(query, "i");

            filter = {
                $or: [
                    { name: regex },
                    { description: regex },
                    { category: regex },
                    { tags: { $in: [regex] } }
                ]
            };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("GET products error:", error);
        return NextResponse.json(
            { message: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectToDB();
        const body = await request.json();

        const { name, price, description, image, category, tags } = body;

        console.log("📝 Received product data:", { name, price, category, tags, tagsType: typeof tags });

        if (!name || !price) {
            return NextResponse.json(
                { message: "Name and price are required" },
                { status: 400 }
            );
        }

        // Convert tags to array if it's a string
        let tagsArray = [];
        if (tags) {
            if (typeof tags === "string" && tags.trim() !== "") {
                tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
            } else if (Array.isArray(tags)) {
                tagsArray = tags;
            }
        }

        console.log("🏷️ Processed tags array:", tagsArray);

        const product = await Product.create({
            name,
            price,
            description,
            image,
            category: category || "Uncategorized",
            tags: tagsArray,
        });

        console.log("✅ Product created:", { id: product._id, tags: product.tags });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("POST product error:", error);
        return NextResponse.json(
            { message: "Failed to create product" },
            { status: 500 }
        );
    }
}
