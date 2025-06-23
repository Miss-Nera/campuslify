import { SidebarContent, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from '../components/app-sidebar'
import AppNavBar from '../components/app-navbar'
type Props = {
  children: React.ReactNode
}
const HomeLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
         <AppSidebar /> 
         <SidebarContent>

        <main className='mx-4 mt-1 rounded-md'>
          <div className="flex flex-col"> 
           <AppNavBar />
          </div>
        </main>
        <div className="m-4">
         {children}
        </div>
         </SidebarContent> 
       </SidebarProvider>
    )
}

export default HomeLayout