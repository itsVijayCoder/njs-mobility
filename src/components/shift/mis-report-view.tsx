"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { MISReport, CashDenomination } from "@/types/checkout";

interface MISReportViewProps {
   report: MISReport;
   onDownload?: () => void;
   className?: string;
}

export function MISReportView({
   report,
   onDownload,
   className,
}: MISReportViewProps) {
   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
      }).format(amount);
   };

   const getVarianceColor = (variance: number) => {
      if (variance > 0) return "text-green-600";
      if (variance < 0) return "text-red-600";
      return "text-muted-foreground";
   };

   const getVarianceIcon = (variance: number) => {
      if (variance > 0) return <TrendingUp className='h-4 w-4' />;
      if (variance < 0) return <TrendingDown className='h-4 w-4' />;
      return null;
   };

   const getTotalPayments = () => {
      return (
         report.cash_payments +
         report.card_payments +
         report.upi_payments +
         report.other_payments
      );
   };

   const getTotalDenominations = () => {
      return report.denomination_breakdown.reduce((sum, d) => sum + d.total, 0);
   };

   return (
      <Card className={className}>
         <CardHeader>
            <div className='flex items-center justify-between'>
               <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  MIS Daily Sales Report
               </CardTitle>
               {onDownload && (
                  <Button variant='outline' size='sm' onClick={onDownload}>
                     <Download className='h-4 w-4 mr-2' />
                     Download
                  </Button>
               )}
            </div>
            <div className='text-sm text-muted-foreground'>
               Date:{" "}
               {new Date(report.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
               })}
            </div>
         </CardHeader>
         <CardContent className='space-y-6'>
            {/* Executive Summary */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
               <Card className='bg-primary/5 border-primary/20'>
                  <CardContent className='p-4'>
                     <div className='text-sm text-muted-foreground'>
                        Net Sales
                     </div>
                     <div className='text-2xl font-bold'>
                        {formatCurrency(report.net_sales)}
                     </div>
                  </CardContent>
               </Card>
               <Card className='bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'>
                  <CardContent className='p-4'>
                     <div className='text-sm text-muted-foreground'>
                        Total Payments
                     </div>
                     <div className='text-2xl font-bold'>
                        {formatCurrency(getTotalPayments())}
                     </div>
                  </CardContent>
               </Card>
               <Card
                  className={`${
                     report.total_variance >= 0
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                  }`}
               >
                  <CardContent className='p-4'>
                     <div className='text-sm text-muted-foreground'>
                        Variance
                     </div>
                     <div
                        className={`text-2xl font-bold flex items-center gap-1 ${getVarianceColor(
                           report.total_variance
                        )}`}
                     >
                        {getVarianceIcon(report.total_variance)}
                        {formatCurrency(Math.abs(report.total_variance))}
                     </div>
                     <div className='text-xs text-muted-foreground'>
                        {report.total_variance > 0
                           ? "Excess"
                           : report.total_variance < 0
                           ? "Short"
                           : "Balanced"}
                     </div>
                  </CardContent>
               </Card>
               <Card className='bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'>
                  <CardContent className='p-4'>
                     <div className='text-sm text-muted-foreground'>
                        Reconciliation
                     </div>
                     <div className='text-2xl font-bold'>
                        <Badge
                           variant={
                              report.total_variance === 0
                                 ? "default"
                                 : "secondary"
                           }
                        >
                           {report.total_variance === 0
                              ? "Balanced"
                              : "Pending"}
                        </Badge>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Separator />

            {/* Payment Breakdown */}
            <div>
               <h3 className='font-semibold mb-4'>Payment Mode Breakdown</h3>
               <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='space-y-2'>
                     <div className='text-sm text-muted-foreground'>
                        Cash Payments
                     </div>
                     <div className='text-lg font-semibold'>
                        {formatCurrency(report.cash_payments)}
                     </div>
                     <div className='text-xs text-muted-foreground'>
                        {(
                           (report.cash_payments / getTotalPayments()) *
                           100
                        ).toFixed(1)}
                        %
                     </div>
                  </div>
                  <div className='space-y-2'>
                     <div className='text-sm text-muted-foreground'>
                        Card Payments
                     </div>
                     <div className='text-lg font-semibold'>
                        {formatCurrency(report.card_payments)}
                     </div>
                     <div className='text-xs text-muted-foreground'>
                        {(
                           (report.card_payments / getTotalPayments()) *
                           100
                        ).toFixed(1)}
                        %
                     </div>
                  </div>
                  <div className='space-y-2'>
                     <div className='text-sm text-muted-foreground'>
                        UPI Payments
                     </div>
                     <div className='text-lg font-semibold'>
                        {formatCurrency(report.upi_payments)}
                     </div>
                     <div className='text-xs text-muted-foreground'>
                        {(
                           (report.upi_payments / getTotalPayments()) *
                           100
                        ).toFixed(1)}
                        %
                     </div>
                  </div>
                  <div className='space-y-2'>
                     <div className='text-sm text-muted-foreground'>
                        Other Payments
                     </div>
                     <div className='text-lg font-semibold'>
                        {formatCurrency(report.other_payments)}
                     </div>
                     <div className='text-xs text-muted-foreground'>
                        {(
                           (report.other_payments / getTotalPayments()) *
                           100
                        ).toFixed(1)}
                        %
                     </div>
                  </div>
               </div>
            </div>

            <Separator />

            {/* Fuel Prices */}
            <div>
               <h3 className='font-semibold mb-4'>Today's Fuel Prices</h3>
               <div className='grid grid-cols-2 gap-4'>
                  <Card className='bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'>
                     <CardContent className='p-4'>
                        <div className='text-sm text-muted-foreground'>
                           Petrol (MS)
                        </div>
                        <div className='text-xl font-bold'>
                           ₹{report.fuel_prices.MS.toFixed(2)}/L
                        </div>
                     </CardContent>
                  </Card>
                  <Card className='bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'>
                     <CardContent className='p-4'>
                        <div className='text-sm text-muted-foreground'>
                           Diesel (HSD)
                        </div>
                        <div className='text-xl font-bold'>
                           ₹{report.fuel_prices.HSD.toFixed(2)}/L
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>

            <Separator />

            {/* Cash Denominations */}
            <div>
               <h3 className='font-semibold mb-4'>
                  Cash Denomination Breakdown
               </h3>
               <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                  {report.denomination_breakdown
                     .filter((d) => d.count > 0)
                     .sort((a, b) => b.denomination - a.denomination)
                     .map((denomination) => (
                        <div
                           key={denomination.denomination}
                           className='text-center space-y-1'
                        >
                           <div className='text-sm font-medium'>
                              ₹{denomination.denomination}
                           </div>
                           <div className='text-xs text-muted-foreground'>
                              {denomination.count} notes
                           </div>
                           <div className='text-sm font-semibold'>
                              ₹{denomination.total}
                           </div>
                        </div>
                     ))}
               </div>
               <div className='mt-3 text-right'>
                  <span className='text-sm text-muted-foreground'>
                     Total Cash Count:{" "}
                  </span>
                  <span className='font-semibold'>
                     {formatCurrency(getTotalDenominations())}
                  </span>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
