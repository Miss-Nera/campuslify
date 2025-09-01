// app/admin/AdminNavBar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminNavBar() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 shrink-0 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: trigger + title */}
        <div className="flex items-center gap-3">
          {/* ✅ Use SidebarTrigger alone; do not wrap a Menu icon inside */}
          <SidebarTrigger className="text-indigo-600" />
          <h1 className="text-xl font-bold text-indigo-600">Admin Dashboard</h1>
        </div>

        {/* Right: avatar */}
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
