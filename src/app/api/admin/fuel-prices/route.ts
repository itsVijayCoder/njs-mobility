import { NextRequest, NextResponse } from "next/server";

// Mock fuel prices data - replace with actual database calls
const mockFuelPrices = [
   {
      id: "1",
      fuel_type: "MS",
      price: 101.66,
      effective_date: new Date().toISOString().split("T")[0],
      created_by: "1",
      created_at: new Date().toISOString(),
   },
   {
      id: "2",
      fuel_type: "HSD",
      price: 93.26,
      effective_date: new Date().toISOString().split("T")[0],
      created_by: "1",
      created_at: new Date().toISOString(),
   },
];

export async function GET(request: NextRequest) {
   try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real application, you would fetch this from your database
      // Example:
      // const fuelPrices = await db.fuel_prices.findMany({
      //    where: {
      //       effective_date: {
      //          lte: new Date()
      //       }
      //    },
      //    orderBy: {
      //       effective_date: 'desc'
      //    },
      //    take: 2 // Get latest prices for MS and HSD
      // });

      return NextResponse.json(mockFuelPrices);
   } catch (error) {
      console.error("Error fetching fuel prices:", error);
      return NextResponse.json(
         { error: "Failed to fetch fuel prices" },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { fuel_type, price, effective_date } = body;

      // Validate input
      if (!fuel_type || !price || !effective_date) {
         return NextResponse.json(
            {
               error: "Missing required fields: fuel_type, price, effective_date",
            },
            { status: 400 }
         );
      }

      if (!["MS", "HSD"].includes(fuel_type)) {
         return NextResponse.json(
            { error: "Invalid fuel_type. Must be MS or HSD" },
            { status: 400 }
         );
      }

      // In a real application, you would save this to your database
      // Example:
      // const newFuelPrice = await db.fuel_prices.create({
      //    data: {
      //       fuel_type,
      //       price: parseFloat(price),
      //       effective_date: new Date(effective_date),
      //       created_by: getUserIdFromSession(request),
      //    }
      // });

      const newFuelPrice = {
         id: Date.now().toString(),
         fuel_type,
         price: parseFloat(price),
         effective_date,
         created_by: "1",
         created_at: new Date().toISOString(),
      };

      return NextResponse.json(newFuelPrice, { status: 201 });
   } catch (error) {
      console.error("Error creating fuel price:", error);
      return NextResponse.json(
         { error: "Failed to create fuel price" },
         { status: 500 }
      );
   }
}
