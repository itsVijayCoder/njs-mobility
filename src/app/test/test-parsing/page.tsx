import {
   parsePastedData,
   convertToDispenserReadings,
} from "@/utils/shift-utils";

export default function TestParsing() {
   const sampleData = `PRODUCT	PUMP	NOZZLE	OPENING	CLOSING	TOTAL
Diesel	1	1	226928.6	227183.59	254.99
PETROL		2	96221.4	96526.27	304.87
Diesel	2	1	310406.14	310917.69	511.55
PETROL		2	50316.06	50475.28	159.22
Diesel	3	1	131559.38	131932.37	372.99
PETROL		2	114335.57	114681.68	346.11
Diesel	4	1	194369.88	194619.02	249.14
PETROL		2	25012.78	25123.46	110.68`;

   const handleTestParsing = () => {
      console.log("Testing parsing with sample data...");

      const parsedData = parsePastedData(sampleData);
      console.log("Parsed data:", parsedData);

      const fuelPrices = { MS: 93.26, HSD: 93.26 };
      const dispensers = convertToDispenserReadings(parsedData, fuelPrices);
      console.log("Converted dispensers:", dispensers);

      // Display results
      const resultsDiv = document.getElementById("results");
      if (resultsDiv) {
         resultsDiv.innerHTML = `
        <h3>Parsed Data (${parsedData.length} items):</h3>
        <pre>${JSON.stringify(parsedData, null, 2)}</pre>
        
        <h3>Converted Dispensers (${dispensers.length} dispensers):</h3>
        <pre>${JSON.stringify(dispensers, null, 2)}</pre>
      `;
      }
   };

   return (
      <div className='container mx-auto p-4'>
         <h1 className='text-2xl font-bold mb-4'>Test Parsing Logic</h1>

         <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Sample Data:</h2>
            <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
               {sampleData}
            </pre>
         </div>

         <button
            onClick={handleTestParsing}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
         >
            Test Parsing Logic
         </button>

         <div id='results' className='mt-6'></div>
      </div>
   );
}
