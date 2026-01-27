import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Admin from "@/models/admin";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectToDB();

    const { email, password } = await request.json();

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ STORE LOGIN INFO
    admin.lastLogin = new Date();
    await admin.save();

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
