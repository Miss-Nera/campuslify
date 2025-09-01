// app/admin/layout.tsx
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminNavBar from "./AdminNavBar";
import AdminSidebar from "./AdminSideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Left: Sidebar controls its own width */}
      <AdminSidebar />

      {/* Right: Inset handles spacing next to sidebar */}
      <SidebarInset className="flex min-h-screen flex-1 flex-col">
        {/* Navbar stays at the top with fixed height */}
        <AdminNavBar />

        {/* Page content scrolls; navbar doesn’t shrink */}
        <main className="flex-1 min-h-0 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
