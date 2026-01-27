"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path) => pathname === path;

    const logout = async () => {
        await fetch("/api/login", { method: "DELETE" });
        router.push("/login");
    };

    return (
        <div className="admin-sidebar-inner">
            <h2 className="admin-title">Admin Panel</h2>

            <nav className="admin-nav">
                {/* <Link
                    href="/admin"
                    className={`admin-link ${isActive("/admin") ? "active" : ""}`}
                >
                    Dashboard
                </Link> */}

                <Link
                    href="/admin/products"
                    className={`admin-link ${isActive("/admin/products") ? "active" : ""}`}
                >
                    Products
                </Link>

                <Link
                    href="/admin/products/add"
                    className={`admin-link ${isActive("/admin/products/add") ? "active" : ""}`}
                >
                    Add Product
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}
