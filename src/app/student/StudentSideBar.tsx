"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "student" | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Marks hydration complete

    const student = localStorage.getItem("studentProfile");
    const admin = localStorage.getItem("adminProfile");

    if (admin) setRole("admin");
    else if (student) setRole("student");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("adminProfile");
    window.location.href = "/";
  };

  if (!hasMounted) return null; // Avoid rendering before hydration

  const commonLinks = [
    { label: "Courses", href: "/student/courseReg" },
    { label: "Payment", href: "/student/payment" },
      { label: "Results", href: "/student/results" },
  ];

  const studentLinks = [
    { label: "Accommodation", href: "/student/accommodation" },
    { label: "Announcements", href: "/student/announcement" },
    { label: "Calendar", href: "/student/calendar" },
    { label: "Timetable", href: "/student/timetable" },
  ];

  const adminLinks = [
    { label: "Manage Students", href: "/admin/students" },
    { label: "Payment Records", href: "/admin/payments" },
    { label: "Reports", href: "/admin/reports" },
  ];

  const linksToRender =
    role === "admin"
      ? [...adminLinks, ...commonLinks]
      : [...studentLinks, ...commonLinks];

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <div className="flex flex-col gap-4 m-4">
          {linksToRender.map(({ label, href }) => (
            <Button
              key={href}
              asChild
              variant="sidebar"
              className={cn(
                "justify-start",
                pathname === href &&
                  "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-white"
              )}
            >
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 dark:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
