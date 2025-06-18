"use client";
import { useState, useEffect } from "react";
import { ComprehensiveShiftReading } from "@/components/shift/comprehensive-shift-reading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Simulate fetching fuel prices from an API or database
const fetchFuelPrices = async () => {
   // Simulate API call delay
   await new Promise((resolve) => setTimeout(resolve, 500));

   // Simulate price fluctuation
   const baseMS = 93.26;
   const baseHSD = 85.5;
   const variation = (Math.random() - 0.5) * 2; // ±1 rupee variation

   return {
      MS: Math.round((baseMS + variation) * 100) / 100,
      HSD: Math.round((baseHSD + variation) * 100) / 100,
      lastUpdated: new Date().toLocaleTimeString(),
   };
};

export default function FuelPriceDemo() {
   const [fuelPrices, setFuelPrices] = useState({ MS: 93.26, HSD: 85.5 });
   const [lastUpdated, setLastUpdated] = useState(
      new Date().toLocaleTimeString()
   );
   const [isLoading, setIsLoading] = useState(false);

   const handleSave = (data: any) => {
      console.log("Shift reading data:", data);
   };

   const refreshPrices = async () => {
      setIsLoading(true);
      try {
         const newPrices = await fetchFuelPrices();
         setFuelPrices({ MS: newPrices.MS, HSD: newPrices.HSD });
         setLastUpdated(newPrices.lastUpdated);
      } catch (error) {
         console.error("Failed to fetch fuel prices:", error);
      } finally {
         setIsLoading(false);
      }
   };

   // Auto-refresh prices every 30 seconds (for demo)
   useEffect(() => {
      const interval = setInterval(refreshPrices, 30000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className='container mx-auto p-4 space-y-6'>
         <h1 className='text-2xl font-bold mb-4'>
            Live Fuel Price Integration Demo
         </h1>

         {/* Live Fuel Price Display */}
         <Card>
            <CardHeader>
               <CardTitle className='flex items-center justify-between'>
                  Live Fuel Prices
                  <Button
                     onClick={refreshPrices}
                     disabled={isLoading}
                     variant='outline'
                     size='sm'
                  >
                     <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                           isLoading ? "animate-spin" : ""
                        }`}
                     />
                     Refresh
                  </Button>
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                     <div className='text-2xl font-bold text-blue-600'>
                        ₹{fuelPrices.MS.toFixed(2)}
                     </div>
                     <div className='text-sm text-blue-800'>
                        MS (Petrol) per Liter
                     </div>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                     <div className='text-2xl font-bold text-green-600'>
                        ₹{fuelPrices.HSD.toFixed(2)}
                     </div>
                     <div className='text-sm text-green-800'>
                        HSD (Diesel) per Liter
                     </div>
                  </div>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                     <Badge variant='outline'>Last Updated</Badge>
                     <div className='text-sm text-gray-600 mt-1'>
                        {lastUpdated}
                     </div>
                  </div>
               </div>

               <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <div className='text-sm text-yellow-800'>
                     <strong>📊 Live Integration:</strong> Fuel prices
                     automatically update in the shift reading below. Amounts
                     are recalculated in real-time when prices change.
                  </div>
               </div>
            </CardContent>
         </Card>

         <ComprehensiveShiftReading
            shiftId='demo-shift-1'
            shiftNumber={1}
            operatorName='DEMO OPERATOR'
            fuelPrices={fuelPrices}
            onSave={handleSave}
            disabled={false}
         />
      </div>
   );
}
