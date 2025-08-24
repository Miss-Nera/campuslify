"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

export default function StudentSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student"> Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/announcement">Announcements</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/payment">Payments</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/accommodation"> Hostel</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

<SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/calendar">Academic Calendar</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

<SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/courseReg">Course Reg</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

<SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/results"> Results</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

<SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/timetable">Timetable</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/settings">Settings</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
