"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
   LayoutDashboard,
   Gauge,
   Store,
   FileText,
   Settings,
   Users,
   Fuel,
   DollarSign,
   ChevronLeft,
   ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { Button } from "@/components/ui/button";

interface NavItem {
   title: string;
   href: string;
   icon: React.ComponentType<any>;
   roles?: string[];
}

const navItems: NavItem[] = [
   {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
   },
   {
      title: "Shift Management",
      href: "/dashboard/shift",
      icon: Gauge,
   },
   {
      title: "Store Sales",
      href: "/dashboard/store",
      icon: Store,
   },
   {
      title: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
   },
   {
      title: "Fuel Prices",
      href: "/admin/fuel-prices",
      icon: Fuel,
      roles: ["admin", "manager"],
   },
   {
      title: "Pump Management",
      href: "/admin/pumps",
      icon: DollarSign,
      roles: ["admin", "manager"],
   },
   {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
      roles: ["admin"],
   },
   {
      title: "Settings",
      href: "/settings",
      icon: Settings,
   },
];

export function AppSidebar() {
   const pathname = usePathname();
   const { user } = useAuth();
   const { isOpen, toggle } = useSidebar();

   const filteredNavItems = navItems.filter((item) => {
      if (!item.roles) return true;
      return user?.role && item.roles.includes(user.role);
   });

   return (
      <aside
         className={cn(
            "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300 ease-in-out",
            isOpen ? "w-64" : "w-16"
         )}
      >
         <div className='flex h-full flex-col'>
            {/* Header */}
            <div className='flex h-16 items-center justify-between px-4 border-b'>
               {isOpen && (
                  <div className='flex items-center space-x-2'>
                     <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                        <Fuel className='h-4 w-4 text-primary-foreground' />
                     </div>
                     <span className='font-semibold text-lg'>NJS Mobility</span>
                  </div>
               )}
               <Button
                  variant='ghost'
                  size='icon'
                  onClick={toggle}
                  className='h-8 w-8'
               >
                  {isOpen ? (
                     <ChevronLeft className='h-4 w-4' />
                  ) : (
                     <ChevronRight className='h-4 w-4' />
                  )}
               </Button>
            </div>

            {/* Navigation */}
            <nav className='flex-1 space-y-1 p-4'>
               {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                     pathname === item.href ||
                     pathname.startsWith(item.href + "/");

                  return (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                           "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                           isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground",
                           !isOpen && "justify-center px-2"
                        )}
                     >
                        <Icon className='h-4 w-4 flex-shrink-0' />
                        {isOpen && <span>{item.title}</span>}
                     </Link>
                  );
               })}
            </nav>

            {/* User Info */}
            {isOpen && user && (
               <div className='border-t p-4'>
                  <div className='flex items-center space-x-3'>
                     <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
                        <span className='text-xs font-medium'>
                           {user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </span>
                     </div>
                     <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>
                           {user.full_name}
                        </p>
                        <p className='text-xs text-muted-foreground capitalize'>
                           {user.role.replace("_", " ")}
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </aside>
   );
}
