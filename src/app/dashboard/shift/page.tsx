"use client";

import React, { useState } from "react";
import { Plus, Filter, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { ShiftSummaryCard } from "@/components/shift/shift-summary-card";
import { useShifts } from "@/hooks/use-shifts";
import { Shift } from "@/types/shift";
import { ShiftSummary } from "@/types/checkout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShiftManagementPage() {
   const router = useRouter();
   const [filters, setFilters] = useState({
      status: "all",
      operator_id: "all",
      date: "",
   });

   const { data: shifts = [], isLoading, error } = useShifts(filters);

   // Transform shifts to shift summaries
   const shiftSummaries: ShiftSummary[] = shifts.map((shift: Shift) => ({
      shift_id: shift.id,
      shift_number: shift.shift_number,
      shift_date: shift.shift_date,
      total_checkout_sheets: 4, // Fixed 4 checkout sheets per shift
      completed_checkouts:
         shift.status === "completed" ? 4 : shift.status === "ongoing" ? 2 : 0,
      total_fuel_sales: shift.total_fuel_sales,
      total_store_sales: shift.total_store_sales,
      total_cash_collections: shift.total_cash,
      total_digital_payments: shift.total_digital,
      net_variance: shift.variance,
      status: shift.status,
   }));

   const getStatusBadge = (status: string) => {
      switch (status) {
         case "ongoing":
            return <Badge variant='default'>Ongoing</Badge>;
         case "completed":
            return <Badge variant='secondary'>Completed</Badge>;
         case "verified":
            return <Badge variant='outline'>Verified</Badge>;
         default:
            return <Badge variant='destructive'>Unknown</Badge>;
      }
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
      }).format(amount);
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-IN", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const formatTime = (timeString: string) => {
      return new Date(timeString).toLocaleTimeString("en-IN", {
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   if (isLoading) {
      return (
         <div className='space-y-4'>
            <div className='h-8 bg-muted animate-pulse rounded'></div>
            <div className='h-64 bg-muted animate-pulse rounded'></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='text-center text-red-600'>
            Error loading shifts: {error.message}
         </div>
      );
   }

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold tracking-tight'>
                  Shift Management
               </h1>
               <p className='text-muted-foreground'>
                  Manage daily shifts and track operator performance
               </p>
            </div>
            <div className='flex items-center space-x-2'>
               <Button variant='outline'>
                  <Download className='h-4 w-4 mr-2' />
                  Export
               </Button>
               <Link href='/dashboard/shift/new'>
                  <Button>
                     <Plus className='h-4 w-4 mr-2' />
                     New Shift
                  </Button>
               </Link>
            </div>
         </div>

         {/* Filters */}
         <Card>
            <CardHeader>
               <CardTitle className='text-lg flex items-center'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filters
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className='grid gap-4 md:grid-cols-4'>
                  <div>
                     <Input
                        placeholder='Search by date...'
                        type='date'
                        value={filters.date}
                        onChange={(e) =>
                           setFilters((prev) => ({
                              ...prev,
                              date: e.target.value,
                           }))
                        }
                     />
                  </div>
                  <div>
                     <Select
                        value={filters.status}
                        onValueChange={(value) =>
                           setFilters((prev) => ({ ...prev, status: value }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder='Filter by status' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='all'>All Statuses</SelectItem>
                           <SelectItem value='ongoing'>Ongoing</SelectItem>
                           <SelectItem value='completed'>Completed</SelectItem>
                           <SelectItem value='verified'>Verified</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Select
                        value={filters.operator_id}
                        onValueChange={(value) =>
                           setFilters((prev) => ({
                              ...prev,
                              operator_id: value,
                           }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder='Filter by operator' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='all'>All Operators</SelectItem>
                           <SelectItem value='3'>Shift Operator 1</SelectItem>
                           <SelectItem value='4'>Shift Operator 2</SelectItem>
                           <SelectItem value='5'>Shift Operator 3</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Button
                        variant='outline'
                        onClick={() =>
                           setFilters({
                              status: "all",
                              operator_id: "all",
                              date: "",
                           })
                        }
                        className='w-full'
                     >
                        Clear Filters
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Shifts Grid */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {shiftSummaries.map((summary) => (
               <ShiftSummaryCard
                  key={summary.shift_id}
                  summary={summary}
                  onView={() =>
                     router.push(`/dashboard/shift/${summary.shift_id}`)
                  }
                  onEdit={() =>
                     router.push(`/dashboard/shift/${summary.shift_id}`)
                  }
               />
            ))}
         </div>

         {shiftSummaries.length === 0 && (
            <Card>
               <CardContent className='flex flex-col items-center justify-center py-12'>
                  <div className='text-center'>
                     <h3 className='text-lg font-medium mb-2'>
                        No shifts found
                     </h3>
                     <p className='text-muted-foreground mb-4'>
                        {filters.date ||
                        filters.status !== "all" ||
                        filters.operator_id !== "all"
                           ? "Try adjusting your filters to see more shifts"
                           : "Get started by creating your first shift"}
                     </p>
                     {filters.date === "" &&
                        filters.status === "all" &&
                        filters.operator_id === "all" && (
                           <Link href='/dashboard/shift/new'>
                              <Button>
                                 <Plus className='h-4 w-4 mr-2' />
                                 Start First Shift
                              </Button>
                           </Link>
                        )}
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
