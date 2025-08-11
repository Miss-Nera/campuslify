"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentNavBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <h1 className="text-lg font-semibold text-indigo-600">Student Dashboard</h1>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </div>
  );
}