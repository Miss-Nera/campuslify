"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import StudentNavBar from "./StudentNavBar";
import { AppSidebar } from "./StudentSideBar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
        {/* Sidebar */}
        <AppSidebar />

         <div className="flex-1 flex flex-col">
               {/* Navbar */}
               <StudentNavBar />

          {/* Page content fills the rest */}
          <main className="flex-1 p-6">{children} </main>
          </div>
      </div>
    </SidebarProvider>
  );
}
