"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   ArrowLeft,
   Save,
   CheckCircle,
   Clock,
   FileText,
   Calculator,
   DollarSign,
} from "lucide-react";
import { ShiftReadingEntry } from "@/components/shift/shift-reading-entry";
import { CheckoutSheetEntry } from "@/components/shift/checkout-sheet-entry";
import { MISReportView } from "@/components/shift/mis-report-view";
import { ExtendedShift, CheckoutSheet, MISReport } from "@/types/checkout";
import { ShiftReading, Pump, FuelPrice } from "@/types/shift";

interface ShiftDetailPageProps {
   shiftId: string;
}

// Mock data - replace with actual API calls
const mockShift: ExtendedShift = {
   id: "1",
   shift_date: "2024-06-18",
   shift_number: 1,
   operator_id: "3",
   operator: {
      id: "3",
      email: "operator1@njsmobility.com",
      full_name: "Shift Operator 1",
      role: "shift_operator_1",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
   },
   status: "ongoing",
   start_time: "2024-06-18T06:00:00Z",
   readings: [],
   payments: [],
   store_sales: [],
   total_fuel_sales: 0,
   total_store_sales: 0,
   total_cash: 0,
   total_digital: 0,
   variance: 0,
   created_at: "2024-06-18T06:00:00Z",
   updated_at: "2024-06-18T06:00:00Z",
   checkout_sheets: [],
};

const mockPumps: Pump[] = [
   {
      id: "1",
      name: "Pump 1 - MS",
      fuel_type: "MS",
      status: "active",
      current_reading: 125463.5,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-06-18T08:00:00Z",
   },
   {
      id: "2",
      name: "Pump 2 - MS",
      fuel_type: "MS",
      status: "active",
      current_reading: 98432.25,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-06-18T08:00:00Z",
   },
];

const mockFuelPrices: FuelPrice[] = [
   {
      id: "1",
      fuel_type: "MS",
      price: 95.5,
      effective_date: "2024-06-18",
      created_by: "1",
      created_at: "2024-06-18T00:00:00Z",
   },
   {
      id: "2",
      fuel_type: "HSD",
      price: 87.25,
      effective_date: "2024-06-18",
      created_by: "1",
      created_at: "2024-06-18T00:00:00Z",
   },
];

