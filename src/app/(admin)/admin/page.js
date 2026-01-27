"use client"
import { useRouter } from "next/navigation";

export default function Admin() {
    const router = useRouter();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Hello Admin</p>
            <button onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
        </div>
    );
}
