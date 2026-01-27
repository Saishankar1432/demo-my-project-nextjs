import "@/app/(admin)/admin/admin.css";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Sidebar />
            </aside>

            <div className="admin-main">
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
