"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   parsePastedData,
   convertToDispenserReadings,
} from "@/utils/shift-utils";

export default function TestPasteFunctionality() {
   const [pasteData, setPasteData] = useState("");
   const [result, setResult] = useState<any>(null);
   const [error, setError] = useState<string>("");

   // Sample data that matches your format exactly
   const sampleData1 = `PRODUCT	PUMP	NOZZLE	OPENING	CLOSING	TOTAL
Diesel	1	1	226928.6	227183.59	254.99
PETROL		2	96221.4	96526.27	304.87
Diesel	2	1	310406.14	310917.69	511.55
PETROL		2	50316.06	50475.28	159.22
Diesel	3	1	131559.38	131932.37	372.99
PETROL		2	114335.57	114681.68	346.11
Diesel	4	1	194369.88	194619.02	249.14
PETROL		2	25012.78	25123.46	110.68`;

   // Alternative format with spaces instead of tabs
   const sampleData2 = `PRODUCT PUMP NOZZLE OPENING CLOSING TOTAL
Diesel 1 1 226928.6 227183.59 254.99
PETROL   2 96221.4 96526.27 304.87
Diesel 2 1 310406.14 310917.69 511.55
PETROL   2 50316.06 50475.28 159.22
Diesel 3 1 131559.38 131932.37 372.99
PETROL   2 114335.57 114681.68 346.11
Diesel 4 1 194369.88 194619.02 249.14
PETROL   2 25012.78 25123.46 110.68`;

   const fuelPrices = { MS: 90.5, HSD: 88.2 };

   const testParsing = () => {
      setError("");
      setResult(null);

      if (!pasteData.trim()) {
         setError("Please paste some data first");
         return;
      }

      try {
         console.log("Original pasted data:");
         console.log(pasteData);

         const parsedData = parsePastedData(pasteData);
         console.log("Parsed pump data:", parsedData);

         const dispenserReadings = convertToDispenserReadings(
            parsedData,
            fuelPrices
         );
         console.log("Converted dispenser readings:", dispenserReadings);

         setResult({
            rawParsed: parsedData,
            dispenserReadings: dispenserReadings,
            stats: {
               totalRows: parsedData.length,
               dieselRows: parsedData.filter((d) => d.product === "Diesel")
                  .length,
               petrolRows: parsedData.filter((d) => d.product === "PETROL")
                  .length,
               uniquePumps: [...new Set(parsedData.map((d) => d.pump))].sort(
                  (a, b) => a - b
               ),
            },
         });
      } catch (err: any) {
         setError(err.message || "Unknown error occurred");
         console.error("Parsing error:", err);
      }
   };

   return (
      <div className='container mx-auto p-4 space-y-6'>
         <Card>
            <CardHeader>
               <CardTitle>Test Paste Functionality</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Button
                     onClick={() => setPasteData(sampleData1)}
                     variant='outline'
                     className='text-left h-auto p-4'
                  >
                     <div>
                        <div className='font-semibold'>
                           Load Sample Data 1 (Tab-separated)
                        </div>
                        <div className='text-xs text-muted-foreground mt-1'>
                           Uses tab characters, PETROL rows have empty pump
                           column
                        </div>
                     </div>
                  </Button>

                  <Button
                     onClick={() => setPasteData(sampleData2)}
                     variant='outline'
                     className='text-left h-auto p-4'
                  >
                     <div>
                        <div className='font-semibold'>
                           Load Sample Data 2 (Space-separated)
                        </div>
                        <div className='text-xs text-muted-foreground mt-1'>
                           Uses spaces, PETROL rows have empty pump column
                        </div>
                     </div>
                  </Button>
               </div>

               <div>
                  <label className='block text-sm font-medium mb-2'>
                     Paste your data here:
                  </label>
                  <Textarea
                     value={pasteData}
                     onChange={(e) => setPasteData(e.target.value)}
                     placeholder='Paste your pump reading data here...'
                     className='min-h-[200px] font-mono text-sm'
                  />
               </div>

               <Button onClick={testParsing} className='w-full'>
                  Test Parsing
               </Button>

               {error && (
                  <div className='p-4 bg-red-50 border border-red-200 rounded text-red-800'>
                     <strong>Error:</strong> {error}
                  </div>
               )}

               {result && (
                  <div className='space-y-4'>
                     <Card>
                        <CardHeader>
                           <CardTitle className='text-lg'>
                              Parsing Statistics
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                              <div>
                                 <div className='font-semibold'>Total Rows</div>
                                 <div className='text-2xl'>
                                    {result.stats.totalRows}
                                 </div>
                              </div>
                              <div>
                                 <div className='font-semibold'>
                                    Diesel Rows
                                 </div>
                                 <div className='text-2xl text-blue-600'>
                                    {result.stats.dieselRows}
                                 </div>
                              </div>
                              <div>
                                 <div className='font-semibold'>
                                    Petrol Rows
                                 </div>
                                 <div className='text-2xl text-green-600'>
                                    {result.stats.petrolRows}
                                 </div>
                              </div>
                              <div>
                                 <div className='font-semibold'>
                                    Unique Pumps
                                 </div>
                                 <div className='text-lg'>
                                    {result.stats.uniquePumps.join(", ")}
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle className='text-lg'>
                              Raw Parsed Data
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <pre className='bg-gray-50 p-4 rounded text-xs overflow-x-auto'>
                              {JSON.stringify(result.rawParsed, null, 2)}
                           </pre>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle className='text-lg'>
                              Converted Dispenser Readings
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <pre className='bg-blue-50 p-4 rounded text-xs overflow-x-auto'>
                              {JSON.stringify(
                                 result.dispenserReadings,
                                 null,
                                 2
                              )}
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
