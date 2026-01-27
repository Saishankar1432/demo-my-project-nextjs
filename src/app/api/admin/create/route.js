import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Admin from "@/models/admin";
import bcrypt from "bcryptjs";

export async function POST() {
    await connectToDB();

    const email = "admin@gmail.com";
    const password = "admin";

    await Admin.deleteMany({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
        email,
        password: hashedPassword,
    });

    return NextResponse.json({
        message: "Admin created successfully",
        email,
        password,
    });
}
