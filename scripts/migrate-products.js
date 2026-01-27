import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: String,
        image: String,
        category: { type: String, default: "Uncategorized" },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function migrateProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const productsToMigrate = await Product.find({
            $or: [
                { category: { $exists: false } },
                { category: null },
                { category: "" },
                { tags: { $exists: false } },
                { tags: null },
            ],
        });

        console.log(`📊 Found ${productsToMigrate.length} products to migrate\n`);

        if (productsToMigrate.length === 0) {
            console.log("✨ All products are already up to date!");
            await mongoose.connection.close();
            return;
        }

        let migratedCount = 0;
        for (const product of productsToMigrate) {
            const updates = {};
            if (!product.category || product.category === "") {
                updates.category = "Uncategorized";
            }

            if (!product.tags || !Array.isArray(product.tags)) {
                updates.tags = [];
            }
            await Product.findByIdAndUpdate(product._id, updates);

            console.log(`✅ Migrated: ${product.name}`);
            console.log(`   - Category: ${updates.category || product.category}`);
            console.log(`   - Tags: ${JSON.stringify(updates.tags || product.tags)}\n`);

            migratedCount++;
        }

        console.log(`\n🎉 Migration complete! Updated ${migratedCount} products.`);

        await mongoose.connection.close();

    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrateProducts();