export function ShiftDetailPage({ shiftId }: ShiftDetailPageProps) {
   const router = useRouter();
   const [shift, setShift] = useState<ExtendedShift>(mockShift);
   const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>(mockFuelPrices);
   const [isLoadingPrices, setIsLoadingPrices] = useState(true);
   const [activeTab, setActiveTab] = useState("readings");

   // Fetch fuel prices from admin/fuel-prices endpoint
   const fetchFuelPrices = async () => {
      try {
         setIsLoadingPrices(true);
         const response = await fetch("/api/admin/fuel-prices");

         if (!response.ok) {
            throw new Error("Failed to fetch fuel prices");
         }

         const data = await response.json();
         setFuelPrices(data);
      } catch (error) {
         console.error("Error fetching fuel prices:", error);
         // Keep using mock data as fallback
         setFuelPrices(mockFuelPrices);
      } finally {
         setIsLoadingPrices(false);
      }
   };

   // Fetch fuel prices on component mount
   useEffect(() => {
      fetchFuelPrices();
   }, []);

   // Convert fuel prices to the format expected by shift reading components
   const getFuelPricesForShiftReading = () => {
      const msPrice = fuelPrices.find((p) => p.fuel_type === "MS")?.price || 0;
      const hsdPrice =
         fuelPrices.find((p) => p.fuel_type === "HSD")?.price || 0;

      return {
         MS: msPrice,
         HSD: hsdPrice,
      };
   };

   const handleSaveReadings = (readings: Partial<ShiftReading>[]) => {
      console.log("Saving readings:", readings);
      // TODO: Implement API call
   };

   const handleSaveCheckout = (
      checkoutNumber: number,
      checkout: Partial<CheckoutSheet>
   ) => {
      console.log("Saving checkout:", checkoutNumber, checkout);
      // TODO: Implement API call
   };

   const handleCompleteShift = () => {
      console.log("Completing shift");
      // TODO: Implement API call
      setShift((prev) => ({ ...prev, status: "completed" }));
   };

   const handleVerifyShift = () => {
      console.log("Verifying shift");
      // TODO: Implement API call
      setShift((prev) => ({ ...prev, status: "verified" }));
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

   const generateMISReport = (): MISReport => {
      // Calculate totals from shift data
      const totalFuelSales = shift.total_fuel_sales;
      const totalCash = shift.total_cash;
      const totalDigital = shift.total_digital;

      return {
         date: shift.shift_date,
         net_sales: totalFuelSales + shift.total_store_sales,
         cash_payments: totalCash,
         card_payments: totalDigital * 0.6, // Mock distribution
         upi_payments: totalDigital * 0.4,
         other_payments: 0,
         fuel_prices: getFuelPricesForShiftReading(),
         denomination_breakdown: [
            { denomination: 2000, count: 5, total: 10000 },
            { denomination: 500, count: 20, total: 10000 },
            { denomination: 100, count: 50, total: 5000 },
         ],
         total_variance: shift.variance,
      };
   };

   return (
      <div className='container mx-auto p-6 space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
               <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => router.back()}
               >
                  <ArrowLeft className='h-4 w-4' />
               </Button>
               <div>
                  <h1 className='text-2xl font-bold'>
                     Shift {shift.shift_number} -{" "}
                     {new Date(shift.shift_date).toLocaleDateString()}
                  </h1>
                  <div className='flex items-center gap-4'>
                     <p className='text-muted-foreground'>
                        Operator: {shift.operator.full_name}
                     </p>
                     {isLoadingPrices ? (
                        <Badge variant='outline' className='text-yellow-600'>
                           Loading Fuel Prices...
                        </Badge>
                     ) : (
                        <Badge variant='outline' className='text-green-600'>
                           MS: ₹{getFuelPricesForShiftReading().MS} | HSD: ₹
                           {getFuelPricesForShiftReading().HSD}
                        </Badge>
                     )}
                  </div>
               </div>
            </div>
            <div className='flex items-center gap-2'>
               {getStatusBadge(shift.status)}
               {shift.status === "ongoing" && (
                  <Button onClick={handleCompleteShift}>
                     <CheckCircle className='h-4 w-4 mr-2' />
                     Complete Shift
                  </Button>
               )}
               {shift.status === "completed" && (
                  <Button onClick={handleVerifyShift}>
                     <Save className='h-4 w-4 mr-2' />
                     Verify Shift
                  </Button>
               )}
            </div>
         </div>

         {/* Quick Stats */}
         <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <Card>
               <CardContent className='p-4'>
                  <div className='flex items-center gap-2'>
                     <Clock className='h-4 w-4 text-muted-foreground' />
                     <div className='text-sm text-muted-foreground'>
                        Duration
                     </div>
                  </div>
                  <div className='text-xl font-semibold'>8 hours</div>
               </CardContent>
            </Card>
            <Card>
               <CardContent className='p-4'>
                  <div className='flex items-center gap-2'>
                     <Calculator className='h-4 w-4 text-muted-foreground' />
                     <div className='text-sm text-muted-foreground'>
                        Fuel Sales
                     </div>
                  </div>
                  <div className='text-xl font-semibold'>
                     ₹{shift.total_fuel_sales.toLocaleString()}
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardContent className='p-4'>
                  <div className='flex items-center gap-2'>
                     <DollarSign className='h-4 w-4 text-muted-foreground' />
                     <div className='text-sm text-muted-foreground'>
                        Store Sales
                     </div>
                  </div>
                  <div className='text-xl font-semibold'>
                     ₹{shift.total_store_sales.toLocaleString()}
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardContent className='p-4'>
                  <div className='flex items-center gap-2'>
                     <FileText className='h-4 w-4 text-muted-foreground' />
                     <div className='text-sm text-muted-foreground'>
                        Variance
                     </div>
                  </div>
                  <div
                     className={`text-xl font-semibold ${
                        shift.variance >= 0 ? "text-green-600" : "text-red-600"
                     }`}
                  >
                     ₹{Math.abs(shift.variance).toLocaleString()}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Main Content */}
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='space-y-4'
         >
            <TabsList className='grid w-full grid-cols-4'>
               <TabsTrigger value='readings'>Shift Readings</TabsTrigger>
               <TabsTrigger value='checkouts'>Checkout Sheets</TabsTrigger>
               <TabsTrigger value='mis'>MIS Report</TabsTrigger>
               <TabsTrigger value='summary'>Summary</TabsTrigger>
            </TabsList>

            <TabsContent value='readings' className='space-y-4'>
               <ShiftReadingEntry
                  shiftId={shift.id}
                  shiftNumber={shift.shift_number}
                  operatorName={shift.operator.full_name}
                  pumps={mockPumps}
                  fuelPrices={fuelPrices}
                  existingReadings={shift.readings}
                  onSave={handleSaveReadings}
                  disabled={shift.status === "verified"}
               />
            </TabsContent>

            <TabsContent value='checkouts' className='space-y-4'>
               <div className='grid gap-6'>
                  {[1, 2, 3, 4].map((checkoutNumber) => (
                     <CheckoutSheetEntry
                        key={checkoutNumber}
                        shiftId={shift.id}
                        checkoutNumber={checkoutNumber}
                        operatorName={`Operator ${checkoutNumber}`}
                        expectedAmount={50000} // Mock expected amount
                        existingCheckout={shift.checkout_sheets.find(
                           (c) => c.checkout_number === checkoutNumber
                        )}
                        onSave={(checkout) =>
                           handleSaveCheckout(checkoutNumber, checkout)
                        }
                        disabled={shift.status === "verified"}
                     />
                  ))}
               </div>
            </TabsContent>

            <TabsContent value='mis' className='space-y-4'>
               <MISReportView
                  report={generateMISReport()}
                  onDownload={() => console.log("Download MIS report")}
               />
            </TabsContent>

            <TabsContent value='summary' className='space-y-4'>
               <Card>
                  <CardHeader>
                     <CardTitle>Shift Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className='text-center text-muted-foreground'>
                        Comprehensive shift summary coming soon...
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   );
}
