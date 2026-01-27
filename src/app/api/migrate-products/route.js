import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product";

export async function GET() {
    try {
        await connectToDB();

        const productsToMigrate = await Product.find({
            $or: [
                { category: { $exists: false } },
                { category: null },
                { category: "" },
                { tags: { $exists: false } },
                { tags: null },
            ],
        });

        if (productsToMigrate.length === 0) {
            return NextResponse.json({
                success: true,
                message: "All products are already up to date!",
                migratedCount: 0,
            });
        }

        const migratedProducts = [];
        for (const product of productsToMigrate) {
            const updates = {};
            if (!product.category || product.category === "") {
                updates.category = "Uncategorized";
            }

            if (!product.tags || !Array.isArray(product.tags)) {
                updates.tags = [];
            }
            const updated = await Product.findByIdAndUpdate(
                product._id,
                updates,
                { new: true }
            );

            migratedProducts.push({
                id: product._id,
                name: product.name,
                updates,
            });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully migrated ${migratedProducts.length} products`,
            migratedCount: migratedProducts.length,
            products: migratedProducts,
        });

    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Migration failed",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
