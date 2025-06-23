import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <div className="flex flex-col gap-4 m-4">
          <Button asChild variant="sidebar">
            <Link href="/home/accomodation">Accomodation</Link>
          </Button>
          <Button asChild variant="sidebar">
            <Link href="/home/student">Student Info</Link>
          </Button>
          <Button asChild variant="sidebar">
            <Link href="/home/payment">Payment</Link>
          </Button>
          <Button asChild variant="sidebar">
            <Link href="/home/info">Info</Link>
          </Button>
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
