"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return (
         <div className='min-h-screen flex items-center justify-center'>
            <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
         </div>
      );
   }

   if (!isAuthenticated) {
      redirect("/login");
   }

   return <DashboardOverview />;
}
