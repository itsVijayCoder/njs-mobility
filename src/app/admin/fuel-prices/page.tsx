"use client";

import React, { useState, useEffect } from "react";
import {
   History,
   TrendingUp,
   TrendingDown,
   AlertTriangle,
   Clock,
   Check,
   X,
   RefreshCw,
   Save,
   Fuel,
   DollarSign,
   Zap,
   Shield,
   Calendar,
} from "lucide-react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FuelPrice } from "@/types/shift";
import { AdminProvider } from "@/contexts/admin-context";
import { AdminGuard } from "@/components/admin/admin-guard";

interface FuelPriceUpdate {
   fuel_type: "MS" | "HSD";
   price: number;
   effective_date: string;
}

// Toast utility for better UX
const showToast = (message: string, type: "success" | "error" = "success") => {
   console.log(`${type.toUpperCase()}: ${message}`);
   // In production, replace with actual toast library like sonner
};

function FuelPricesContent() {
   const [newPrices, setNewPrices] = useState({
      ms_price: "",
      hsd_price: "",
      effective_date: new Date().toISOString().split("T")[0],
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [lastUpdate, setLastUpdate] = useState<string>("");

   const queryClient = useQueryClient();

   // Fetch current fuel prices with real-time updates
   const {
      data: fuelPrices = [],
      isLoading,
      refetch,
   } = useQuery({
      queryKey: ["fuel_prices"],
      queryFn: async () => {
         const response = await fetch("/api/admin/fuel-prices");
         if (!response.ok) throw new Error("Failed to fetch prices");
         return response.json();
      },
      refetchInterval: 5000, // Auto-refresh every 5 seconds
   });

   // Auto-refresh indicator
   useEffect(() => {
      setLastUpdate(new Date().toLocaleTimeString());
   }, [fuelPrices]);

   const currentMSPrice = fuelPrices
      .filter((price: FuelPrice) => price.fuel_type === "MS")
      .sort(
         (a: FuelPrice, b: FuelPrice) =>
            new Date(b.effective_date).getTime() -
            new Date(a.effective_date).getTime()
      )[0];

   const currentHSDPrice = fuelPrices
      .filter((price: FuelPrice) => price.fuel_type === "HSD")
      .sort(
         (a: FuelPrice, b: FuelPrice) =>
            new Date(b.effective_date).getTime() -
            new Date(a.effective_date).getTime()
      )[0];

   // Update prices mutation
   const updatePricesMutation = useMutation({
      mutationFn: async (updates: FuelPriceUpdate[]) => {
         const results = await Promise.all(
            updates.map(async (update) => {
               const response = await fetch("/api/admin/fuel-prices", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                     ...update,
                     created_by: "admin",
                     created_at: new Date().toISOString(),
                  }),
               });
               if (!response.ok)
                  throw new Error(`Failed to update ${update.fuel_type} price`);
               return response.json();
            })
         );
         return results;
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["fuel_prices"] });
         showToast(
            `✅ Updated prices for ${data
               .map((d: any) => d.fuel_type)
               .join(" and ")} successfully!`
         );
         setNewPrices({
            ms_price: "",
            hsd_price: "",
            effective_date: new Date().toISOString().split("T")[0],
         });
      },
      onError: (error: any) => {
         showToast(`❌ Failed to update prices: ${error.message}`, "error");
      },
   });

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
         minimumFractionDigits: 2,
      }).format(amount);
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-IN", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const handleInputChange = (field: string, value: string) => {
      setNewPrices((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleUpdatePrices = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const updates: FuelPriceUpdate[] = [];

         if (
            newPrices.ms_price &&
            parseFloat(newPrices.ms_price) !== currentMSPrice?.price
         ) {
            updates.push({
               fuel_type: "MS",
               price: parseFloat(newPrices.ms_price),
               effective_date: newPrices.effective_date,
            });
         }

         if (
            newPrices.hsd_price &&
            parseFloat(newPrices.hsd_price) !== currentHSDPrice?.price
         ) {
            updates.push({
               fuel_type: "HSD",
               price: parseFloat(newPrices.hsd_price),
               effective_date: newPrices.effective_date,
            });
         }

         if (updates.length === 0) {
            showToast("⚠️ No price changes detected", "error");
            return;
         }

         await updatePricesMutation.mutateAsync(updates);
      } catch (error) {
         console.error("Update error:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const priceHistory = fuelPrices
      .sort(
         (a: FuelPrice, b: FuelPrice) =>
            new Date(b.effective_date).getTime() -
            new Date(a.effective_date).getTime()
      )
      .slice(0, 10);

   if (isLoading) {
      return (
         <div className='space-y-4 p-6'>
            <div className='h-8 bg-muted animate-pulse rounded'></div>
            <div className='grid gap-4 md:grid-cols-2'>
               <div className='h-48 bg-muted animate-pulse rounded'></div>
               <div className='h-48 bg-muted animate-pulse rounded'></div>
            </div>
         </div>
      );
   }

   return (
      <div className='space-y-6 p-6'>
         {/* Enhanced Header with Admin Highlighting */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold tracking-tight flex items-center gap-2'>
                  <div className='relative'>
                     <Fuel className='h-8 w-8 text-blue-600' />
                     <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                  </div>
                  Fuel Price Management
               </h1>
               <p className='text-muted-foreground flex items-center gap-2 mt-1'>
                  <Zap className='h-4 w-4 text-yellow-500' />
                  Real-time fuel pricing control - Updates reflect across all
                  shift readings instantly
               </p>
            </div>
            <div className='flex items-center gap-3'>
               <Badge
                  variant='outline'
                  className='bg-red-50 text-red-700 border-red-200 px-3 py-1'
               >
                  <Shield className='h-3 w-3 mr-1' />
                  ADMIN ONLY
               </Badge>
               <Badge
                  variant='outline'
                  className='bg-green-50 text-green-700 border-green-200 px-2 py-1'
               >
                  <div className='w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse'></div>
                  LIVE
               </Badge>
               <Button
                  variant='outline'
                  size='sm'
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className='hover:bg-blue-50'
               >
                  <RefreshCw
                     className={`h-4 w-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                     }`}
                  />
                  Refresh
               </Button>
            </div>
         </div>

         {/* Live Status Alert */}
         <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
            <CardContent className='pt-6'>
               <div className='flex items-start gap-3'>
                  <div className='p-2 bg-blue-100 rounded-lg'>
                     <AlertTriangle className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='flex-1'>
                     <h3 className='font-semibold text-blue-900 mb-1'>
                        Live Price Management System
                     </h3>
                     <p className='text-blue-800 text-sm'>
                        Price changes will immediately update all active shift
                        readings and future calculations. All connected systems
                        will receive the new prices in real-time.
                     </p>
                     <div className='mt-2 flex items-center gap-2 text-xs text-blue-700'>
                        <Clock className='h-3 w-3' />
                        Last updated: {lastUpdate}
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Enhanced Current Prices Display */}
         <div className='grid gap-6 md:grid-cols-2'>
            {/* MS Price Card with Enhanced Highlighting */}
            <Card className='relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300'>
               <div className='absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-10 rounded-full -mr-16 -mt-16'></div>
               <div className='absolute top-2 right-2'>
                  <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
               </div>
               <CardHeader className='relative'>
                  <CardTitle className='flex items-center justify-between'>
                     <div className='flex items-center'>
                        <div className='p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mr-3 shadow-md'>
                           <TrendingUp className='h-6 w-6 text-white' />
                        </div>
                        <div>
                           <div className='text-lg font-bold text-blue-900'>
                              Motor Spirit (MS)
                           </div>
                           <div className='text-sm text-blue-700'>
                              Petrol Price Control
                           </div>
                        </div>
                     </div>
                     <Badge
                        variant='secondary'
                        className='bg-blue-600 text-white font-semibold px-3 py-1'
                     >
                        PETROL
                     </Badge>
                  </CardTitle>
               </CardHeader>
               <CardContent className='relative'>
                  <div className='text-4xl font-bold mb-3 text-blue-800 flex items-baseline gap-2'>
                     {currentMSPrice
                        ? formatCurrency(currentMSPrice.price)
                        : "N/A"}
                     <span className='text-lg text-blue-600 font-normal'>
                        per litre
                     </span>
                  </div>
                  {currentMSPrice && (
                     <>
                        <div className='text-sm text-blue-700 mb-3 flex items-center gap-2'>
                           <Calendar className='h-4 w-4' />
                           Effective from{" "}
                           {formatDate(currentMSPrice.effective_date)}
                        </div>
                        <div className='flex items-center gap-2'>
                           <Badge
                              variant='outline'
                              className='bg-blue-600 text-white border-blue-600'
                           >
                              <Check className='h-3 w-3 mr-1' />
                              ACTIVE
                           </Badge>
                           <Badge
                              variant='outline'
                              className='bg-white text-blue-600 border-blue-200'
                           >
                              Live Rate
                           </Badge>
                        </div>
                     </>
                  )}
               </CardContent>
            </Card>

            {/* HSD Price Card with Enhanced Highlighting */}
            <Card className='relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 via-green-100 to-green-50 shadow-lg hover:shadow-xl transition-all duration-300'>
               <div className='absolute top-0 right-0 w-32 h-32 bg-green-600 opacity-10 rounded-full -mr-16 -mt-16'></div>
               <div className='absolute top-2 right-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
               </div>
               <CardHeader className='relative'>
                  <CardTitle className='flex items-center justify-between'>
                     <div className='flex items-center'>
                        <div className='p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mr-3 shadow-md'>
                           <TrendingUp className='h-6 w-6 text-white' />
                        </div>
                        <div>
                           <div className='text-lg font-bold text-green-900'>
                              High Speed Diesel (HSD)
                           </div>
                           <div className='text-sm text-green-700'>
                              Diesel Price Control
                           </div>
                        </div>
                     </div>
                     <Badge
                        variant='secondary'
                        className='bg-green-600 text-white font-semibold px-3 py-1'
                     >
                        DIESEL
                     </Badge>
                  </CardTitle>
               </CardHeader>
               <CardContent className='relative'>
                  <div className='text-4xl font-bold mb-3 text-green-800 flex items-baseline gap-2'>
                     {currentHSDPrice
                        ? formatCurrency(currentHSDPrice.price)
                        : "N/A"}
                     <span className='text-lg text-green-600 font-normal'>
                        per litre
                     </span>
                  </div>
                  {currentHSDPrice && (
                     <>
                        <div className='text-sm text-green-700 mb-3 flex items-center gap-2'>
                           <Clock className='h-4 w-4' />
                           Effective from{" "}
                           {formatDate(currentHSDPrice.effective_date)}
                        </div>
                        <div className='flex items-center gap-2'>
                           <Badge
                              variant='outline'
                              className='bg-green-600 text-white border-green-600'
                           >
                              <Check className='h-3 w-3 mr-1' />
                              ACTIVE
                           </Badge>
                           <Badge
                              variant='outline'
                              className='bg-white text-green-600 border-green-200'
                           >
                              Live Rate
                           </Badge>
                        </div>
                     </>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* Enhanced Price Update Form */}
         <Card className='border-2 border-orange-200 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 shadow-lg'>
            <CardHeader className='bg-gradient-to-r from-orange-100 to-yellow-100 border-b border-orange-200'>
               <CardTitle className='flex items-center gap-2'>
                  <div className='p-2 bg-orange-600 rounded-lg'>
                     <DollarSign className='h-5 w-5 text-white' />
                  </div>
                  <div>
                     <div className='text-orange-900'>Update Fuel Prices</div>
                     <div className='text-sm text-orange-700 font-normal'>
                        Administrative price control panel
                     </div>
                  </div>
               </CardTitle>
               <CardDescription className='text-orange-800'>
                  Set new fuel prices - Changes will be applied immediately
                  across all systems
               </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
               <form onSubmit={handleUpdatePrices} className='space-y-6'>
                  <div className='grid gap-6 md:grid-cols-2'>
                     {/* MS Price Input */}
                     <div className='space-y-2'>
                        <Label
                           htmlFor='ms_price'
                           className='flex items-center gap-2 font-semibold'
                        >
                           <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                           Motor Spirit (MS) Price
                        </Label>
                        <div className='relative'>
                           <Input
                              id='ms_price'
                              type='number'
                              step='0.01'
                              min='0'
                              placeholder={
                                 currentMSPrice
                                    ? `Current: ₹${currentMSPrice.price}`
                                    : "Enter new price"
                              }
                              value={newPrices.ms_price}
                              onChange={(e) =>
                                 handleInputChange("ms_price", e.target.value)
                              }
                              className='pl-10 border-blue-200 focus:border-blue-400 h-12 text-lg'
                           />
                           <DollarSign className='absolute left-3 top-3.5 h-5 w-5 text-blue-500' />
                        </div>
                        {newPrices.ms_price && currentMSPrice && (
                           <div className='text-sm'>
                              {parseFloat(newPrices.ms_price) >
                              currentMSPrice.price ? (
                                 <Badge
                                    variant='outline'
                                    className='text-red-600 border-red-200 bg-red-50'
                                 >
                                    <TrendingUp className='h-3 w-3 mr-1' />
                                    +₹
                                    {(
                                       parseFloat(newPrices.ms_price) -
                                       currentMSPrice.price
                                    ).toFixed(2)}{" "}
                                    increase
                                 </Badge>
                              ) : parseFloat(newPrices.ms_price) <
                                currentMSPrice.price ? (
                                 <Badge
                                    variant='outline'
                                    className='text-green-600 border-green-200 bg-green-50'
                                 >
                                    <TrendingDown className='h-3 w-3 mr-1' />
                                    -₹
                                    {(
                                       currentMSPrice.price -
                                       parseFloat(newPrices.ms_price)
                                    ).toFixed(2)}{" "}
                                    decrease
                                 </Badge>
                              ) : null}
                           </div>
                        )}
                     </div>

                     {/* HSD Price Input */}
                     <div className='space-y-2'>
                        <Label
                           htmlFor='hsd_price'
                           className='flex items-center gap-2 font-semibold'
                        >
                           <div className='w-3 h-3 bg-green-600 rounded-full'></div>
                           High Speed Diesel (HSD) Price
                        </Label>
                        <div className='relative'>
                           <Input
                              id='hsd_price'
                              type='number'
                              step='0.01'
                              min='0'
                              placeholder={
                                 currentHSDPrice
                                    ? `Current: ₹${currentHSDPrice.price}`
                                    : "Enter new price"
                              }
                              value={newPrices.hsd_price}
                              onChange={(e) =>
                                 handleInputChange("hsd_price", e.target.value)
                              }
                              className='pl-10 border-green-200 focus:border-green-400 h-12 text-lg'
                           />
                           <DollarSign className='absolute left-3 top-3.5 h-5 w-5 text-green-500' />
                        </div>
                        {newPrices.hsd_price && currentHSDPrice && (
                           <div className='text-sm'>
                              {parseFloat(newPrices.hsd_price) >
                              currentHSDPrice.price ? (
                                 <Badge
                                    variant='outline'
                                    className='text-red-600 border-red-200 bg-red-50'
                                 >
                                    <TrendingUp className='h-3 w-3 mr-1' />
                                    +₹
                                    {(
                                       parseFloat(newPrices.hsd_price) -
                                       currentHSDPrice.price
                                    ).toFixed(2)}{" "}
                                    increase
                                 </Badge>
                              ) : parseFloat(newPrices.hsd_price) <
                                currentHSDPrice.price ? (
                                 <Badge
                                    variant='outline'
                                    className='text-green-600 border-green-200 bg-green-50'
                                 >
                                    <TrendingDown className='h-3 w-3 mr-1' />
                                    -₹
                                    {(
                                       currentHSDPrice.price -
                                       parseFloat(newPrices.hsd_price)
                                    ).toFixed(2)}{" "}
                                    decrease
                                 </Badge>
                              ) : null}
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Effective Date */}
                  <div className='space-y-2'>
                     <Label
                        htmlFor='effective_date'
                        className='flex items-center gap-2 font-semibold'
                     >
                        <Clock className='h-4 w-4 text-orange-600' />
                        Effective Date
                     </Label>
                     <Input
                        id='effective_date'
                        type='date'
                        value={newPrices.effective_date}
                        onChange={(e) =>
                           handleInputChange("effective_date", e.target.value)
                        }
                        className='border-orange-200 focus:border-orange-400 h-12'
                     />
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-4'>
                     <Button
                        type='submit'
                        disabled={
                           isSubmitting ||
                           (!newPrices.ms_price && !newPrices.hsd_price)
                        }
                        className='bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white flex-1 h-12 text-lg font-semibold shadow-lg'
                     >
                        {isSubmitting ? (
                           <>
                              <RefreshCw className='h-5 w-5 mr-2 animate-spin' />
                              Updating Prices...
                           </>
                        ) : (
                           <>
                              <Save className='h-5 w-5 mr-2' />
                              Update Prices
                           </>
                        )}
                     </Button>
                     <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                           setNewPrices({
                              ms_price: "",
                              hsd_price: "",
                              effective_date: new Date()
                                 .toISOString()
                                 .split("T")[0],
                           })
                        }
                        disabled={isSubmitting}
                        className='h-12 px-6'
                     >
                        <X className='h-4 w-4 mr-2' />
                        Reset
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>

         {/* Price History */}
         <Card className='shadow-md'>
            <CardHeader>
               <CardTitle className='flex items-center gap-2'>
                  <History className='h-5 w-5 text-slate-600' />
                  Recent Price History
               </CardTitle>
               <CardDescription>
                  Last 10 price updates with timestamps
               </CardDescription>
            </CardHeader>
            <CardContent>
               {priceHistory.length > 0 ? (
                  <div className='space-y-2'>
                     {priceHistory.map((price: FuelPrice, index: number) => (
                        <div
                           key={`${price.fuel_type}-${price.effective_date}-${index}`}
                           className='flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border hover:shadow-md transition-shadow'
                        >
                           <div className='flex items-center gap-3'>
                              <Badge
                                 variant={
                                    price.fuel_type === "MS"
                                       ? "default"
                                       : "secondary"
                                 }
                                 className='px-3 py-1'
                              >
                                 {price.fuel_type === "MS"
                                    ? "PETROL"
                                    : "DIESEL"}
                              </Badge>
                              <span className='font-semibold text-lg'>
                                 {formatCurrency(price.price)}
                              </span>
                           </div>
                           <div className='text-sm text-muted-foreground flex items-center gap-2'>
                              <Clock className='h-3 w-3' />
                              {formatDate(price.effective_date)}
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className='text-center text-muted-foreground py-8'>
                     No price history available
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Enhanced Instructions */}
         <Card className='bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm'>
            <CardHeader>
               <CardTitle className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5 text-amber-600' />
                  Important Administrative Instructions
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className='space-y-4 text-sm'>
                  <div className='grid md:grid-cols-2 gap-6'>
                     <div className='space-y-3'>
                        <h4 className='font-semibold text-blue-600 flex items-center gap-2'>
                           <DollarSign className='h-4 w-4' />
                           Price Update Guidelines
                        </h4>
                        <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                           <li>
                              Enter new price only if you want to change it
                           </li>
                           <li>
                              Leave fields empty to keep current prices
                              unchanged
                           </li>
                           <li>
                              Set effective date for when prices should take
                              effect
                           </li>
                           <li>All changes are logged for audit purposes</li>
                        </ul>
                     </div>
                     <div className='space-y-3'>
                        <h4 className='font-semibold text-green-600 flex items-center gap-2'>
                           <Zap className='h-4 w-4' />
                           Real-Time System Impact
                        </h4>
                        <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                           <li>
                              All active shift readings update automatically
                           </li>
                           <li>
                              Future calculations use new prices immediately
                           </li>
                           <li>System-wide price synchronization</li>
                           <li>
                              No manual refresh required across the platform
                           </li>
                        </ul>
                     </div>
                  </div>
                  <Card className='border-amber-200 bg-amber-50'>
                     <CardContent className='pt-4'>
                        <div className='flex items-start gap-3'>
                           <Shield className='h-5 w-5 text-amber-600 mt-0.5' />
                           <div>
                              <h5 className='font-semibold text-amber-900 mb-1'>
                                 Administrative Access Control
                              </h5>
                              <p className='text-amber-800 text-sm'>
                                 Only authorized administrators can update fuel
                                 prices. Changes affect the entire system and
                                 should be made carefully. All modifications are
                                 tracked and auditable.
                              </p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default function FuelPricesPage() {
   return (
      <AdminProvider>
         <AdminGuard>
            <FuelPricesContent />
         </AdminGuard>
      </AdminProvider>
   );
}
