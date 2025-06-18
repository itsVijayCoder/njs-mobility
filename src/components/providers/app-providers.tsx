"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { Toaster } from "sonner";

interface AppProvidersProps {
   children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
   // Create QueryClient inside the client component to avoid SSR issues
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  retry: 1,
                  refetchOnWindowFocus: false,
                  staleTime: 5 * 60 * 1000, // 5 minutes
               },
            },
         })
   );

   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider defaultTheme='system' storageKey='njs-ui-theme'>
            <AuthProvider>
               <SidebarProvider>
                  {children}
                  <Toaster
                     position='top-right'
                     toastOptions={{
                        style: {
                           background: "hsl(var(--background))",
                           color: "hsl(var(--foreground))",
                           border: "1px solid hsl(var(--border))",
                        },
                     }}
                  />
               </SidebarProvider>
            </AuthProvider>
         </ThemeProvider>
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}
