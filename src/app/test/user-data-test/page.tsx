"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Improved parsing function specifically for your data format
function parseUserData(pastedText: string) {
   const lines = pastedText.trim().split("\n");
   const data: any[] = [];
   let currentPumpNumber = 0;

   console.log("=== PARSING USER DATA ===");
   console.log("Total lines:", lines.length);

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`\nLine ${i}: "${line}"`);

      // Skip header row and empty lines
      if (line.includes("PRODUCT") || line.includes("PUMP") || !line.trim()) {
         console.log("-> Skipping header/empty line");
         continue;
      }

      // Parse each line more carefully
      // Your format: "Diesel	1	1	226928.6	227183.59	254.99"
      // Your format: "PETROL		2	96221.4	96526.27	304.87"

      let columns: string[] = [];

      if (line.includes("\t")) {
         // Tab-separated
         columns = line.split("\t");
         console.log("-> Tab-separated, raw columns:", columns);
      } else {
         // Space-separated - try to detect empty pump field for PETROL
         if (line.startsWith("PETROL")) {
            // For PETROL lines, manually parse since pump might be empty
            const parts = line.split(/\s+/);
            console.log("-> PETROL line parts:", parts);

            if (parts.length === 5) {
               // Format: "PETROL 2 96221.4 96526.27 304.87" (missing pump)
               columns = [parts[0], "", parts[1], parts[2], parts[3], parts[4]];
            } else {
               columns = parts;
            }
         } else {
            // Regular space-separated
            columns = line.split(/\s+/);
         }
         console.log("-> Space-separated, processed columns:", columns);
      }

      // Ensure we have at least 6 columns
      while (columns.length < 6) {
         columns.push("");
      }

      console.log("-> Final columns:", columns);

      const product = columns[0]?.trim() || "";
      let pump = parseInt(columns[1]?.trim() || "0") || 0;
      const nozzle = parseInt(columns[2]?.trim() || "0") || 0;
      const opening = parseFloat(columns[3]?.trim() || "0") || 0;
      const closing = parseFloat(columns[4]?.trim() || "0") || 0;
      const total = parseFloat(columns[5]?.trim() || "0") || 0;

      console.log(
         `-> Parsed: Product="${product}", Pump=${pump}, Nozzle=${nozzle}, Opening=${opening}, Closing=${closing}, Total=${total}`
      );

      // Handle PETROL rows with empty pump
      if (product === "Diesel" && pump > 0) {
         currentPumpNumber = pump;
         console.log(`-> Updated current pump to: ${currentPumpNumber}`);
      } else if (product === "PETROL" && pump === 0) {
         pump = currentPumpNumber;
         console.log(`-> Assigned pump ${currentPumpNumber} to PETROL`);
      }

      // Validate and add
      if ((product === "Diesel" || product === "PETROL") && pump > 0) {
         const item = {
            product,
            pump,
            nozzle,
            opening,
            closing,
            total,
         };
         data.push(item);
         console.log("-> ✅ Added:", item);
      } else {
         console.log("-> ❌ Skipped - invalid data");
      }
   }

   console.log("\n=== FINAL RESULT ===");
   console.log("Total items parsed:", data.length);
   console.log(
      "Diesel items:",
      data.filter((d) => d.product === "Diesel").length
   );
   console.log(
      "PETROL items:",
      data.filter((d) => d.product === "PETROL").length
   );

   return data;
}

export default function UserDataTest() {
   const [pasteData, setPasteData] = useState("");
   const [result, setResult] = useState<any>(null);

   // Your exact data
   const userData = `PRODUCT	PUMP	NOZZLE	OPENING	CLOSING	TOTAL
Diesel	1	1	226928.6	227183.59	254.99
PETROL		2	96221.4	96526.27	304.87
Diesel	2	1	310406.14	310917.69	511.55
PETROL		2	50316.06	50475.28	159.22
Diesel	3	1	131559.38	131932.37	372.99
PETROL		2	114335.57	114681.68	346.11
Diesel	4	1	194369.88	194619.02	249.14
PETROL		2	25012.78	25123.46	110.68`;

   const testParsing = () => {
      console.clear();
      const parsed = parseUserData(pasteData);
      setResult({
         data: parsed,
         stats: {
            total: parsed.length,
            diesel: parsed.filter((d) => d.product === "Diesel").length,
            petrol: parsed.filter((d) => d.product === "PETROL").length,
         },
      });
   };

   return (
      <div className='container mx-auto p-4 space-y-6'>
         <Card>
            <CardHeader>
               <CardTitle>User Data Parsing Test</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <Button
                  onClick={() => setPasteData(userData)}
                  variant='outline'
                  className='w-full'
               >
                  Load Your Exact Data
               </Button>

               <div>
                  <label className='block text-sm font-medium mb-2'>
                     Paste Data (open console to see detailed logs):
                  </label>
                  <Textarea
                     value={pasteData}
                     onChange={(e) => setPasteData(e.target.value)}
                     placeholder='Paste your data here...'
                     className='min-h-[200px] font-mono text-sm'
                  />
               </div>

               <Button onClick={testParsing} className='w-full'>
                  Test Parsing (Check Console)
               </Button>

               {result && (
                  <div className='space-y-4'>
                     <div className='grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded'>
                        <div className='text-center'>
                           <div className='text-2xl font-bold'>
                              {result.stats.total}
                           </div>
                           <div className='text-sm text-gray-600'>
                              Total Items
                           </div>
                        </div>
                        <div className='text-center'>
                           <div className='text-2xl font-bold text-blue-600'>
                              {result.stats.diesel}
                           </div>
                           <div className='text-sm text-gray-600'>
                              Diesel Items
                           </div>
                        </div>
                        <div className='text-center'>
                           <div className='text-2xl font-bold text-green-600'>
                              {result.stats.petrol}
                           </div>
                           <div className='text-sm text-gray-600'>
                              PETROL Items
                           </div>
                        </div>
                     </div>

                     <Card>
                        <CardHeader>
                           <CardTitle>Parsed Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <pre className='bg-gray-50 p-4 rounded text-xs overflow-x-auto'>
                              {JSON.stringify(result.data, null, 2)}
                           </pre>
                        </CardContent>
                     </Card>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
