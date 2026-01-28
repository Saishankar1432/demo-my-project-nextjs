import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { uploadToCloudinary } from "@/lib/cloudinary";

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
                    { tags: { $in: [regex] } },
                ],
            };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error("GET products error:", error);
        return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
    }
}

/* ===================== CREATE PRODUCT ===================== */
export async function POST(req) {
    try {
        await connectToDB();

        const formData = await req.formData();

        const name = formData.get("name");
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const description = formData.get("description");
        const tags = JSON.parse(formData.get("tags") || "[]");
        const imageFiles = formData.getAll("images");

        const variantsData = JSON.parse(formData.get("variants") || "[]");

        if (!name || !price) {
            return NextResponse.json(
                { message: "Name and price are required" },
                { status: 400 }
            );
        }

        const globalImages = [];
        // Handle Global Images
        for (const imageFile of imageFiles) {
            if (imageFile?.size > 0) {
                const buffer = Buffer.from(await imageFile.arrayBuffer());
                const url = await uploadToCloudinary(buffer, "products");
                globalImages.push(url);
            }
        }

        // Handle Variants & Their Images
        const processedVariants = [];
        console.log("Processing variants:", variantsData.length);

        for (let i = 0; i < variantsData.length; i++) {
            const variant = variantsData[i];
            const variantImages = [];

            // Get files for this variant index (convention: variant_0_images, variant_1_images...)
            const variantFiles = formData.getAll(`variant_${i}_images`);
            console.log(`Variant ${i} files:`, variantFiles.length);

            for (const file of variantFiles) {
                if (file?.size > 0) {
                    try {
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const url = await uploadToCloudinary(buffer, "products/variants");
                        variantImages.push({
                            secure_url: url,
                            public_id: "",
                            order: 0,
                            isDefault: variantImages.length === 0
                        });
                    } catch (uploadErr) {
                        console.error(`Failed to upload variant image ${i}:`, uploadErr);
                    }
                }
            }

            // Push even if no images, but include the array
            processedVariants.push({
                ...variant,
                images: variantImages
            });
        }

        console.log("Final Processed Variants:", JSON.stringify(processedVariants));

        const product = await Product.create({
            name,
            price,
            category,
            description,
            tags,
            images: globalImages,
            variants: processedVariants,
        });

        console.log("Product created with variants:", JSON.stringify(product, null, 2));

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("POST product error:", error);
        return NextResponse.json(
            { message: "Failed to create product" },
            { status: 500 }
        );
    }
}
