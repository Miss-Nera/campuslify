"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import StudentNavBar from "./StudentNavBar";
import StudentSidebar from "./StudentSideBar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <StudentSidebar />

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <StudentNavBar />

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
