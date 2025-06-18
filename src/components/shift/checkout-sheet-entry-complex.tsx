"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { CheckoutSheet } from "@/types/checkout";
import { CashDenomination } from "@/types/shift";

interface CheckoutSheetEntryProps {
   shiftId: string;
   checkoutNumber: number;
   operatorName: string;
   expectedAmount?: number;
   existingCheckout?: CheckoutSheet;
   onSave: (checkout: Partial<CheckoutSheet>) => void;
   disabled?: boolean;
}

const DENOMINATIONS = [500, 200, 100, 50, 20, 10];
const COINS = [20, 10, 5, 2, 1];

export function CheckoutSheetEntry({
   shiftId,
   checkoutNumber,
   operatorName,
   expectedAmount = 0,
   existingCheckout,
   onSave,
   disabled = false,
}: CheckoutSheetEntryProps) {
   const [checkout, setCheckout] = useState<Partial<CheckoutSheet>>(() => ({
      shift_id: shiftId,
      checkout_number: checkoutNumber,
      operator_name: operatorName,
      cash_received: 0,
      card_payments: 0,
      upi_payments: 0,
      other_payments: 0,
      opening_balance: 0,
      closing_balance: 0,
      short_excess: 0,
      cash_denominations: DENOMINATIONS.map((d) => ({
         denomination: d,
         count: 0,
         total: 0,
      })),
      status: "pending",
      notes: "",
      ...existingCheckout,
   }));

   const updateField = (field: keyof CheckoutSheet, value: any) => {
      setCheckout((prev) => ({ ...prev, [field]: value }));
   };

   const updateDenomination = (denomination: number, count: number) => {
      setCheckout((prev) => ({
         ...prev,
         cash_denominations: prev.cash_denominations?.map((d) =>
            d.denomination === denomination
               ? { ...d, count, total: count * denomination }
               : d
         ),
      }));
   };

   // Calculate totals
   useEffect(() => {
      const cashFromDenominations =
         checkout.cash_denominations?.reduce((sum, d) => sum + d.total, 0) || 0;

      const totalReceived =
         cashFromDenominations +
         (checkout.card_payments || 0) +
         (checkout.upi_payments || 0) +
         (checkout.other_payments || 0);

      const variance = totalReceived - expectedAmount;

      setCheckout((prev) => ({
         ...prev,
         cash_received: cashFromDenominations,
         short_excess: variance,
      }));
   }, [
      checkout.cash_denominations,
      checkout.card_payments,
      checkout.upi_payments,
      checkout.other_payments,
      expectedAmount,
   ]);

   const getTotalReceived = () => {
      return (
         (checkout.cash_received || 0) +
         (checkout.card_payments || 0) +
         (checkout.upi_payments || 0) +
         (checkout.other_payments || 0)
      );
   };

   const getVarianceColor = () => {
      const variance = checkout.short_excess || 0;
      if (variance > 0) return "text-green-600";
      if (variance < 0) return "text-red-600";
      return "text-muted-foreground";
   };

   const getVarianceIcon = () => {
      const variance = checkout.short_excess || 0;
      if (variance > 0)
         return <CheckCircle className='h-4 w-4 text-green-600' />;
      if (variance < 0)
         return <AlertTriangle className='h-4 w-4 text-red-600' />;
      return <DollarSign className='h-4 w-4 text-muted-foreground' />;
   };

   const handleSave = () => {
      onSave({
         ...checkout,
         status: checkout.short_excess === 0 ? "completed" : "pending",
      });
   };

   return (
      <Card>
         <CardHeader>
            <div className='flex items-center justify-between'>
               <CardTitle className='flex items-center gap-2'>
                  <DollarSign className='h-5 w-5' />
                  Checkout Sheet {checkoutNumber}
               </CardTitle>
               <Badge
                  variant={
                     checkout.status === "completed" ? "default" : "secondary"
                  }
               >
                  {checkout.status}
               </Badge>
            </div>
            <div className='text-sm text-muted-foreground'>
               Operator: {operatorName}
            </div>
         </CardHeader>
         <CardContent className='space-y-6'>
            {/* Summary */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg'>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Expected
                  </Label>
                  <div className='text-lg font-semibold'>
                     ₹{expectedAmount.toLocaleString("en-IN")}
                  </div>
               </div>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Received
                  </Label>
                  <div className='text-lg font-semibold'>
                     ₹{getTotalReceived().toLocaleString("en-IN")}
                  </div>
               </div>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Variance
                  </Label>
                  <div
                     className={`text-lg font-semibold flex items-center gap-1 ${getVarianceColor()}`}
                  >
                     {getVarianceIcon()}₹
                     {Math.abs(checkout.short_excess || 0).toLocaleString(
                        "en-IN"
                     )}
                     {(checkout.short_excess || 0) > 0
                        ? " Excess"
                        : (checkout.short_excess || 0) < 0
                        ? " Short"
                        : ""}
                  </div>
               </div>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Status
                  </Label>
                  <div className='text-lg font-semibold'>{checkout.status}</div>
               </div>
            </div>

            {/* Digital Payments */}
            <div>
               <h3 className='font-semibold mb-3'>Digital Payments</h3>
               <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                     <Label htmlFor='card_payments'>Card Payments</Label>
                     <Input
                        id='card_payments'
                        type='number'
                        step='0.01'
                        value={checkout.card_payments || ""}
                        onChange={(e) =>
                           updateField(
                              "card_payments",
                              parseFloat(e.target.value) || 0
                           )
                        }
                        disabled={disabled}
                     />
                  </div>
                  <div>
                     <Label htmlFor='upi_payments'>UPI Payments</Label>
                     <Input
                        id='upi_payments'
                        type='number'
                        step='0.01'
                        value={checkout.upi_payments || ""}
                        onChange={(e) =>
                           updateField(
                              "upi_payments",
                              parseFloat(e.target.value) || 0
                           )
                        }
                        disabled={disabled}
                     />
                  </div>
                  <div>
                     <Label htmlFor='other_payments'>Other Payments</Label>
                     <Input
                        id='other_payments'
                        type='number'
                        step='0.01'
                        value={checkout.other_payments || ""}
                        onChange={(e) =>
                           updateField(
                              "other_payments",
                              parseFloat(e.target.value) || 0
                           )
                        }
                        disabled={disabled}
                     />
                  </div>
               </div>
            </div>

            <Separator />

            {/* Cash Denominations */}
            <div>
               <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-semibold'>Cash Denominations</h3>
                  <div className='flex gap-2'>
                     <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                           // Quick preset for common amounts
                           updateDenomination(500, 10); // ₹5000
                           updateDenomination(100, 20); // ₹2000
                           updateDenomination(50, 10); // ₹500
                           updateDenomination(20, 25); // ₹500
                        }}
                        disabled={disabled}
                     >
                        Quick ₹8K
                     </Button>
                     <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                           // Clear all denominations
                           DENOMINATIONS.forEach((d) =>
                              updateDenomination(d, 0)
                           );
                        }}
                        disabled={disabled}
                     >
                        Clear All
                     </Button>
                  </div>
               </div>

               {/* Quick Entry Section */}
               <Card className='mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'>
                  <CardContent className='p-4'>
                     <h4 className='font-medium mb-3 text-blue-800 dark:text-blue-200'>
                        Quick Entry
                     </h4>
                     <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                        <Button
                           variant='outline'
                           size='sm'
                           onClick={() =>
                              updateDenomination(
                                 2000,
                                 (checkout.cash_denominations?.find(
                                    (d) => d.denomination === 2000
                                 )?.count || 0) + 1
                              )
                           }
                           disabled={disabled}
                           className='text-xs'
                        >
                           +₹2000
                        </Button>
                        <Button
                           variant='outline'
                           size='sm'
                           onClick={() =>
                              updateDenomination(
                                 500,
                                 (checkout.cash_denominations?.find(
                                    (d) => d.denomination === 500
                                 )?.count || 0) + 1
                              )
                           }
                           disabled={disabled}
                           className='text-xs'
                        >
                           +₹500
                        </Button>
                        <Button
                           variant='outline'
                           size='sm'
                           onClick={() =>
                              updateDenomination(
                                 100,
                                 (checkout.cash_denominations?.find(
                                    (d) => d.denomination === 100
                                 )?.count || 0) + 1
                              )
                           }
                           disabled={disabled}
                           className='text-xs'
                        >
                           +₹100
                        </Button>
                        <Button
                           variant='outline'
                           size='sm'
                           onClick={() =>
                              updateDenomination(
                                 50,
                                 (checkout.cash_denominations?.find(
                                    (d) => d.denomination === 50
                                 )?.count || 0) + 1
                              )
                           }
                           disabled={disabled}
                           className='text-xs'
                        >
                           +₹50
                        </Button>
                     </div>
                  </CardContent>
               </Card>

               {/* Large Notes */}
               <div className='mb-6'>
                  <h4 className='text-sm font-medium text-muted-foreground mb-3'>
                     Large Notes
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     {[500, 200, 100].map((denomination) => {
                        const denominationData =
                           checkout.cash_denominations?.find(
                              (d) => d.denomination === denomination
                           );
                        const count = denominationData?.count || 0;
                        return (
                           <Card key={denomination} className='p-4'>
                              <div className='flex items-center justify-between mb-3'>
                                 <div className='text-lg font-semibold text-primary'>
                                    ₹{denomination}
                                 </div>
                                 <div className='text-sm text-muted-foreground'>
                                    = ₹
                                    {denominationData?.total?.toLocaleString(
                                       "en-IN"
                                    ) || 0}
                                 </div>
                              </div>
                              <div className='flex items-center gap-3'>
                                 <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                       updateDenomination(
                                          denomination,
                                          Math.max(0, count - 1)
                                       )
                                    }
                                    disabled={disabled || count === 0}
                                 >
                                    -
                                 </Button>
                                 <Input
                                    type='number'
                                    min='0'
                                    value={count || ""}
                                    onChange={(e) =>
                                       updateDenomination(
                                          denomination,
                                          parseInt(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-20'
                                 />
                                 <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                       updateDenomination(
                                          denomination,
                                          count + 1
                                       )
                                    }
                                    disabled={disabled}
                                 >
                                    +
                                 </Button>
                                 <div className='flex gap-1'>
                                    <Button
                                       variant='ghost'
                                       size='sm'
                                       onClick={() =>
                                          updateDenomination(
                                             denomination,
                                             count + 5
                                          )
                                       }
                                       disabled={disabled}
                                       className='text-xs px-2'
                                    >
                                       +5
                                    </Button>
                                    <Button
                                       variant='ghost'
                                       size='sm'
                                       onClick={() =>
                                          updateDenomination(
                                             denomination,
                                             count + 10
                                          )
                                       }
                                       disabled={disabled}
                                       className='text-xs px-2'
                                    >
                                       +10
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        );
                     })}
                  </div>
               </div>

               {/* Medium Notes */}
               <div className='mb-6'>
                  <h4 className='text-sm font-medium text-muted-foreground mb-3'>
                     Medium Notes
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     {[200, 100].map((denomination) => {
                        const denominationData =
                           checkout.cash_denominations?.find(
                              (d) => d.denomination === denomination
                           );
                        const count = denominationData?.count || 0;
                        return (
                           <Card key={denomination} className='p-4'>
                              <div className='flex items-center justify-between mb-3'>
                                 <div className='text-lg font-semibold text-green-600'>
                                    ₹{denomination}
                                 </div>
                                 <div className='text-sm text-muted-foreground'>
                                    = ₹
                                    {denominationData?.total?.toLocaleString(
                                       "en-IN"
                                    ) || 0}
                                 </div>
                              </div>
                              <div className='flex items-center gap-3'>
                                 <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                       updateDenomination(
                                          denomination,
                                          Math.max(0, count - 1)
                                       )
                                    }
                                    disabled={disabled || count === 0}
                                 >
                                    -
                                 </Button>
                                 <Input
                                    type='number'
                                    min='0'
                                    value={count || ""}
                                    onChange={(e) =>
                                       updateDenomination(
                                          denomination,
                                          parseInt(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-20'
                                 />
                                 <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                       updateDenomination(
                                          denomination,
                                          count + 1
                                       )
                                    }
                                    disabled={disabled}
                                 >
                                    +
                                 </Button>
                                 <div className='flex gap-1'>
                                    <Button
                                       variant='ghost'
                                       size='sm'
                                       onClick={() =>
                                          updateDenomination(
                                             denomination,
                                             count + 10
                                          )
                                       }
                                       disabled={disabled}
                                       className='text-xs px-2'
                                    >
                                       +10
                                    </Button>
                                    <Button
                                       variant='ghost'
                                       size='sm'
                                       onClick={() =>
                                          updateDenomination(
                                             denomination,
                                             count + 20
                                          )
                                       }
                                       disabled={disabled}
                                       className='text-xs px-2'
                                    >
                                       +20
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        );
                     })}
                  </div>
               </div>

               {/* Small Notes & Coins */}
               <div className='mb-4'>
                  <h4 className='text-sm font-medium text-muted-foreground mb-3'>
                     Small Notes & Coins
                  </h4>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
                     {[50, 20, 10, 5, 2, 1].map((denomination) => {
                        const denominationData =
                           checkout.cash_denominations?.find(
                              (d) => d.denomination === denomination
                           );
                        const count = denominationData?.count || 0;
                        const isCoins = denomination <= 10;
                        return (
                           <Card key={denomination} className='p-3'>
                              <div className='text-center mb-2'>
                                 <div
                                    className={`text-sm font-medium ${
                                       isCoins
                                          ? "text-orange-600"
                                          : "text-blue-600"
                                    }`}
                                 >
                                    ₹{denomination}
                                 </div>
                                 <div className='text-xs text-muted-foreground'>
                                    ₹{denominationData?.total || 0}
                                 </div>
                              </div>
                              <div className='flex items-center gap-1'>
                                 <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                       updateDenomination(
                                          denomination,
                                          Math.max(0, count - 1)
                                       )
                                    }
                                    disabled={disabled || count === 0}
                                    className='h-7 w-7 p-0'
                                 >
                                    -
                                 </Button>
                                 <Input
                                    type='number'
                                    min='0'
                                    value={count || ""}
                                    onChange={(e) =>
                                       updateDenomination(
                                          denomination,
                                          parseInt(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center h-7 text-xs'
                                 />
                                 <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                       updateDenomination(
                                          denomination,
                                          count + 1
                                       )
                                    }
                                    disabled={disabled}
                                    className='h-7 w-7 p-0'
                                 >
                                    +
                                 </Button>
                              </div>
                           </Card>
                        );
                     })}
                  </div>
               </div>

               {/* Cash Summary */}
               <Card className='bg-muted/50 p-4'>
                  <div className='flex items-center justify-between'>
                     <div>
                        <div className='text-sm text-muted-foreground'>
                           Total Cash Count
                        </div>
                        <div className='text-2xl font-bold'>
                           ₹
                           {checkout.cash_received?.toLocaleString("en-IN") ||
                              0}
                        </div>
                     </div>
                     <div className='text-right'>
                        <div className='text-sm text-muted-foreground'>
                           Total Notes & Coins
                        </div>
                        <div className='text-lg font-semibold'>
                           {checkout.cash_denominations?.reduce(
                              (sum, d) => sum + d.count,
                              0
                           ) || 0}
                        </div>
                     </div>
                  </div>
               </Card>
            </div>

            <Separator />

            {/* Balance & Notes */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               <div>
                  <Label htmlFor='opening_balance'>Opening Balance</Label>
                  <Input
                     id='opening_balance'
                     type='number'
                     step='0.01'
                     value={checkout.opening_balance || ""}
                     onChange={(e) =>
                        updateField(
                           "opening_balance",
                           parseFloat(e.target.value) || 0
                        )
                     }
                     disabled={disabled}
                  />
               </div>
               <div>
                  <Label htmlFor='closing_balance'>Closing Balance</Label>
                  <Input
                     id='closing_balance'
                     type='number'
                     step='0.01'
                     value={checkout.closing_balance || ""}
                     onChange={(e) =>
                        updateField(
                           "closing_balance",
                           parseFloat(e.target.value) || 0
                        )
                     }
                     disabled={disabled}
                  />
               </div>
            </div>

            <div>
               <Label htmlFor='notes'>Notes</Label>
               <textarea
                  id='notes'
                  className='flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                  value={checkout.notes || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                     updateField("notes", e.target.value)
                  }
                  disabled={disabled}
                  placeholder='Any additional notes or observations...'
               />
            </div>

            <div className='flex justify-end'>
               <Button onClick={handleSave} disabled={disabled}>
                  <Save className='h-4 w-4 mr-2' />
                  Save Checkout
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
