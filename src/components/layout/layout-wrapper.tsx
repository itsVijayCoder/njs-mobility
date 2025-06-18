"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface LayoutWrapperProps {
   children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
   const { isAuthenticated } = useAuth();
   const { isOpen } = useSidebar();

   if (!isAuthenticated) {
      return <div className='min-h-screen'>{children}</div>;
   }

   return (
      <div className='min-h-screen bg-background'>
         <AppSidebar />
         <div
            className={cn(
               "transition-all duration-300 ease-in-out",
               isOpen ? "ml-64" : "ml-16"
            )}
         >
            <AppHeader />
            <main className='p-6'>{children}</main>
         </div>
      </div>
   );
}
