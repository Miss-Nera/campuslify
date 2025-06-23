import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

const AppNavBar = () => {
    return (
        <div className="flex items-center justify-between px-3 py-1 bg-white shadow">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <SidebarTrigger className="size-3" />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/home">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/home/about">About</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default AppNavBar
