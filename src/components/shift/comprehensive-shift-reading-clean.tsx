"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Save, Fuel, Clipboard, Download } from "lucide-react";
import {
   parsePastedData,
   convertToDispenserReadings,
   SHIFT_TIMINGS,
} from "@/utils/shift-utils";

interface DispenserReading {
   dispenser_name: string;
   ms_pump: PumpReading;
   hsd_pump: PumpReading;
}

interface PumpReading {
   pump_name: string;
   fuel_type: "MS" | "HSD";
   closing_reading: number;
   opening_reading: number;
   dispensed_qty: number;
   pump_test_qty: number;
   own_use_qty: number;
   net_dispensed_qty: number;
   rate_per_litre: number;
   amount: number;
}

interface ComprehensiveShiftReadingProps {
   shiftId: string;
   shiftNumber: number;
   operatorName: string;
   fuelPrices: { MS: number; HSD: number };
   onSave: (data: any) => void;
   disabled?: boolean;
}

export function ComprehensiveShiftReading({
   shiftId,
   shiftNumber,
   operatorName,
   fuelPrices,
   onSave,
   disabled = false,
}: ComprehensiveShiftReadingProps) {
   const [showPasteDialog, setShowPasteDialog] = useState(false);
   const [pasteData, setPasteData] = useState("");

   const [dispensers, setDispensers] = useState<DispenserReading[]>(() => [
      {
         dispenser_name: "DS-1",
         ms_pump: createEmptyPumpReading("MS-1", "MS", fuelPrices.MS),
         hsd_pump: createEmptyPumpReading("HSD-1", "HSD", fuelPrices.HSD),
      },
      {
         dispenser_name: "DS-2",
         ms_pump: createEmptyPumpReading("MS-2", "MS", fuelPrices.MS),
         hsd_pump: createEmptyPumpReading("HSD-2", "HSD", fuelPrices.HSD),
      },
      {
         dispenser_name: "DS-3",
         ms_pump: createEmptyPumpReading("MS-3", "MS", fuelPrices.MS),
         hsd_pump: createEmptyPumpReading("HSD-3", "HSD", fuelPrices.HSD),
      },
      {
         dispenser_name: "DS-4",
         ms_pump: createEmptyPumpReading("MS-4", "MS", fuelPrices.MS),
         hsd_pump: createEmptyPumpReading("HSD-4", "HSD", fuelPrices.HSD),
      },
   ]);

   function createEmptyPumpReading(
      name: string,
      type: "MS" | "HSD",
      rate: number
   ): PumpReading {
      // For Shift 1, pump test should be 5 for each pump
      const pumpTestQty = shiftNumber === 1 ? 5 : 0;

      return {
         pump_name: name,
         fuel_type: type,
         closing_reading: 0,
         opening_reading: 0,
         dispensed_qty: 0,
         pump_test_qty: pumpTestQty,
         own_use_qty: 0,
         net_dispensed_qty: 0,
         rate_per_litre: rate,
         amount: 0,
      };
   }

   const updatePumpReading = (
      dispenserIndex: number,
      pumpType: "ms_pump" | "hsd_pump",
      field: keyof PumpReading,
      value: number
   ) => {
      setDispensers((prev) => {
         const updated = [...prev];
         const pump = { ...updated[dispenserIndex][pumpType] };

         (pump as any)[field] = value;

         // Auto-calculate derived values
         if (field === "opening_reading" || field === "closing_reading") {
            pump.dispensed_qty = Math.max(
               0,
               pump.closing_reading - pump.opening_reading
            );
         }

         if (
            field === "dispensed_qty" ||
            field === "pump_test_qty" ||
            field === "own_use_qty"
         ) {
            pump.net_dispensed_qty =
               pump.dispensed_qty - pump.pump_test_qty - pump.own_use_qty;
            // Recalculate amount when net dispensed changes
            pump.amount = pump.net_dispensed_qty * pump.rate_per_litre;
         }

         if (field === "net_dispensed_qty" || field === "rate_per_litre") {
            pump.amount = pump.net_dispensed_qty * pump.rate_per_litre;
         }

         updated[dispenserIndex][pumpType] = pump;
         return updated;
      });
   };

   const getTotals = () => {
      const allPumps = dispensers.flatMap((d) => [d.ms_pump, d.hsd_pump]);
      return {
         total_dispensed: allPumps.reduce((sum, p) => sum + p.dispensed_qty, 0),
         total_pump_test: allPumps.reduce((sum, p) => sum + p.pump_test_qty, 0),
         total_own_use: allPumps.reduce((sum, p) => sum + p.own_use_qty, 0),
         total_net_dispensed: allPumps.reduce(
            (sum, p) => sum + p.net_dispensed_qty,
            0
         ),
         total_amount: allPumps.reduce((sum, p) => sum + p.amount, 0),
      };
   };

   const handleSave = () => {
      const data = {
         shift_id: shiftId,
         shift_number: shiftNumber,
         operator_name: operatorName,
         dispensers,
         totals: getTotals(),
      };
      onSave(data);
   };

   const handlePasteData = () => {
      if (!pasteData.trim()) return;

      try {
         const parsedData = parsePastedData(pasteData);
         const newDispensers = convertToDispenserReadings(
            parsedData,
            fuelPrices,
            shiftNumber
         );

         if (newDispensers.length > 0) {
            setDispensers(newDispensers);
            setShowPasteDialog(false);
            setPasteData("");
         }
      } catch (error) {
         console.error("Error parsing pasted data:", error);
      }
   };

   const getShiftTimingInfo = () => {
      return (
         SHIFT_TIMINGS[shiftNumber as keyof typeof SHIFT_TIMINGS] || {
            start: "00:00",
            end: "00:00",
            label: `Shift ${shiftNumber}`,
         }
      );
   };

   // Update fuel prices when they change
   useEffect(() => {
      setDispensers((prev) => {
         return prev.map((dispenser) => ({
            ...dispenser,
            ms_pump: {
               ...dispenser.ms_pump,
               rate_per_litre: fuelPrices.MS,
               amount: dispenser.ms_pump.net_dispensed_qty * fuelPrices.MS,
            },
            hsd_pump: {
               ...dispenser.hsd_pump,
               rate_per_litre: fuelPrices.HSD,
               amount: dispenser.hsd_pump.net_dispensed_qty * fuelPrices.HSD,
            },
         }));
      });
   }, [fuelPrices.MS, fuelPrices.HSD]);

   const totals = getTotals();
   const isShiftOne = shiftNumber === 1;
   const timingInfo = getShiftTimingInfo();

   return (
      <Card>
         <CardHeader>
            <CardTitle className='flex items-center gap-2'>
               <Fuel className='h-5 w-5' />
               SHIFT - {shiftNumber} Reading Entry
            </CardTitle>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
               <span>Operator: {operatorName}</span>
               <Badge variant='outline'>{timingInfo.label}</Badge>
               <Badge variant='outline'>
                  Date: {new Date().toLocaleDateString("en-GB")}
               </Badge>
            </div>
         </CardHeader>
         <CardContent className='space-y-6'>
            {/* Paste Data Section */}
            <div className='flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800'>
               <div>
                  <h4 className='font-medium text-blue-800 dark:text-blue-200'>
                     Quick Data Import
                  </h4>
                  <p className='text-sm text-blue-600 dark:text-blue-300'>
                     Paste pump reading data from spreadsheet to auto-fill the
                     form
                  </p>
               </div>
               <Button
                  variant='outline'
                  onClick={() => setShowPasteDialog(true)}
                  disabled={disabled}
                  className='bg-white dark:bg-blue-900'
               >
                  <Clipboard className='h-4 w-4 mr-2' />
                  Paste Data
               </Button>
            </div>

            {/* Paste Dialog */}
            <Dialog open={showPasteDialog} onOpenChange={setShowPasteDialog}>
               <DialogContent className='max-w-2xl'>
                  <DialogHeader>
                     <DialogTitle>Import Pump Reading Data</DialogTitle>
                     <DialogDescription>
                        Paste your pump reading data from spreadsheet. Expected
                        format:
                        <br />
                        <code className='text-xs bg-muted p-1 rounded mt-2 block'>
                           PRODUCT PUMP NOZZLE OPENING CLOSING TOTAL
                           <br />
                           Diesel 1 1 226928.6 227183.59 254.99
                           <br />
                           PETROL 2 96221.4 96526.27 304.87
                        </code>
                     </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                     <div>
                        <Label htmlFor='pasteData'>Paste Data Here:</Label>
                        <Textarea
                           id='pasteData'
                           value={pasteData}
                           onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                           ) => setPasteData(e.target.value)}
                           placeholder='Paste your pump reading data here...'
                           className='min-h-[200px] font-mono text-sm'
                        />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button
                        variant='outline'
                        onClick={() => setShowPasteDialog(false)}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={handlePasteData}
                        disabled={!pasteData.trim()}
                     >
                        <Download className='h-4 w-4 mr-2' />
                        Import Data
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>

            {/* Summary Totals */}
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg'>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Total Dispensed
                  </Label>
                  <div className='text-lg font-semibold'>
                     {totals.total_dispensed.toFixed(2)}L
                  </div>
               </div>
               {isShiftOne && (
                  <div>
                     <Label className='text-sm text-muted-foreground'>
                        Pump Test
                     </Label>
                     <div className='text-lg font-semibold'>
                        {totals.total_pump_test.toFixed(2)}L
                     </div>
                  </div>
               )}
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Own Use
                  </Label>
                  <div className='text-lg font-semibold'>
                     {totals.total_own_use.toFixed(2)}L
                  </div>
               </div>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Net Dispensed
                  </Label>
                  <div className='text-lg font-semibold text-primary'>
                     {totals.total_net_dispensed.toFixed(2)}L
                  </div>
               </div>
               <div>
                  <Label className='text-sm text-muted-foreground'>
                     Total Amount
                  </Label>
                  <div className='text-xl font-bold text-green-600'>
                     ₹{totals.total_amount.toLocaleString("en-IN")}
                  </div>
               </div>
            </div>

            {/* Dispensers Table */}
            <div className='overflow-x-auto'>
               <table className='w-full border border-border rounded-lg'>
                  <thead className='bg-muted'>
                     <tr>
                        <th className='text-left p-3 border-b'>Pump</th>
                        <th className='text-center p-3 border-b'>Product</th>
                        <th className='text-center p-3 border-b'>Opening</th>
                        <th className='text-center p-3 border-b'>Closing</th>
                        <th className='text-center p-3 border-b'>Total (L)</th>
                        {isShiftOne && (
                           <th className='text-center p-3 border-b'>
                              Pump Test (L)
                           </th>
                        )}
                        <th className='text-center p-3 border-b'>
                           Own Use (L)
                        </th>
                        <th className='text-center p-3 border-b'>
                           Net Dispensed (L)
                        </th>
                        <th className='text-center p-3 border-b'>Rate (₹/L)</th>
                        <th className='text-right p-3 border-b'>Amount (₹)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {dispensers.map((dispenser, dispenserIndex) => (
                        <React.Fragment key={dispenser.dispenser_name}>
                           {/* HSD (Diesel) Row */}
                           <tr className='border-b'>
                              <td className='p-3 font-medium' rowSpan={2}>
                                 {dispenser.dispenser_name}
                              </td>
                              <td className='p-3 text-center'>
                                 <Badge
                                    variant='secondary'
                                    className='bg-green-100 text-green-800'
                                 >
                                    Diesel
                                 </Badge>
                              </td>
                              <td className='p-3 text-center'>
                                 <Input
                                    type='number'
                                    step='0.01'
                                    value={
                                       dispenser.hsd_pump.opening_reading || ""
                                    }
                                    onChange={(e) =>
                                       updatePumpReading(
                                          dispenserIndex,
                                          "hsd_pump",
                                          "opening_reading",
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-28 h-8'
                                 />
                              </td>
                              <td className='p-3 text-center'>
                                 <Input
                                    type='number'
                                    step='0.01'
                                    value={
                                       dispenser.hsd_pump.closing_reading || ""
                                    }
                                    onChange={(e) =>
                                       updatePumpReading(
                                          dispenserIndex,
                                          "hsd_pump",
                                          "closing_reading",
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-28 h-8'
                                 />
                              </td>
                              <td className='p-3 text-center font-medium'>
                                 {dispenser.hsd_pump.dispensed_qty.toFixed(2)}
                              </td>
                              {isShiftOne && (
                                 <td className='p-3 text-center'>
                                    <Input
                                       type='number'
                                       step='0.01'
                                       value={
                                          dispenser.hsd_pump.pump_test_qty || ""
                                       }
                                       onChange={(e) =>
                                          updatePumpReading(
                                             dispenserIndex,
                                             "hsd_pump",
                                             "pump_test_qty",
                                             parseFloat(e.target.value) || 0
                                          )
                                       }
                                       disabled={disabled}
                                       className='text-center w-20 h-8'
                                    />
                                 </td>
                              )}
                              <td className='p-3 text-center'>
                                 <Input
                                    type='number'
                                    step='0.01'
                                    value={dispenser.hsd_pump.own_use_qty || ""}
                                    onChange={(e) =>
                                       updatePumpReading(
                                          dispenserIndex,
                                          "hsd_pump",
                                          "own_use_qty",
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-20 h-8'
                                 />
                              </td>
                              <td className='p-3 text-center font-medium text-primary'>
                                 {dispenser.hsd_pump.net_dispensed_qty.toFixed(
                                    2
                                 )}
                              </td>
                              <td className='p-3 text-center'>
                                 <div className='text-sm font-medium'>
                                    {dispenser.hsd_pump.rate_per_litre.toFixed(
                                       2
                                    )}
                                 </div>
                              </td>
                              <td className='p-3 text-right font-medium'>
                                 ₹
                                 {dispenser.hsd_pump.amount.toLocaleString(
                                    "en-IN"
                                 )}
                              </td>
                           </tr>

                           {/* MS (Petrol) Row */}
                           <tr className='border-b'>
                              <td className='p-3 text-center'>
                                 <Badge
                                    variant='secondary'
                                    className='bg-blue-100 text-blue-800'
                                 >
                                    PETROL
                                 </Badge>
                              </td>
                              <td className='p-3 text-center'>
                                 <Input
                                    type='number'
                                    step='0.01'
                                    value={
                                       dispenser.ms_pump.opening_reading || ""
                                    }
                                    onChange={(e) =>
                                       updatePumpReading(
                                          dispenserIndex,
                                          "ms_pump",
                                          "opening_reading",
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-28 h-8'
                                 />
                              </td>
                              <td className='p-3 text-center'>
                                 <Input
                                    type='number'
                                    step='0.01'
                                    value={
                                       dispenser.ms_pump.closing_reading || ""
                                    }
                                    onChange={(e) =>
                                       updatePumpReading(
                                          dispenserIndex,
                                          "ms_pump",
                                          "closing_reading",
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-28 h-8'
                                 />
                              </td>
                              <td className='p-3 text-center font-medium'>
                                 {dispenser.ms_pump.dispensed_qty.toFixed(2)}
                              </td>
                              {isShiftOne && (
                                 <td className='p-3 text-center'>
                                    <Input
                                       type='number'
                                       step='0.01'
                                       value={
                                          dispenser.ms_pump.pump_test_qty || ""
                                       }
                                       onChange={(e) =>
                                          updatePumpReading(
                                             dispenserIndex,
                                             "ms_pump",
                                             "pump_test_qty",
                                             parseFloat(e.target.value) || 0
                                          )
                                       }
                                       disabled={disabled}
                                       className='text-center w-20 h-8'
                                    />
                                 </td>
                              )}
                              <td className='p-3 text-center'>
                                 <Input
                                    type='number'
                                    step='0.01'
                                    value={dispenser.ms_pump.own_use_qty || ""}
                                    onChange={(e) =>
                                       updatePumpReading(
                                          dispenserIndex,
                                          "ms_pump",
                                          "own_use_qty",
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    disabled={disabled}
                                    className='text-center w-20 h-8'
                                 />
                              </td>
                              <td className='p-3 text-center font-medium text-primary'>
                                 {dispenser.ms_pump.net_dispensed_qty.toFixed(
                                    2
                                 )}
                              </td>
                              <td className='p-3 text-center'>
                                 <div className='text-sm font-medium'>
                                    {dispenser.ms_pump.rate_per_litre.toFixed(
                                       2
                                    )}
                                 </div>
                              </td>
                              <td className='p-3 text-right font-medium'>
                                 ₹
                                 {dispenser.ms_pump.amount.toLocaleString(
                                    "en-IN"
                                 )}
                              </td>
                           </tr>
                        </React.Fragment>
                     ))}

                     {/* Total Row */}
                     <tr className='bg-muted font-semibold'>
                        <td className='p-3' colSpan={2}>
                           TOTAL
                        </td>
                        <td className='p-3 text-center'>-</td>
                        <td className='p-3 text-center'>-</td>
                        <td className='p-3 text-center'>
                           {totals.total_dispensed.toFixed(2)}
                        </td>
                        {isShiftOne && (
                           <td className='p-3 text-center'>
                              {totals.total_pump_test.toFixed(2)}
                           </td>
                        )}
                        <td className='p-3 text-center'>
                           {totals.total_own_use.toFixed(2)}
                        </td>
                        <td className='p-3 text-center text-primary'>
                           {totals.total_net_dispensed.toFixed(2)}
                        </td>
                        <td className='p-3 text-center'>-</td>
                        <td className='p-3 text-right text-green-600'>
                           ₹{totals.total_amount.toLocaleString("en-IN")}
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>

            <Separator />

            <div className='flex justify-between items-center'>
               <div className='text-sm text-muted-foreground'>
                  * Pump Test is only applicable for Shift I ({timingInfo.label}
                  )
               </div>
               <Button onClick={handleSave} disabled={disabled}>
                  <Save className='h-4 w-4 mr-2' />
                  Save Shift Reading
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
