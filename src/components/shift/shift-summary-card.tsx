"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
   Clock,
   Users,
   DollarSign,
   TrendingUp,
   CheckCircle,
   AlertCircle,
   Eye,
   Edit,
} from "lucide-react";
import { ShiftSummary } from "@/types/checkout";

interface ShiftSummaryCardProps {
   summary: ShiftSummary;
   onView?: () => void;
   onEdit?: () => void;
   className?: string;
}

export function ShiftSummaryCard({
   summary,
   onView,
   onEdit,
   className,
}: ShiftSummaryCardProps) {
   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
      }).format(amount);
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "ongoing":
            return "bg-blue-500";
         case "completed":
            return "bg-green-500";
         case "verified":
            return "bg-purple-500";
         default:
            return "bg-gray-500";
      }
   };

   const getStatusBadge = (status: string) => {
      switch (status) {
         case "ongoing":
            return (
               <Badge className='bg-blue-500 hover:bg-blue-600'>Ongoing</Badge>
            );
         case "completed":
            return (
               <Badge className='bg-green-500 hover:bg-green-600'>
                  Completed
               </Badge>
            );
         case "verified":
            return (
               <Badge className='bg-purple-500 hover:bg-purple-600'>
                  Verified
               </Badge>
            );
         default:
            return <Badge variant='secondary'>Unknown</Badge>;
      }
   };

   const getVarianceColor = (variance: number) => {
      if (variance > 0) return "text-green-600";
      if (variance < 0) return "text-red-600";
      return "text-muted-foreground";
   };

   const getVarianceIcon = (variance: number) => {
      if (variance > 0) return <TrendingUp className='h-4 w-4' />;
      if (variance < 0) return <AlertCircle className='h-4 w-4' />;
      return <CheckCircle className='h-4 w-4' />;
   };

   const getCompletionPercentage = () => {
      return (
         (summary.completed_checkouts / summary.total_checkout_sheets) * 100
      );
   };

   const getTotalSales = () => {
      return summary.total_fuel_sales + summary.total_store_sales;
   };

   const getTotalCollections = () => {
      return summary.total_cash_collections + summary.total_digital_payments;
   };

   return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
         <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
               <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  Shift {summary.shift_number}
               </CardTitle>
               {getStatusBadge(summary.status)}
            </div>
            <div className='text-sm text-muted-foreground'>
               {new Date(summary.shift_date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
               })}
            </div>
         </CardHeader>
         <CardContent className='space-y-4'>
            {/* Progress */}
            <div>
               <div className='flex items-center justify-between text-sm mb-2'>
                  <span className='text-muted-foreground'>
                     Checkout Progress
                  </span>
                  <span className='font-medium'>
                     {summary.completed_checkouts}/
                     {summary.total_checkout_sheets}
                  </span>
               </div>
               <Progress value={getCompletionPercentage()} className='h-2' />
            </div>

            {/* Key Metrics */}
            <div className='grid grid-cols-2 gap-3'>
               <div className='space-y-1'>
                  <div className='text-xs text-muted-foreground'>
                     Total Sales
                  </div>
                  <div className='font-semibold text-sm'>
                     {formatCurrency(getTotalSales())}
                  </div>
               </div>
               <div className='space-y-1'>
                  <div className='text-xs text-muted-foreground'>
                     Collections
                  </div>
                  <div className='font-semibold text-sm'>
                     {formatCurrency(getTotalCollections())}
                  </div>
               </div>
               <div className='space-y-1'>
                  <div className='text-xs text-muted-foreground'>
                     Fuel Sales
                  </div>
                  <div className='font-semibold text-sm'>
                     {formatCurrency(summary.total_fuel_sales)}
                  </div>
               </div>
               <div className='space-y-1'>
                  <div className='text-xs text-muted-foreground'>
                     Store Sales
                  </div>
                  <div className='font-semibold text-sm'>
                     {formatCurrency(summary.total_store_sales)}
                  </div>
               </div>
            </div>

            {/* Payment Breakdown */}
            <div className='grid grid-cols-2 gap-3'>
               <div className='space-y-1'>
                  <div className='text-xs text-muted-foreground flex items-center gap-1'>
                     <DollarSign className='h-3 w-3' />
                     Cash
                  </div>
                  <div className='font-semibold text-sm'>
                     {formatCurrency(summary.total_cash_collections)}
                  </div>
               </div>
               <div className='space-y-1'>
                  <div className='text-xs text-muted-foreground flex items-center gap-1'>
                     <Users className='h-3 w-3' />
                     Digital
                  </div>
                  <div className='font-semibold text-sm'>
                     {formatCurrency(summary.total_digital_payments)}
                  </div>
               </div>
            </div>

            {/* Variance */}
            <div className='flex items-center justify-between p-2 rounded-md bg-muted'>
               <div className='text-sm text-muted-foreground'>Net Variance</div>
               <div
                  className={`flex items-center gap-1 font-semibold text-sm ${getVarianceColor(
                     summary.net_variance
                  )}`}
               >
                  {getVarianceIcon(summary.net_variance)}
                  {formatCurrency(Math.abs(summary.net_variance))}
                  {summary.net_variance > 0
                     ? " Excess"
                     : summary.net_variance < 0
                     ? " Short"
                     : ""}
               </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2 pt-2'>
               {onView && (
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={onView}
                     className='flex-1'
                  >
                     <Eye className='h-4 w-4 mr-1' />
                     View
                  </Button>
               )}
               {onEdit && summary.status !== "verified" && (
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={onEdit}
                     className='flex-1'
                  >
                     <Edit className='h-4 w-4 mr-1' />
                     Edit
                  </Button>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
