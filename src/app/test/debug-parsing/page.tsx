"use client";
import { useState } from "react";

export default function TestParsingPage() {
   const [testResult, setTestResult] = useState<string>("");

   const sampleData = `PRODUCT	PUMP	NOZZLE	OPENING	CLOSING	TOTAL
Diesel	1	1	226928.6	227183.59	254.99
PETROL		2	96221.4	96526.27	304.87
Diesel	2	1	310406.14	310917.69	511.55
PETROL		2	50316.06	50475.28	159.22
Diesel	3	1	131559.38	131932.37	372.99
PETROL		2	114335.57	114681.68	346.11
Diesel	4	1	194369.88	194619.02	249.14
PETROL		2	25012.78	25123.46	110.68`;

   const testParsing = () => {
      // Inline parsing logic to test
      const lines = sampleData.trim().split("\n");
      const data: any[] = [];
      let currentPumpNumber = 0;

      console.log("Lines:", lines);

      for (let i = 0; i < lines.length; i++) {
         const line = lines[i];
         console.log(`Processing line ${i}: "${line}"`);

         // Skip header row and empty lines
         if (
            line.includes("PRODUCT") ||
            line.includes("PUMP") ||
            !line.trim()
         ) {
            console.log("Skipping header/empty line");
            continue;
         }

         const columns = line.split("\t").map((col) => col.trim());
         console.log("Columns:", columns);

         if (columns.length >= 6) {
            const product = columns[0];
            let pump = parseInt(columns[1]) || 0;
            const nozzle = parseInt(columns[2]) || 0;
            const opening = parseFloat(columns[3]) || 0;
            const closing = parseFloat(columns[4]) || 0;
            const total = parseFloat(columns[5]) || 0;

            console.log(
               `Product: ${product}, Pump: ${pump}, Original pump: "${columns[1]}"`
            );

            // Handle the case where PETROL rows have empty pump column
            if (product === "Diesel" && pump > 0) {
               currentPumpNumber = pump;
               console.log(`Set current pump number to: ${currentPumpNumber}`);
            } else if (product === "PETROL" && pump === 0) {
               pump = currentPumpNumber;
               console.log(
                  `Using current pump number ${currentPumpNumber} for PETROL`
               );
            }

            if ((product === "Diesel" || product === "PETROL") && pump > 0) {
               const item = {
                  product: product as "Diesel" | "PETROL",
                  pump,
                  nozzle,
                  opening,
                  closing,
                  total,
               };
               data.push(item);
               console.log("Added item:", item);
            } else {
               console.log("Skipped item - invalid product or pump");
            }
         } else {
            console.log("Skipped line - insufficient columns");
         }
      }

      const result = JSON.stringify(data, null, 2);
      setTestResult(result);
      console.log("Final parsed data:", result);
   };

   return (
      <div className='container mx-auto p-4'>
         <h1 className='text-2xl font-bold mb-4'>Parsing Debug Test</h1>

         <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Sample Data:</h2>
            <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto border'>
               {sampleData}
            </pre>
         </div>

         <button
            onClick={testParsing}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4'
         >
            Test Parsing (Check Console)
         </button>

         {testResult && (
            <div className='mt-4'>
               <h2 className='text-lg font-semibold mb-2'>Parsed Result:</h2>
               <pre className='bg-green-50 p-4 rounded text-sm overflow-x-auto border border-green-200'>
                  {testResult}
               </pre>
            </div>
         )}

         <div className='mt-4 text-sm text-gray-600'>
            <p>Open browser developer tools to see detailed parsing logs.</p>
            <p>Expected result: 8 items (4 Diesel + 4 PETROL)</p>
         </div>
      </div>
   );
}
