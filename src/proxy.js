import { NextResponse } from "next/server";

export default function proxy(req) {
    const isAdmin = req.cookies.get("admin");

    if (!isAdmin) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};
