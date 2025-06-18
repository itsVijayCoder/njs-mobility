"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useCreateShift } from "@/hooks/use-shifts";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import Link from "next/link";

export default function NewShiftPage() {
   const router = useRouter();
   const { user } = useAuth();
   const createShiftMutation = useCreateShift();

   const [formData, setFormData] = useState({
      shift_date: new Date().toISOString().split("T")[0],
      shift_number: 1,
      operator_id: user?.id || "",
      start_time: new Date().toISOString().slice(0, 16),
      notes: "",
   });

   const handleInputChange = (field: string, value: string | number) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const shiftData = {
            ...formData,
            status: "ongoing" as const,
            total_fuel_sales: 0,
            total_store_sales: 0,
            total_cash: 0,
            total_digital: 0,
            variance: 0,
            readings: [],
            payments: [],
            store_sales: [],
         };

         await createShiftMutation.mutateAsync(shiftData);
         toast.success("Shift created successfully");
         router.push("/dashboard/shift");
      } catch (error) {
         toast.error("Failed to create shift");
      }
   };

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center space-x-4'>
            <Link href='/dashboard/shift'>
               <Button variant='outline' size='icon'>
                  <ArrowLeft className='h-4 w-4' />
               </Button>
            </Link>
            <div>
               <h1 className='text-3xl font-bold tracking-tight'>New Shift</h1>
               <p className='text-muted-foreground'>
                  Create a new shift to start tracking fuel and store sales
               </p>
            </div>
         </div>

         {/* Form */}
         <Card>
            <CardHeader>
               <CardTitle>Shift Details</CardTitle>
               <CardDescription>
                  Enter the basic information for the new shift
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                     <div className='space-y-2'>
                        <Label htmlFor='shift_date'>Shift Date</Label>
                        <Input
                           id='shift_date'
                           type='date'
                           value={formData.shift_date}
                           onChange={(e) =>
                              handleInputChange("shift_date", e.target.value)
                           }
                           required
                        />
                     </div>

                     <div className='space-y-2'>
                        <Label htmlFor='shift_number'>Shift Number</Label>
                        <Select
                           value={formData.shift_number.toString()}
                           onValueChange={(value) =>
                              handleInputChange("shift_number", parseInt(value))
                           }
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value='1'>
                                 Shift 1 (6 AM - 2 PM)
                              </SelectItem>
                              <SelectItem value='2'>
                                 Shift 2 (2 PM - 10 PM)
                              </SelectItem>
                              <SelectItem value='3'>
                                 Shift 3 (10 PM - 6 AM)
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className='space-y-2'>
                        <Label htmlFor='operator_id'>Operator</Label>
                        <Select
                           value={formData.operator_id}
                           onValueChange={(value) =>
                              handleInputChange("operator_id", value)
                           }
                        >
                           <SelectTrigger>
                              <SelectValue placeholder='Select operator' />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value='3'>
                                 Shift Operator 1
                              </SelectItem>
                              <SelectItem value='4'>
                                 Shift Operator 2
                              </SelectItem>
                              <SelectItem value='5'>
                                 Shift Operator 3
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className='space-y-2'>
                        <Label htmlFor='start_time'>Start Time</Label>
                        <Input
                           id='start_time'
                           type='datetime-local'
                           value={formData.start_time}
                           onChange={(e) =>
                              handleInputChange("start_time", e.target.value)
                           }
                           required
                        />
                     </div>
                  </div>

                  <div className='space-y-2'>
                     <Label htmlFor='notes'>Notes (Optional)</Label>
                     <Input
                        id='notes'
                        placeholder='Enter any notes about this shift...'
                        value={formData.notes}
                        onChange={(e) =>
                           handleInputChange("notes", e.target.value)
                        }
                     />
                  </div>

                  <div className='flex space-x-2'>
                     <Button
                        type='submit'
                        disabled={createShiftMutation.isPending}
                        className='flex-1'
                     >
                        <Save className='h-4 w-4 mr-2' />
                        {createShiftMutation.isPending
                           ? "Creating..."
                           : "Create Shift"}
                     </Button>
                     <Link href='/dashboard/shift' className='flex-1'>
                        <Button
                           type='button'
                           variant='outline'
                           className='w-full'
                        >
                           Cancel
                        </Button>
                     </Link>
                  </div>
               </form>
            </CardContent>
         </Card>

         {/* Instructions */}
         <Card>
            <CardHeader>
               <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
               <div className='space-y-2 text-sm'>
                  <p>After creating the shift, you can:</p>
                  <ul className='list-disc list-inside space-y-1 text-muted-foreground ml-4'>
                     <li>Record fuel pump readings</li>
                     <li>Process store sales</li>
                     <li>Enter payment details at the end of shift</li>
                     <li>Close the shift when done</li>
                  </ul>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
