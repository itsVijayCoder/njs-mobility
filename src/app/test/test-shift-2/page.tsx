"use client";
import { ComprehensiveShiftReading } from "@/components/shift/comprehensive-shift-reading";

export default function TestShift2Reading() {
   const mockFuelPrices = { MS: 93.26, HSD: 93.26 };

   const handleSave = (data: any) => {
      console.log("Shift 2 reading data:", data);
   };

   return (
      <div className='container mx-auto p-4'>
         <h1 className='text-2xl font-bold mb-4'>
            Test Shift 2 Reading (No Auto Pump Test)
         </h1>
         <ComprehensiveShiftReading
            shiftId='test-shift-2'
            shiftNumber={2}
            operatorName='VAIRAMUTHU'
            fuelPrices={mockFuelPrices}
            onSave={handleSave}
            disabled={false}
         />
      </div>
   );
}
