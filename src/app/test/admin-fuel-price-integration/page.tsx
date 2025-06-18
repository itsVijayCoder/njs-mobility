"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, TestTube, Zap, CheckCircle } from "lucide-react";
import { ComprehensiveShiftReading } from "@/components/shift/comprehensive-shift-reading-clean";

export default function AdminFuelPriceIntegrationTest() {
   const [testResults, setTestResults] = useState<string[]>([]);

   // Fetch current fuel prices in real-time
   const {
      data: fuelPrices = [],
      isLoading,
      refetch,
   } = useQuery({
      queryKey: ["fuel_prices"],
      queryFn: async () => {
         const response = await fetch("/api/admin/fuel-prices");
         if (!response.ok) throw new Error("Failed to fetch prices");
         return response.json();
      },
      refetchInterval: 2000, // Faster refresh for testing
   });

   const currentMSPrice = fuelPrices
      .filter((price: any) => price.fuel_type === "MS")
      .sort(
         (a: any, b: any) =>
            new Date(b.effective_date).getTime() -
            new Date(a.effective_date).getTime()
      )[0];

   const currentHSDPrice = fuelPrices
      .filter((price: any) => price.fuel_type === "HSD")
      .sort(
         (a: any, b: any) =>
            new Date(b.effective_date).getTime() -
            new Date(a.effective_date).getTime()
      )[0];

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
         minimumFractionDigits: 2,
      }).format(amount);
   };

   const addTestResult = (message: string) => {
      setTestResults((prev) => [
         ...prev,
         `${new Date().toLocaleTimeString()}: ${message}`,
      ]);
   };

   const runIntegrationTest = () => {
      addTestResult("🧪 Starting Admin Fuel Price Integration Test");
      addTestResult("✅ Fetching current fuel prices from API");
      addTestResult(
         `📊 Current MS Price: ${
            currentMSPrice ? formatCurrency(currentMSPrice.price) : "N/A"
         }`
      );
      addTestResult(
         `📊 Current HSD Price: ${
            currentHSDPrice ? formatCurrency(currentHSDPrice.price) : "N/A"
         }`
      );
      addTestResult(
         "⚡ Shift reading component should reflect these prices automatically"
      );
      addTestResult(
         "🔄 Price changes in admin panel should update calculations in real-time"
      );
   };

   return (
      <div className='space-y-6'>
         {/* Test Header */}
         <Card className='bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'>
            <CardHeader>
               <CardTitle className='flex items-center gap-2'>
                  <TestTube className='h-6 w-6 text-purple-600' />
                  Admin Fuel Price Integration Test
               </CardTitle>
               <p className='text-muted-foreground'>
                  Testing real-time fuel price propagation from admin panel to
                  shift readings
               </p>
            </CardHeader>
            <CardContent>
               <div className='flex gap-4'>
                  <Button
                     onClick={runIntegrationTest}
                     className='bg-purple-600 hover:bg-purple-700 text-white'
                  >
                     <TestTube className='h-4 w-4 mr-2' />
                     Run Integration Test
                  </Button>
                  <Button
                     variant='outline'
                     onClick={() => window.open("/admin/fuel-prices", "_blank")}
                  >
                     <ExternalLink className='h-4 w-4 mr-2' />
                     Open Admin Panel
                  </Button>
                  <Button
                     variant='outline'
                     onClick={() => refetch()}
                     disabled={isLoading}
                  >
                     <Zap className='h-4 w-4 mr-2' />
                     Refresh Prices
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Current Price Status */}
         <div className='grid md:grid-cols-2 gap-4'>
            <Card className='border-blue-200 bg-blue-50'>
               <CardHeader>
                  <CardTitle className='text-blue-800 flex items-center gap-2'>
                     <Zap className='h-5 w-5' />
                     Live MS Price
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='text-2xl font-bold text-blue-900 mb-2'>
                     {currentMSPrice
                        ? formatCurrency(currentMSPrice.price)
                        : "N/A"}
                  </div>
                  <Badge
                     variant='outline'
                     className='bg-blue-100 text-blue-800'
                  >
                     <CheckCircle className='h-3 w-3 mr-1' />
                     Auto-updating
                  </Badge>
               </CardContent>
            </Card>

            <Card className='border-green-200 bg-green-50'>
               <CardHeader>
                  <CardTitle className='text-green-800 flex items-center gap-2'>
                     <Zap className='h-5 w-5' />
                     Live HSD Price
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='text-2xl font-bold text-green-900 mb-2'>
                     {currentHSDPrice
                        ? formatCurrency(currentHSDPrice.price)
                        : "N/A"}
                  </div>
                  <Badge
                     variant='outline'
                     className='bg-green-100 text-green-800'
                  >
                     <CheckCircle className='h-3 w-3 mr-1' />
                     Auto-updating
                  </Badge>
               </CardContent>
            </Card>
         </div>

         {/* Test Results */}
         {testResults.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle>Test Results</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='space-y-2 max-h-60 overflow-y-auto'>
                     {testResults.map((result, index) => (
                        <div
                           key={index}
                           className='text-sm font-mono bg-muted p-2 rounded'
                        >
                           {result}
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}

         <Separator />

         {/* Live Shift Reading Integration */}
         <Card>
            <CardHeader>
               <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-yellow-500' />
                  Live Shift Reading Integration
               </CardTitle>
               <p className='text-muted-foreground'>
                  This shift reading component automatically updates when fuel
                  prices change in the admin panel
               </p>
            </CardHeader>
         </Card>

         {/* Test Shift Reading Component */}
         {currentMSPrice && currentHSDPrice && (
            <ComprehensiveShiftReading
               shiftId='test-integration'
               shiftNumber={1}
               operatorName='Test Operator'
               fuelPrices={{
                  MS: currentMSPrice.price,
                  HSD: currentHSDPrice.price,
               }}
               onSave={(data) => {
                  addTestResult("💾 Shift data saved with current fuel prices");
                  console.log("Saved shift data:", data);
               }}
            />
         )}

         {/* Instructions */}
         <Card className='bg-amber-50 border-amber-200'>
            <CardHeader>
               <CardTitle className='text-amber-800'>🧪 How to Test</CardTitle>
            </CardHeader>
            <CardContent className='text-amber-800'>
               <ol className='list-decimal list-inside space-y-2'>
                  <li>Click "Run Integration Test" to start the test</li>
                  <li>Open the Admin Panel in a new tab</li>
                  <li>Update fuel prices in the admin panel</li>
                  <li>Watch the Live Price cards above update automatically</li>
                  <li>
                     Observe that the shift reading calculations update in
                     real-time
                  </li>
                  <li>Verify that all amounts recalculate with new prices</li>
               </ol>
               <div className='mt-4 p-3 bg-amber-100 rounded-lg'>
                  <strong>Expected Behavior:</strong> When you change fuel
                  prices in the admin panel, this page should automatically
                  reflect the new prices and recalculate all shift reading
                  amounts.
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
