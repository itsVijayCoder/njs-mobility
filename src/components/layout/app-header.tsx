"use client";

import React from "react";
import { Bell, Search, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
   const { user, logout } = useAuth();
   const { theme, setTheme } = useTheme();

   const handleLogout = async () => {
      try {
         await logout();
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   const toggleTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
   };

   return (
      <header className='sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6'>
         {/* Search */}
         <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input type='search' placeholder='Search...' className='pl-8' />
         </div>

         <div className='flex items-center gap-2'>
            {/* Current Date */}
            <div className='hidden sm:flex items-center text-sm text-muted-foreground'>
               {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
               })}
            </div>

            {/* Theme Toggle */}
            <Button
               variant='ghost'
               size='icon'
               onClick={toggleTheme}
               className='h-8 w-8'
            >
               <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
               <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
               <span className='sr-only'>Toggle theme</span>
            </Button>

            {/* Notifications */}
            <Button variant='ghost' size='icon' className='h-8 w-8 relative'>
               <Bell className='h-4 w-4' />
               <Badge
                  variant='destructive'
                  className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs'
               >
                  3
               </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant='ghost'
                     className='relative h-8 w-8 rounded-full'
                  >
                     <Avatar className='h-8 w-8'>
                        <AvatarFallback>
                           {user?.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </AvatarFallback>
                     </Avatar>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                     <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                           {user?.full_name}
                        </p>
                        <p className='text-xs leading-none text-muted-foreground'>
                           {user?.email}
                        </p>
                        <Badge variant='secondary' className='w-fit mt-1'>
                           {user?.role.replace("_", " ")}
                        </Badge>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     onClick={handleLogout}
                     className='text-red-600'
                  >
                     <LogOut className='mr-2 h-4 w-4' />
                     <span>Log out</span>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </header>
   );
}
