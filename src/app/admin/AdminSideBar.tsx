"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-indigo-700 text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <nav className="space-y-2">
        <Link href="/admin/dashboard" className="block hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/students" className="block hover:underline">
          Manage Students
        </Link>
        <Link href="/admin/accommodation" className="block hover:underline">
          Accommodation Requests
        </Link>
        <Link href="/admin/announcement" className="block hover:underline">
          Announcement
        </Link>
        <Link href="/admin/results" className="block hover:underline">
          Manage Results
        </Link>
        <Link href="/admin/calendar" className="block hover:underline">
          Academic Calender
        </Link>
        <Link href="/admin/courseReg" className="block hover:underline">
          Course management
        </Link>
        <Link href="/admin/timetable" className="block hover:underline">
          Edit timetable
        </Link>
         <Link href="/admin/results" className="block hover:underline">
          Upload Result
        </Link>
      </nav>
    </aside>
  );
}
