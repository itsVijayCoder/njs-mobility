"use client";
import { useState } from "react";
import { ComprehensiveShiftReading } from "@/components/shift/comprehensive-shift-reading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TestShiftReading() {
   const [fuelPrices, setFuelPrices] = useState({ MS: 93.26, HSD: 85.5 });

   const handleSave = (data: any) => {
      console.log("Shift reading data:", data);
   };

   const updateFuelPrice = (fuelType: "MS" | "HSD", price: number) => {
      setFuelPrices((prev) => ({
         ...prev,
         [fuelType]: price,
      }));
   };

   const resetPrices = () => {
      setFuelPrices({ MS: 93.26, HSD: 85.5 });
   };

   const testPriceChange = () => {
      setFuelPrices({ MS: 95.0, HSD: 87.0 });
   };

   return (
      <div className='container mx-auto p-4 space-y-6'>
         <h1 className='text-2xl font-bold mb-4'>
            Test Shift Reading with Dynamic Fuel Prices
         </h1>

         {/* Fuel Price Control Panel */}
         <Card>
            <CardHeader>
               <CardTitle>Fuel Price Control</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                     <Label htmlFor='ms-price'>MS (Petrol) Price ₹/L</Label>
                     <Input
                        id='ms-price'
                        type='number'
                        step='0.01'
                        value={fuelPrices.MS}
                        onChange={(e) =>
                           updateFuelPrice(
                              "MS",
                              parseFloat(e.target.value) || 0
                           )
                        }
                        className='mt-1'
                     />
                  </div>
                  <div>
                     <Label htmlFor='hsd-price'>HSD (Diesel) Price ₹/L</Label>
                     <Input
                        id='hsd-price'
                        type='number'
                        step='0.01'
                        value={fuelPrices.HSD}
                        onChange={(e) =>
                           updateFuelPrice(
                              "HSD",
                              parseFloat(e.target.value) || 0
                           )
                        }
                        className='mt-1'
                     />
                  </div>
               </div>

               <div className='flex gap-2'>
                  <Button onClick={testPriceChange} variant='outline'>
                     Test Price Change (₹95/₹87)
                  </Button>
                  <Button onClick={resetPrices} variant='outline'>
                     Reset to Default
                  </Button>
               </div>

               <div className='text-sm text-muted-foreground'>
                  Current Prices: MS = ₹{fuelPrices.MS.toFixed(2)}/L, HSD = ₹
                  {fuelPrices.HSD.toFixed(2)}/L
               </div>
            </CardContent>
         </Card>

         <ComprehensiveShiftReading
            shiftId='test-shift-1'
            shiftNumber={1}
            operatorName='VAIRAMUTHU'
            fuelPrices={fuelPrices}
            onSave={handleSave}
            disabled={false}
         />
      </div>
   );
}
