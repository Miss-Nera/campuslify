"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function StudentNavBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
      {/* Left Section with Sidebar Trigger + Title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-6 w-6 text-indigo-600 cursor-pointer" />
        </SidebarTrigger>
        <h1 className="text-lg font-semibold text-indigo-600">
          Student Dashboard
        </h1>
      </div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </div>
  );
}