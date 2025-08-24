"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function AdminNavBar() {
  return (
   <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
     <SidebarTrigger>
          <Menu className="h-6 w-6 text-indigo-600 cursor-pointer" />
        </SidebarTrigger>
      {/* Title */}
      <h1 className="text-lg font-semibold text-indigo-600">Admin Dashboard</h1>

      {/* Profile Avatar */}
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </div>
  );
}
