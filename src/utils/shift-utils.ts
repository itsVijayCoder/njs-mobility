// Shift timing constants
export const SHIFT_TIMINGS = {
   1: { start: "06:00", end: "14:00", label: "Shift I (6AM - 2PM)" },
   2: { start: "14:00", end: "22:00", label: "Shift II (2PM - 10PM)" },
   3: { start: "22:00", end: "06:00", label: "Shift III (10PM - 6AM)" },
} as const;

export const MAX_SHIFTS_PER_DAY = 3;

// Pump data structure based on your image format
export interface PumpData {
   product: "Diesel" | "PETROL";
   pump: number;
   nozzle: number;
   opening: number;
   closing: number;
   total: number;
}

// Parse pasted data from spreadsheet format
export function parsePastedData(pastedText: string): PumpData[] {
   const lines = pastedText.trim().split("\n");
   const data: PumpData[] = [];
   let currentPumpNumber = 0; // Track the current pump number for PETROL rows

   console.log("=== PARSING PASTE DATA ===");
   console.log("Total lines:", lines.length);

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`\nLine ${i}: "${line}"`);

      // Skip header row and empty lines
      if (line.includes("PRODUCT") || line.includes("PUMP") || !line.trim()) {
         console.log("-> Skipping header/empty line");
         continue;
      }

      let columns: string[] = [];

      if (line.includes("\t")) {
         // Tab-separated data
         columns = line.split("\t");
         console.log("-> Tab-separated, raw columns:", columns);
      } else {
         // Space-separated data - handle PETROL lines with missing pump specially
         if (line.trim().startsWith("PETROL")) {
            // For PETROL lines, manually parse since pump might be empty
            const parts = line.trim().split(/\s+/);
            console.log("-> PETROL line parts:", parts);

            if (parts.length === 5) {
               // Format: "PETROL 2 96221.4 96526.27 304.87" (missing pump)
               columns = [parts[0], "", parts[1], parts[2], parts[3], parts[4]];
            } else if (parts.length >= 6) {
               columns = parts;
            }
         } else {
            // Regular space-separated line
            columns = line.trim().split(/\s+/);
         }
         console.log("-> Space-separated, processed columns:", columns);
      }

      // Trim all columns
      columns = columns.map((col) => col.trim());

      // Ensure we have at least 6 columns
      while (columns.length < 6) {
         columns.push("");
      }

      console.log("-> Final columns:", columns);

      if (columns.length >= 6) {
         const product = columns[0];
         let pump = parseInt(columns[1]) || 0;
         const nozzle = parseInt(columns[2]) || 0;
         const opening = parseFloat(columns[3]) || 0;
         const closing = parseFloat(columns[4]) || 0;
         const total = parseFloat(columns[5]) || 0;

         console.log(
            `-> Parsed: Product="${product}", Pump=${pump} (from "${columns[1]}"), Nozzle=${nozzle}`
         );

         // Handle the case where PETROL rows have empty pump column
         if (product === "Diesel" && pump > 0) {
            currentPumpNumber = pump;
            console.log(`-> Updated current pump to: ${currentPumpNumber}`);
         } else if (product === "PETROL" && (pump === 0 || columns[1] === "")) {
            pump = currentPumpNumber;
            console.log(`-> Assigned pump ${currentPumpNumber} to PETROL`);
         }

         // Validate that we have the required data
         if (
            (product === "Diesel" || product === "PETROL") &&
            pump > 0 &&
            opening >= 0 &&
            closing >= 0
         ) {
            const item = {
               product: product as "Diesel" | "PETROL",
               pump,
               nozzle,
               opening,
               closing,
               total,
            };
            data.push(item);
            console.log("-> ✅ Added item:", item);
         } else {
            console.log("-> ❌ Skipped item - invalid data:", {
               product,
               pump,
               opening,
               closing,
            });
         }
      } else {
         console.log(
            "-> Skipped line - insufficient columns, got",
            columns.length
         );
      }
   }

   return data;
}

// Convert parsed data to our pump reading structure
export function convertToDispenserReadings(
   pumpData: PumpData[],
   fuelPrices: { MS: number; HSD: number },
   shiftNumber?: number
) {
   const dispenserMap = new Map<
      number,
      { diesel?: PumpData; petrol?: PumpData }
   >();

   // Group data by pump number
   for (const data of pumpData) {
      if (!dispenserMap.has(data.pump)) {
         dispenserMap.set(data.pump, {});
      }

      const dispenser = dispenserMap.get(data.pump)!;
      if (data.product === "Diesel") {
         dispenser.diesel = data;
      } else if (data.product === "PETROL") {
         dispenser.petrol = data;
      }
   }

   // Convert to our structure
   const dispensers = [];
   const pumpTestQty = shiftNumber === 1 ? 5 : 0; // For Shift 1, pump test should be 5

   for (const [pumpNum, data] of dispenserMap) {
      const dispenserName = `Pump-${pumpNum}`;

      const msNetDispensed = (data.petrol?.total || 0) - pumpTestQty;
      const hsdNetDispensed = (data.diesel?.total || 0) - pumpTestQty;

      dispensers.push({
         dispenser_name: dispenserName,
         ms_pump: {
            pump_name: `MS-${pumpNum}`,
            fuel_type: "MS" as const,
            closing_reading: data.petrol?.closing || 0,
            opening_reading: data.petrol?.opening || 0,
            dispensed_qty: data.petrol?.total || 0,
            pump_test_qty: pumpTestQty,
            own_use_qty: 0,
            net_dispensed_qty: Math.max(0, msNetDispensed),
            rate_per_litre: fuelPrices.MS,
            amount: Math.max(0, msNetDispensed) * fuelPrices.MS,
         },
         hsd_pump: {
            pump_name: `HSD-${pumpNum}`,
            fuel_type: "HSD" as const,
            closing_reading: data.diesel?.closing || 0,
            opening_reading: data.diesel?.opening || 0,
            dispensed_qty: data.diesel?.total || 0,
            pump_test_qty: pumpTestQty,
            own_use_qty: 0,
            net_dispensed_qty: Math.max(0, hsdNetDispensed),
            rate_per_litre: fuelPrices.HSD,
            amount: Math.max(0, hsdNetDispensed) * fuelPrices.HSD,
         },
      });
   }

   return dispensers;
}
