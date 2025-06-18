"use client";

import React from "react";
import { ComprehensiveShiftReading } from "./comprehensive-shift-reading";
import { ShiftReading, Pump, FuelPrice } from "@/types/shift";

interface ShiftReadingEntryProps {
   shiftId: string;
   shiftNumber: number;
   operatorName: string;
   pumps: Pump[];
   fuelPrices: FuelPrice[];
   existingReadings?: ShiftReading[];
   onSave: (readings: any) => void;
   disabled?: boolean;
}

export function ShiftReadingEntry({
   shiftId,
   shiftNumber,
   operatorName,
   pumps,
   fuelPrices,
   existingReadings = [],
   onSave,
   disabled = false,
}: ShiftReadingEntryProps) {
   // Extract fuel prices for MS and HSD
   const fuelPriceMap = {
      MS: fuelPrices.find((fp) => fp.fuel_type === "MS")?.price || 93.26,
      HSD: fuelPrices.find((fp) => fp.fuel_type === "HSD")?.price || 93.26,
   };

   return (
      <ComprehensiveShiftReading
         shiftId={shiftId}
         shiftNumber={shiftNumber}
         operatorName={operatorName}
         fuelPrices={fuelPriceMap}
         onSave={onSave}
         disabled={disabled}
      />
   );
}
