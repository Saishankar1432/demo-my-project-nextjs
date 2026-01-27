import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const AdminSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema, "myproject");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "sample_mflix",
        });

        const existingAdmin = await Admin.findOne({
            email: "admin@example.com",
        });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("Email:", existingAdmin.email);
            process.exit(0);
        }

        const admin = new Admin({
            email: "admin@example.com",
            password: "admin123",
        });

        await admin.save();

        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@example.com");
        console.log("Password: admin123");
        console.log("\n⚠️  IMPORTANT: Change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();
