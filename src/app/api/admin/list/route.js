import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Admin from "@/models/admin";

export async function GET() {
    try {
        await connectToDB();

        // Get all admin users (without passwords for security)
        const admins = await Admin.find({}, { password: 0 });

        return NextResponse.json({
            success: true,
            count: admins.length,
            admins: admins,
        });
    } catch (error) {
        console.error("Error fetching admins:", error);
        return NextResponse.json(
            { message: "Failed to fetch admin users", error: error.message },
            { status: 500 }
        );
    }
}
